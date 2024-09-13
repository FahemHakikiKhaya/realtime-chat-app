"use client";

import Image from "next/image";

const Avatar = ({ image, alt }: { image?: string | null; alt?: string }) => {
  return (
    <div className="avatar online">
      <div className="relative w-12 rounded-full">
        <Image
          src={image || "/default-avatar.jpg"}
          alt={alt || "avatar"}
          layout="fill"
          style={{ position: "absolute" }}
        />
      </div>
    </div>
  );
};

export default Avatar;
