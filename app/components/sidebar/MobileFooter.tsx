"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import React from "react";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();

  const { isOpen } = useConversation();

  if (isOpen) return null;

  return (
    <div className="lg:hidden fixed bottom-0 w-full">
      <ul className="menu menu-horizontal w-full flex flex-row justify-around">
        {React.Children.toArray(
          routes.map((route) => <MobileItem {...route} />)
        )}
      </ul>
    </div>
  );
};

export default MobileFooter;
