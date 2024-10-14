"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { Mic, MicOff, Headphones, HeadphoneOff, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "../providers/UserProvider";

export function ProfileNav() {
  const [mute, setMute] = useState(false);
  const [deafen, setDeafen] = useState(false);
  const user = useUser();

  const { displayName, username } = user;

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
    <section className="h-16 bg-bgprofilenav flex items-center justify-between p-2 text-primary space-x-2 w-[310px]">
      <Button
        className="flex space-x-2 justify-start p-1 hover:bg-page h-12 w-full max-w-48 truncate"
        variant="ghost"
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <p className="font-bold flex">{displayName || username}</p>
          <p className="text-sm text-muted-foreground">{username}</p>
        </div>
      </Button>
      <section className="flex">
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-page"
          onClick={handleMute}
        >
          {mute ? (
            <MicOff size={20} className="text-red-500" />
          ) : (
            <Mic size={20} />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="hover:bg-page"
          onClick={handleDeafen}
        >
          {deafen ? (
            <HeadphoneOff size={20} className="text-red-500" />
          ) : (
            <Headphones size={20} />
          )}
        </Button>
        <Button size="icon" variant="ghost" className="group hover:bg-page">
          <Settings size={20} className="group-hover:animate-spin-slow" />
        </Button>
      </section>
    </section>
  );
}
