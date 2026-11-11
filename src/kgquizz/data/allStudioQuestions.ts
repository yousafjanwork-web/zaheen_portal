import { QUIZ_QUESTIONS, QuizQuestion } from './quizData';
import { ALL_QUIZ_STAGES } from './quizStages';

// Every question that can appear in a quiz: the main list + the extra
// questions that are only created inside the test stages (quizStages.ts).
export const ALL_STUDIO_QUESTIONS: QuizQuestion[] = (() => {
  const seen = new Set<string>();
  const list: QuizQuestion[] = [];
  const add = (q: QuizQuestion) => {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      list.push(q);
    }
  };
  QUIZ_QUESTIONS.forEach(add);
  Object.values(ALL_QUIZ_STAGES).forEach((stages) =>
    stages.forEach((st) => st.questions.forEach(add))
  );
  return list;
})();