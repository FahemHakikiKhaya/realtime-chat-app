import { useSession } from "next-auth/react";
import { FullConversationType } from "../types";
import { useMemo } from "react";
import { User } from "@prisma/client";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const session = useSession();

  const otherUser: User | null = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    if (!currentUserEmail) {
      return null;
    }

    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );
    return otherUser[0];
  }, [conversation.users, session?.data?.user?.email]);

  return otherUser;
};

export default useOtherUser;
