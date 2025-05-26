import React, { useEffect, useState } from "react";
import { API_URL } from "../../config/apiConfig";

export default function TransactionApprovalTable() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [txRes, userRes] = await Promise.all([
          fetch(`${API_URL}/api/payment-transactions`),
          fetch(`${API_URL}/api/users`),
        ]);

        if (!txRes.ok || !userRes.ok) throw new Error("Failed to fetch data");

        const txData = await txRes.json();
        const userData = await userRes.json();

        const pending = txData.filter((tx) => tx.paymentStatus === "pending");

        // Match user_id to get name/email
        const enriched = pending.map((tx) => {
          const user = userData.find((u) => u.user_id === tx.user_id);
          return {
            ...tx,
            user_name: user
              ? `${user.first_name} ${user.last_name}`
              : "Unknown",
            user_email: user?.email || "N/A",
          };
        });

        setTransactions(enriched);
        setUsers(userData);
      } catch (err) {
        console.error("Error fetching transactions/users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleApprove = async (paymentId) => {
    setApproving(paymentId);
    try {
      const res = await fetch(`/api/payment-transactions/${paymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "approved" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Approval failed");
      }

      setTransactions((prev) =>
        prev.filter((tx) => tx.payment_id !== paymentId)
      );
    } catch (err) {
      console.error("Error approving transaction:", err);
      alert("Failed to approve transaction.");
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-green-300 overflow-x-auto">
      <h2 className="text-xl font-semibold p-4 border-b bg-green-50 text-green-900">
        Transaction Approvals
      </h2>

      {loading ? (
        <div className="p-4 text-green-800">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="p-4 text-green-800">No pending transactions.</div>
      ) : (
        <table className="min-w-full text-sm text-left text-green-900">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="px-4 py-2">Payment ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Purpose</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.payment_id}
                className="border-t hover:bg-green-50 transition"
              >
                <td className="px-4 py-2">{tx.payment_id}</td>
                <td className="px-4 py-2">{tx.user_name}</td>
                <td className="px-4 py-2">{tx.user_email}</td>{" "}
                <td className="px-4 py-2">
                  {tx.paymentPurpose.charAt(0).toUpperCase() +
                    tx.paymentPurpose.slice(1).toLowerCase()}
                </td>
                <td className="px-4 py-2">
                  {tx.paymentMethod.charAt(0).toUpperCase() +
                    tx.paymentMethod.slice(1).toLowerCase()}
                </td>
                <td className="px-4 py-2">
                  RM {Number(tx.amountPaid).toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  {new Date(tx.transaction_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleApprove(tx.payment_id)}
                    disabled={approving === tx.payment_id}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {approving === tx.payment_id ? "Approving..." : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
