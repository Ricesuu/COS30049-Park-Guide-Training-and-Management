import { useState } from 'react';
import { useRouter } from 'next/router';

const Quiz = () => {
    const router = useRouter();

    const navigateTo = (page) => {
        router.push(page);
    };

    // Quiz questions and options
    const questions = [
        {
            question: "What is the primary role of a park guide?",
            options: ["Protect wildlife", "Guide visitors", "Maintain trails", "All of the above"],
            correctAnswer: 3, // Index of the correct answer
        },
        {
            question: "Which zone has the highest biodiversity?",
            options: ["Zone A", "Zone B", "Zone C", "Zone D"],
            correctAnswer: 2,
        },
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isQuizComplete, setIsQuizComplete] = useState(false);

    const handleOptionSelect = (index) => {
        setSelectedOption(index);
    };

    const handleNextQuestion = () => {
        if (selectedOption === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
        } else {
            setIsQuizComplete(true);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="sidebar flex flex-col justify-start items-center w-72 p-5 bg-gray-200">
                <img src="/images/SFC_LOGO_small.jpg" alt="SFC Logo" className="w-1/2 mb-6" />
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideDashboard')}>
                    Dashboard
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideTraining')}>
                    Training Module
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideCert')}>
                    Certification & Licensing
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideIdentifier')}>
                    Identifier
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguideMonitoring')}>
                    Monitoring
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguidePerformance')}>
                    Performance
                </button>
                <button className="btn w-4/5 bg-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/parkguidePlantInfo')}>
                    Plant Info
                </button>
                <button className="btn w-4/5 bg-red-500 text-white text-center py-2 mb-3 rounded shadow" onClick={() => navigateTo('/logout')}>
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content flex flex-grow p-4">
                <div className="bg-white p-6 rounded shadow w-full h-full">
                    <h2 className="text-lg font-bold mb-4 text-center">Park Guide Quiz</h2>
                    {!isQuizComplete ? (
                        <div>
                            <p className="text-center mb-4">{questions[currentQuestion].question}</p>
                            <div className="flex flex-col items-center">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`btn w-3/4 text-center py-2 mb-3 rounded shadow ${
                                            selectedOption === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                        }`}
                                        onClick={() => handleOptionSelect(index)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="btn bg-green-500 text-white text-center py-2 px-4 rounded shadow mt-4"
                                onClick={handleNextQuestion}
                                disabled={selectedOption === null}
                            >
                                {currentQuestion + 1 < questions.length ? 'Next' : 'Finish'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg font-bold">Quiz Complete!</p>
                            <p className="text-base">Your Score: {score} / {questions.length}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;