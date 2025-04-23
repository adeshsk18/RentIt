// Test script to verify filters are working correctly
const testFilters = async () => {
  const testCases = [
    {
      name: "Test Price Range Filter",
      filters: {
        priceRange: [10000, 20000],
        propertyType: "",
        numberOfBedrooms: 1,
        amenities: [],
      },
      expected: (property) => property.rent >= 10000 && property.rent <= 20000,
    },
    {
      name: "Test Bedrooms Filter",
      filters: {
        priceRange: [1000, 40000],
        propertyType: "",
        numberOfBedrooms: 2,
        amenities: [],
      },
      expected: (property) => property.numberOfBedrooms === 2,
    },
    {
      name: "Test Property Type Filter",
      filters: {
        priceRange: [1000, 40000],
        propertyType: "apartment",
        numberOfBedrooms: 1,
        amenities: [],
      },
      expected: (property) => property.propertyType === "apartment",
    },
    {
      name: "Test Amenities Filter",
      filters: {
        priceRange: [1000, 40000],
        propertyType: "",
        numberOfBedrooms: 1,
        amenities: ["wifi", "parking"],
      },
      expected: (property) => 
        property.amenities.includes("wifi") && 
        property.amenities.includes("parking"),
    },
    {
      name: "Test Combined Filters",
      filters: {
        priceRange: [15000, 30000],
        propertyType: "house",
        numberOfBedrooms: 3,
        amenities: ["wifi"],
      },
      expected: (property) => 
        property.rent >= 15000 && 
        property.rent <= 30000 &&
        property.propertyType === "house" &&
        property.numberOfBedrooms === 3 &&
        property.amenities.includes("wifi"),
    },
  ];

  for (const testCase of testCases) {
    console.log(`\nRunning test: ${testCase.name}`);
    console.log("Filters:", testCase.filters);

    try {
      const response = await fetch(`/api/list/filter?${new URLSearchParams({
        ...testCase.filters,
        priceRange: testCase.filters.priceRange.join(","),
        amenities: testCase.filters.amenities.join(","),
      })}`);
      
      const data = await response.json();
      const properties = data.properties || [];

      console.log(`Found ${properties.length} properties`);

      // Verify each property matches the expected criteria
      const allValid = properties.every(testCase.expected);
      console.log(`All properties match criteria: ${allValid}`);

      if (!allValid) {
        console.log("Properties that don't match:");
        properties
          .filter(property => !testCase.expected(property))
          .forEach(property => {
            console.log({
              id: property._id,
              rent: property.rent,
              bedrooms: property.numberOfBedrooms,
              type: property.propertyType,
              amenities: property.amenities,
            });
          });
      }
    } catch (error) {
      console.error("Test failed:", error);
    }
  }
};

// To run the tests, call:
// testFilters(); 