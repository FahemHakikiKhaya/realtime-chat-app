"use client";

import Image from "next/image";
import useActiveList from "../hooks/useActiveList";
import { User } from "@prisma/client";
import useActiveUser from "../hooks/useActiveUser";

const Avatar = ({ user, alt }: { user?: User | null; alt?: string }) => {
  const isActive = useActiveUser(user);
  return (
    <div className={`avatar ${isActive ? "online" : "offline"}`}>
      <div className="relative w-12 rounded-full">
        <Image
          src={user?.image || "/default-avatar.jpg"}
          alt={alt || "avatar"}
          layout="fill"
          style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
};

export default Avatar;
