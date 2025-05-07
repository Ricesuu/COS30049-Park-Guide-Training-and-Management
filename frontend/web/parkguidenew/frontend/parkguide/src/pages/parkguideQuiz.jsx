import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const questions = [
  {
    question: 'What is the primary reason orangutans in Borneo are endangered according to recent conservation research? Please select the most comprehensive answer that addresses the full scope of the threat.',
    type: 'MCQ',
    options: [
      'Habitat loss due to deforestation for palm oil plantations, illegal logging, and mining operations that fragment their natural forest habitat',
      'Climate change causing alterations in fruit production cycles which orangutans depend on for food',
      'Hunting by local indigenous communities as part of traditional practices',
      'Natural predation from tigers and other large carnivores in the forest'
    ],
    answer: 'Habitat loss due to deforestation for palm oil plantations, illegal logging, and mining operations that fragment their natural forest habitat',
  },
  {
    question: 'When approaching a proboscis monkey troop in the wild during a guided tour, what is the recommended protocol that ensures both visitor safety and minimal wildlife disturbance according to Sarawak Wildlife Conservation guidelines?',
    type: 'MCQ',
    options: [
      'Maintain at least 10 meters distance, speak in whispers, avoid direct eye contact, and follow guide instructions regarding positioning and photography',
      'Approach slowly with food offerings to gain their trust',
      'Make loud noises to alert them of human presence',
      'Run quickly past them to minimize time spent in their territory'
    ],
    answer: 'Maintain at least 10 meters distance, speak in whispers, avoid direct eye contact, and follow guide instructions regarding positioning and photography',
  },
  {
    question: 'The rainforests of Borneo contain a complex ecosystem where numerous species depend on each other for survival. Which of the following best describes the ecological relationship between hornbills and fruit-bearing trees in Borneo\'s rainforest?',
    type: 'MCQ',
    options: [
      'Hornbills consume fruits and disperse the seeds throughout the forest, aiding in forest regeneration, while the trees provide essential food sources for the hornbills',
      'Hornbills build nests in these trees but have no impact on tree reproduction',
      'Hornbills protect the trees from insect infestations but do not interact with the fruits',
      'Hornbills and fruit trees compete for the same resources in the ecosystem'
    ],
    answer: 'Hornbills consume fruits and disperse the seeds throughout the forest, aiding in forest regeneration, while the trees provide essential food sources for the hornbills',
  },
  {
    question: 'When a visitor reports seeing a potentially venomous snake on a trail during a guided tour, what is the proper protocol that should be followed by a park guide?',
    type: 'MCQ',
    options: [
      'Ensure all visitors maintain a safe distance, identify the species if possible without approaching it, report the sighting to park management, and redirect the tour along an alternative route if necessary',
      'Capture the snake to remove it from the tourist area',
      'Encourage visitors to take close-up photographs for species identification',
      'Ignore the report unless the snake is actively threatening visitors'
    ],
    answer: 'Ensure all visitors maintain a safe distance, identify the species if possible without approaching it, report the sighting to park management, and redirect the tour along an alternative route if necessary',
  },
  {
    question: 'Climate change is impacting Borneo\'s rainforest ecosystems in multiple ways. Which of the following is NOT a documented effect of climate change on Borneo\'s wildlife according to recent scientific studies?',
    type: 'MCQ',
    options: [
      'Increased intelligence and tool use among primate species',
      'Alterations in flowering and fruiting seasons affecting food availability',
      'Changes in migration patterns of certain bird species',
      'Increased vulnerability to disease among amphibian populations'
    ],
    answer: 'Increased intelligence and tool use among primate species',
  },
  {
    question: 'The practice of sustainable tourism in wildlife sanctuaries is essential for long-term conservation. According to the Sarawak Tourism Board\'s guidelines, sustainable wildlife tourism in orangutan rehabilitation centers should incorporate which of the following principles?',
    type: 'MCQ',
    options: [
      'Limited visitor numbers, maintained viewing distances, education components, contribution to conservation funding, and employment opportunities for local communities',
      'Maximizing visitor numbers to increase revenue for conservation',
      'Allowing visitors to feed wildlife to ensure memorable experiences',
      'Focusing exclusively on tourism revenue without educational components'
    ],
    answer: 'Limited visitor numbers, maintained viewing distances, education components, contribution to conservation funding, and employment opportunities for local communities',
  },
  {
    question: 'During periods of drought in Borneo, wildlife behavior often changes in response to environmental stress. As a park guide, which of the following behavioral changes in orangutans would indicate serious drought-related stress that should be reported to conservation authorities?',
    type: 'MCQ',
    options: [
      'Increased ground travel instead of arboreal movement, unusual feeding on bark and pith, aggressive competition at water sources, and intrusion into agricultural areas surrounding protected forests',
      'Increased vocalizations during morning hours',
      'More frequent nest building activities',
      'Higher levels of social grooming among family groups'
    ],
    answer: 'Increased ground travel instead of arboreal movement, unusual feeding on bark and pith, aggressive competition at water sources, and intrusion into agricultural areas surrounding protected forests',
  },
  {
    question: 'The flora of Borneo\'s rainforests includes many species with medicinal properties that are being studied by pharmaceutical companies. As a guide, which statement most accurately describes the current status of bioprospecting in Borneo according to recent agreements between research institutions and local authorities?',
    type: 'MCQ',
    options: [
      'Research partnerships must include benefit-sharing agreements with local communities, sustainable harvesting protocols, and recognition of indigenous knowledge, with a percentage of profits directed toward conservation efforts',
      'All plant collection is prohibited to prevent biopiracy',
      'Any researcher can collect plant samples without restrictions',
      'Only foreign pharmaceutical companies are granted collection permits'
    ],
    answer: 'Research partnerships must include benefit-sharing agreements with local communities, sustainable harvesting protocols, and recognition of indigenous knowledge, with a percentage of profits directed toward conservation efforts',
  },
  {
    question: 'In Borneo\'s delicate ecosystem, the relationship between mangrove forests and marine life is crucial for coastal biodiversity. According to marine conservation research, what role do mangrove forests play in supporting offshore coral reef ecosystems?',
    type: 'MCQ',
    options: [
      'Mangroves filter terrestrial sediment and pollutants, provide nursery habitats for juvenile reef fish, sequester carbon that would otherwise contribute to ocean acidification, and reduce coastal erosion that could smother reefs during storms',
      'Mangroves have no significant impact on coral reef health',
      'Mangroves compete with coral reefs for marine resources',
      'Mangroves primarily benefit human communities and have limited ecological connection to reefs'
    ],
    answer: 'Mangroves filter terrestrial sediment and pollutants, provide nursery habitats for juvenile reef fish, sequester carbon that would otherwise contribute to ocean acidification, and reduce coastal erosion that could smother reefs during storms',
  },
  {
    question: 'In accordance with the Sarawak Wildlife Protection Ordinance, certain critically endangered species receive the highest level of protection. Under this ordinance, if a tour group encounters evidence of illegal hunting of totally protected species such as pangolins, what is the legally mandated response expected of a licensed park guide?',
    type: 'MCQ',
    options: [
      'Document the evidence without disturbing it, immediately report to the nearest Forestry Department or wildlife authority with precise location details, prevent tourists from removing any items from the scene, and follow up with a written report within 24 hours',
      'Ignore the evidence to avoid paperwork complications',
      'Remove any traps found but otherwise take no action',
      'Discuss the situation with the tour group before deciding whether to report'
    ],
    answer: 'Document the evidence without disturbing it, immediately report to the nearest Forestry Department or wildlife authority with precise location details, prevent tourists from removing any items from the scene, and follow up with a written report within 24 hours',
  },
];

const ParkguideQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const certTitle = queryParams.get('cert');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(''));
  const [quizSubmitted, setQuizSubmitted] = useState(false);

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

  const submitQuiz = () => {
    let finalScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === questions[i].answer) {
        finalScore++;
      }
    }
    setScore(finalScore);
    setQuizSubmitted(true);
  };

  const passingPercentage = 75;
  const passingScore = Math.ceil((questions.length * passingPercentage) / 100);
  const isPassed = score >= passingScore;
  const scorePercentage = Math.round((score / questions.length) * 100);

  const returnToCertifications = () => {
    navigate('/certifications');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="quiz-main-content">
        {!quizSubmitted ? (
          <div className="quiz-details">
            <h2 className="module-title">{certTitle}</h2>
            <div className="question-counter">Question {currentQuestion + 1} of {questions.length}</div>
            <p className="module-description">
              {questions[currentQuestion].question}
            </p>
            <div className="quiz-options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option-button ${selectedAnswers[currentQuestion] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
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
                <button className="quiz-submit-button" onClick={submitQuiz}>
                  Submit Quiz
                </button>
              ) : (
                <button className="quiz-nav-button" onClick={goToNextQuestion}>
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="quiz-results">
            <h2 className="results-title">{certTitle} - Quiz Results</h2>
            
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
    </div>
  );
};

export default ParkguideQuiz;