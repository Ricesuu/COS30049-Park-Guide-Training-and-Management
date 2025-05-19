import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    LogBox,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_URL } from "../../../src/constants/constants";
import { auth } from "../../../lib/Firebase";

// Ignore specific warnings
LogBox.ignoreLogs(["Text strings must be rendered within a <Text> component"]);

const Quiz = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const moduleId = params.moduleId ? parseInt(params.moduleId, 10) : null;
    const moduleName = params.moduleName || "Unknown Module";

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);

    // For now, we'll use static questions based on module ID
    useEffect(() => {
        // Simulate loading questions from API
        setLoading(true);

        // This is mock data - in production, fetch from API
        const mockQuestions = [
            {
                question:
                    "What is the primary purpose of this certification program?",
                options: [
                    "To increase park revenue",
                    "To improve visitor experience and safety",
                    "To reduce staff workload",
                    "To comply with international standards",
                ],
                correctAnswer: 1,
            },
            {
                question:
                    "What should a park guide do if a visitor is injured?",
                options: [
                    "Ignore the situation",
                    "Call for medical assistance immediately",
                    "Ask the visitor to leave the park",
                    "Take photos for documentation",
                ],
                correctAnswer: 1,
            },
            {
                question:
                    "Which of these is NOT a responsibility of a park guide?",
                options: [
                    "Providing information about park features",
                    "Ensuring visitor safety",
                    "Making executive decisions about park operations",
                    "Environmental education",
                ],
                correctAnswer: 2,
            },
            {
                question:
                    "What is the best approach when answering visitor questions?",
                options: [
                    "Be brief and move on quickly",
                    "Provide detailed, accurate information",
                    "Refer all questions to management",
                    "Read directly from guidebooks",
                ],
                correctAnswer: 1,
            },
            {
                question: "What is a key principle of sustainable tourism?",
                options: [
                    "Maximizing visitor numbers",
                    "Preserving natural resources while benefiting local communities",
                    "Building more facilities",
                    "Restricting all access to protected areas",
                ],
                correctAnswer: 1,
            },
        ];

        setTimeout(() => {
            setQuestions(mockQuestions);
            setLoading(false);
        }, 1000);
    }, [moduleId]);

    const handleOptionSelect = (optionIndex) => {
        setSelectedOption(optionIndex);
    };

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];

        // Check if answer is correct
        selectedOption === currentQuestion.correctAnswer
            ? setCorrectCount(correctCount + 1)
            : setWrongCount(wrongCount + 1);

        // Move to next question or finish quiz
        currentQuestionIndex < questions.length - 1
            ? (setCurrentQuestionIndex(currentQuestionIndex + 1),
              setSelectedOption(null))
            : setIsQuizComplete(true);
    };

    const handleSubmitQuiz = async () => {
        setSubmitting(true);

        try {
            // In a real app, you would submit to your API
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            // Simulate API submission
            setTimeout(() => {
                Alert.alert(
                    "Quiz Submitted",
                    `You've completed the quiz with ${correctCount} correct and ${wrongCount} incorrect answers.`,
                    [
                        {
                            text: "Back to Modules",
                            onPress: () => router.push("/pg-dashboard/module"),
                        },
                    ]
                );
                setSubmitting(false);
            }, 1000);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            Alert.alert("Error", "Failed to submit quiz. Please try again.");
            setSubmitting(false);
        }
    };

    const renderQuizContent = () => {
        // For quiz completion summary
        const totalQuestions = questions.length;
        const scorePercentage = isQuizComplete
            ? Math.round((correctCount / totalQuestions) * 100)
            : 0;
        const isPassing = scorePercentage >= 70; // Assuming 70% is passing

        // Current question reference
        const currentQuestion =
            currentQuestionIndex < questions.length
                ? questions[currentQuestionIndex]
                : null;

        return loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
                <Text style={styles.loadingText}>
                    Loading quiz questions...
                </Text>
            </View>
        ) : error ? (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("/pg-dashboard/module")}
                >
                    <Text style={styles.buttonText}>Back to Modules</Text>
                </TouchableOpacity>
            </View>
        ) : isQuizComplete ? (
            <View style={styles.completionContainer}>
                <Text style={styles.completionTitle}>Quiz Complete!</Text>

                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>
                        Your Score: {scorePercentage}%
                    </Text>
                    <Text
                        style={[
                            styles.resultText,
                            isPassing ? styles.passingText : styles.failingText,
                        ]}
                    >
                        {isPassing ? "PASSED" : "FAILED"}
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{correctCount}</Text>
                        <Text style={styles.statLabel}>Correct</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{wrongCount}</Text>
                        <Text style={styles.statLabel}>Incorrect</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalQuestions}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmitQuiz}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Submit Results</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push("/pg-dashboard/module")}
                    disabled={submitting}
                >
                    <Text style={styles.buttonText}>Back to Modules</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Question {currentQuestionIndex + 1} of{" "}
                        {questions.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${
                                        ((currentQuestionIndex + 1) /
                                            questions.length) *
                                        100
                                    }%`,
                                },
                            ]}
                        />
                    </View>
                </View>

                <Text style={styles.questionText}>
                    {currentQuestion?.question}
                </Text>

                {currentQuestion?.options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionItem,
                            selectedOption === index
                                ? styles.selectedOption
                                : {},
                        ]}
                        onPress={() => handleOptionSelect(index)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                        {selectedOption === index && (
                            <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color="rgb(22, 163, 74)"
                                style={styles.checkIcon}
                            />
                        )}
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedOption === null ? styles.disabledButton : {},
                    ]}
                    onPress={handleNextQuestion}
                    disabled={selectedOption === null}
                >
                    <Text style={styles.buttonText}>
                        {currentQuestionIndex < questions.length - 1
                            ? "Next Question"
                            : "Complete Quiz"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push("/pg-dashboard/module")}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.quizTitle}>Module Quiz</Text>
            </View>

            <View style={styles.quizContainer}>
                <Text style={styles.moduleName}>{moduleName}</Text>
                {renderQuizContent()}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
    },
    header: {
        backgroundColor: "rgb(22, 163, 74)",
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    backText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: 16,
    },
    quizTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 20,
    },
    quizContainer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    moduleName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        marginVertical: 20,
        alignItems: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "rgb(22, 163, 74)",
        borderRadius: 4,
    },
    questionText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    optionItem: {
        backgroundColor: "#f5f5f5",
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    selectedOption: {
        backgroundColor: "#e8f5e9",
        borderColor: "rgb(22, 163, 74)",
    },
    optionText: {
        fontSize: 16,
        flex: 1,
    },
    checkIcon: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: "rgb(22, 163, 74)",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        marginVertical: 20,
    },
    disabledButton: {
        backgroundColor: "#a0a0a0",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    completionContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    completionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "rgb(22, 163, 74)",
    },
    scoreContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#333",
    },
    resultText: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
    },
    passingText: {
        color: "rgb(22, 163, 74)",
    },
    failingText: {
        color: "#e53935",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 20,
        paddingHorizontal: 30,
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: 14,
        color: "#666",
    },
    submitButton: {
        backgroundColor: "#e67e22",
    },
});

export default Quiz;
