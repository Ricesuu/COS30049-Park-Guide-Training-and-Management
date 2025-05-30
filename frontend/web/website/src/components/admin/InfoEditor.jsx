import React, { useState, useEffect } from "react";

export default function PlantEditor({ open, onClose, plantData, onSave }) {
    const [commonName, setCommonName] = useState("");
    const [scientificName, setScientificName] = useState("");
    const [family, setFamily] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (plantData) {
            // Editing mode - populate fields with plant data
            setCommonName(plantData.common_name || "");
            setScientificName(plantData.scientific_name || "");
            setFamily(plantData.family || "");
            setDescription(plantData.description || "");
            setImageUrl(plantData.image_url || "");
        } else {
            // Create mode - reset all fields
            setCommonName("");
            setScientificName("");
            setFamily("");
            setDescription("");
            setImageUrl("");
        }
    }, [plantData]);

    if (!open) return null;    const handleSave = () => {
        // Validate required fields
        const errors = [];
        
        if (!commonName.trim()) {
            errors.push("Common Name is required");
        }
        
        if (!scientificName.trim()) {
            errors.push("Scientific Name is required");
        }
        
        if (!family.trim()) {
            errors.push("Family is required");
        }
        
        if (imageUrl && !isValidImageUrl(imageUrl)) {
            errors.push("Image URL is invalid");
        }
        
        if (errors.length > 0) {
            alert("Please fix the following errors:\n" + errors.join("\n"));
            return;
        }

        const updatedPlant = {
            ...(plantData?.plant_id && { plant_id: plantData.plant_id }),
            common_name: commonName.trim(),
            scientific_name: scientificName.trim(),
            family: family.trim(),
            description: description.trim(),
            image_url: imageUrl.trim(),
        };
        
        console.log("Saving plant data:", updatedPlant);
        onSave && onSave(updatedPlant);
    };

    const isValidImageUrl = (url) => {
        if (!url) return true; // Empty URL is allowed
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
        return urlRegex.test(url);
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    {plantData ? "Edit Plant Information" : "Add New Plant Information"}
                </h2>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">
                        Common Name: <span className="text-red-600">*</span>
                    </span>
                    <input
                        value={commonName}
                        onChange={(e) => setCommonName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter common name of the plant"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">
                        Scientific Name: <span className="text-red-600">*</span>
                    </span>
                    <input
                        value={scientificName}
                        onChange={(e) => setScientificName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2 italic"
                        placeholder="Enter scientific name (e.g., Genus species)"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">
                        Family: <span className="text-red-600">*</span>
                    </span>
                    <input
                        value={family}
                        onChange={(e) => setFamily(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter plant family"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">
                        Description:
                    </span>
                    <textarea
                        rows="6"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                        placeholder="Enter detailed description of the plant"
                    />
                </label>

                <label className="block mb-4">
                    <span className="block text-sm font-medium mb-1">
                        Image URL:
                    </span>
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => {
                            const url = e.target.value;
                            if (url === "" || isValidImageUrl(url)) {
                                setImageUrl(url);
                            } else {
                                alert("Please enter a valid URL");
                            }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    {imageUrl && (
                        <div className="mt-2">
                            <p className="text-sm mb-1">Image Preview:</p>
                            <img 
                                src={imageUrl} 
                                alt="Plant preview" 
                                className="max-h-32 object-contain border border-gray-200 p-1 rounded"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                                }}
                            />
                        </div>
                    )}
                </label>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        {plantData ? "Save Changes" : "Add Plant"}
                    </button>

                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
