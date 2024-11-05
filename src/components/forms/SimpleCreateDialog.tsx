import { useForm } from "react-hook-form";
import { ReactNode, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./CustomForm";

type SimpleCreateDialogProps = {
  title: string;
  buttonTitle?: string;
  loading: boolean;
  trigger?: ReactNode;
  fieldLabel: string;
  onSubmit: (data: { name: string }) => void;
  schema?: z.ZodSchema<{ name: string }>;
  description?: string;
  className?: string;
};

export function SimpleCreateDialog(props: SimpleCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    title,
    buttonTitle,
    trigger,
    fieldLabel,
    onSubmit,
    loading,
    description,
    className,
    schema = z.object({
      name: z
        .string()
        .trim()
        .min(1, { message: `${fieldLabel} is required` }),
    }),
  } = props;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  function handleOnSubmit(data: z.infer<typeof schema>) {
    onSubmit(data);
    setIsOpen(false);
    form.reset();
  }

  return (
    <Form.Dialog
      title={title}
      buttonTitle={buttonTitle}
      mode="create"
      trigger={trigger}
      form={form}
      open={isOpen}
      onOpenChange={setIsOpen}
      loading={loading}
      onSubmit={handleOnSubmit}
      className={className}
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
