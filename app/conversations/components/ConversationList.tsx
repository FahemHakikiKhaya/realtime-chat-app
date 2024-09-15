"use client";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Avatar from "@/app/components/Avatar";
import useConversation from "@/app/hooks/useConversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationItem from "./ConversationItem";
import { User } from "@prisma/client";
import AddConversationModal from "./AddConversationModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);

  const session = useSession();

  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const [addConversationModal, setAddConversationModal] = useState({
    opened: false,
  });

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (current.find(({ id }) => conversation.id === id)) {
          return current;
        }
        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        });
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversation.id === conversationId) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.bind("conversation:update", updateHandler);
      pusherClient.bind("conversation:remove", removeHandler);
    };
  }, [conversationId, pusherKey, router]);

  return (
    <div className="fixed inset-y-0 items-center w-[320px]  hidden lg:block">
      <div className="flex-row flex items-center justify-between">
        <h4 className="text-2xl font-bold text-neutral-800 py-4 ml-2">
          Messages
        </h4>
        <div
          className="rounded-full p-2 bg-gray-100 text-gray-600 cursor-pointer hover:opacity-75 transition"
          onClick={() => setAddConversationModal({ opened: true })}
        >
          <MdOutlineGroupAdd size={20} />
        </div>
      </div>
      <ul className="menu">
        {React.Children.toArray(
          items.map((conversation) => {
            return <ConversationItem conversation={conversation} />;
          })
        )}
      </ul>
      <AddConversationModal
        users={users}
        opened={addConversationModal.opened}
        onClose={() => setAddConversationModal({ opened: false })}
      />
    </div>
  );
};

export default ConversationList;
