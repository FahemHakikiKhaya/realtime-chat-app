import { FC, PropsWithChildren } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";

const Sidebar: FC<PropsWithChildren> = async ({ children }) => {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser} />
      <main className="lg:pl-20 h-full">{children}</main>
      <MobileFooter />
    </div>
  );
};

export default Sidebar;
