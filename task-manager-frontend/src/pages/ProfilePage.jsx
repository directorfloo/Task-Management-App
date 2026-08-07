import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../store/slices/authSlice.js";
import { saveAvatar } from "../utils/avatarStore.js";
import Header from "../components/Header.jsx";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("success");

  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "?";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNoticeType("error");
      setNotice("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setNoticeType("error");
      setNotice("Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      dispatch(setAvatar(dataUrl));
      saveAvatar(user.username, dataUrl);
      setNoticeType("success");
      setNotice("Profile picture updated.");
      setTimeout(() => setNotice(""), 2500);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page">
      <Header />
      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar">{initials}</div>
            )}
            <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
              Change photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            {notice && (
              <p className={`profile-notice ${noticeType === "error" ? "profile-notice-error" : ""}`}>
                {notice}
              </p>
            )}
          </div>

          <div className="profile-info">
            <span className="section-eyebrow">Account</span>
            <h1 className="profile-name">{user?.username}</h1>

            <div className="profile-field">
              <span className="profile-label">Username</span>
              <span className="profile-value">{user?.username}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">User ID</span>
              <span className="profile-value mono">{user?.userId}</span>
            </div>
           
          </div>
        </div>
      </main>
    </div>
  );
}
