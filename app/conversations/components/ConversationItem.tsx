import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types";
import { format } from "date-fns";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";

interface ConversationItemProps {
  conversation: FullConversationType;
}

const ConversationItem: FC<ConversationItemProps> = ({ conversation }) => {
  const session = useSession();
  const otherUser = useOtherUser(conversation);
  const router = useRouter();

  const conversationName = conversation.name || otherUser?.name;

  const handleClick = () => {
    router.push(`/conversations/${conversation.id}`);
  };

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];

    return messages[messages.length - 1];
  }, [conversation.messages]);

  const userEmail = useMemo(() => {
    return session?.data?.user?.email;
  }, [session?.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.some((user) => user.email === userEmail);
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a conversation";
  }, [lastMessage?.body, lastMessage?.image]);

  if (!conversationName) {
    return null;
  }

  return (
    <li
      className="w-full cursor-pointer"
      onClick={handleClick}
      // onClick={() => handleOpenConversation({ userId: id })}
    >
      <div className="flex flex-row items-center gap-x-3 px-2">
        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center flex-1">
            <p className="text-base font-medium text-gray-900">
              {conversation.name || otherUser?.name}
            </p>
            {true && (
              <p className="text-xs text-gray-400 font-light">
                {format(new Date(), "p")}
              </p>
            )}
          </div>
          <p className="text-md font-medium text-gray-400">{lastMessageText}</p>
        </div>
      </div>
    </li>
  );
};

export default ConversationItem;
