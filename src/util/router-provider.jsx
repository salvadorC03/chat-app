import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../components/UI/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import UserPage from "../pages/UserPage";
import JoinChatPage from "../pages/JoinChatPage";
import NewChatPage from "../pages/NewChatPage";
import ChatsPage from "../pages/ChatsPage";
import ChatRoomPage from "../pages/ChatRoomPage";
import ChangeEmailPage from "../pages/ChangeEmailPage";
import ChangeUsernamePage from "../pages/ChangeUsernamePage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import AnonymousUserPage from "../pages/AnonymousUserPage";
import AnonymousUserProfile from "../components/UserPage/AnonymousUserProfile";

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
            element={<ChangePasswordPage />}
          />
          <Route
            path="/user/profile/changeusername"
            element={<ChangeUsernamePage />}
          />
          <Route
            path="/user/profile/changeemail"
            element={<ChangeEmailPage />}
          />
        </Route>
        <Route path="/anonymous" element={<AnonymousUserPage />}>
        <Route index element={<Navigate to="/anonymous/profile" />} />
          <Route path="/anonymous/profile" element={<AnonymousUserProfile />} />
          <Route path="/anonymous/joinchat" element={<JoinChatPage />} />
        </Route>
        <Route path="/*" element={<Navigate to="/home" />} />
      </Route>
      <Route path="/chat/:chatId" element={<ChatRoomPage />} />
    </Route>
  )
);
