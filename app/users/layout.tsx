import { FC, PropsWithChildren, ReactNode } from "react";
import DesktopSidebar from "../components/sidebar/DesktopSidebar";
import Sidebar from "../components/sidebar";
import getUsers from "../actions/getUsers";
import UserList from "./components/UserList";

export default async function UserLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <UserList users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
