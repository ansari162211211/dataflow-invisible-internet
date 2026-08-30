import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/knowledgeCards';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface InteractiveQuizProps {
  onAnnounce?: (msg: string) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ onAnnounce }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    soundFx.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      soundFx.playArrival();
      onAnnounce?.(`Correct! ${question.options[idx]}. ${question.explanation}`);
    } else {
      soundFx.playHop(0);
      onAnnounce?.(`Incorrect. You selected ${question.options[idx]}. The correct answer is: ${question.options[question.correctIndex]}. ${question.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
      onAnnounce?.(`Question ${nextIdx + 1} of ${QUIZ_QUESTIONS.length}: ${QUIZ_QUESTIONS[nextIdx].question}`);
    } else {
      setIsQuizCompleted(true);
      onAnnounce?.(`Quiz completed! You scored ${score} out of ${QUIZ_QUESTIONS.length}.`);
      if (score >= QUIZ_QUESTIONS.length - 1) {
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#a855f7', '#10b981'],
          });
        } catch {
          // Ignore
        }
      }
    }
  };

  const handleRestartQuiz = () => {
    soundFx.playClick();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsQuizCompleted(false);
    onAnnounce?.(`Quiz restarted. Question 1 of ${QUIZ_QUESTIONS.length}: ${QUIZ_QUESTIONS[0].question}`);
  };

  return (
    <section
      id="quiz"
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-16 sm:scroll-mt-20 w-full"
      aria-label="Student Knowledge Check Quiz"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
          <HelpCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
          <span>Visualizing the Invisible: Knowledge Quiz</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-2.5 sm:mb-3">
          Internet Data Master Quiz
        </h2>
        <p className="text-xs sm:text-base text-slate-300 px-1 leading-relaxed">
          Check how much you learned about packets, fiber optics, routers, and encryption.
        </p>
      </div>

      {/* Quiz Card */}
      <div className="glass-panel p-4 sm:p-8 lg:p-10 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative">
        {!isQuizCompleted ? (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10">
              <span>
                Question <strong className="text-cyan-300">{currentQuestionIndex + 1}</strong> of{' '}
                {QUIZ_QUESTIONS.length}
              </span>
              <span>
                Score: <strong className="text-emerald-400">{score}</strong>
              </span>
            </div>

            {/* Question Title */}
            <h3 className="text-base sm:text-xl font-display font-bold text-white mb-4 sm:mb-6 leading-snug">
              {question.question}
            </h3>

            {/* Options */}
            <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6" role="group" aria-label={`Question ${currentQuestionIndex + 1} options`}>
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctIndex;
                let optionStyle = 'glass-panel hover:border-cyan-500/40 text-slate-200';

                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle =
                      'bg-emerald-950/50 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-950/50 border-red-400 text-red-200';
                  } else {
                    optionStyle = 'glass-panel opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left text-xs sm:text-base flex items-center justify-between transition-all duration-200 cursor-pointer min-h-[48px] focus:outline-none focus:ring-2 focus:ring-cyan-400 ${optionStyle}`}
                    aria-label={`Option ${String.fromCharCode(65 + idx)}: ${option}${isAnswered && isCorrect ? ' (Correct Answer)' : isAnswered && isSelected && !isCorrect ? ' (Incorrect Selection)' : ''}`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white/10 flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold text-slate-200 shrink-0" aria-hidden="true">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 ml-2" aria-label="Correct" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" aria-label="Incorrect" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answering */}
            {isAnswered && (
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm mb-4 sm:mb-6 ${
                  selectedOption === question.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-cyan-950/40 border-cyan-500/40 text-slate-200'
                }`}
                role="status"
              >
                <div className="font-bold font-mono mb-1 text-white">
                  {selectedOption === question.correctIndex ? '🎉 Spot on!' : '💡 Explanation:'}
                </div>
                <p className="leading-relaxed text-slate-200">{question.explanation}</p>
              </div>
            )}

            {/* Next Question Button */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  id="quiz-next-question-btn"
                  onClick={handleNextQuestion}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <span>
                    {currentQuestionIndex < QUIZ_QUESTIONS.length - 1
                      ? 'Next Question'
                      : 'View My Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results Screen */
          <div className="text-center py-4 sm:py-6" role="status">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 sm:mb-6 shadow-[0_0_30px_rgba(6,182,212,0.6)]" aria-hidden="true">
              <Award className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <h3 className="text-xl sm:text-3xl font-display font-extrabold text-white mb-2">
              Quiz Completed!
            </h3>
            <p className="text-slate-300 text-xs sm:text-base mb-4 sm:mb-6">
              You scored <strong className="text-cyan-300 text-base sm:text-lg">{score}</strong> out of{' '}
              <strong className="text-white text-base sm:text-lg">{QUIZ_QUESTIONS.length}</strong>!
            </p>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-white/10 max-w-md mx-auto mb-6 sm:mb-8 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {score === QUIZ_QUESTIONS.length
                ? '🏆 Perfect score! You understand the invisible architecture of internet packets and undersea cables like a pro network engineer!'
                : score >= 2
                ? '⭐ Great job! You have a solid grasp of how data travels across the globe!'
                : '📚 Keep exploring the interactive simulator and knowledge cards to strengthen your understanding!'}
            </div>

            <button
              id="restart-quiz-btn"
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
