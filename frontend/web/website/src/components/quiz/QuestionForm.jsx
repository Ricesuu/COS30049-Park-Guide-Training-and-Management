import React from "react";

const QuestionForm = ({
  questionType,
  questionText,
  explanation,
  points,
  options,
  onQuestionTypeChange,
  onQuestionTextChange,
  onExplanationChange,
  onPointsChange,
  onOptionChange,
  onCorrectAnswerChange,
  onTrueFalseChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Question Type */}
      <div>
        <label
          htmlFor="quiz-editor-questionType"
          className="block text-sm font-medium text-green-900 mb-1"
        >
          Question Type
        </label>
        <select
          id="quiz-editor-questionType"
          className="block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-green-900"
          value={questionType}
          onChange={(e) => onQuestionTypeChange(e.target.value)}
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
        </select>
      </div>

      {/* Question Text */}
      <div>
        <label
          htmlFor="quiz-editor-questionText"
          className="block text-sm font-medium text-green-900 mb-1"
        >
          Question Text
        </label>
        <textarea
          id="quiz-editor-questionText"
          rows="3"
          placeholder="Enter your question"
          className="block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-green-900"
          value={questionText}
          onChange={(e) => onQuestionTextChange(e.target.value)}
        ></textarea>
      </div>

      {/* ====== Answer Options ====== */}
      <div>
        <label className="block text-sm font-medium text-green-900 mb-2">
          {questionType === "true-false" ? "Answer" : "Options"}
        </label>

        {questionType === "true-false" ? (
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="trueFalse"
                className="form-radio text-green-600"
                onChange={() => onTrueFalseChange("true")}
                checked={options[0]?.isCorrect || false}
              />
              <span className="ml-2">True</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="trueFalse"
                className="form-radio text-green-600"
                onChange={() => onTrueFalseChange("false")}
                checked={options[1]?.isCorrect || false}
              />
              <span className="ml-2">False</span>
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  className="form-radio text-green-600"
                  checked={option.isCorrect}
                  onChange={() => onCorrectAnswerChange(index)}
                />
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  value={option.text}
                  onChange={(e) => onOptionChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explanation */}
      <div>
        <label
          htmlFor="quiz-editor-explanation"
          className="block text-sm font-medium text-green-900 mb-1"
        >
          Explanation for Question Answer (optional)
        </label>
        <textarea
          id="quiz-editor-explanation"
          rows="2"
          placeholder="Enter explanation for the correct answer"
          className="block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-green-900"
          value={explanation}
          onChange={(e) => onExplanationChange(e.target.value)}
        ></textarea>
      </div>

      {/* Points */}
      <div>
        <label
          htmlFor="quiz-editor-points"
          className="block text-sm font-medium text-green-900 mb-1"
        >
          Points for correct answer (1-3)
        </label>
        <select
          id="quiz-editor-points"
          className="block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 text-green-900"
          value={points}
          onChange={(e) => onPointsChange(parseInt(e.target.value))}
        >
          <option value="1">1 point</option>
          <option value="2">2 points</option>
          <option value="3">3 points</option>
        </select>
      </div>
    </div>
  );
};

export default QuestionForm;
