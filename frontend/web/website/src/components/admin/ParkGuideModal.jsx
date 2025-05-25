import React, { useEffect, useState } from "react";

export default function ParkGuideModal({ guide, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchTransactions();
    return () => (document.body.style.overflow = "auto");
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/payment-transactions?${guide.user_id}`);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Transaction fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveTransaction = async (payment_id) => {
    try {
      const res = await fetch(`/api/payment-transactions/${payment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "approved" }),
      });

      if (!res.ok) throw new Error("Failed to approve transaction");

      // Update UI
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.payment_id === payment_id
            ? { ...tx, paymentStatus: "approved" }
            : tx
        )
      );
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-300 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-[75vw] h-[75vh] p-6 rounded-xl shadow-lg overflow-y-auto animate-pop relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-green-900 hover:text-green-600 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="text-green-900 space-y-2">
            <h2 className="text-2xl font-bold">
              {guide.first_name} {guide.last_name}
            </h2>
            <p><strong>Email:</strong> {guide.email}</p>
            <p><strong>Role:</strong> {guide.role}</p>
            <p><strong>Account Status:</strong> {guide.status}</p>
            <p><strong>Certification Status:</strong> {guide.certification_status}</p>
            <p><strong>License Expiry Date:</strong> {guide.license_expiry_date || "N/A"}</p>
            <p><strong>Assigned Park:</strong> {guide.assigned_park || "N/A"}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Transactions</h3>
          {loading ? (
            <p className="text-gray-500">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <ul className="space-y-3">
              {transactions.map((tx) => (
                <li key={tx.payment_id} className="bg-gray-100 p-4 rounded-lg border">
                  <p><strong>Purpose:</strong> {tx.paymentPurpose}</p>
                  <p><strong>Amount:</strong> ${tx.amountPaid}</p>
                  <p><strong>Status:</strong> {tx.paymentStatus}</p>
                  <p><strong>Method:</strong> {tx.paymentMethod}</p>
                  <p><strong>Date:</strong> {new Date(tx.transaction_date).toLocaleString()}</p>

                  {tx.paymentStatus !== "approved" && (
                    <button
                      onClick={() => approveTransaction(tx.payment_id)}
                      className="mt-2 px-4 py-1 bg-green-700 text-white rounded hover:bg-green-600"
                    >
                      Approve Payment
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-pop {
          animation: pop 0.25s ease-out forwards;
        }

        @keyframes pop {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

