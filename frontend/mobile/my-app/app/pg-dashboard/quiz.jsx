import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/PGdashboard/PGDashboardHome/Header";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_URL } from "../../src/constants/constants";
import { auth } from "../../lib/Firebase";

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
    
    console.log("Quiz loaded for module:", moduleId, moduleName);
    
    // For now, we'll use static questions based on module ID
    // In a real app, these would come from an API
    useEffect(() => {
        // Simulate loading questions from API
        setLoading(true);
        
        // This is mock data - in production, fetch from API
        const mockQuestions = [
            {
                question: "What is the primary purpose of this certification program?",
                options: [
                    "To increase park revenue",
                    "To improve visitor experience and safety",
                    "To reduce staff workload",
                    "To comply with international standards"
                ],
                correctAnswer: 1,
            },
            {
                question: "What should a park guide do if a visitor is injured?",
                options: [
                    "Ignore the situation",
                    "Call for medical assistance immediately",
                    "Ask the visitor to leave the park",
                    "Take photos for documentation"
                ],
                correctAnswer: 1,
            },
            {
                question: "Which of these is NOT a responsibility of a park guide?",
                options: [
                    "Providing information about park features",
                    "Ensuring visitor safety",
                    "Making executive decisions about park operations",
                    "Environmental education"
                ],
                correctAnswer: 2,
            },
            {
                question: "What is the best approach when answering visitor questions?",
                options: [
                    "Be brief and move on quickly",
                    "Provide detailed, accurate information",
                    "Refer all questions to management",
                    "Read directly from guidebooks"
                ],
                correctAnswer: 1,
            },
            {
                question: "What is a key principle of sustainable tourism?",
                options: [
                    "Maximizing visitor numbers",
                    "Preserving natural resources while benefiting local communities",
                    "Building more facilities",
                    "Restricting all access to protected areas"
                ],
                correctAnswer: 1,
            }
        ];
        
        setTimeout(() => {
            setQuestions(mockQuestions);
            setLoading(false);
        }, 1000);
    }, [moduleId]);
    
    // If no module ID provided, show error
    if (!moduleId) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Header />
                    <View style={styles.quizContainer}>
                        <Text style={styles.errorText}>Invalid module selected.</Text>
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.nextButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    const handleNextQuestion = () => {
        const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
        
        if (isCorrect) {
            setCorrectCount(c => c + 1);
        } else {
            setWrongCount(w => w + 1);
        }

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
    
    const handleQuizSubmission = async () => {
        if (!moduleId) return;
        
        setSubmitting(true);
        try {
            const idToken = await auth.currentUser.getIdToken();
            const score = correctCount;
            const totalQuestions = questions.length;
            
            const response = await axios.post(
                `${API_URL}/api/quiz-completions`,
                {
                    moduleId,
                    score,
                    totalQuestions,
                    passingScore: 0.7, // 70% passing grade
                },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );
            
            console.log("Quiz submission response:", response.data);
            
            if (response.data.passed) {
                Alert.alert(
                    "Congratulations!",
                    "You've passed the quiz and earned your certification!",
                    [
                        { 
                            text: "View Certificates", 
                            onPress: () => router.push("/pg-dashboard/certificate")
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "Quiz Results",
                    `You scored ${score}/${totalQuestions}. You need 70% to pass.`,
                    [
                        { 
                            text: "Try Again", 
                            onPress: () => {
                                setCorrectCount(0);
                                setWrongCount(0);
                                setCurrentQuestionIndex(0);
                                setSelectedOption(null);
                                setIsQuizComplete(false);
                            } 
                        },
                        { 
                            text: "Go Back", 
                            onPress: () => router.back() 
                        }
                    ]
                );
            }
        } catch (error) {
            console.error("Error submitting quiz results:", error);
            Alert.alert(
                "Error",
                "There was a problem submitting your quiz results. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Header />

                <View style={styles.quizContainer}>
                    <Text style={styles.moduleName}>{moduleName}</Text>
                    
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="rgb(22, 163, 74)" />
                            <Text style={styles.loadingText}>Loading quiz questions...</Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.nextButtonText}>Go Back</Text>
                            </TouchableOpacity>
                        </View>
                    ) : isQuizComplete ? (
                        <View style={styles.completionContainer}>
                            <Text style={styles.completionText}>
                                Quiz Complete!
                            </Text>
                            <Text style={styles.resultText}>
                                Correct: {correctCount}
                            </Text>
                            <Text style={styles.resultText}>
                                Wrong: {wrongCount}
                            </Text>
                            <Text style={styles.scoreText}>
                                Score: {Math.round((correctCount / questions.length) * 100)}%
                            </Text>
                            
                            {submitting ? (
                                <ActivityIndicator size="large" color="rgb(22, 163, 74)" style={styles.submitLoading} />
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={styles.submitButton}
                                        onPress={handleQuizSubmission}
                                    >
                                        <Text style={styles.submitButtonText}>
                                            Submit Results
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={styles.nextButton}
                                        onPress={() => router.back()}
                                    >
                                        <Text style={styles.nextButtonText}>
                                            Cancel
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    ) : (
                        <>
                            <View style={styles.progressBar}>
                                <View 
                                    style={[
                                        styles.progressFill, 
                                        {width: `${(currentQuestionIndex / questions.length) * 100}%`}
                                    ]} 
                                />
                            </View>
                            <Text style={styles.progressText}>
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </Text>
                            
                            <Text style={styles.questionText}>
                                {questions[currentQuestionIndex]?.question}
                            </Text>
                            
                            {questions[currentQuestionIndex]?.options.map(
                                (option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.optionButton,
                                            selectedOption === index && styles.selectedOption,
                                        ]}
                                        onPress={() => handleOptionSelect(index)}
                                    >
                                        <Text 
                                            style={[
                                                styles.optionText,
                                                selectedOption === index && styles.selectedOptionText
                                            ]}
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            )}
                            
                            <TouchableOpacity
                                style={[
                                    styles.nextButton,
                                    selectedOption === null && styles.disabledNextButton,
                                ]}
                                onPress={handleNextQuestion}
                                disabled={selectedOption === null}
                            >
                                <Text style={styles.nextButtonText}>
                                    {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
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
    moduleName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 20,
        textAlign: "center",
    },
    progressBar: {
        height: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        marginBottom: 10,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "rgb(22, 163, 74)",
    },
    progressText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 20,
        textAlign: "right",
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
    selectedOptionText: {
        color: "white",
    },
    nextButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "rgb(22, 163, 74)",
        borderRadius: 8,
        alignSelf: "center",
    },
    disabledNextButton: {
        backgroundColor: "#ccc",
    },
    nextButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    submitButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#f0ad4e",
        borderRadius: 8,
        alignSelf: "stretch",
        marginBottom: 15,
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    backButton: {
        position: "absolute",
        bottom: 80,
        left: 20,
        backgroundColor: "rgba(22, 163, 74, 0.8)",
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
        paddingVertical: 40,
    },
    completionText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "rgb(22, 163, 74)",
        marginBottom: 20,
    },
    resultText: {
        fontSize: 18,
        marginVertical: 5,
        color: "#333",
        textAlign: "center",
    },
    scoreText: {
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 25,
        color: "rgb(22, 163, 74)",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: "#666",
    },
    submitLoading: {
        marginVertical: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 50,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        marginBottom: 20,
        textAlign: "center",
    },
});

export default Quiz;
