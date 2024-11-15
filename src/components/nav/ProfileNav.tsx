"use client";

import { useState } from "react";
import { Mic, MicOff, Headphones, HeadphoneOff, Settings } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ProfilePopover } from "../popovers/ProfilePopover";

export function ProfileNav() {
  const [mute, setMute] = useState(false);
  const [deafen, setDeafen] = useState(false);

  function handleMute() {
    setMute(!mute);
    if (deafen) setDeafen(!deafen);

    new Audio(mute ? "/discordUnmute.mp3" : "/discordMute.mp3").play();
  }

  function handleDeafen() {
    setDeafen(!deafen);
    if (!mute) setMute(!mute);

    new Audio(deafen ? "/discordUndeafen.mp3" : "/discordDeafen.mp3").play();
  }

  return (
    <main className="h-16 bg-bgprofilenav flex items-center justify-between p-2 text-primary space-x-2 w-full">
      <ProfilePopover />

      <div className="flex">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-page"
          onClick={handleMute}
        >
          {mute ? (
            <MicOff className="text-red-500 size-5" />
          ) : (
            <Mic className="size-5" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-page"
          onClick={handleDeafen}
        >
          {deafen ? (
            <HeadphoneOff className="text-red-500 size-5" />
          ) : (
            <Headphones className="size-5" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="group hover:bg-page"
          asChild
        >
          <Link href="/settings">
            <Settings className="group-hover:animate-spin-slow size-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
