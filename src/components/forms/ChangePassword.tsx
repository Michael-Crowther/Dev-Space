import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { passwordChangeSchema } from "@/server/utils/zodSchemas";
import { Form } from "./CustomForm";
import { api } from "@/app/(app)/api/trpc/util";
import { toast } from "@/hooks/use-toast";

export function ChangePassword() {
  const [isOpen, setIsOpen] = useState(false);

  const setNewPassword = api.base.user.changePassword.useMutation({
    onSuccess: (data) => {
      setIsOpen(false);
      form.reset();
      toast({ description: data.message });
    },
  });

  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  return (
    <Form.Dialog
      title="Change Password"
      mode="create"
      form={form}
      open={isOpen}
      onOpenChange={setIsOpen}
      loading={setNewPassword.isPending}
      onSubmit={setNewPassword.mutate}
      className="bg-brand-500"
    >
      <Form.Input
        control={form.control}
        type="password"
        label="Current Password"
        name="currentPassword"
      />
      <Form.Input
        control={form.control}
        type="password"
        label="New Password"
        name="newPassword"
      />
      <Form.Input
        control={form.control}
        type="password"
        label="Confirm New Password"
        name="confirmNewPassword"
      />
      {setNewPassword.error && (
        <p className="text-red-500 w-max">* {setNewPassword.error.message}</p>
      )}
    </Form.Dialog>
  );
}
