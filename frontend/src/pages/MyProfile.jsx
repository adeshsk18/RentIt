import { Button } from "@mui/material";
import { LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";

import ProfileBox from "../components/ProfileBox";
import Loading from "../components/blocks/loading";
import NaBlock from "../components/blocks/naBlock";
import ChangePassword from "../components/profile/ChangePassword";
import EditProfile from "../components/profile/EditProfile";
import OwnerRequestButton from "../components/profile/OwnerRequestButton";
import useGetMyInfo from "../hooks/user/useGetMyInfo";
import useAuthStore from "../stores/useAuthStore";
import useLogout from "../hooks/auth/useLogout";

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { userData } = useAuthStore();
  const { loading: logoutLoading, logout } = useLogout();

  const [user, setUser] = useState(null);

  const { loading, getMyInfo } = useGetMyInfo();

  useEffect(() => {
    const fetchData = async () => {
      setUser(await getMyInfo());
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  if (!user) return <NaBlock />;

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <EditProfile
          userData={user}
          onUpdate={(updatedUserData) => {
            setIsEditing(false);
            setUser(updatedUserData);
          }}
          setIsEditing={setIsEditing}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 py-12">
      <ProfileBox userData={user} />
      <div className="mt-8 flex flex-col justify-center gap-6 p-6 md:flex-row">
        <Button onClick={() => setIsEditing(true)} variant="contained">
          Edit Profile
        </Button>
        <ChangePassword />
        {userData.type === "user" && <OwnerRequestButton />}
        <Button
          onClick={logout}
          disabled={logoutLoading}
          variant="contained"
          color="error"
          className="flex items-center gap-2"
        >
          <LogOut size={20} />
          {logoutLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
};

export default MyProfile;
