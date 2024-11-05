import { Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PropertyDetails from "../components/PropertyDetails";
import Loading from "../components/blocks/loading";
import NaBlock from "../components/blocks/naBlock";
import ChangeStatus from "../components/property/ChangeStatus";
import DeleteProperty from "../components/property/DeleteProperty";
import EditProperty from "../components/property/EditProperty";
import PropertyRequests from "../components/requests/PropertyRequests";
import useGetMyProperty from "../hooks/property/useGetMyProperty";
import useRequestStore from "../stores/useRequestStore";

const UDProperty = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const { clearSelectedRequest } = useRequestStore();

  const { loading, getProperty } = useGetMyProperty();

  useEffect(() => {
    fetchProperty();
    clearSelectedRequest();
  }, [propertyId]);

  const fetchProperty = async () => {
    const ret = await getProperty(propertyId);
    setTimeout(() => {}, 500);
    setProperty(ret);
  };

  if (loading) {
    return <Loading />;
  }

  if (!property) return <NaBlock />;

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Card className="rounded-xl bg-white shadow-lg">
        <CardContent className="p-6">
          <PropertyDetails
            property={property}
            showDateInfo={true}
            showStatusInfo={false}
          />
          <div className="mt-4 flex justify-end gap-5">
            <div className="flex w-full justify-end gap-2 sm:w-auto sm:flex-row sm:gap-3">
              <DeleteProperty
                propertyId={property._id}
                title={property.title}
              />

              <EditProperty property={property} onSuccess={fetchProperty} />

              <ChangeStatus property={property} onSuccess={fetchProperty} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <PropertyRequests property={property} />
      </div>
    </div>
  );
};

export default UDProperty;
