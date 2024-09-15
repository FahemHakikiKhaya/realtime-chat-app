"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  return useMemo(() => {
    return {
      conversationId: params?.conversationId as string,
      isOpen: !!params?.conversationId,
    };
  }, [params?.conversationId]);
};

export default useConversation;
