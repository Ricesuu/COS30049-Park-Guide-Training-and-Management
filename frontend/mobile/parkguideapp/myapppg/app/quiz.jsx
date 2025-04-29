import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../components/PGDashboardHome/Header";
import Ionicons from "react-native-vector-icons/Ionicons";

const Quiz = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { certName } = route.params || {};

  console.log("Quiz loaded for certificate:", certName); // for debugging

  const questionBank = {
    "First Aid Certification": [
      {
        question: "What is the first step in providing first aid?",
        options: ["Call for help", "Assess the scene", "Start CPR", "Check the pulse"],
        correctAnswer: 1,
      },
      {
        question: "When should you stop CPR?",
        options: [
          "When the victim recovers",
          "When help arrives",
          "When you are too exhausted",
          "All of the above",
        ],
        correctAnswer: 3,
      },
    ],
    "Semenggoh Wildlife Centre Certification": [
      {
        question: "Where is Semenggoh Wildlife Centre located?",
        options: ["Sabah", "Kuala Lumpur", "Sarawak", "Penang"],
        correctAnswer: 2,
      },
      {
        question: "Which species is Semenggoh most famous for?",
        options: ["Sun Bear", "Orangutan", "Hornbill", "Tiger"],
        correctAnswer: 1,
      },
    ],
    "Wildlife Safety Certification": [
      {
        question: "What is a key rule for wildlife safety?",
        options: [
          "Approach from behind",
          "Feed with supervision",
          "Keep a safe distance",
          "Touch gently",
        ],
        correctAnswer: 2,
      },
      {
        question: "Why is it important not to feed wild animals?",
        options: [
          "It’s illegal",
          "It changes their behavior",
          "It makes them aggressive",
          "All of the above",
        ],
        correctAnswer: 3,
      },
    ],
    "Advanced Park Guide Certification": [
      {
        question: "What skill is essential for an advanced park guide?",
        options: [
          "Fluent in multiple languages",
          "Map reading & navigation",
          "Animal taming",
          "Tree climbing",
        ],
        correctAnswer: 1,
      },
      {
        question: "What does Leave No Trace mean?",
        options: [
          "Avoid hiking",
          "Stay on roads only",
          "Minimize impact on nature",
          "Don't talk loudly",
        ],
        correctAnswer: 2,
      },
    ],
  };

  const questions = questionBank?.[certName?.trim()] || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // If no questions found, show error message
  if (!certName || questions.length === 0) {
    return (
      <View style={styles.quizContainer}>
        <Text style={styles.completionText}>No quiz found for this certificate.</Text>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.nextButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleNextQuestion = () => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    isCorrect ? setCorrectCount((c) => c + 1) : setWrongCount((w) => w + 1);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Header />

        <View style={styles.quizContainer}>
          {isQuizComplete ? (
            <View style={styles.completionContainer}>
              <Text style={styles.completionText}>Quiz Complete!</Text>
              <Text style={styles.resultText}>Correct: {correctCount}</Text>
              <Text style={styles.resultText}>Wrong: {wrongCount}</Text>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.nextButtonText}>Back to Certificates</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.questionText}>
                {questions[currentQuestionIndex].question}
              </Text>
              {questions[currentQuestionIndex].options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === index && styles.selectedOption,
                  ]}
                  onPress={() => handleOptionSelect(index)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  selectedOption === null && styles.disabledNextButton,
                ]}
                onPress={handleNextQuestion}
                disabled={selectedOption === null}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(22, 163, 74)",
  },
  scrollView: {
    flexGrow: 1,
  },
  quizContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -5,
    paddingBottom: 120,
    padding: 20,
    flex: 1,
    zIndex: 1,
    elevation: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  optionButton: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: "rgb(22, 163, 74)",
    borderColor: "rgb(22, 163, 74)",
  },
  optionText: {
    fontSize: 16,
    color: "#555",
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgb(22, 163, 74)",
    borderRadius: 5,
    alignSelf: "center",
  },
  disabledNextButton: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    bottom: 80,
    left: 20,
    backgroundColor: "rgb(22, 163, 74)",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  completionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  completionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgb(22, 163, 74)",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    marginVertical: 5,
    color: "#333",
    textAlign: "center",
  },
});

export default Quiz;
