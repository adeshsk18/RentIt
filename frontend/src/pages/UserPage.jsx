import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileBox from "../components/ProfileBox";
import PropertiesGrid from "../components/PropertiesGrid";
import Loading from "../components/blocks/loading";
import NaBlock from "../components/blocks/naBlock";
import NoListings from "../components/blocks/noListings";
import useGetUserInfo from "../hooks/user/useGetUserInfo";

const PublicUserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const { loading, getUserInfo } = useGetUserInfo();
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserInfo(userId);
      if (data) {
        setProperties(data.properties);
        setUser(data.user);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return <Loading />;
  }

  if (!properties || !user) return <NaBlock message="User Doesn't exist." />;

  return (
    <div className="container mx-auto px-4 py-6">
      <ProfileBox userData={user} />

      <div className="mt-8">
        {properties.length === 0 ? (
          <NoListings
            message="User doesn't have any properties"
            subMessage=""
          />
        ) : (
          <PropertiesGrid properties={properties} title="Posted Properties" />
        )}
      </div>
    </div>
  );
};

export default PublicUserProfile;
