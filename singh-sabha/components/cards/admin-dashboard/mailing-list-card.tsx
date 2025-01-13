import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Plus } from "lucide-react";

import { mailingListColumns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import { MailingList } from "@/db/schema";
import { AddEmail } from "@/lib/api/mailing-list/mutations";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mailing List</CardTitle>
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
                        <Plus className="mr-2 h-4 w-4" />
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
            <DataTable columns={mailingListColumns} data={mailingList} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
