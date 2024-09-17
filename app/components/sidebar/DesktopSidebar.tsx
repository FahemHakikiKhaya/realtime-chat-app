"use client";

import useRoutes from "@/app/hooks/useRoutes";
import React, { FC, useState } from "react";
import DesktopItem from "./DesktopItem";
import { User } from "@prisma/client";
import Image from "next/image";
import Modal from "../Modal";
import Avatar from "../Avatar";
import SettingsModal from "./SettingsModal";

interface DesktopSidebarProps {
  currentUser: User | null;
}

const DesktopSidebar: FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();

  const [settingsModal, setSettingsModal] = useState({ opened: false });

  return (
    <div className="hidden lg:block lg:fixed lg:h-screen lg:left-0 bg-neutral">
      <div className="flex flex-col justify-between items-center h-full px-2 py-4">
        <ul className="menu p-0">
          {React.Children.toArray(
            routes.map((route) => <DesktopItem {...route} />)
          )}
        </ul>

        <div
          className="avatar online cursor-pointer"
          onClick={() => setSettingsModal({ opened: true })}
        >
          <Avatar user={currentUser} />
        </div>
        <SettingsModal
          currentUser={currentUser}
          opened={settingsModal.opened}
          onClose={() => setSettingsModal({ opened: false })}
        />
      </div>
    </div>
  );
};

export default DesktopSidebar;
