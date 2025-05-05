import { useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import { getResponseMsg } from "../../services/utils";

const useFetchProperties = () => {
  const [loading, setLoading] = useState(false);

  const fetchProperties = async (filter = {}) => {
    const params = new URLSearchParams();
    
    // Only add filters that are explicitly set
    if (filter.address?.trim()) {
      const addressValue = filter.address.trim();
      params.append('address', addressValue);
      console.log("Frontend sending address:", addressValue);
    }
    
    if (filter.propertyType?.trim()) {
      params.append('propertyType', filter.propertyType.trim());
    }
    
    if (Array.isArray(filter.priceRange) && filter.priceRange.length === 2) {
      params.append('priceRange', filter.priceRange.join(','));
    }
    
    if (filter.numberOfBedrooms !== undefined && filter.numberOfBedrooms !== null) {
      params.append('numberOfBedrooms', filter.numberOfBedrooms);
    }
    
    if (Array.isArray(filter.amenities) && filter.amenities.length > 0) {
      params.append('amenities', filter.amenities.join(','));
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
