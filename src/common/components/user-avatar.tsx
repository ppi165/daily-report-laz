"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-7 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-10 text-sm",
  xl: "size-12 text-base",
};

export default function UserAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const displayName = name?.trim() || "Amil";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Avatar
      className={cn(
        sizeClasses[size] || sizeClasses.md,
        "border border-outline-variant/60 shrink-0 bg-surface-container-high",
        className
      )}
    >
      {avatarUrl && (
        <AvatarImage
          src={avatarUrl}
          alt={displayName}
          className="object-cover size-full"
        />
      )}
      <AvatarFallback className="font-bold bg-primary/10 text-primary uppercase select-none">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
