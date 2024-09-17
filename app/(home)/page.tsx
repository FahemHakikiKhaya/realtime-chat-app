"use client";

import { useSession } from "next-auth/react";
import AuthForm from "./components/AuthForm";
import { MdOutlineMessage } from "react-icons/md";
import LoadingModal from "../components/LoadingModal";
import { useEffect, useState } from "react";
import { LuMessagesSquare } from "react-icons/lu";

const Home = () => {
  const session = useSession();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (session.status !== "loading") {
      setInitialLoading(false);
    }
  }, [session.status]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {initialLoading && <LoadingModal />}
      <div className="flex gap-2 text-2xl items-center mb-2">
        <LuMessagesSquare />
        <h1 className="font-bold">Connect</h1>
      </div>
      <h1 className="text-lg font-light mb-5">Log in to start connecting</h1>
      <AuthForm />
    </div>
  );
};

export default Home;
