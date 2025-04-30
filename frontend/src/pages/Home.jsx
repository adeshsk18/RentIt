import React, { useEffect, useState, useCallback } from "react";
import { ChevronDown, Home as HomeIcon, MapPin, Search, Compass, ArrowUp } from "lucide-react";
import { toast } from "react-toastify";

import PropertiesGrid from "../components/PropertiesGrid";
import Loading from "../components/blocks/loading";
import NoListings from "../components/blocks/noListings";
import AdvancedFilters from "../components/home/AdvancedFilters";
import PropertyTypeSelect from "../components/frags/ProptypeSelect";
import { availablePropertyTypes } from "../constanst";
import useFetchProperties from "../hooks/property/useFetchProperties";

const QuickSearch = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [error, setError] = useState("");

  const handleQuickSearch = (e) => {
    e.preventDefault();
    
    // Clear any previous error
    setError("");

    // Check if at least one field is filled
    if (!location.trim() && !propertyType) {
      setError("Please enter a location or select a property type");
      toast.warning("Please enter a location or select a property type");
      return;
    }

    onSearch({
      address: location.trim(),
      propertyType: propertyType,
      priceRange: [1000, 40000],
      numberOfBedrooms: 1,
      amenities: [],
    });
  };

  return (
    <form onSubmit={handleQuickSearch} className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4 rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setError(""); // Clear error when user types
              }}
              className={`w-full rounded-lg border ${error && !location.trim() ? 'border-red-300' : 'border-gray-300'} bg-white py-3 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
          </div>
        </div>
        <div className="flex-1">
          <PropertyTypeSelect
            formData={{ propertyType }}
            handleChange={(e) => {
              setPropertyType(e.target.value);
              setError("");
            }}
            useAll={true}
            required={false}
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Search className="h-5 w-5" />
          Search
        </button>
      </div>
      {error && (
        <div className="mt-2 text-center text-sm text-red-500">
          {error}
        </div>
      )}
    </form>
  );
};

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [filters, setFilters] = useState({
    address: "",
    propertyType: "",
    priceRange: [1000, 40000],
    numberOfBedrooms: 1,
    amenities: [],
  });

  const { loading, fetchProperties } = useFetchProperties();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToProperties = () => {
    const propertiesSection = document.getElementById('properties-section');
    if (propertiesSection) {
      setTimeout(() => {
        propertiesSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const handleSearch = useCallback(async (searchFilters = filters, shouldScroll = true) => {
    const results = await fetchProperties(searchFilters);
    setProperties(results || []);
    if (shouldScroll) {
      scrollToProperties();
    }
  }, [fetchProperties]);

  // Add initial load to fetch all properties
  useEffect(() => {
    handleSearch({}, false);
  }, []);

  const showLoading = loading;

  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-[600px] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80"
            alt="Modern apartment interior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Dream Rental Home
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-200">
              Discover the perfect space that feels like home. Browse through our curated collection of premium rental properties.
            </p>
            
            <QuickSearch onSearch={(newFilters) => {
              setFilters(newFilters);
              handleSearch(newFilters, true);
            }} />

            <div className="mt-8 flex flex-col items-center space-y-2">
              <p className="text-white/80 text-sm">- or -</p>
              <button
                onClick={() => {
                  handleSearch({}, true);
                  scrollToProperties();
                }}
                className="group inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Compass className="h-5 w-5 transition-transform group-hover:rotate-45" />
                Explore All Properties
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div id="properties-section" className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <AdvancedFilters
            filters={filters}
            setFilters={setFilters}
            handleSearch={handleSearch}
          />

          {showLoading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : properties.length === 0 ? (
            <NoListings />
          ) : (
            <PropertiesGrid properties={properties} />
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Home;
