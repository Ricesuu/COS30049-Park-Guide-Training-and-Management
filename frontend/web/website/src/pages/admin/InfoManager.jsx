import { useEffect, useState } from "react";
import InfoTable from "../../components/admin/Infotable";
import InfoCard from "../../components/admin/InfoCard";
import { Leaf, FileText } from "lucide-react";

const columns = ["Title", "Type", "Last Updated"];

export default function InfoManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/info-docs")
      .then((res) => res.json())
      .then((docs) => {
        const formatted = docs.map(doc => ({
          Title: doc.title,
          Type: doc.type,
          "Last Updated": doc.last_updated
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch info docs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard title="Documents" value={data.length.toString()} icon={<FileText />} color="bg-amber-300" />
        <InfoCard title="Pages Updated" value="3" icon={<Leaf />} color="bg-green-600" />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading documents...</div>
      ) : (
        <InfoTable columns={columns} data={data} />
      )}
    </div>
  );
}