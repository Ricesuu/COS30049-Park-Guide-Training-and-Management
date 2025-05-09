import React from "react";

const QuestionCard = ({ question, index, onEdit, onDuplicate, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      {/* ====== Question Header ====== */}
      <div className="flex justify-between items-center border-b border-green-100 pb-3 mb-3">
        <div>
          <span className="font-semibold">Question {index + 1}</span>
          <span className="ml-2 px-2 py-1 bg-green-100 rounded text-sm">
            {question.type === "multiple-choice"
              ? "Multiple Choice"
              : "True/False"}
          </span>
          <span className="ml-2 px-2 py-1 bg-green-50 rounded text-sm">
            {question.points} {question.points === 1 ? "point" : "points"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-green-100 text-green-800 hover:bg-green-200 rounded text-sm transition-colors"
            onClick={() => onEdit(question.id)}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded text-sm transition-colors"
            onClick={() => onDuplicate(question.id)}
          >
            Copy
          </button>
          <button
            className="px-2 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm transition-colors"
            onClick={() => onDelete(question.id)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ====== Question Text ====== */}
      <p className="mb-4 text-green-800 font-medium">{question.text}</p>

      {/* ====== Question Options ====== */}
      <div className="space-y-2">
        {question.options.map((option, optIndex) => {
          // Force convert to boolean
          const isCorrect = option.isCorrect === true;

          // Inline styles to guarantee the styling works
          const optionStyle = {
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            borderRadius: "0.25rem",
            backgroundColor: isCorrect ? "#22c55e" : "white",
            color: isCorrect ? "white" : "#065f46",
            fontWeight: isCorrect ? "500" : "normal",
            boxShadow: isCorrect ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
            border: isCorrect ? "1px solid #16a34a" : "1px solid #e5e7eb",
            marginBottom: "0.5rem",
          };

          const letterStyle = {
            marginRight: "0.5rem",
            fontWeight: isCorrect ? "bold" : "normal",
          };

          const textStyle = {
            fontWeight: isCorrect ? "500" : "normal",
          };

          const badgeStyle = {
            marginLeft: "auto",
            color: "white",
            fontWeight: "bold",
            backgroundColor: "#15803d",
            padding: "0.25rem 0.75rem",
            borderRadius: "0.25rem",
            fontSize: "0.75rem",
          };

          return (
            <div key={optIndex} style={optionStyle}>
              <span style={letterStyle}>
                {String.fromCharCode(65 + optIndex)}.
              </span>
              <span style={textStyle}>{option.text}</span>
              {isCorrect && <span style={badgeStyle}>CORRECT ANSWER</span>}
            </div>
          );
        })}
      </div>

      {/* ====== Question Explanation ====== */}
      {question.explanation && (
        <div className="mt-4 pt-3 border-t border-green-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-green-700">Explanation:</span>{" "}
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
