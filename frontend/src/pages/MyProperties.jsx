import { Typography } from "@mui/material";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Loading from "../components/blocks/loading";
import NaBlock from "../components/blocks/naBlock";
import DetailedInfoCard from "../components/property/DetailedInfoCard";
import useGetMyProperties from "../hooks/property/useGetMyProperties";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);

  const { loading, getProperties } = useGetMyProperties();

  useEffect(() => {
    const fetchProperties = async () => {
      setProperties(await getProperties());
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!properties) return <NaBlock message="404" />;

  return (
    <div className="container relative mx-auto min-h-screen px-4 py-8 pb-24">
      <h1 className="mb-8 text-3xl font-bold">My Properties</h1>

      <div className="space-y-6">
        {properties.length === 0 ? (
          <Typography>You Have No Properties</Typography>
        ) : (
          properties.map((property) => (
            <DetailedInfoCard key={property._id} property={property} />
          ))
        )}
      </div>

      <NavLink
        to="/property/add"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg transition-colors hover:bg-blue-600"
      >
        <Plus className="h-6 w-6 text-white" />
      </NavLink>
    </div>
  );
};

export default MyProperties;
