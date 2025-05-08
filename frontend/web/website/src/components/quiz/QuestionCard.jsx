import React from "react";

const QuestionCard = ({ question, index, onEdit, onDuplicate, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      {/* ====== Question Header ====== */}
      <div className="flex justify-between items-center border-b pb-3 mb-3">
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
        {/* ====== Question Actions ====== */}
        <div className="flex gap-3">
          <button
            className="text-green-800 hover:text-green-600"
            onClick={() => onEdit(question.id)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="text-green-800 hover:text-green-600"
            onClick={() => onDuplicate(question.id)}
          >
            <i className="fas fa-copy"></i>
          </button>
          <button
            className="text-green-800 hover:text-green-600"
            onClick={() => onDelete(question.id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      {/* ====== Question Text ====== */}
      <p className="mb-3">{question.text}</p>
      {/* ====== Question Options ====== */}
      <div className="space-y-2">
        {question.options.map((option, optIndex) => (
          <div
            key={optIndex}
            className={`px-4 py-2 ${
              option.isCorrect
                ? "bg-green-100 border-l-4 border-green-500"
                : "bg-white border border-gray-200"
            } rounded text-green-900`}
          >
            {String.fromCharCode(65 + optIndex)}. {option.text}
          </div>
        ))}
      </div>
      {/* ====== Question Explanation ====== */}
      {question.explanation && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Explanation:</span>{" "}
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
