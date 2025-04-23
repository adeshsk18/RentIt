import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useFetchProperties = () => {
  const [loading, setLoading] = useState(false);

  const fetchProperties = async (filter) => {
    const queryString = new URLSearchParams({
      address: filter.address || "",
      propertyType: filter.propertyType || "",
      priceRange: Array.isArray(filter.priceRange) ? filter.priceRange.join(",") : "1000,40000",
      numberOfBedrooms: filter.numberOfBedrooms || 1,
      amenities: Array.isArray(filter.amenities) ? filter.amenities.join(",") : "",
    }).toString();

    if (!loading) {
      setLoading(true);
      try {
        const response = await api.get(`/list/filter?${queryString}`);
        if (response.data.message?.startsWith("Ple")) {
          toast.warn(response.data.message);
        }
        return response.data.properties || [];
      } catch (error) {
        toast.error(getResponseMsg(error));
        return [];
      } finally {
        setLoading(false);
      }
    }
    return [];
  };

  return { loading, fetchProperties };
};

export default useFetchProperties;
