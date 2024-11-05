import { Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PropertyDetails from "../components/PropertyDetails";
import Loading from "../components/blocks/loading";
import NaBlock from "../components/blocks/naBlock";
import RequestForm from "../components/listing/RequestForm";
import UserInfoCard from "../components/listing/UserInfoCard";
import useGetProperty from "../hooks/property/useGetProperty";

const Listing = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const { loading, getProperty } = useGetProperty();

  useEffect(() => {
    const fetchProperty = async () => {
      const property = await getProperty(propertyId);
      setProperty(property);
    };
    fetchProperty();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!property) return <NaBlock message={"404 Not Available!"} />;

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Card className="rounded-xl bg-white shadow-lg">
        <CardContent>
          <PropertyDetails
            property={property}
            showStatusInfo={true}
            showDateInfo={false}
          />

          <h6 className="mb-3 text-lg font-semibold">Posted By</h6>
          <UserInfoCard user={property.listedBy} />
          <RequestForm propertyId={property._id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Listing;
