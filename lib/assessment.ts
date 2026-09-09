export type Question = {
  id: string;
  lesson: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  rationales: string[];
};
export type AssessmentState = {
  answers: Record<string, number>;
  flagged: string[];
  submitted: boolean;
};
export const freshAssessment = (): AssessmentState => ({
  answers: {},
  flagged: [],
  submitted: false,
});
export function parseAssessment(
  raw: string | null,
  questions: Question[],
): AssessmentState {
  if (!raw) return freshAssessment();
  if (raw.length > 20000) throw new Error('Assessment save is too large');
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid assessment save');
  const state = value as Record<string, unknown>;
  if (
    !state.answers ||
    typeof state.answers !== 'object' ||
    Array.isArray(state.answers) ||
    !Array.isArray(state.flagged) ||
    typeof state.submitted !== 'boolean'
  )
    throw new Error('Invalid assessment save');
  const answers: Record<string, number> = {};
  for (const [id, answer] of Object.entries(state.answers)) {
    const q = questions.find((q) => q.id === id);
    if (
      !q ||
      !Number.isInteger(answer) ||
      typeof answer !== 'number' ||
      answer < 0 ||
      answer >= q.options.length
    )
      throw new Error('Invalid saved answer');
    answers[id] = answer;
  }
  if (
    state.flagged.some(
      (id) => typeof id !== 'string' || !questions.some((q) => q.id === id),
    )
  )
    throw new Error('Invalid review flag');
  if (state.submitted && Object.keys(answers).length !== questions.length)
    throw new Error('Incomplete submitted assessment');
  return {
    answers,
    flagged: [...new Set(state.flagged)],
    submitted: state.submitted,
  };
}
export function gradeAssessment(
  questions: Question[],
  answers: Record<string, number>,
) {
  return {
    correct: questions.filter((q) => answers[q.id] === q.answer).length,
    answered: questions.filter((q) => answers[q.id] !== undefined).length,
    total: questions.length,
    review: questions
      .filter((q) => answers[q.id] !== q.answer)
      .map((q) => q.lesson),
  };
}
