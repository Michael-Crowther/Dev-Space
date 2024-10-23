import { useForm } from "react-hook-form";
import { ReactNode, useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./CustomForm";

type SimpleEditDialogProps = {
  title: string;
  loading: boolean;
  fieldLabel: string;
  fieldValue: string;
  trigger?: ReactNode;
  description?: string;
  onSubmit: (name: string) => void;
  onSuccess?: () => void;
  schema?: z.ZodSchema<{ name: string }>;
};

export function SimpleEditDialog(props: SimpleEditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    title,
    fieldLabel,
    fieldValue,
    onSubmit,
    onSuccess,
    loading,
    description,
    trigger,
    schema = z.object({
      name: z.string().trim().min(1, { message: "Field is required" }),
    }),
  } = props;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: fieldValue },
  });

  const { reset } = form;

  useEffect(() => {
    reset({ name: fieldValue });
  }, [fieldValue, reset]);

  function handleOnSubmit(data: z.infer<typeof schema>) {
    onSubmit(data.name);
    if (onSuccess) {
      onSuccess();
    }
    setIsOpen(false);
    form.reset();
  }

  return (
    <Form.Dialog
      title={title}
      buttonTitle="Edit"
      trigger={trigger}
      mode="edit"
      //debug
      form={form}
      open={isOpen}
      onOpenChange={setIsOpen}
      loading={loading}
      onSubmit={handleOnSubmit}
    >
      <Form.Input
        control={form.control}
        name="name"
        label={fieldLabel}
        description={description}
      />
    </Form.Dialog>
  );
}
