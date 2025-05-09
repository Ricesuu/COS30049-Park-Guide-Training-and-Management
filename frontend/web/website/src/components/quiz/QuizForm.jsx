import React from "react";

const QuizForm = ({
  quizName,
  quizDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
  isEditing,
  hideButtons = false,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="quiz-name"
          className="block text-sm font-medium text-green-900 mb-1"
        >
          Quiz Name
        </label>
        <input
          id="quiz-name"
          type="text"
          placeholder="Enter quiz name"
          className="block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-green-900"
          value={quizName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="quiz-description"
          className="block text-sm font-medium text-green-900 mb-1"
        >
          Quiz Description
        </label>
        <textarea
          id="quiz-description"
          rows="3"
          placeholder="Enter quiz description"
          className="block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-green-900"
          value={quizDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
        ></textarea>
      </div>

      {!hideButtons && onSave && (
        <div className="flex justify-end">
          <button
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={onSave}
          >
            {isEditing ? "Update" : "Create"} Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizForm;
