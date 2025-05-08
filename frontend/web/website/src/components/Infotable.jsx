import React from "react";

import { useNavigate } from "react-router-dom";

const InfoTable = ({ columns, data }) => {
  const navigate = useNavigate();

  return (
    <table className="min-w-full text-sm text-left text-gray-600">
      <thead className="text-xs text-gray-700 uppercase bg-green-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-4 py-2">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            onClick={() => navigate(`/info-manager/${encodeURIComponent(row.Title)}`)}
            className="border-b hover:bg-green-50 cursor-pointer"
          >
            {columns.map((col) => (
              <td key={col} className="px-4 py-2">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InfoTable;