import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

export default function ParkGuideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const guide = parkGuides.find((g) => g.id === parseInt(id));

  if (!guide) return <div className="p-6 text-red-600">Guide not found.</div>;

  return (
    <div className="p-6 space-y-4 text-green-900">
      <h1 className="text-3xl font-bold">Park Guide Details</h1>

      <div className="bg-white p-6 rounded-xl shadow-md flex gap-6 items-start border border-green-300">
        <img
          src={guide.picture}
          alt={guide.name}
          className="w-32 h-32 object-cover rounded-full border-4 border-green-600"
        />
        <div className="space-y-2">
          <p><strong>Name:</strong> {guide.name}</p>
          <p><strong>License ID:</strong> {guide.licenseId}</p>
          <p><strong>Status:</strong> {guide.status}</p>
          <p><strong>Date of Birth:</strong> {guide.dob}</p>
          <p><strong>Age:</strong> {guide.age}</p>
          <p><strong>Years of Experience:</strong> {guide.experience} years</p>
          <p><strong>Skills:</strong> {guide.skills.join(', ')}</p>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Back
      </button>
    </div>
  );
}