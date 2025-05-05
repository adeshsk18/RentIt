import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
} from "@mui/material";
import { BedDouble, IndianRupee, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { availablePropertyTypes } from "../../constanst";

// Default filter values
const defaultFilters = {
  propertyType: "",
  priceRange: [1000, 40000],
  numberOfBedrooms: 1,
};

const AdvancedFilters = ({ handleSearch }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [hasModifiedFilters, setHasModifiedFilters] = useState(false);
  const minPriceDiff = 2000;

  // Check if any filter has been modified from its default value
  useEffect(() => {
    const isModified = 
      filters.propertyType !== defaultFilters.propertyType ||
      JSON.stringify(filters.priceRange) !== JSON.stringify(defaultFilters.priceRange) ||
      filters.numberOfBedrooms !== defaultFilters.numberOfBedrooms;
    
    setHasModifiedFilters(isModified);
  }, [filters]);

  const handlePriceRangeChange = (_, newValue) => {
    if (!Array.isArray(newValue)) return;
    
    // Ensure minimum difference between min and max price
    if (newValue[1] - newValue[0] < minPriceDiff) {
      if (newValue[0] === filters.priceRange[0]) {
        newValue[1] = newValue[0] + minPriceDiff;
      } else {
        newValue[0] = newValue[1] - minPriceDiff;
      }
    }
    
    setFilters({ ...filters, priceRange: newValue });
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    handleSearch(defaultFilters);
    // Reload the page after clearing filters
    window.location.reload();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
        {hasModifiedFilters && (
          <Button
            variant="text"
            startIcon={<X className="h-4 w-4" />}
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 transition-opacity"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Price Range */}
        <div className="space-y-2">
          <Typography variant="body1" className="font-medium text-gray-700">
            Monthly Rent
          </Typography>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <IndianRupee className="h-4 w-4" />
            <span>
              ₹{filters.priceRange[0].toLocaleString()} - ₹
              {filters.priceRange[1].toLocaleString()}/mo
            </span>
          </div>
          <Slider
            value={filters.priceRange}
            min={1000}
            max={170000}
            step={1000}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
          />
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Typography variant="body1" className="font-medium text-gray-700">
            Bedrooms
          </Typography>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BedDouble className="h-4 w-4" />
            <span>{filters.numberOfBedrooms} Bedroom{filters.numberOfBedrooms !== 1 ? 's' : ''}</span>
          </div>
          <Slider
            value={filters.numberOfBedrooms}
            min={1}
            max={7}
            step={1}
            onChange={(_, newValue) => setFilters({ ...filters, numberOfBedrooms: newValue })}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} Bedroom${value !== 1 ? 's' : ''}`}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="contained"
          onClick={() => handleSearch(filters)}
          className="px-6"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default AdvancedFilters; 