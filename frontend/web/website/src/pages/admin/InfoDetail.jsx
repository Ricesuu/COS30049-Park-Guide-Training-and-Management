import { useParams } from "react-router-dom";
import { useState } from "react";

const InfoDetail = () => {
  const { title } = useParams();
  const [content, setContent] = useState("This is placeholder content for the selected document.");

  const handleSave = () => {
    
    alert("Saved!");
  };

  return (
    <div className="p-6 space-y-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700">{decodeURIComponent(title)}</h1>
      <textarea
        className="w-full p-4 border border-green-300 rounded-md h-60"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default InfoDetail;
