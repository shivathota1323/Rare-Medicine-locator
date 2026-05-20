import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import ChatBot from "./ChatBot.jsx";
import { useAuth } from "../store/authStore.js";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <ChatBot />
    </>
  );
}

export default RootLayout;
