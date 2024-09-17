import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar";
import useConversation from "../hooks/useConversation";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <ConversationList initialItems={conversations} users={users} />
      <div>{children}</div>
    </Sidebar>
  );
}
