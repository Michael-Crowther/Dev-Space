"use client";
import { SimpleCreateDialog } from "@/components/forms/SimpleCreateDialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/utils/PageHeader";
import { cn } from "@/lib/utils";
import { Contact } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { api } from "../../api/trpc/util";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/components/providers/UserProvider";

export default function FriendsLayout({ children }: { children: ReactNode }) {
  const { friendRequests } = useUser();

  const sendFriendRequest = api.base.user.sendFriendRequest.useMutation({
    onSuccess: (data) =>
      toast({
        description: data?.message,
      }),
    onError: (error) =>
      toast({
        description: error?.message,
        variant: "destructive",
      }),
  });

  return (
    <div className="h-full flex flex-col">
      <PageHeader className="flex items-center gap-3">
        <section className="flex gap-2 text-muted-foreground">
          <Contact />
          <p className="text-primary">Friends</p>
        </section>

        <span className="border-l h-6 ml-2" />

        <section className="text-muted-foreground space-x-3">
          <HeaderLink label="All" href="/friends" />
          <HeaderLink
            label="Pending"
            href="/friends/pending"
            value={friendRequests?.count}
          />
          <HeaderLink label="Blocked" href="/friends/blocked" />

          <SimpleCreateDialog
            title="Send Friend Request"
            fieldLabel="Username"
            buttonTitle="Add Friend"
            description="You can add friends with their Dev-Space username."
            onSubmit={(name) => sendFriendRequest.mutate(name)}
            loading={sendFriendRequest.isPending}
            className="h-6 bg-green-600 hover:bg-green-600 text-white p-2"
          />
        </section>
      </PageHeader>
      <section className="flex flex-1 overflow-hidden">
        <div className="w-3/4 border-r">{children}</div>
        <div className="w-1/4 p-3">Active now</div>
      </section>
    </div>
  );
}

type HeaderLinkProps = {
  label: string;
  href: string;
  value?: number;
};

function HeaderLink({ label, href, value }: HeaderLinkProps) {
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "h-8 p-2",
          selected && "bg-accent text-accent-foreground"
        )}
      >
        <div className="flex gap-2">
          {label}
          {value! > 0 && <Badge variant="destructive">{value}</Badge>}
        </div>
      </Button>
    </Link>
  );
}
