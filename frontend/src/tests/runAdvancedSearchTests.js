import api from '../services/api';

// Advanced Search Functionality Tests
const runAdvancedSearchTests = async () => {
    console.log('🔍 Starting Advanced Search Functionality Tests...\n');
    
    // Test cases for different search scenarios
    const testCases = [
        {
            name: 'Price Range Filter Test',
            filters: {
                address: 'Mumbai',
                maxDistance: 10,
                priceRange: [5000, 15000],
                numberOfBedrooms: 2,
                propertyType: '',
                amenities: []
            },
            expectedValidation: (results) => {
                console.log('Checking properties with rent between 5000 and 15000');
                return results.every(property => {
                    const isValid = property.rent >= 5000 && property.rent <= 15000;
                    if (!isValid) {
                        console.log(`Failed property: Rent ${property.rent} is not between 5000-15000`);
                    }
                    return isValid;
                });
            }
        },
        {
            name: 'Bedrooms Filter Test',
            filters: {
                address: 'Mumbai',
                maxDistance: 10,
                priceRange: [1000, 50000],
                numberOfBedrooms: 3,
                propertyType: '',
                amenities: []
            },
            expectedValidation: (results) => {
                console.log('Checking properties with 3 bedrooms');
                return results.every(property => {
                    const isValid = property.numberOfBedrooms === 3;
                    if (!isValid) {
                        console.log(`Failed property: Has ${property.numberOfBedrooms} bedrooms instead of 3`);
                    }
                    return isValid;
                });
            }
        },
        {
            name: 'Property Type Filter Test',
            filters: {
                address: 'Mumbai',
                maxDistance: 10,
                priceRange: [1000, 50000],
                numberOfBedrooms: 1,
                propertyType: 'apartment',
                amenities: []
            },
            expectedValidation: (results) => {
                console.log('Checking properties of type apartment');
                return results.every(property => {
                    const isValid = property.propertyType.toLowerCase() === 'apartment';
                    if (!isValid) {
                        console.log(`Failed property: Type is ${property.propertyType} instead of apartment`);
                    }
                    return isValid;
                });
            }
        },
        {
            name: 'Amenities Filter Test',
            filters: {
                address: 'Mumbai',
                maxDistance: 10,
                priceRange: [1000, 50000],
                numberOfBedrooms: 1,
                propertyType: '',
                amenities: ['parking', 'wifi']
            },
            expectedValidation: (results) => {
                console.log('Checking properties with parking and wifi');
                return results.every(property => {
                    const hasParking = property.amenities.includes('parking');
                    const hasWifi = property.amenities.includes('wifi');
                    if (!hasParking || !hasWifi) {
                        console.log(`Failed property: Missing ${!hasParking ? 'parking' : 'wifi'}`);
                    }
                    return hasParking && hasWifi;
                });
            }
        },
        {
            name: 'Combined Filters Test',
            filters: {
                address: 'Mumbai',
                maxDistance: 5,
                priceRange: [10000, 20000],
                numberOfBedrooms: 2,
                propertyType: 'apartment',
                amenities: ['parking']
            },
            expectedValidation: (results) => {
                console.log('Checking properties matching all combined criteria');
                return results.every(property => {
                    const checks = {
                        rent: property.rent >= 10000 && property.rent <= 20000,
                        bedrooms: property.numberOfBedrooms === 2,
                        type: property.propertyType.toLowerCase() === 'apartment',
                        parking: property.amenities.includes('parking')
                    };
                    
                    if (!Object.values(checks).every(Boolean)) {
                        console.log('Failed property checks:', {
                            property: {
                                rent: property.rent,
                                bedrooms: property.numberOfBedrooms,
                                type: property.propertyType,
                                amenities: property.amenities
                            },
                            failedChecks: Object.entries(checks)
                                .filter(([, passed]) => !passed)
                                .map(([check]) => check)
                        });
                    }
                    return Object.values(checks).every(Boolean);
                });
            }
        }
    ];

    // Run each test case
    for (const testCase of testCases) {
        try {
            console.log(`\n🧪 Running Test: ${testCase.name}`);
            console.log('Filters:', JSON.stringify(testCase.filters, null, 2));
            
            // Make API call to fetch properties with filters
            const queryString = new URLSearchParams({
                address: testCase.filters.address,
                maxDistance: testCase.filters.maxDistance,
                priceRange: testCase.filters.priceRange.join(','),
                numberOfBedrooms: testCase.filters.numberOfBedrooms,
                propertyType: testCase.filters.propertyType,
                amenities: testCase.filters.amenities.join(',')
            }).toString();

            const response = await api.get(`/list/filter?${queryString}`);
            const results = response.data.properties || [];

            // Validate results
            console.log(`Found ${results.length} properties`);
            const passed = testCase.expectedValidation(results);
            
            console.log(`\nTest ${passed ? '✅ PASSED' : '❌ FAILED'}`);
            
            if (results.length === 0) {
                console.log('⚠️ Warning: No properties found for this filter combination');
            }

        } catch (error) {
            console.error(`❌ Test Failed: ${testCase.name}`);
            console.error('Error:', error.message);
        }
    }

    console.log('\n🏁 Advanced Search Testing Completed!');
};

// Export the function
export default runAdvancedSearchTests; 