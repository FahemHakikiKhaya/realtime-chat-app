import AuthForm from "./components/AuthForm";
import { MdOutlineMessage } from "react-icons/md";

const Home = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="flex gap-2 text-xl items-center mb-4">
        <MdOutlineMessage />
        <h1>Connect</h1>
      </div>
      <h1 className="text-xl font-bold mb-5">Sign in to your account</h1>
      <AuthForm />
    </div>
  );
};

export default Home;
