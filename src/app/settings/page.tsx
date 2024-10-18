"use client";
import { useUser } from "@/components/providers/UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SimpleEditDialog } from "@/components/utils/SimpleEditDialog";
import { format } from "date-fns";
import { api } from "../api/trpc/util";

export default function MyAccount() {
  const { user, getUser } = useUser();

  const { displayName, username, createdAt, email } = user;

  const formattedDate = format(new Date(createdAt), "MMM dd, yyyy");

  const { mutate: updateDisplayName, isPending: displayPending } =
    api.base.user.updateDisplayName.useMutation({
      onSuccess: () => {
        getUser();
      },
    });

  const { mutate: updateUsername, isPending: usernamePending } =
    api.base.user.updateUsername.useMutation({
      onSuccess: () => {
        getUser();
      },
    });

  return (
    <>
      <p className="font-bold text-lg text-primary">My Account</p>
      <Card className="my-2 bg-bgnav h-[340px] p-6 flex">
        <div className="flex items-start flex-col space-y-3 w-full">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
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
              allowEdit
              onSubmit={(value) => updateDisplayName({ value })}
              isPending={displayPending}
            />
            <MyAccountSection
              header="USERNAME"
              value={username}
              allowEdit
              onSubmit={(value) => updateUsername({ value })}
              isPending={usernamePending}
            />
            <MyAccountSection header="EMAIL" value={email} />
          </Card>
        </div>
      </Card>
    </>
  );
}

type MyAccountSectionProps =
  | {
      header: string;
      value: string;
      allowEdit: true;
      isPending: boolean;
      onSubmit: (value: string) => void;
    }
  | {
      header: string;
      value: string;
      allowEdit?: false;
    };

function MyAccountSection(props: MyAccountSectionProps) {
  const { header, value, allowEdit } = props;

  return (
    <section className="flex items-center">
      <div className="flex flex-col">
        <p className="text-xs text-muted-foreground">{header}</p>
        <p>{value}</p>
      </div>
      <span className="flex-1" />
      {allowEdit && (
        <SimpleEditDialog
          title="Edit Display Name"
          fieldLabel="Display Name"
          fieldValue={value}
          loading={props.isPending}
          onSubmit={props.onSubmit}
        />
      )}
    </section>
  );
}
