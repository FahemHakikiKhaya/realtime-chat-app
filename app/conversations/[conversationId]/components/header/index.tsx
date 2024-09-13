"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { FC, useMemo } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import ConversationInfoDrawer from "./components/ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";

interface HeaderProps {
  conversation:
    | Conversation & {
        users: User[];
      };
}

const Header: FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return "Active";
  }, [conversation.isGroup, conversation.users.length]);

  return (
    <>
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <Link
            href="/conversations"
            className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar image={otherUser?.image || ""} />
          )}{" "}
          <div className="flex flex-col">
            <p>{conversation.name || otherUser?.name}</p>
            <p className="text-sm font-light text-neutral-500">{statusText}</p>
          </div>
        </div>
        <ConversationInfoDrawer conversation={conversation} />
      </div>
    </>
  );
};

export default Header;
