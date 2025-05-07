import { useState } from 'react';
import { useRouter } from 'next/router';

const Identifier = () => {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState(null);

    const navigateTo = (page) => {
        router.push(page);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const uploadToSystem = () => {
        alert('Upload to system functionality is not implemented yet.');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="sidebar flex flex-col justify-start items-center w-72 p-5 bg-gray-200">
                <img src="/images/SFC_LOGO_small.jpg" alt="SFC Logo" className="w-1/2 mb-6" />
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideDashboard')}>
                    Dashboard
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideTraining')}>
                    Training Module
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideCert')}>
                    Certification & Licensing
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideIdentifier')}>
                    Identifier
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideMonitoring')}>
                    Monitoring
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguidePerformance')}>
                    Performance
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguidePlantInfo')}>
                    Plant Info
                </button>
                <button className="btn w-4/5 bg-red-500 text-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/logout')}>
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content flex flex-grow flex-wrap">
                {/* Left Column */}
                <div className="left-column flex flex-col w-full md:w-1/4 mt-1">
                    {/* Upload Box */}
                    <div className="bg-white p-4 m-2 rounded shadow flex-none">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 text-center">Upload Image</h2>
                        <input type="file" accept="image/*" className="mb-4" onChange={handleImageChange} />
                        <button className="btn bg-blue-500 text-white py-2 px-4 rounded w-full" onClick={uploadToSystem}>
                            Upload
                        </button>
                    </div>

                    {/* Image Preview */}
                    <div className="flex-grow bg-gray-100 border border-gray-300 rounded flex items-center justify-center m-2 shadow">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Uploaded Image" className="w-full h-full object-cover rounded" />
                        ) : (
                            <span className="text-gray-500">No image uploaded</span>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column bg-white p-4 m-3 rounded shadow w-full md:w-3/4 relative flex flex-col">
                    <div className="flex flex-col h-full">
                        <h2 className="text-lg font-bold mb-4 text-center">Information</h2>
                        {/* Content Area */}
                        <div className="flex-grow p-4 text-left">
                            <p className="text-gray-700 text-base">Plant Name: Lorem Ipsum.</p>
                            <p className="text-gray-700 text-base">You can add more details about the identifier here.</p>
                            <p className="text-gray-700 text-base">Feel free to customize this section as needed.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Identifier;