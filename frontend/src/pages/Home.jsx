import React, { useEffect, useState } from "react";

import PropertiesGrid from "../components/PropertiesGrid";
import Loading from "../components/blocks/loading";
import NoListings from "../components/blocks/noListings";
import FilterWidget from "../components/home/FilterWidget";
import useFetchProperties from "../hooks/property/useFetchProperties";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    address: "",
    maxDistance: 5,
    priceRange: [1000, 40000],
    numberOfBedrooms: 1,
    propertyType: "",
    amenities: [],
  });

  const { loading, fetchProperties } = useFetchProperties();

  const handleSearch = async () => {
    setProperties(await fetchProperties(filters));
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="md:w-full">
          <FilterWidget
            filters={filters}
            setFilters={setFilters}
            handleSearch={handleSearch}
          />
        </div>

        {loading ? (
          <Loading />
        ) : properties.length === 0 ? (
          <NoListings />
        ) : (
          <PropertiesGrid properties={properties} />
        )}
      </div>
    </div>
  );
};

export default Home;
