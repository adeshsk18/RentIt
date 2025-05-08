import {
  Button,
  Slider,
  Typography,
  Grid,
} from "@mui/material";
import { X, BedDouble, IndianRupee } from "lucide-react";
import React, { useState, useEffect } from "react";

const defaultFilters = {
  priceRange: [1000, 40000],
  numberOfBedrooms: 1,
};

const AdvancedFilters = ({ handleSearch }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [hasModifiedFilters, setHasModifiedFilters] = useState(false);
  const minPriceDiff = 2000;

  useEffect(() => {
    const isModified = 
      JSON.stringify(filters.priceRange) !== JSON.stringify(defaultFilters.priceRange) ||
      filters.numberOfBedrooms !== defaultFilters.numberOfBedrooms;
    setHasModifiedFilters(isModified);
  }, [filters]);

  const clearFilters = () => {
    setFilters(defaultFilters);
    handleSearch(defaultFilters);
    window.location.reload();
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(filters);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filter Properties</h2>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <Grid container spacing={3}>
          {/* Price Range */}
          <Grid item xs={12} md={6}>
            <div className="space-y-2">
              <Typography variant="subtitle1" className="flex items-center gap-2 font-medium text-gray-700">
                <IndianRupee className="h-4 w-4" />
                Price Range
              </Typography>
              <div className="text-sm text-gray-500">
                ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}/month
              </div>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                min={1000}
                max={170000}
                step={1000}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
              />
            </div>
          </Grid>

          {/* Number of Bedrooms */}
          <Grid item xs={12} md={6}>
            <div className="space-y-2">
              <Typography variant="subtitle1" className="flex items-center gap-2 font-medium text-gray-700">
                <BedDouble className="h-4 w-4" />
                Bedrooms
              </Typography>
              <div className="text-sm text-gray-500">
                {filters.numberOfBedrooms} {filters.numberOfBedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </div>
              <Slider
                value={filters.numberOfBedrooms}
                onChange={(_, newValue) => setFilters({ ...filters, numberOfBedrooms: newValue })}
                min={1}
                max={7}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} ${value === 1 ? 'Bedroom' : 'Bedrooms'}`}
              />
            </div>
          </Grid>
        </Grid>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            className="px-6"
          >
            Apply Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedFilters; 