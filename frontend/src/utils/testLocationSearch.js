// Test script for location search functionality
const testLocationSearch = async () => {
  // Test cases with sample addresses
  const testCases = [
    {
      name: "Test Case 1 - Exact Address Match",
      address: "123 Main Street",
      expected: "Should return properties with exact address match"
    },
    {
      name: "Test Case 2 - Partial Address Match",
      address: "Main",
      expected: "Should return properties containing 'Main' in address"
    },
    {
      name: "Test Case 3 - Case Insensitive Match",
      address: "main street",
      expected: "Should return properties regardless of case"
    }
  ];

  console.log("Starting Location Search Tests...\n");

  for (const testCase of testCases) {
    console.log(`\n${testCase.name}`);
    console.log(`Searching for: "${testCase.address}"`);
    console.log(`Expected: ${testCase.expected}`);

    try {
      const response = await fetch(`http://localhost:3000/api/property/filter?address=${encodeURIComponent(testCase.address)}`);
      const data = await response.json();

      console.log("\nResults:");
      console.log(`Status: ${response.status}`);
      console.log(`Number of properties found: ${data.properties.length}`);

      if (data.properties.length > 0) {
        console.log("\nSample Property Details:");
        data.properties.slice(0, 2).forEach((property, index) => {
          console.log(`\nProperty ${index + 1}:`);
          console.log(`Address: ${property.address}`);
          console.log(`Property Type: ${property.propertyType}`);
          console.log(`Rent: ${property.rent}`);
        });
      } else {
        console.log("No properties found matching the search criteria");
      }

    } catch (error) {
      console.error("Error during test:", error);
    }

    console.log("\n" + "=".repeat(50));
  }
};

// Run the tests
testLocationSearch().catch(console.error); 