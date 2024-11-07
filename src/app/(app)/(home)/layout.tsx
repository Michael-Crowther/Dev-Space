import PrimaryNav from "@/components/nav/PrimaryNav";
import SecondaryNav from "@/components/nav/SecondaryNav";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PrimaryNav />
      <SecondaryNav />
      <div className="flex flex-col w-full bg-page text-primary h-full">
        {children}
      </div>
    </>
  );
}
