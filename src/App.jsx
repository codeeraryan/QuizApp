import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { QuizHistory } from './components/QuizHistory';
import { questions } from './questions';
import { saveAttempt } from './db';
import { Brain, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [showHistory, setShowHistory] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [timerKey, setTimerKey] = useState(0); 

  const handleAnswerClick = async (optionIndex) => {
    setIsTimerActive(false);
    setSelectedAnswer(optionIndex);
    
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsTimerActive(true);
        setTimerKey(prev => prev + 1); 
      } else {
        const endTime = Date.now();
        saveAttempt({
          date: new Date(),
          score,
          totalQuestions: questions.length,
          timeSpent: endTime - startTime,
        });
        setShowScore(true);
      }
    }, 1000);
  };

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      handleAnswerClick(-1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setStartTime(Date.now());
    setShowHistory(false);
    setIsTimerActive(true);
    setTimerKey(prev => prev + 1); 
  };

  const question = questions[currentQuestion];

  if (showHistory) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-center">
        <QuizHistory />
        <button
          onClick={() => setShowHistory(false)}
          className="mt-20 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {!showScore ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold">Play Quiz</h1>
              </div>
              <Timer 
                key={timerKey}
                duration={30} 
                onTimeUp={handleTimeUp} 
                isActive={isTimerActive}
              />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <p className="text-lg">{question.text}</p>
            </div>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => isTimerActive && selectedAnswer === null && handleAnswerClick(index)}
                  disabled={!isTimerActive || selectedAnswer !== null}
                  className={clsx(
                    "w-full p-4 text-left rounded-lg transition-all",
                    (selectedAnswer === null && isTimerActive)
                      ? "hover:bg-blue-50 border border-gray-200"
                      : "cursor-default",
                    selectedAnswer !== null && index === question.correctAnswer
                      ? "bg-green-100 border-green-500"
                      : selectedAnswer === index && index !== question.correctAnswer
                      ? "bg-red-100 border-red-500"
                      : "",
                    (!isTimerActive || selectedAnswer !== null) && "opacity-75"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedAnswer !== null && index === question.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {selectedAnswer === index && index !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <p className="text-lg mb-8">
              You scored {score} out of {questions.length}
            </p>
            <div className="space-x-4">
              <button
                onClick={restartQuiz}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;