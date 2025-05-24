import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../ParkGuideStyle.css";
import { auth } from '../../Firebase';

const ParkguideQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const moduleId = location.state?.moduleId || queryParams.get('moduleId');
  console.log('Received moduleId:', moduleId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [answerTimes, setAnswerTimes] = useState({}); // Track time spent on each question
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        const token = await user.getIdToken();

        // First get the module info
        const moduleResponse = await fetch(`/api/training-modules/${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!moduleResponse.ok) {
          throw new Error('Failed to fetch module data');
        }
        
        const moduleData = await moduleResponse.json();
        
        // Fetch quiz data and questions
        const quizResponse = await fetch(`/api/training-modules/${moduleId}/quiz`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!quizResponse.ok) {
          const errorData = await quizResponse.json();
          throw new Error(errorData.error || 'Failed to fetch quiz questions');
        }
        
        const data = await quizResponse.json();
        
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid quiz data received');
        }
        
        console.log('Quiz data received:', data); // For debugging

        setQuizData({
          quiz_id: data.quiz_id || moduleData.quiz_id,
          name: moduleData.module_name,
        });
        setQuestions(data.questions);
        setSelectedAnswers(new Array(data.questions.length).fill(''));
        setError(null);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchQuizData();
    } else {
      setError('No module ID provided');
      setLoading(false);
    }
  }, [moduleId]);

  // Add timing tracking to useEffect
  useEffect(() => {
    setQuestionStartTime(Date.now()); // Reset timer when question changes
  }, [currentQuestion]);

  const handleAnswer = (selectedOption) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000); // Convert to seconds
    const newAnswerTimes = { ...answerTimes };
    newAnswerTimes[currentQuestion] = timeSpent;
    setAnswerTimes(newAnswerTimes);

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = selectedOption;
    setSelectedAnswers(newSelectedAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (!moduleId) {
        throw new Error('Module ID is missing');
      }

      if (!quizData || !quizData.quiz_id) {
        throw new Error('Quiz ID is missing');
      }

      if (!selectedAnswers || selectedAnswers.length === 0) {
        throw new Error('No answers selected');
      }

      if (!questions || questions.length === 0) {
        throw new Error('No questions loaded');
      }

      const token = await user.getIdToken();

      // Calculate final answer time for the last question if not yet recorded
      if (!answerTimes[currentQuestion]) {
        answerTimes[currentQuestion] = Math.floor((Date.now() - questionStartTime) / 1000);
      }      // Convert answerTimes object to array matching question order
      const answerTimesArray = questions.map((_, index) => answerTimes[index] || 0);

      const requestData = {
        module_id: parseInt(moduleId),
        quiz_id: parseInt(quizData.quiz_id),
        selectedAnswers: selectedAnswers,
        question_ids: questions.map(q => q.question_id),
        answerTimes: answerTimesArray
      };

      console.log('Submitting quiz data:', requestData); // For debugging

      const submitResponse = await fetch(`/api/quizattempts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.error || 'Failed to submit quiz');
      }
        const responseData = await submitResponse.json();
      const { success, message, score: finalScore } = responseData;
      setScore(finalScore);
      setQuizSubmitted(true);
      
      if (success) {
        console.log(message); // Log success message
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.message);
    }
  };

  const passingPercentage = 75;
  const passingScore = Math.ceil((questions.length * passingPercentage) / 100);
  const isPassed = score >= passingScore;
  const scorePercentage = Math.round((score / questions.length) * 100);

  const returnToCertifications = () => {
    navigate('/park_guide/certifications');
  };

  if (loading) {
    return (
      <div className="quiz-main-content">
        <div className="loading-container">
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-main-content">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="back-button" onClick={() => navigate('/park_guide/training')}>
            Back to Training
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-main-content">
      {!quizSubmitted ? (
        <div className="quiz-details">
          <h2 className="module-title">{quizData?.name} - Certification Quiz</h2>
          <div className="question-counter">Question {currentQuestion + 1} of {questions.length}</div>
          <p className="module-description">
            {questions[currentQuestion]?.question_text}
          </p>
          <div className="quiz-options">
            {questions[currentQuestion]?.options.map((option, index) => {
              console.log("Current Question Object:", questions[currentQuestion]);
              console.log("Option:", option); // 🐞 Log each option for debugging
              return (
                <button
                  key={index}
                  className={`quiz-option-button ${
                    selectedAnswers[currentQuestion] === option.option_id ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswer(option.option_id)}
                >
                  {option.option_text || `Option ${index + 1}`} {/* fallback if text is missing */}
                </button>
              );
            })}
          </div>
          <div className="quiz-navigation">
            <button
              className="quiz-nav-button"
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous Question
            </button>
            <button
              className="quiz-nav-button"
              onClick={goToNextQuestion}
              disabled={currentQuestion === questions.length - 1}
            >
              Next Question
            </button>
            {currentQuestion === questions.length - 1 && (
              <button
                className="submit-quiz-button"
                onClick={submitQuiz}
                disabled={selectedAnswers.includes('')}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <div className="results-content">
            <p className="score-display">Your Score: {scorePercentage}%</p>
            <p className={`pass-status ${isPassed ? 'passed' : 'failed'}`}>
              {isPassed ? 'Congratulations! You passed!' : 'Sorry, you did not pass.'}
            </p>
            <p className="passing-info">
              Passing score: {passingPercentage}% ({passingScore} out of {questions.length} questions)
            </p>
            {isPassed ? (
              <button 
                className="view-cert-button"
                onClick={returnToCertifications}
              >
                View Certificate
              </button>
            ) : (
              <button
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Retry Quiz
              </button>
            )}
            <button 
              className="back-to-training-button"
              onClick={() => navigate('/park_guide/training')}
            >
              Back to Training
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkguideQuiz;