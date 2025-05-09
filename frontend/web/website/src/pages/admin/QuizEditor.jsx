import React, { useState, useEffect } from "react";
import QuizTable from "../../components/quiz/QuizTable";
import QuizForm from "../../components/quiz/QuizForm";
import QuestionCard from "../../components/quiz/QuestionCard";
import QuestionForm from "../../components/quiz/QuestionForm";
import Modal from "../../components/common/Modal";

// API base URL
const API_BASE_URL = "http://localhost:3000/api";

export default function QuizEditor() {
  /* ==================== STATE MANAGEMENT ==================== */
  // Quiz state
  const [quizzes, setQuizzes] = useState([]);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [editingQuizId, setEditingQuizId] = useState(null);

  // Question state
  const [questionBankVisible, setQuestionBankVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [questionType, setQuestionType] = useState("multiple-choice");
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  /* ==================== DATA FETCHING ==================== */
  // Fetch all quizzes when component mounts
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`);
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const data = await response.json();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError("Failed to load quizzes. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions for a specific quiz
  const fetchQuizQuestions = async (quizId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/quizzes/${quizId}/questions`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==================== QUIZ CRUD OPERATIONS ==================== */
  // Quiz modal functions
  const toggleQuizModal = () => {
    setQuizModalVisible(!quizModalVisible);
    if (!quizModalVisible) {
      // Reset form when opening modal
      setEditingQuizId(null);
      setQuizName("");
      setQuizDescription("");
    }
  };

  // Combined edit function - opens quiz editor with question management
  const handleEditQuiz = (quiz) => {
    setEditingQuizId(quiz.id);
    setQuizName(quiz.name);
    setQuizDescription(quiz.description);
    setCurrentQuiz(quiz);
    fetchQuizQuestions(quiz.id);
    setQuestionBankVisible(true);
  };

  // Create or update a quiz
  const handleSaveQuiz = async () => {
    if (!quizName.trim()) {
      alert("Quiz name is required");
      return;
    }

    try {
      const quizData = {
        name: quizName,
        description: quizDescription,
      };

      let response;
      let method;

      if (editingQuizId) {
        // Update existing quiz
        method = "PUT";
        response = await fetch(`${API_BASE_URL}/quizzes/${editingQuizId}`, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizData),
        });
      } else {
        // Create new quiz
        method = "POST";
        response = await fetch(`${API_BASE_URL}/quizzes`, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizData),
        });
      }

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingQuizId ? "update" : "create"} quiz`
        );
      }

      // Refetch quizzes to update the list
      await fetchQuizzes();

      // Close the modal
      toggleQuizModal();
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Delete a quiz
  const handleDeleteQuiz = async (quizId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this quiz? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      // Refetch quizzes
      await fetchQuizzes();
    } catch (err) {
      console.error("Error deleting quiz:", err);
      alert(`Error: ${err.message}`);
    }
  };

  /* ==================== QUESTION CRUD OPERATIONS ==================== */ // Question modal functions
  const toggleModal = () => {
    // If we're closing the modal, reset everything
    if (modalVisible) {
      setEditingQuestionId(null);
      setQuestionText("");
      setExplanation("");
      setPoints(1);
      setQuestionType("multiple-choice");
      setOptions([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
    }

    // When opening the modal directly (not via edit function)
    if (!modalVisible && !editingQuestionId) {
      setQuestionText("");
      setExplanation("");
      setPoints(1);
      setQuestionType("multiple-choice");
      setOptions([
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]);
    }

    setModalVisible(!modalVisible);
  };

  // Function to save all quiz changes at once
  const handleSaveAllChanges = async () => {
    try {
      // Save quiz details (name and description)
      const quizResponse = await fetch(
        `${API_BASE_URL}/quizzes/${currentQuiz.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: quizName,
            description: quizDescription,
          }),
        }
      );

      if (!quizResponse.ok) {
        throw new Error("Failed to update quiz details");
      }

      // Update the current quiz in state
      setCurrentQuiz({
        ...currentQuiz,
        name: quizName,
        description: quizDescription,
      });

      // Refetch questions to ensure we have the most current data
      await fetchQuizQuestions(currentQuiz.id);

      // Show success message
      alert("All changes saved successfully!");
    } catch (err) {
      console.error("Error saving quiz changes:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleTrueFalseChange = (value) => {
    const newOptions = [
      { text: "True", isCorrect: value === "true" },
      { text: "False", isCorrect: value === "false" },
    ];
    setOptions(newOptions);
  };

  // Create or update a question
  const handleSaveQuestion = async () => {
    if (!questionText.trim()) {
      alert("Question text is required");
      return;
    }

    // Validate that at least one option is marked as correct for multiple choice
    if (
      questionType === "multiple-choice" &&
      !options.some((opt) => opt.isCorrect)
    ) {
      alert("At least one correct option is required");
      return;
    }

    // Validate that all options have text
    if (options.some((opt) => !opt.text.trim())) {
      alert("All options must have text");
      return;
    }

    try {
      const questionData = {
        type: questionType,
        text: questionText,
        explanation,
        points,
        options,
      };

      let response;

      if (editingQuestionId) {
        // Update existing question
        response = await fetch(
          `${API_BASE_URL}/questions/${editingQuestionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionData),
          }
        );
      } else {
        // Create new question
        response = await fetch(
          `${API_BASE_URL}/quizzes/${currentQuiz.id}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionData),
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          `Failed to ${editingQuestionId ? "update" : "create"} question`
        );
      }

      // Refetch questions
      await fetchQuizQuestions(currentQuiz.id);

      // Close the modal
      toggleModal();
    } catch (err) {
      console.error("Error saving question:", err);
      alert(`Error: ${err.message}`);
    }
  }; // Edit a question
  const handleEditQuestion = async (questionId) => {
    try {
      setLoading(true);
      console.log("Fetching question details for ID:", questionId);

      // Find the question in the current questions array first
      const existingQuestion = questions.find((q) => q.id === questionId);

      if (!existingQuestion) {
        throw new Error("Question not found");
      }

      console.log("Question data found:", existingQuestion);

      // Process options to ensure they're in the correct format
      let processedOptions = [];

      if (existingQuestion.type === "true-false") {
        // True/False questions should have exactly two options
        processedOptions = [
          {
            text: "True",
            isCorrect:
              existingQuestion.options.find((o) => o.text === "True")
                ?.isCorrect || false,
          },
          {
            text: "False",
            isCorrect:
              existingQuestion.options.find((o) => o.text === "False")
                ?.isCorrect || false,
          },
        ];

        // If neither is marked correct, mark one as correct
        if (!processedOptions[0].isCorrect && !processedOptions[1].isCorrect) {
          processedOptions[0].isCorrect = true;
        }
      } else {
        // Multiple choice
        processedOptions = existingQuestion.options.map((opt) => ({
          ...opt,
          isCorrect: Boolean(opt.isCorrect),
        }));

        // Ensure at least one option is marked as correct
        if (!processedOptions.some((opt) => opt.isCorrect === true)) {
          if (processedOptions.length > 0) {
            processedOptions[0].isCorrect = true;
          }
        }
      }

      console.log("Processed options:", processedOptions);

      // Set all the form data BEFORE opening the modal
      setEditingQuestionId(questionId);
      setQuestionType(existingQuestion.type);
      setQuestionText(existingQuestion.text || "");
      setExplanation(existingQuestion.explanation || "");
      setPoints(existingQuestion.points || 1);
      setOptions(processedOptions);

      // Then open the modal
      setModalVisible(true);
      setLoading(false);
    } catch (err) {
      console.error("Error preparing question for edit:", err);
      alert(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  // Delete a question
  const handleDeleteQuestion = async (questionId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete question");
      }

      // Refetch questions
      await fetchQuizQuestions(currentQuiz.id);
    } catch (err) {
      console.error("Error deleting question:", err);
      alert(`Error: ${err.message}`);
    }
  };

  // Duplicate a question
  const handleDuplicateQuestion = async (questionId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/questions/${questionId}/duplicate`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to duplicate question");
      }

      // Refetch questions
      await fetchQuizQuestions(currentQuiz.id);
    } catch (err) {
      console.error("Error duplicating question:", err);
      alert(`Error: ${err.message}`);
    }
  };

  /* ==================== COMPONENT RENDER ==================== */
  return (
    <div className="bg-gray-100 min-h-screen text-green-900">
      {/* Main Content Area */}
      <div className="p-6 space-y-6">
        {/* Main Title */}
        <div>
          <h1 className="text-2xl font-bold text-green-800">Quiz Management</h1>
        </div>

        {/* ==================== QUIZ LIST VIEW ==================== */}
        {!questionBankVisible ? (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-green-50">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Quizzes
              </h2>
              <button
                className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                onClick={toggleQuizModal}
              >
                Create New Quiz
              </button>
            </div>

            {/* Quizzes Collection */}
            <div className="p-6">
              <QuizTable
                quizzes={quizzes}
                loading={loading}
                error={error}
                onEdit={handleEditQuiz}
                onDelete={handleDeleteQuiz}
              />
            </div>
          </div>
        ) : (
          /* ==================== QUIZ EDITOR VIEW ==================== */
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {/* Header with back button */}
            <div className="flex justify-between items-center p-4 border-b bg-green-50">
              <span className="text-lg font-semibold">Edit Quiz</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSaveAllChanges}
                  className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center transition-colors"
                >
                  Save All Changes
                </button>
                <button
                  onClick={() => setQuestionBankVisible(false)}
                  className="text-green-800 hover:text-green-600 flex items-center"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>

            {/* ==================== QUIZ DETAILS SECTION ==================== */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium mb-4">Quiz Details</h3>
              <QuizForm
                quizName={quizName}
                quizDescription={quizDescription}
                onNameChange={setQuizName}
                onDescriptionChange={setQuizDescription}
                isEditing={true}
                hideButtons={true}
              />
            </div>

            {/* ==================== QUESTIONS SECTION ==================== */}
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Quiz Questions</h3>
              {/* Questions List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <div className="col-span-2 text-center py-10">
                    <p>Loading questions...</p>
                  </div>
                ) : error ? (
                  <div className="col-span-2 text-center py-10 text-red-500">
                    <p>{error}</p>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-gray-500">
                    <p>
                      No questions found in this quiz. Add your first question
                      below.
                    </p>
                  </div>
                ) : (
                  questions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      onEdit={handleEditQuestion}
                      onDuplicate={handleDuplicateQuestion}
                      onDelete={handleDeleteQuestion}
                    />
                  ))
                )}
              </div>{" "}
              {/* Add New Question Button */}
              <div className="mt-6">
                <button
                  className="w-full bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                  onClick={toggleModal}
                >
                  Add New Question
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== QUIZ CREATION/EDIT MODAL ==================== */}
      <Modal
        isOpen={quizModalVisible}
        onClose={toggleQuizModal}
        title={editingQuizId ? "Edit Quiz" : "Create New Quiz"}
        footer={
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 border border-gray-300 text-green-800 rounded hover:bg-gray-100"
              onClick={toggleQuizModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleSaveQuiz}
            >
              {editingQuizId ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        }
      >
        <QuizForm
          quizName={quizName}
          quizDescription={quizDescription}
          onNameChange={setQuizName}
          onDescriptionChange={setQuizDescription}
          onSave={handleSaveQuiz}
          isEditing={!!editingQuizId}
        />
      </Modal>

      {/* ==================== QUESTION CREATION/EDIT MODAL ==================== */}
      <Modal
        isOpen={modalVisible}
        onClose={toggleModal}
        title={editingQuestionId ? "Edit Question" : "Add New Question"}
        footer={
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 border border-gray-300 text-green-800 rounded hover:bg-gray-100"
              onClick={toggleModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleSaveQuestion}
            >
              {editingQuestionId ? "Update Question" : "Save Question"}
            </button>
          </div>
        }
      >
        <QuestionForm
          questionType={questionType}
          questionText={questionText}
          explanation={explanation}
          points={points}
          options={options}
          onQuestionTypeChange={setQuestionType}
          onQuestionTextChange={setQuestionText}
          onExplanationChange={setExplanation}
          onPointsChange={setPoints}
          onOptionChange={handleOptionChange}
          onCorrectAnswerChange={handleCorrectAnswerChange}
          onTrueFalseChange={handleTrueFalseChange}
        />
      </Modal>
    </div>
  );
}
