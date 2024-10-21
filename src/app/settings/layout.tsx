"use client";
import { SettingsNav } from "@/components/nav/SettingsNav";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") router.push("/");
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [router]);

  return (
    <div className="h-screen flex w-full bg-page focus:outline-none">
      <SettingsNav />
      <section className="p-8 w-[800px] h-full min-w-[600px]">
        {children}
      </section>
      <section className="p-6 w-1/3 items-start flex">
        <div className="flex flex-col items-center space-y-1">
          <Button
            size="icon"
            variant="link"
            className="group border border-none hover:bg-page"
            onClick={() => router.push("/")}
          >
            <CircleX
              className="group-hover:opacity-70 text-muted-foreground"
              size={50}
            />
          </Button>
          <p className="text-sm text-muted-foreground">ESC</p>
        </div>
      </section>
    </div>
  );
}
