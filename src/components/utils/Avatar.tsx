"use client";
import { Avatar as ShadAvatar, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { useUser } from "../providers/UserProvider";
import { ChangeEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FadeLoader } from "react-spinners";

type AvatarProps = {
  allowEdit?: boolean;
  className?: string;
  profileImageUrl?: string;
};

export function Avatar({
  allowEdit = false,
  className,
  profileImageUrl,
}: AvatarProps) {
  const { user, getUser } = useUser();
  const { profileImageUrl: loggedInUserUrl } = user;
  const [loading, setLoading] = useState(false);

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const files = e.target.files;

    if (files) {
      setLoading(true);
      await fetch(`/api/upload?filename=${files[0].name}&userId=${user.id}`, {
        method: "POST",
        body: files[0],
      }).then(() => getUser());
    }
  }

  useEffect(() => {
    if (loggedInUserUrl) setLoading(false);
  }, [loggedInUserUrl]);

  return (
    <ShadAvatar
      className={cn(
        "relative h-20 w-20 flex items-center justify-center group",
        className
      )}
    >
      {loading ? (
        <FadeLoader color="#FFFF" className="ml-2" />
      ) : (
        <>
          <AvatarImage
            src={profileImageUrl || loggedInUserUrl}
            className={cn(
              "transition-opacity duration-300",
              allowEdit ? "group-hover:opacity-60" : ""
            )}
          />

          {allowEdit && (
            <>
              <input
                type="file"
                title=""
                accept="image/*"
                multiple={false}
                onChange={handleImageUpload}
                className="absolute z-10 opacity-100 h-96 w-full cursor-pointer"
              />
              <Pencil className="absolute size-6 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </>
      )}
    </ShadAvatar>
  );
}

type MultiAvatarProps = {
  profileImageUrl1: string | undefined;
  profileImageUrl2: string | undefined;
};

export function MultiAvatar({
  profileImageUrl1,
  profileImageUrl2,
}: MultiAvatarProps) {
  return (
    <div className="flex items-center min-w-11 ml-2">
      {profileImageUrl1 && (
        <ShadAvatar className="z-10 size-7 mb-3">
          <AvatarImage
            src={profileImageUrl1}
            className={cn("transition-opacity duration-300")}
          />
        </ShadAvatar>
      )}
      {profileImageUrl2 && (
        <ShadAvatar className="-ml-5 mt-2 z-20 size-8 border-[3px] overlap border-bgsecondary">
          <AvatarImage
            src={profileImageUrl2}
            className={cn("transition-opacity duration-300")}
          />
        </ShadAvatar>
      )}
    </div>
  );
}
