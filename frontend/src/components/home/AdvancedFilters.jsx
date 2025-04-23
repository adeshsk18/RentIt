import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
} from "@mui/material";
import { BedDouble, IndianRupee, X } from "lucide-react";
import React, { useState, useMemo } from "react";

import AmenitiesSelect from "../frags/AminitiesSelect";
import PropertyTypeSelect from "../frags/ProptypeSelect";

// Default filter values
const defaultFilters = {
  priceRange: [1000, 40000],
  numberOfBedrooms: 1,
  propertyType: "",
  amenities: [],
};

const AdvancedFilters = ({ filters, setFilters, handleSearch }) => {
  const [isAmenitiesOpen, setAmenitiesOpen] = useState(false);
  const minPriceDiff = 2000;

  // Check if any filter has been modified from default values
  const hasModifiedFilters = useMemo(() => {
    return (
      filters.propertyType !== defaultFilters.propertyType ||
      filters.numberOfBedrooms !== defaultFilters.numberOfBedrooms ||
      filters.priceRange[0] !== defaultFilters.priceRange[0] ||
      filters.priceRange[1] !== defaultFilters.priceRange[1] ||
      filters.amenities.length > 0
    );
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
    setFilters({
      ...filters,
      ...defaultFilters
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Advanced Search</h2>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Price Range */}
        <div className="space-y-2">
          <Typography variant="body1" className="font-medium text-gray-700">
            Price Range
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
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-gray-500" />
            <div className="flex items-center space-x-2">
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setFilters({
                    ...filters,
                    numberOfBedrooms: Math.max(0, filters.numberOfBedrooms - 1),
                  })
                }
              >
                -
              </Button>
              <span className="w-8 text-center font-medium">
                {filters.numberOfBedrooms}
              </span>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setFilters({
                    ...filters,
                    numberOfBedrooms: Math.min(7, filters.numberOfBedrooms + 1),
                  })
                }
              >
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Typography variant="body1" className="font-medium text-gray-700">
            Property Type
          </Typography>
          <PropertyTypeSelect
            formData={filters}
            handleChange={(e) =>
              setFilters({ ...filters, propertyType: e.target.value })
            }
            useAll={true}
            required={false}
          />
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <Typography variant="body1" className="font-medium text-gray-700">
            Amenities
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setAmenitiesOpen(true)}
            className="w-full justify-start"
          >
            <span className="my-1 h-5 font-medium">
              {filters.amenities.length === 0
                ? "Select Amenities"
                : `${filters.amenities.length} Selected`}
            </span>
          </Button>
          <Dialog open={isAmenitiesOpen} onClose={() => setAmenitiesOpen(false)}>
            <DialogContent>
              <DialogTitle variant="h6" className="flex items-center gap-2">
                <Typography variant="inherit" className="flex items-center gap-2">
                  Select Amenities
                </Typography>
              </DialogTitle>
              <AmenitiesSelect formData={filters} setFormData={setFilters} />
              <div className="mt-5 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="text"
                  disabled={filters.amenities.length === 0}
                  onClick={() => setFilters({ ...filters, amenities: [] })}
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setAmenitiesOpen(false)}
                >
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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