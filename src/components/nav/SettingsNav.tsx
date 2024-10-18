"use client";
import { LogOutIcon, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SettingsNav() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const userSettingsButtons = [
    { label: "My Account", path: "/settings" },
    { label: "Profiles", path: "/settings/profiles" },
    { label: "Privacy & Safety", path: "/settings/privacy" },
    { label: "Family Center", path: "/settings/family" },
    { label: "Authorized Apps", path: "/settings/apps" },
    { label: "Devices", path: "/settings/devices" },
    { label: "Connections", path: "/settings/connections" },
    { label: "Clips", path: "/settings/clips" },
    { label: "Friend Requests", path: "/settings/friends" },
  ];

  const billingSettingsButtons = [
    { label: "Nitro", path: "/settings/nitro" },
    { label: "Server Boost", path: "/settings/boost" },
    { label: "Subscriptions", path: "/settings/subscriptions" },
    { label: "Gift Inventory", path: "/settings/gifts" },
    { label: "Billing", path: "/settings/billing" },
  ];

  const appSettingsButtons = [
    { label: "Appearance", path: "/settings/appearance" },
    { label: "Accessibility", path: "/settings/accessibility" },
    { label: "Voice & Video", path: "/settings/audio" },
    { label: "Chat", path: "/settings/chat" },
    { label: "Notifications", path: "/settings/notifications" },
    { label: "Keybinds", path: "/settings/keybinds" },
    { label: "Language", path: "/settings/language" },
    { label: "Streamer Mode", path: "/settings/streamer" },
    { label: "Advanced", path: "/settings/advanced" },
  ];

  const activitySettingsButtons = [
    { label: "Activity Privacy", path: "/settings/activity" },
    { label: "Registered Games", path: "/settings/games" },
  ];

  const settingsSections = [
    {
      header: "USER SETTINGS",
      buttons: userSettingsButtons,
    },
    {
      header: "BILLING SETTINGS",
      buttons: billingSettingsButtons,
    },
    {
      header: "APP SETTINGS",
      buttons: appSettingsButtons,
    },
    {
      header: "ACTIVITY SETTINGS",
      buttons: activitySettingsButtons,
    },
  ];

  return (
    <div className="min-w-[240px] w-1/3 bg-bgsecondary p-3 flex justify-end overflow-auto">
      <div className="h-full w-52 p-2">
        <Input
          placeholder="Search"
          className="bg-bgnav mb-3 text-secondary-foreground h-8"
          endAdornment={<Search className="text-muted-foreground" size={20} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {settingsSections.map(({ header, buttons }) => {
          const filteredButtons = buttons.filter(({ label }) =>
            label.toLowerCase().includes(search.toLowerCase())
          );

          return (
            filteredButtons.length > 0 && (
              <SettingsSection
                key={header}
                header={header}
                buttons={filteredButtons}
                pathname={pathname}
              />
            )
          );
        })}
        <SettingsSection buttons={[{ label: "Log Out", path: "/login" }]} />
      </div>
    </div>
  );
}

type SettingsSectionProps = {
  header?: string;
  pathname?: string;
  buttons: { label: string; path: string }[];
};

function SettingsSection({ header, buttons, pathname }: SettingsSectionProps) {
  return (
    <div className=" border-b py-2 border-page">
      {header && (
        <p className="text-muted-foreground text-xs pl-3 pb-2 mt-1">{header}</p>
      )}
      <div className="flex gap-[2px] flex-col">
        {buttons.map(({ label, path }) => (
          <SettingsButton
            key={path}
            label={label}
            path={path}
            isSelected={pathname === path}
          />
        ))}
      </div>
    </div>
  );
}

type SettingsButtonProps = {
  label: string;
  path: string;
  isSelected?: boolean;
};

function SettingsButton({ label, path, isSelected }: SettingsButtonProps) {
  return (
    <Button
      key={path}
      className={cn(
        "w-full justify-start hover:bg-page h-8 text-primary opacity-70 text-md",
        isSelected && "bg-page cursor-default opacity-100"
      )}
      variant="ghost"
    >
      <Link href={path}>{label}</Link>
      <span className="flex-1" />
      {path === "/login" && <LogOutIcon size={15} />}
    </Button>
  );
}
