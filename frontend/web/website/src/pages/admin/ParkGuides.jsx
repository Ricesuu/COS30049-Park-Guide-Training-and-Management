import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const parkGuides = [
  {
    id: 1,
    name: "Alice Johnson",
    licenseId: "PG-001",
    status: "Pending",
    dob: "1985-06-15",
    age: 39,
    experience: 10,
    skills: ["Wildlife Knowledge", "First Aid", "Navigation"],
    picture: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Carlos Rivera",
    licenseId: "PG-002",
    status: "Approved",
    dob: "1990-02-20",
    age: 34,
    experience: 8,
    skills: ["Bird Watching", "Plant Identification"],
    picture: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    name: "Vanessa Park",
    licenseId: "PG-003",
    status: "Pending",
    dob: "1998-06-09",
    age: 27,
    experience: 4,
    skills: ["Bug Indentification", "Plant Identification"],
    picture: "https://via.placeholder.com/150"
  },
  {
    id: 4,
    name: "Manuel Saba",
    licenseId: "PG-004",
    status: "Pending",
    dob: "2000-02-29",
    age: 25,
    experience: 2,
    skills: ["Tracker", "First Aid"],
    picture: "https://via.placeholder.com/150"
  },
  {
    id: 5,
    name: "Emily P. Hew",
    licenseId: "PG-005",
    status: "Approved",
    dob: "1982-12-31",
    age: 42,
    experience: 10,
    skills: ["First Aid", "Wildlife Identification","Navigation"],
    picture: "https://via.placeholder.com/150"
  },
  {
    id: 6,
    name: "Abdul Hamsyad",
    licenseId: "PG-006",
    status: "Expired",
    dob: "1999-02-20",
    age: 26,
    experience: 3,
    skills: ["Bird Watching", "Plant Identification"],
    picture: "https://via.placeholder.com/150"
  },
];

export default function ParkGuides() {

  const navigate = useNavigate();
  
  return (
    <div className="p-6 space-y-6 text-green-900">
      <h1 className="text-2xl font-bold">Park Guide Management</h1>

      
      <div className="bg-green-100 rounded-xl p-4 shadow-md border border-green-300">
        <h2 className="text-xl font-semibold mb-4">License Approvals</h2>
        <div className="space-y-2">
          {parkGuides
            .filter((guide) => guide.status === "Pending")
            .map((guide) => (
              <div
                key={guide.id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
              >
                <span>{guide.name} (License: {guide.licenseId})</span>
                <button className="bg-green-800 text-white px-4 py-1 rounded hover:bg-green-700">
                  Approve
                </button>
              </div>
            ))}
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-md overflow-auto border border-green-300">
        <h2 className="text-xl font-semibold p-4 border-b bg-green-50">
          All Park Guides
        </h2>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-green-200 text-green-800">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">License ID</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-green-900">
            {parkGuides.map((guide) => (
              <tr key={guide.id} className="border-b">
                <td className="px-4 py-2">{guide.id}</td>
                <td className="px-4 py-2">{guide.name}</td>
                <td className="px-4 py-2">{guide.licenseId}</td>
                <td className="px-4 py-2">{guide.status}</td>
                <td className = "px-4 py-2 space-x-2">
                  <button className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => navigate(`/guides/${guide.id}`)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}