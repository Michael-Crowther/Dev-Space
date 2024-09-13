"use client";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import { ReactNode } from "react";
import DiscordIcon from "../../../public/discord-icon-svgrepo-com.svg";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function PrimaryNav() {
  return (
    <div className="bg-bgnav flex flex-col w-20 p-3 h-screen justify-between items-center">
      <section className="justify-center flex flex-col items-center">
        <PrimaryNavButton
          icon={<DiscordIcon className="h-8 w-8" />}
          tooltip="Direct Messages"
        />
        <span className="border border-bgsecondary w-12" />
      </section>
      <ThemeSwitcher />
    </div>
  );
}

type PrimaryNavButtonProps = {
  icon?: ReactNode;
  tooltip?: string;
};

function PrimaryNavButton({ icon, tooltip }: PrimaryNavButtonProps) {
  return (
    <Tooltip placement="right" title={tooltip} className="ml-3">
      <Button
        size="icon"
        className="rounded-full w-14 h-14 mb-2 hover:rounded-xl bg-brand-500 hover:bg-brand-600"
      >
        {icon}
      </Button>
    </Tooltip>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  function handleTheme() {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  return (
    <Button size="icon" onClick={handleTheme} variant="link">
      {theme === "dark" ? <Moon /> : <Sun color="black" />}
    </Button>
  );
}
