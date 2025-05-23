import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../ParkGuideStyle.css";
import { auth } from '../../Firebase';

const ParkguideQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const moduleId = queryParams.get('moduleId');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [attemptId, setAttemptId] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        const token = await user.getIdToken();

        // First get the module to find its quiz_id
        const moduleResponse = await fetch(`/api/training-modules/${moduleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!moduleResponse.ok) {
          throw new Error('Failed to fetch module data');
        }        const moduleData = await moduleResponse.json();

        // Fetch quiz data and questions through the module quiz endpoint
        const quizResponse = await fetch(`/api/training-modules/${moduleId}/quiz`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!quizResponse.ok) {
          throw new Error('Failed to fetch quiz questions');
        }        const data = await quizResponse.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setQuizData({
          ...data.quiz,
          name: moduleData.module_name
        });
        setAttemptId(data.quiz.attemptId);
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

  const handleAnswer = (selectedOption) => {
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

      const token = await user.getIdToken();

      // Send only moduleId and answers
      const submitResponse = await fetch(`/api/quiz-completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: parseInt(moduleId),
          answers: selectedAnswers.map((answer, index) => ({
            questionId: questions[index].question_id,
            selectedOptionId: answer,
          })),
        }),
      });

      if (!submitResponse.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await submitResponse.json();
      setScore(result.score);
      setQuizSubmitted(true);
      setAttemptId(result.attemptId);
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
              Previous
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button 
                className="quiz-submit-button" 
                onClick={submitQuiz}
                disabled={selectedAnswers.includes('')}
              >
                Submit Quiz
              </button>
            ) : (
              <button 
                className="quiz-nav-button" 
                onClick={goToNextQuestion}
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <h2 className="results-title">{quizData?.name} - Quiz Results</h2>
          
          <div className={`results-score ${isPassed ? 'passed' : 'failed'}`}>
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-divider">/</span>
              <span className="score-total">{questions.length}</span>
            </div>
            <div className="score-percentage">{scorePercentage}%</div>
          </div>
          
          <div className="results-message">
            {isPassed ? (
              <>
                <h3 className="success-message">Congratulations! You Passed!</h3>
                <p>You have successfully completed this certification quiz with a score of {score} out of {questions.length} questions ({scorePercentage}%).</p>
                <p>The minimum passing score was {passingScore} correct answers ({passingPercentage}%).</p>
              </>
            ) : (
              <>
                <h3 className="failure-message">Sorry, You Did Not Pass</h3>
                <p>You completed this certification quiz with a score of {score} out of {questions.length} questions ({scorePercentage}%).</p>
                <p>The minimum passing score is {passingScore} correct answers ({passingPercentage}%). Please review the material and try again.</p>
              </>
            )}
          </div>
          
          <button className="return-button" onClick={returnToCertifications}>
            Return to Certifications
          </button>
        </div>
      )}
    </div>
  );
};

export default ParkguideQuiz;