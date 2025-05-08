import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useFetchProperties = () => {
  const [loading, setLoading] = useState(false);

  const fetchProperties = async (filter = {}) => {
    const params = new URLSearchParams();
    
    // Add address filter if it's set
    if (filter.address?.trim()) {
      const addressValue = filter.address.trim();
      params.append('address', addressValue);
      console.log("Frontend sending address:", addressValue);
    }

    // Add price range filter if it's set
    if (Array.isArray(filter.priceRange) && filter.priceRange.length === 2) {
      params.append('priceRange', filter.priceRange.join(','));
      console.log("Frontend sending price range:", filter.priceRange);
    }

    // Add number of bedrooms filter if it's set
    if (filter.numberOfBedrooms !== undefined && filter.numberOfBedrooms !== null) {
      params.append('numberOfBedrooms', filter.numberOfBedrooms);
      console.log("Frontend sending number of bedrooms:", filter.numberOfBedrooms);
    }

    setLoading(true);
    try {
      const url = `/list/filter?${params}`;
      console.log("Making request to:", url);
      const response = await api.get(url);
      console.log("Search response:", response.data);
      if (response.data.message?.startsWith("Ple")) {
        toast.warn(response.data.message);
      }
      return response.data.properties || [];
    } catch (error) {
      console.error("Search error:", error);
      toast.error(getResponseMsg(error));
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchProperties };
};

export default useFetchProperties;
