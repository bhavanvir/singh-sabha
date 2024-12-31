import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Plus, Trash } from "lucide-react";

import { AddEmail, RemoveEmail } from "@/lib/api/mailing-list/mutations";
import { MailingList } from "@/db/schema";

const emailSchema = z.object({
  email: z.string().min(1, "Email missing").email("Invalid email"),
});

interface MailingListCardProps {
  mailingList: MailingList[];
}

export default function MailingListCard({ mailingList }: MailingListCardProps) {
  const mailingListForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleAddEmail: SubmitHandler<z.infer<typeof emailSchema>> = (data) => {
    toast.promise(AddEmail({ email: data.email }), {
      loading: "Adding email to mailing list...",
      success: (_) => {
        mailingListForm.reset();
        return `Added ${data.email} to mailing list.`;
      },
      error: "Failed to add email to mailing list.",
    });
  };

  const handleRemoveEmail = (data: MailingList) => {
    toast.promise(RemoveEmail({ id: data.id }), {
      loading: "Removing email from mailing list...",
      success: `Removed ${data.email} from mailing list.`,
      error: "Failed to remove email from mailing list.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mailing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...mailingListForm}>
          <form
            onSubmit={mailingListForm.handleSubmit(handleAddEmail)}
            className="space-y-2"
          >
            <FormField
              control={mailingListForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Email to Mailing List</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        type="email"
                        placeholder="New email address"
                        {...field}
                        className="flex-grow"
                      />
                      <Button type="submit">
                        <Plus />
                        Add
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Current Mailing List</h3>
          {mailingList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No emails in the list yet.
            </p>
          ) : (
            <ScrollArea>
              <ul className="space-y-2 max-h-[180px]">
                {mailingList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between bg-secondary p-2 rounded-md"
                  >
                    <span className="text-sm">{item.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(item)}
                      aria-label={`Remove ${item.email} from mailing list`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
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
