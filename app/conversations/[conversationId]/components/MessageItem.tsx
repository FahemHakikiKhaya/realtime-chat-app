import Avatar from "@/app/components/Avatar";
import ImageModal from "@/app/components/ImageModal";
import { FullMessageType } from "@/app/types";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { BiCheckDouble } from "react-icons/bi";

interface MessageItemProps {
  isLast: boolean;
  message: FullMessageType;
  conversationMembers: (User | null)[];
}

const MessageItem: React.FC<MessageItemProps> = ({
  isLast,
  message,
  conversationMembers,
}) => {
  const session = useSession();
  const isOwnMessage = session?.data?.user?.email === message?.sender?.email;
  const [imageModal, setImageModal] = useState({ opened: false });
  const seenBy = (message.seen || []).filter(
    (user) => user.email !== message.sender.email
  );

  const seen = seenBy.length === conversationMembers.length;

  return (
    <div>
      <div className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}>
        <div className="chat-image avatar">
          <Avatar image={message.sender.image} />
        </div>

        {message.image ? (
          <div className="chat-bubble p-0">
            <div className="relative w-72 h-56 overflow-hidden">
              <Image
                onClick={() => setImageModal({ opened: true })}
                alt="image"
                fill
                src={message.image}
                className="object-cover cursor-pointer hover:scale-110 transition translate"
              />
            </div>
          </div>
        ) : (
          <div className="chat-bubble">
            <div className="flex flex-row items-end space-x-2">
              <p>{message.body}</p>
              <p className="text-xs">{format(message.createdAt, "p")}</p>
              <BiCheckDouble
                size={18}
                className={seen ? `text-blue-400` : ""}
              />
            </div>
          </div>
        )}
      </div>
      <ImageModal
        image={message.image}
        opened={imageModal.opened}
        onClose={() => setImageModal({ opened: false })}
      />
    </div>
  );
};

export default MessageItem;
