import React, { useEffect, useState } from 'react';
import { Clock, Trophy } from 'lucide-react';
import { getAttempts } from '../db';

export function QuizHistory() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const loadAttempts = async () => {
      const history = await getAttempts();
      setAttempts(history.sort((a, b) => b.date.getTime() - a.date.getTime()));
    };
    loadAttempts();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
      <div className="space-y-4">
        {attempts.map((attempt, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">
                  Score: {attempt.score}/{attempt.totalQuestions}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{new Date(attempt.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Time spent: {Math.round(attempt.timeSpent / 1000)}s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}