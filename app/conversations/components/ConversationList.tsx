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
    <div
      className={`lg:fixed ${
        isOpen ? "hidden" : "relative"
      } lg:inset-y-0 items-center lg:w-[320px] w-full lg:block border-r-[1px] border-neutral`}
    >
      <div className="flex-row flex items-center justify-between py-4 sticky top-0 px-3 bg-[#1D232A] z-50">
        <h4 className="text-2xl font-bold">Messages</h4>
        <button
          className="btn btn-outline btn-circle btn-sm"
          onClick={() => setAddConversationModal({ opened: true })}
        >
          <MdOutlineGroupAdd size={15} />
        </button>
      </div>
      <div className="lg:h-[calc(100vh-80px)] overflow-y-scroll lg:px-0 px-3">
        <ul className="menu p-0">
          {React.Children.toArray(
            items.map((conversation) => {
              return <ConversationItem conversation={conversation} />;
            })
          )}
        </ul>
      </div>
      <AddConversationModal
        users={users}
        opened={addConversationModal.opened}
        onClose={() => setAddConversationModal({ opened: false })}
      />
    </div>
  );
};

export default ConversationList;
