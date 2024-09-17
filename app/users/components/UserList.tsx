"use client";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";

interface UserListProps {
  users: User[];
}

const UserList: FC<UserListProps> = ({ users }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenConversation = async ({ userId }: { userId: string }) => {
    setIsLoading(true);
    try {
      const conversation = await axios.post("/api/conversations", {
        userId,
      });

      router.push(`/conversations/${conversation.data.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingModal />}
      <div
        className={`lg:fixed lg:inset-y-0 items-center lg:w-[320px] w-full lg:block border-r-[1px] border-neutral`}
      >
        {" "}
        <h4 className="text-2xl font-bold py-4 px-3">People</h4>
        <div className="lg:h-[calc(100vh-80px)] overflow-y-scroll lg:px-0 px-3">
          <ul className="flex flex-col px-0 menu">
            {React.Children.toArray(
              users.map((user) => {
                return (
                  <li
                    className="w-full"
                    onClick={() => handleOpenConversation({ userId: user.id })}
                  >
                    <div className="flex flex-row items-center px-2">
                      <Avatar user={user} />
                      <p>{user.name}</p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserList;
