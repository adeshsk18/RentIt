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
            
            {/* Location Search Box */}
            <div className="mx-auto mb-8 max-w-2xl">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                <div className="flex flex-1 items-center gap-2 rounded-lg bg-white/5 px-4 py-2">
                  <MapPin className="h-5 w-5 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={filters.address}
                    onChange={(e) => setFilters(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => handleSearch(filters, true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </div>
            </div>

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
