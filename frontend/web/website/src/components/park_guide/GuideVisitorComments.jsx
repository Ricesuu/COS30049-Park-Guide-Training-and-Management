import React, { useEffect, useState } from "react";
import { auth } from "../../Firebase";

export default function GuideVisitorComments() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return setError("Not logged in.");

        const token = await user.getIdToken();
        const res = await fetch(`/api/ratings/park-guide/self/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setComments(data);
        } else {
          setError(data.error || "Failed to load comments.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching comments.");
      }
    };

    fetchComments();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!comments.length) return <p>No visitor comments available.</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-4 rounded-xl shadow-lg h-full">
      <h3 className="text-xl font-semibold mb-3">
        Visitor Comments ({comments.length})
      </h3>

      <div className="space-y-3 max-h-75 overflow-y-auto pr-2 pb-1 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
        {comments.map((item, index) => (
          <div key={index} className="border-l-4 border-green-600 pl-3">
            <p className="text-gray-800 italic text-sm leading-snug">"{item.comment}"</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(item.submitted_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
