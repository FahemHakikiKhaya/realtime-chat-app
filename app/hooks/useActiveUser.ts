import { User } from "@prisma/client";
import useActiveList from "./useActiveList";

const useActiveUser = (user?: User | null) => {
  const { members } = useActiveList();

  if (!user) return false;

  return members.includes(user?.email!);
};

export default useActiveUser;
