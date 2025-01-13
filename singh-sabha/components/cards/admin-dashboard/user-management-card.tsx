import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Edit, Info } from "lucide-react";

import { userColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { User } from "@/db/schema";
import { DeleteUser, UpdateUserPrivilege } from "@/lib/api/users/mutations";

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  isAdmin: z.boolean(),
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
    },
  });

  const handleUpdateUser: SubmitHandler<z.infer<typeof userSchema>> = (
    data,
  ) => {
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

  const columns = userColumns((user) => {
    setEditingUser(user);
    userForm.reset(user);
  }, handleDeleteUser);

  return (
    <Card>
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
              <div className="flex justify-end">
                <Button type="submit">
                  <Edit className="mr-2 h-4 w-4" /> Change
                </Button>
              </div>
            </form>
          </Form>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">All Users</h3>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users added yet.</p>
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
