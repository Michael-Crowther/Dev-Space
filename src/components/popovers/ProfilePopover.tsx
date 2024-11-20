import { Popover, PopoverContent } from "../ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { Avatar } from "../utils/Avatar";
import { useUser } from "../providers/UserProvider";
import { Button } from "../ui/button";
import Link from "next/link";

export function ProfilePopover() {
  const { user } = useUser();
  const { displayName, username, createdAt } = user;

  return (
    <Popover>
      <PopoverTrigger className="w-full" asChild>
        <Button
          className="flex space-x-2 justify-start p-1 hover:bg-page h-12 w-full max-w-48 truncate"
          variant="ghost"
        >
          <Avatar className="size-12" />
          <div className="flex flex-col items-start">
            <p className="font-bold flex">{displayName || username}</p>
            <p className="text-sm text-muted-foreground">{username}</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 ml-12 bg-card p-6 flex gap-4 flex-col">
        <section className="flex items-center gap-3">
          <Avatar className="size-24" />
          <div className="flex flex-col text-sm space-y-1">
            <p className="font-bold text-2xl">{displayName || username}</p>
            <p className="text-sm">{username}</p>
            <p className="text-muted-foreground">
              Registered {format(new Date(createdAt), "MMM dd, yyyy")}
            </p>
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
