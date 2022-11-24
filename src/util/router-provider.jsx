import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import UserPage from "../pages/UserPage";
import JoinChatPage from "../pages/JoinChatPage";
import NewChatPage from "../pages/NewChatPage";
import ChatsPage from "../pages/ChatsPage";
import ChangePassword from "../components/ChangePassword";
import ChangeUsername from "../components/ChangeUsername";
import ChangeEmail from "../components/ChangeEmail";
import ChatRoomPage from "../pages/ChatRoomPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />}>
          <Route index element={<Navigate to="/user/profile" />} />
          <Route path="/user/joinchat" element={<JoinChatPage />} />
          <Route path="/user/newchat" element={<NewChatPage />} />
          <Route path="/user/chats" element={<ChatsPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route
            path="/user/profile/changepassword"
            element={<ChangePassword />}
          />
          <Route
            path="/user/profile/changeusername"
            element={<ChangeUsername />}
          />
          <Route path="/user/profile/changeemail" element={<ChangeEmail />} />
        </Route>
        <Route path="/*" element={<Navigate to="/home" />} />
      </Route>
      <Route path="/chat/:chatId" element={<ChatRoomPage />} />
    </Route>
  )
);
