import React from "react";

const QuizTable = ({ quizzes, loading, error, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No quizzes found. Create your first quiz below.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-green-900 text-lg">
              {quiz.name}
            </h3>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {quiz.questionCount}{" "}
              {quiz.questionCount === 1 ? "question" : "questions"}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">ID: {quiz.id}</span>
            <div className="space-x-2 flex">
              <button
                onClick={() => onEdit(quiz)}
                className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-md text-sm transition-colors inline-flex items-center justify-center"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(quiz.id)}
                className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm transition-colors inline-flex items-center justify-center"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizTable;
