"use client";
import { useUser } from "@/components/providers/UserProvider";
import { Card } from "@/components/ui/card";
import { SimpleEditDialog } from "@/components/forms/SimpleEditDialog";
import { format } from "date-fns";
import { api } from "../../(app)/api/trpc/util";
import { ReactNode } from "react";
import {
  updateDisplayNameSchema,
  updateUsernameSchema,
} from "@/server/utils/zodSchemas";
import { ChangePassword } from "@/components/forms/ChangePassword";
import { toast } from "@/hooks/use-toast";
import { Avatar } from "@/components/utils/Avatar";

export default function MyAccount() {
  const { user, getUser } = useUser();
  const { displayName, username, createdAt, email } = user;
  const formattedDate = format(new Date(createdAt), "MMM dd, yyyy");

  const { mutate: updateDisplayName, isPending: displayPending } =
    api.base.user.updateDisplayName.useMutation({
      onSuccess: (data) => {
        getUser();
        toast({ description: data?.message });
      },
    });

  const { mutate: updateUsername, isPending: usernamePending } =
    api.base.user.updateUsername.useMutation({
      onSuccess: (data) => {
        getUser();
        toast({ description: data?.message });
      },
      onError: (error) => {
        toast({ description: error?.message, variant: "destructive" });
      },
    });

  return (
    <>
      <p className="font-bold text-lg text-primary">My Account</p>
      <Card className="my-2 bg-bgnav h-[340px] p-6 flex">
        <div className="flex items-start flex-col space-y-3 w-full">
          <div className="flex items-center space-x-4">
            <Avatar allowEdit />
            <section className="flex flex-col text-sm">
              <p className="font-bold text-xl">{displayName || username}</p>
              <p className="text-muted-foreground">
                Registered {formattedDate}
              </p>
            </section>
          </div>
          <Card className="bg-page p-3 w-full flex-1 space-y-6">
            <MyAccountSection
              header="DISPLAY NAME"
              value={displayName || "You haven't added a display name yet."}
            >
              <SimpleEditDialog
                title="Edit Display Name"
                fieldLabel="Display Name"
                fieldValue={displayName || ""}
                loading={displayPending}
                onSubmit={(name) => updateDisplayName({ name })}
                schema={updateDisplayNameSchema}
              />
            </MyAccountSection>
            <MyAccountSection header="USERNAME" value={username}>
              <SimpleEditDialog
                title="Edit Username"
                fieldLabel="Username"
                fieldValue={username || ""}
                loading={usernamePending}
                onSubmit={(name) => updateUsername({ name })}
                schema={updateUsernameSchema}
              />
            </MyAccountSection>
            <MyAccountSection header="EMAIL" value={email} />
          </Card>
        </div>
      </Card>

      <ChangePassword />
    </>
  );
}

type MyAccountSectionProps = {
  header: string;
  value: string;
  children?: ReactNode;
};

function MyAccountSection(props: MyAccountSectionProps) {
  const { header, value, children } = props;

  return (
    <section className="flex items-center">
      <div className="flex flex-col">
        <p className="text-xs text-muted-foreground">{header}</p>
        <p>{value}</p>
      </div>
      <span className="flex-1" />
      {children}
    </section>
  );
}
