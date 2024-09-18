import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Share,
  Image,
} from "react-native";
import axios from "axios";
import he from "he";

const logoImage = require("../assets/images/waitiknowthislogo.png");

export default function Index() {
  const totalQuestions = 10; // Total number of questions

  const [questionData, setQuestionData] = useState(null);
  const [score, setScore] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const questionsLeft = totalQuestions - questionCount;

  // Phrases for correct answers
  const correctPhrases = [
    "You watch too much jeopardy",
    " Get a life",
    "You think you're hot shit don't you?",
    "Lucky guess",
    "No way you get the next one",
    "You're right, but only this time",
    "You're correct… I guess",
    "Stop googling the answers!",
    "Nice one. Now make it a nice two!",
    "Right! Not Left!",
    "*Ding dong* It's the answer, OPEN UP!",
    "Pffff. All luck",
    "Luck is on your side… and an idiot on you other side",
    "You're so wrong, it's actually right",
    "Fine. take these points",
    "*slow clap*",
    "You Irish? ",
    "Wow, first one?",
    "Keep it up! You know you can't",
    "Front page news! You got one!",
    "Wait… No way you got that one",
    "That was an easy one",
    "Feelin pretty good about yourself huh?",
    "WoOooOoOoOoW, it's right",
  ];

  // Phrases for incorrect answers
  const incorrectPhrases = [
    "I thought you knew that",
    "Didnt you know that?",
    "You’re in real jeopardy",
    "Ken Jennings my ass",
    "You should find a light bulb and put it above your head",
    "Maybe phone a friend next time?",
    "Doesn't matter. There’s always next time",
    "Youre in the wrong lane",
    "No dice. And no right",
    "Left. You’re not Right",
    "The answer was on vacation I guess",
    "Swing and a miss",
    "Missed that one and probably others too",
    "Off by a light year!",
    "Close, but no cigar, or a right answer",
    "You’re so wrong, soooo wrong",
    "MINUS POINTS BOZO!",
    "Try again! And again and again",
    "Did you really think you had this one?",
    "RONG! Tri Agen",
    "Go back to kindergarten",
    "I’m with stupid… and thats you",
    "*fart noise*",
    "So close, yet so so so so far",
    "Wrong answers are like poop. Smelly and all over you",
    "Great answer, bad guess",
    "Nice! Wait, nevermind, that’s wrong",
    "Extra! Extra! Read all about it. You’re wrong!",
    "Watch out! The right answer’s got a gun!",
    "Wrong. Just plain wrong",
    "*pats your head* good try",
    "How can you live with yourself",
    "Who's the loser? You’re the loser!",
  ];

  // Fetch a new question
  const fetchQuestion = async () => {
    if (gameOver) return;

    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=1&type=multiple"
      );

      if (response.data.response_code === 0) {
        const data = response.data.results[0];
        const options = [...data.incorrect_answers];
        const randomIndex = Math.floor(Math.random() * 4);
        options.splice(randomIndex, 0, data.correct_answer);

        setQuestionData({
          question: he.decode(data.question),
          correctAnswer: he.decode(data.correct_answer),
          options: options.map((option) => he.decode(option)),
        });

        setQuestionCount((prevCount) => prevCount + 1);
      } else {
        alert("Error", "Could not fetch question.");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  // Handle the user's answer
  const handleAnswer = (selectedOption) => {
    let randomPhrase = "";

    if (selectedOption === questionData.correctAnswer) {
      setScore((prevScore) => prevScore + 2);

      // Select a random correct phrase
      randomPhrase =
        correctPhrases[Math.floor(Math.random() * correctPhrases.length)];

      setModalMessage(`${randomPhrase}\n\n+2 points`);
    } else {
      setScore((prevScore) => prevScore - 1);

      // Select a random incorrect phrase
      randomPhrase =
        incorrectPhrases[Math.floor(Math.random() * incorrectPhrases.length)];

      setModalMessage(
        `${randomPhrase}\n\n-1 point\n\nThe correct answer was:\n${questionData.correctAnswer}`
      );
    }

    setModalVisible(true);

    if (questionCount >= totalQuestions) {
      setGameOver(true);
    }
  };

  // Reset the game
  const resetGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameOver(false);
    setQuestionData(null);
  };

  // Share the score
  const onShare = async () => {
    try {
      await Share.share({
        message: `I scored ${score} points on "Wait, I know this" Can you beat my score?`,
      });
    } catch (error) {
      alert("Error sharing your score. Please try again.");
      console.error("Error sharing:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
      <Text style={styles.scoreText}>Score: {score}</Text>
      <Text style={styles.questionsLeftText}>
        Questions Left: {questionsLeft}
      </Text>

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setQuestionData(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(!modalVisible);
                setQuestionData(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScoreText}>
            Your total score is: {score}
          </Text>
          <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      ) : questionData ? (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questionData.question}</Text>
          {questionData.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Button title="Ready for a question?" onPress={fetchQuestion} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... existing styles ...
  logo: {
    width: 150, // Adjust as needed
    height: 150, // Adjust as needed
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  questionsLeftText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  questionContainer: {
    marginTop: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  optionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    minWidth: 80,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  /* Game Over Styles */
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  finalScoreText: {
    fontSize: 24,
    marginBottom: 30,
  },
  playAgainButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 5,
  },
  playAgainButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  /* Share Button Styles */
  shareButton: {
    backgroundColor: "#FF9800",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});
