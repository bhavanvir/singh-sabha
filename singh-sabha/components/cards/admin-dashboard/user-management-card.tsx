import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Edit, Trash, Info } from "lucide-react";

import { User } from "@/db/schema";
import { UpdateUserPrivilege, DeleteUser } from "@/lib/api/users/mutations";

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  isAdmin: z.boolean(),
  isMod: z.boolean(),
});

interface UserManagementCardProps {
  users: Omit<User, "passwordHash">[];
}

export default function UserManagementCard({ users }: UserManagementCardProps) {
  const [editingUser, setEditingUser] = React.useState<Omit<
    User,
    "passwordHash"
  > | null>(null);

  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: "",
      email: "",
      fullName: "",
      isAdmin: false,
      isMod: false,
    },
  });

  const handleUpdateUser: SubmitHandler<z.infer<typeof userSchema>> = (
    data,
  ) => {
    if (data.isAdmin && data.isMod) {
      toast.warning("A user cannot be both an admin and a mod.");
      return;
    }

    toast.promise(UpdateUserPrivilege({ user: data }), {
      loading: `Updating ${data.fullName}'s privileges...`,
      success: (_) => {
        setEditingUser(null);
        userForm.reset();
        return "User updated successfully!";
      },
      error: "Failed to update user.",
    });
  };

  const handleDeleteUser = (id: string) => {
    toast.promise(DeleteUser({ id }), {
      loading: "Deleting user...",
      success: "User deleted successfully!",
      error: "Failed to delete user.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingUser && (
          <Form {...userForm}>
            <form
              onSubmit={userForm.handleSubmit(handleUpdateUser)}
              className="space-y-4"
            >
              <FormField
                control={userForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="User's full name"
                        disabled={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Admin</FormLabel>
                      <FormDescription className="flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Grant admin privileges
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="isMod"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Moderator</FormLabel>
                      <FormDescription className="flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Grant moderator privileges
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">
                  <Edit className="h-4 w-4" /> Change
                </Button>
              </div>
            </form>
          </Form>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Current Users</h3>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users added yet.</p>
          ) : (
            <ScrollArea>
              <ul className="space-y-2 max-h-[180px]">
                {users.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <div className="inline-flex items-center space-x-2">
                      <Badge>
                        {u.isAdmin ? "Admin" : u.isMod ? "Mod" : "User"}
                      </Badge>
                      <span className="font-medium">{u.fullName}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {u.email}
                      </span>
                    </div>

                    <div className="space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingUser(u);
                          userForm.reset(u);
                        }}
                        aria-label={`Edit ${u.fullName}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(u.id)}
                        aria-label={`Delete ${u.fullName}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
