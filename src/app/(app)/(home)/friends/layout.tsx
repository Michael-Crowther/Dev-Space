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

export default function FriendsLayout({ children }: { children: ReactNode }) {
  const sendFriendRequest = api.base.user.sendFriendRequest.useMutation();

  return (
    <>
      <PageHeader className="flex items-center gap-3">
        <section className="flex gap-2 text-muted-foreground">
          <Contact />
          <p className="text-primary">Friends</p>
        </section>

        <span className="border-l border-muted-foreground/30 h-6 ml-2" />

        <section className="text-muted-foreground space-x-3">
          <HeaderLink label="All" href="/friends" />
          <HeaderLink label="Pending" href="/friends/pending" />
          <HeaderLink label="Blocked" href="/friends/blocked" />

          {/* <Button className="h-6 bg-green-600 hover:bg-green-600 text-white p-2">
            Add Friend
          </Button> */}
          <SimpleCreateDialog
            title="Send Friend Request"
            fieldLabel="Username"
            buttonTitle="Add Friend"
            description="You can add friends with their Dev-Space username."
            onSubmit={() => sendFriendRequest.mutate}
            loading={sendFriendRequest.isPending}
            className="h-6 bg-green-600 hover:bg-green-600 text-white p-2"
          />
        </section>
      </PageHeader>
      {children}
    </>
  );
}

type HeaderLinkProps = {
  label: string;
  href: string;
};

function HeaderLink({ label, href }: HeaderLinkProps) {
  const pathname = usePathname();
  const selected = pathname === href;
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "h-6 p-2",
          selected && "bg-accent text-accent-foreground"
        )}
      >
        {label}
      </Button>
    </Link>
  );
}
