"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import React, { FC, useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import axios from "axios";
import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";

interface BodyProps {
  initialMessages: FullMessageType[];
  conversation:
    | Conversation & {
        users: User[];
      };
}

const Body: FC<BodyProps> = ({ initialMessages, conversation }) => {
  const [messages, setMessages] = useState(initialMessages);

  const session = useSession();

  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  const otherUser = useOtherUser(conversation);

  const conversationMembers = conversation.isGroup
    ? conversation.users.filter(
        (user) => user.email !== session.data?.user?.email
      )
    : [otherUser];

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const newMessageHandler = (message: FullMessageType) => {
      console.log("hello");
      setMessages((currentMessages) => {
        if (currentMessages.find(({ id }) => id === message.id)) {
          return currentMessages;
        }
        return [...currentMessages, message];
      });
      bottomRef?.current?.scrollIntoView();
      axios.post(`/api/conversations/${conversationId}/seen`);
    };

    const updateMessageHandler = (messages: FullMessageType[]) => {
      setMessages((currentMessages) => {
        return currentMessages.map((message) => {
          const messageUpdated = messages?.find(({ id }) => id === message.id);
          if (messageUpdated) {
            return messageUpdated;
          }
          return message;
        });
      });
    };

    pusherClient.bind("messages:new", newMessageHandler);
    pusherClient.bind("messages:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", newMessageHandler);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {React.Children.toArray(
        messages?.map((message, index) => (
          <MessageItem
            isLast={index === messages.length - 1}
            message={message}
            conversationMembers={conversationMembers}
          />
        ))
      )}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
