"use client";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";
import { ReactNode, useEffect, useState } from "react";
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
        <span className="border w-12" />
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
        className="rounded-3xl w-14 h-14 mb-2 hover:rounded-[17px] bg-brand-500 hover:bg-brand-600 transition-all duration-400 ease-in-out"
      >
        {icon}
      </Button>
    </Tooltip>
  );
}

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensures this component renders only after the client has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid rendering the button on the server
  }

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
