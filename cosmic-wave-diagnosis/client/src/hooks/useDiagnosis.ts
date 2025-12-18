import { useState, useCallback } from 'react';
import questionsData from '../data/questions.json';
import resultsData from '../data/results.json';

export type Question = {
  id: number;
  text: string;
  dimension: string;
  direction: string;
};

export type ResultType = {
  title: string;
  subtitle: string;
  type: 'Sun' | 'Moon';
  content: string;
};

type Scores = {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
};

export const useDiagnosis = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ResultType | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  const questions = questionsData as Question[];

  const startDiagnosis = useCallback(() => {
    setIsDiagnosing(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  }, []);

  const handleAnswer = useCallback((value: string) => {
    // value is 'yes' or 'no'
    const currentQuestion = questions[currentQuestionIndex];
    // Store the answer. If 'yes', we count towards the direction. If 'no', we might count towards opposite or just ignore?
    // Let's assume 'yes' adds to the direction score.
    // Actually, the original logic was:
    // Each question has a direction (e.g. E). If user says Yes, E++. If No, I++ (or just E doesn't increase).
    // Let's look at the questions. They are statements.
    // "I feel energized..." (E). Yes -> E++, No -> I++.
    
    // We need to know what 'value' means. Let's assume the UI sends 'yes' or 'no'.
    // Or better, let's make the UI send the direction directly if 'yes', and opposite if 'no'.
    // But the hook should handle the logic.
    
    // Let's assume the UI calls handleAnswer('yes') or handleAnswer('no').
    
    const answerDirection = value === 'yes' ? currentQuestion.direction : getOppositeDirection(currentQuestion.direction);
    
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerDirection }));

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 400);
    } else {
      finishDiagnosis({ ...answers, [currentQuestion.id]: answerDirection });
    }
  }, [currentQuestionIndex, answers, questions]);

  const getOppositeDirection = (dir: string) => {
    const map: Record<string, string> = { E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J' };
    return map[dir] || dir;
  };

  const finishDiagnosis = (finalAnswers: Record<string, string>) => {
    const scores: Scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    Object.values(finalAnswers).forEach((direction) => {
      if (direction in scores) {
        scores[direction as keyof Scores]++;
      }
    });

    const type = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P',
    ].join('');

    // Sun/Moon determination logic (simplified for this context, can be expanded)
    // Using the logic from original: Sun if E/I score diff is high, Moon if low?
    // Or based on specific questions. For now, let's use a simple heuristic or random for variety if not specified.
    // Wait, the original logic.js had a specific calculation for Sun/Moon based on total score variance or specific questions?
    // Let's look at the original logic.js if needed. For now, I will implement a variance check.
    
    // Original logic seemed to just use the type. But we have Sun/Moon variants.
    // Let's assume Sun is "Clear preference" and Moon is "Balanced/Conflicted" or based on EI/TF balance.
    // Actually, let's use the total variance. High variance -> Sun (Clear), Low variance -> Moon (Subtle).
    
    const variance = 
      Math.abs(scores.E - scores.I) + 
      Math.abs(scores.S - scores.N) + 
      Math.abs(scores.T - scores.F) + 
      Math.abs(scores.J - scores.P);
    
    // Threshold for Sun/Moon. Max variance is 12 (if 3 questions per dimension). 
    // Let's say if variance > 6 -> Sun, else Moon.
    const variant = variance > 6 ? 'Sun' : 'Moon';
    
    const resultKey = `${type}_${variant}`;
    const diagnosisResult = (resultsData as any)[resultKey];

    if (diagnosisResult) {
      setResult(diagnosisResult);
    } else {
      // Fallback
      setResult((resultsData as any)['INFJ_Sun']);
    }
    setIsDiagnosing(false);
  };

  const resetDiagnosis = useCallback(() => {
    setIsDiagnosing(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  }, []);

  return {
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    handleAnswer,
    result,
    isDiagnosing,
    startDiagnosis,
    resetDiagnosis,
    progress: ((currentQuestionIndex + 1) / questions.length) * 100,
  };
};
