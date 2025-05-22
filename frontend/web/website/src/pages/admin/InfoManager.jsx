import React, { useState, useEffect } from "react";
import InfoEditor from "../../components/admin/InfoEditor";

const API_BASE_URL = "http://localhost:3000/api";

export default function PlantManager() {
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch plants when component mounts
    useEffect(() => {
        fetchPlants();
    }, []);    const fetchPlants = async () => {
        try {
            setLoading(true);
            console.log("Fetching plants from:", `${API_BASE_URL}/plants`);
            const response = await fetch(`${API_BASE_URL}/plants`);
            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch plants: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log("Plants data received:", data);
              // Process the plant data
            let plantData = [];
            
            // Handle different response formats
            if (data && data.success && Array.isArray(data.data)) {
                // Format: { success: true, data: [...] }
                plantData = data.data;
            } else if (Array.isArray(data)) {
                // Format: [...] (direct array)
                plantData = data;
            } else if (data && typeof data === 'object') {
                // Try to find an array property
                const arrayData = Object.values(data).find(val => Array.isArray(val));
                if (arrayData) {
                    plantData = arrayData;
                } else {
                    throw new Error("Could not find plant data in API response");
                }
            } else {
                throw new Error("Invalid data format received from API");
            }
              // Sort plants by plant_id (ascending order)
            const sortedPlants = [...plantData].sort((a, b) => {
                // Sort by plant_id in ascending order
                return a.plant_id - b.plant_id;
            });
            
            setPlants(sortedPlants);
            
            setError(null);
        } catch (err) {
            console.error("Error fetching plants:", err);
            setError("Failed to load plants. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (plant) => {
        setSelectedPlant(plant);
        setIsEditorOpen(true);
    };

    const handleCloseEditor = () => {
        setIsEditorOpen(false);
        setSelectedPlant(null);
    };

    const handleSavePlant = async (plantData) => {
        try {
            let response;
            const requestBody = {
                common_name: plantData.common_name,
                scientific_name: plantData.scientific_name,
                family: plantData.family,
                description: plantData.description,
                image_url: plantData.image_url
            };

            if (plantData.plant_id) {
                // Update existing plant
                response = await fetch(
                    `${API_BASE_URL}/plants/${plantData.plant_id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(requestBody),
                    }
                );
            } else {
                // Create new plant
                response = await fetch(`${API_BASE_URL}/plants`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });
            }            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to save plant information");
                } catch (parseError) {
                    // If we can't parse the error as JSON, use the status text
                    throw new Error(`Failed to save plant information: ${response.statusText}`);
                }
            }

            // Try to parse the successful response
            try {
                const result = await response.json();
                console.log("Plant saved successfully:", result);
                await fetchPlants(); // Refresh the plants list
                setIsEditorOpen(false);
                setSelectedPlant(null);
            } catch (parseError) {
                console.error("Error parsing success response:", parseError);
                await fetchPlants(); // Still try to refresh the list
                setIsEditorOpen(false);
                setSelectedPlant(null);
            }
        } catch (err) {
            console.error("Error saving plant:", err);
            alert("Error: " + err.message);
        }
    };

    const handleDeletePlant = async (plantId) => {
        if (window.confirm("Are you sure you want to delete this plant information?")) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/plants/${plantId}`,
                    {
                        method: "DELETE",
                    }
                );                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to delete plant information");
                    } catch (parseError) {
                        // If we can't parse the error as JSON, use the status text
                        throw new Error(`Failed to delete plant information: ${response.statusText}`);
                    }
                }

                try {
                    // Try to parse the success response
                    const result = await response.json();
                    console.log("Plant deleted successfully:", result);
                } catch (parseError) {
                    console.log("Plant deleted but couldn't parse response.");
                }
                await fetchPlants(); // Refresh the plants list
            } catch (err) {
                console.error("Error deleting plant:", err);
                alert("Error: " + err.message);
            }
        }
    };

    if (loading) {
        return <div className="p-4 text-green-950">Loading plant information...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }    return (
        <div className="p-4 text-green-950 w-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-green-900 font-bold text-lg mb-4">
                    Plant Information Manager
                </h1>

                <button
                    onClick={() => {
                        setSelectedPlant(null); // Reset selected plant
                        setIsEditorOpen(true); // Open editor in create mode
                    }}
                    className="px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors rounded flex items-center gap-2"
                >
                    Add New Plant Information
                </button>            </div>            {/* Plant Information Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                {/* Plant Count Card */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-green-800 text-xl font-semibold mb-1">Total Plants</h2>
                            <p className="text-green-600 text-sm">Collection of botanical information</p>
                        </div>
                        <div className="bg-white p-4 rounded-full shadow-md flex items-center justify-center h-16 w-16">
                            <span className="text-3xl font-bold text-green-700">{plants.length}</span>
                        </div>
                    </div>
                </div>                {/* Newest Addition */}
                {plants.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
                        <div className="flex items-center justify-between">
                            {(() => {
                                // Find plant with highest ID (newest addition)
                                const newestPlant = [...plants].reduce((max, plant) => 
                                    plant.plant_id > max.plant_id ? plant : max, plants[0]);
                                
                                return (
                                    <>
                                        <div>
                                            <h2 className="text-blue-800 text-xl font-semibold mb-1">Newest Addition</h2>
                                            <p className="text-blue-700 font-medium">{newestPlant.common_name}</p>
                                            <p className="text-blue-600 text-sm italic">{newestPlant.scientific_name}</p>
                                        </div>
                                        <div className="bg-white p-2 rounded-md shadow-md h-16 w-16 flex items-center justify-center">
                                            {newestPlant.image_url ? (
                                                <img 
                                                    src={newestPlant.image_url} 
                                                    alt={newestPlant.common_name}
                                                    className="h-full w-full object-cover rounded" 
                                                    onError={(e) => {e.target.src = "https://via.placeholder.com/50?text=Plant"}}
                                                />
                                            ) : (
                                                <div className="text-blue-300 text-3xl">🌿</div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
                
                {/* Plant Families Card */}
                {plants.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg shadow-sm border border-amber-200">
                        <div className="flex flex-col">
                            <h2 className="text-amber-800 text-xl font-semibold mb-1">Plant Families</h2>
                            <p className="text-amber-600 text-sm mb-2">Botanical classification</p>
                            <div className="mt-1">
                                {(() => {
                                    // Count families
                                    const families = plants.reduce((acc, plant) => {
                                        acc[plant.family] = (acc[plant.family] || 0) + 1;
                                        return acc;
                                    }, {});
                                    
                                    // Get top 3 families
                                    const topFamilies = Object.entries(families)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 3);
                                    
                                    return topFamilies.map(([family, count], index) => (
                                        <div key={index} className="flex justify-between items-center mb-1">
                                            <span className="text-amber-700 font-medium">{family}</span>
                                            <span className="bg-amber-200 px-2 py-0.5 rounded-full text-amber-800 text-sm">
                                                {count} plants
                                            </span>
                                        </div>
                                    ));
                                })()}
                                {Object.keys(plants.reduce((acc, plant) => {
                                    acc[plant.family] = true;
                                    return acc;
                                }, {})).length > 3 && (
                                    <div className="text-amber-600 text-xs mt-1 italic">
                                        +{Object.keys(plants.reduce((acc, plant) => {
                                            acc[plant.family] = true;
                                            return acc;
                                        }, {})).length - 3} more families
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="overflow-x-auto w-full">
                <div className="rounded-lg">
                    <table className="border-collapse rounded w-full table-auto">
                        <thead>
                            <tr className="border-b-2 border-green-800 bg-green-50">
                                <th className="text-left py-3 px-4 text-green-800">
                                    ID
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Common Name
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Scientific Name
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Family
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Description
                                </th>
                                <th className="text-left py-3 px-4 text-green-800">
                                    Image
                                </th>
                                <th className="text-left py-3 px-4 text-green-800 whitespace-nowrap">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {plants.map((plant) => (
                                <tr
                                    key={plant.plant_id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="py-3 px-4">
                                        {plant.plant_id}
                                    </td>
                                    <td className="py-3 px-4">
                                        {plant.common_name}
                                    </td>
                                    <td className="py-3 px-4 italic">
                                        {plant.scientific_name}
                                    </td>
                                    <td className="py-3 px-4">
                                        {plant.family}
                                    </td>
                                    <td className="py-3 px-4 max-w-xs truncate">
                                        {plant.description}
                                    </td>
                                    <td className="py-3 px-4">
                                        {plant.image_url ? (
                                            <a
                                                href={plant.image_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                View Image
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">
                                                No image
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEditClick(plant)
                                                }
                                                className="px-4 py-2 text-green-800 hover:text-green-600 bg-green-100 hover:bg-green-200 transition-colors rounded"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeletePlant(
                                                        plant.plant_id
                                                    )
                                                }
                                                className="px-4 py-2 text-red-800 hover:text-red-600 bg-red-100 hover:bg-red-200 transition-colors rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <InfoEditor
                open={isEditorOpen}
                onClose={handleCloseEditor}
                plantData={selectedPlant}
                onSave={handleSavePlant}
            />
        </div>
    );
}
