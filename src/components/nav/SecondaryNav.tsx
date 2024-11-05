"use client";
import { Contact } from "lucide-react";
import { Button } from "../ui/button";
import { ProfileNav } from "./ProfileNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "../utils/PageHeader";

export default function SecondaryNav() {
  const pathname = usePathname();
  const selected = pathname.startsWith("/friends");

  return (
    <div className="flex flex-col">
      <PageHeader className="bg-bgsecondary p-2">
        <Button className="border-b h-8 bg-card text-muted-foreground w-full justify-start flex hover:bg-card">
          Find or start a conversation
        </Button>
      </PageHeader>
      <section className="bg-bgsecondary flex flex-col w-[310px] text-primary h-full p-2">
        <Link href="/friends">
          <Button
            className={`flex gap-4 w-full justify-start h-10 bg-bgsecondary text-muted-foreground text-xl hover:bg-page hover:text-primary ${
              selected ? "text-primary bg-page" : ""
            }`}
          >
            <Contact />
            Friends
          </Button>
        </Link>
      </section>
      <ProfileNav />
    </div>
  );
}
