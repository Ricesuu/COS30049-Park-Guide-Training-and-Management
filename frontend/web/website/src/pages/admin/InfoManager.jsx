import InfoTable from '../../components/Infotable';
import InfoCard from '../../components/InfoCard';
import { Leaf, FileText } from "lucide-react";

const dummyColumns = ["Title", "Type", "Last Updated"];
const dummyData = [
  { Title: "Welcome Message", Type: "Text", "Last Updated": "2025-04-10" },
  { Title: "Safety Rules", Type: "Markdown", "Last Updated": "2025-04-11" },
  { Title: "Park Map", Type: "PDF", "Last Updated": "2025-04-08" },
  { Title: "Park Map", Type: "PDF", "Last Updated": "2025-04-08" },
  { Title: "Park Map", Type: "PDF", "Last Updated": "2025-04-08" },
  { Title: "Park Map", Type: "PDF", "Last Updated": "2025-04-08" },
  { Title: "Park Map", Type: "PDF", "Last Updated": "2025-04-08" },
];

export default function InfoManager() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard title="Documents" value="12" icon={<FileText />} color="bg-amber-300" />
        <InfoCard title="Pages Updated" value="3" icon={<Leaf />} color="bg-green-600" />
      </div>
      <InfoTable columns={dummyColumns} data={dummyData} />
    </div>
  );
}