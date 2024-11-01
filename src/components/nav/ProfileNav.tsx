"use client";

import { useState } from "react";
import { Mic, MicOff, Headphones, HeadphoneOff, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "../providers/UserProvider";
import Link from "next/link";
import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Avatar } from "../utils/Avatar";

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
    <main className="h-16 bg-bgprofilenav flex items-center justify-between p-2 text-primary space-x-2 w-[310px]">
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

function ProfilePopover() {
  const { user } = useUser();
  const { displayName, username, createdAt } = user;

  const formattedDate = format(new Date(createdAt), "MMM dd, yyyy");

  return (
    <Popover>
      <PopoverTrigger className="w-full" asChild>
        <Button
          className="flex space-x-2 justify-start p-1 hover:bg-page h-12 w-full max-w-48 truncate"
          variant="ghost"
        >
          <Avatar className="h-12 w-12" />
          <div className="flex flex-col items-start">
            <p className="font-bold flex">{displayName || username}</p>
            <p className="text-sm text-muted-foreground">{username}</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 ml-12 bg-card p-6 flex gap-4 flex-col">
        <section className="flex items-center gap-3">
          <Avatar className="h-24 w-24" />
          <div className="flex flex-col text-sm space-y-1">
            <p className="font-bold text-2xl">{displayName || username}</p>
            <p className="text-sm">{username}</p>
            <p className="text-muted-foreground">Registered {formattedDate}</p>
          </div>
        </section>
        <section>
          <Link href="/settings">
            <Button variant="ghost" className="text-lg">
              Edit Profile
            </Button>
          </Link>
        </section>
      </PopoverContent>
    </Popover>
  );
}
