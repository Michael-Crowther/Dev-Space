import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadForm,
} from "@/components/ui/form";
import { useState, ReactNode } from "react";
import {
  Control,
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input, InputProps } from "../ui/input";
import { cn } from "@/lib/utils";
import { PrettyObject } from "./PrettyObject";
import { ButtonLoader } from "./ButtonLoader";

type FormDialogProps<TFieldValues extends FieldValues> = {
  debug?: boolean;
  mode: "create" | "edit";
  form: UseFormReturn<TFieldValues, unknown, undefined>;
  title: string;
  buttonTitle?: string;
  onSubmit: (data: TFieldValues) => void;
  children: ReactNode;
  loading?: boolean;
  trigger?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  end?: ReactNode;
  className?: string;
};

function FormDialog<TFieldValues extends FieldValues>(
  props: FormDialogProps<TFieldValues>
) {
  const [discardChangesOpen, setDiscardChangesOpen] = useState(false);
  const {
    mode = "create",
    debug,
    form,
    title,
    buttonTitle,
    onSubmit,
    children,
    loading,
    trigger,
    open,
    onOpenChange,
    end,
    className,
  } = props;

  const {
    formState: { isDirty },
  } = form;

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      onOpenChange(newOpen);
    } else {
      if (form.formState.isDirty) {
        setDiscardChangesOpen(true);
      } else {
        onOpenChange(newOpen);
      }
    }
  }

  function handleCloseAndReset() {
    onOpenChange(false);
    form.reset();
  }

  return (
    <ShadForm {...form}>
      <AlertDialog
        open={discardChangesOpen}
        onOpenChange={setDiscardChangesOpen}
      >
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will discard any unsaved progress in this form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseAndReset}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button
              className={cn(
                "bg-bgnav text-primary hover:opacity-75 hover:bg-nav",
                className
              )}
            >
              {buttonTitle || title}
            </Button>
          )}
        </DialogTrigger>
        <DialogContent
          className="flex max-h-[80%] flex-col overflow-auto p-2 w-[400px] bg-page"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="flex flex-row items-center p-4 pb-2">
            <DialogTitle className="text-primary">{title}</DialogTitle>
            <span className="flex-1" />
            {end}
          </DialogHeader>
          <div className="grid flex-1 grid-cols-2 gap-4 overflow-auto px-4 py-2">
            {children}
            {debug && (
              <>
                {/* <Badge variant={isDirty ? "destructive" : "primary"}>
                  form {isDirty ? "is" : "is not"} dirty
                </Badge> */}
                <p className="text-primary">
                  {" "}
                  form {isDirty ? "is" : "is not"} dirty
                </p>
                <PrettyObject>
                  {{
                    values: form.watch(),
                    dirtyFields: form.formState.dirtyFields,
                    errors: form.formState.errors,
                  }}
                </PrettyObject>
              </>
            )}
          </div>
          <DialogFooter className="gap-2 p-4 pt-2">
            {mode === "create" && (
              <>
                <Button
                  onClick={() => handleOpenChange(false)}
                  variant="ghost"
                  disabled={loading}
                  className="text-primary"
                >
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  //loading={loading}
                  variant={"default"}
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-brand text-primary hover:opacity-75 hover:bg-nav"
                >
                  {loading ? <ButtonLoader /> : "Submit"}
                </Button>
              </>
            )}
            {mode === "edit" && (
              <>
                <Button
                  onClick={handleCloseAndReset}
                  disabled={loading}
                  variant="ghost"
                  //variant={!isDirty ? "outline" : "destructive"}
                  className="text-primary"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!isDirty || loading}
                  //loading={loading}
                  variant={!isDirty ? "outline" : "default"}
                  onClick={form.handleSubmit(onSubmit)}
                  className="bg-brand text-primary hover:opacity-75 hover:bg-nav"
                >
                  Save Changes
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ShadForm>
  );
}

type WrapperProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, "render" | "control"> & {
  control: Control<TFieldValues>;
  label: string;
  description?: string;
  half?: boolean;
};

function FormInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  label,
  description,
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  disabled,
  half,
  ...props
}: WrapperProps<TFieldValues, TName> & InputProps) {
  return (
    <FormField
      name={name}
      rules={rules}
      shouldUnregister={shouldUnregister}
      defaultValue={defaultValue}
      control={control}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={cn("col-span-full flex flex-col", half && "col-span-1")}
        >
          {" "}
          <FormLabel className="text-primary">{label}</FormLabel>
          <FormControl>
            <Input
              autoComplete="off"
              placeholder={label}
              onWheel={(e) => e.currentTarget.blur()}
              className="bg-bgnav text-primary h-10 rounded-sm mt-1 focus:outline-none px-3"
              {...props}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
}

export const Form = {
  Dialog: FormDialog,
  Input: FormInput,
};
