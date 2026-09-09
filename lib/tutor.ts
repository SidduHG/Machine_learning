import type { Lesson } from './curriculum/types';
export type TutorReply = {
  matched: boolean;
  heading: string;
  passages: string[];
  formula?: string;
  code?: string;
  lessonIds: string[];
  sources: { title: string; url: string }[];
};
const stop = new Set(
  'a an the is are be can could would should do does did to of for in on at with and or i me my you your it this that please explain tell about what how why give show mean means'.split(
    ' ',
  ),
);
const aliases: Record<string, string[]> = {
  knn: ['nearest', 'neighbors'],
  svm: ['support', 'vector', 'machines'],
  mlp: ['neural', 'networks'],
  bayesian: ['bayes', 'probability'],
  overfitting: ['regularization'],
  overfit: ['regularization'],
  leakage: ['data', 'preparation'],
  learningrate: ['gradient', 'descent'],
  backprop: ['backpropagation', 'neural'],
  cnn: ['convolution'],
  rnn: ['sequences', 'recurrent'],
  llm: ['transformers', 'language'],
  rag: ['retrieval', 'generation'],
  lora: ['fine', 'tuning'],
  pca: ['principal', 'components'],
  mse: ['squared', 'error'],
  rmse: ['evaluation'],
  f1: ['evaluation'],
  drift: ['monitoring'],
  calibration: ['logistic', 'regression', 'evaluation'],
  pruning: ['decision', 'trees'],
  bootstrap: ['statistics', 'ensembles'],
};
function words(text: string) {
  const raw =
    text
      .toLowerCase()
      .replace(/learning rate/g, 'learningrate')
      .match(/[a-z0-9]+/g) ?? [];
  return [
    ...new Set(
      raw
        .filter((w) => !stop.has(w))
        .flatMap((w) => [w, ...(aliases[w] ?? [])]),
    ),
  ];
}
export function searchLessons(query: string, lessons: Lesson[], limit = 4) {
  const terms = words(query);
  if (!terms.length) return [];
  return lessons
    .map((l) => {
      const title = words(l.title + ' ' + l.id),
        intro = words(
          l.summary +
            ' ' +
            l.intuition.join(' ') +
            ' ' +
            (l.chapter?.sections.flatMap((s) => s.paragraphs).join(' ') ?? ''),
        );
      let score = terms.reduce(
        (n, t) => n + (title.includes(t) ? 8 : 0) + (intro.includes(t) ? 1 : 0),
        0,
      );
      if (query.toLowerCase().includes(l.id.replaceAll('-', ' '))) score += 20;
      return { lesson: l, score };
    })
    .filter((r) => r.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
export function answerQuestion(
  question: string,
  lessons: Lesson[],
  contextId?: string,
): TutorReply {
  const q = question.trim();
  if (!q || q.length > 1000)
    throw new Error('Ask a question between 1 and 1,000 characters.');
  const current = lessons.find((l) => l.id === contextId);
  if (
    /\b(attention|transformers?|neural networks?|deep learning|backpropagation|llms?)\b/i.test(
      q,
    )
  )
    return {
      matched: false,
      heading: 'Deep learning is outside this release.',
      passages: [
        'This course currently covers classical machine learning. Study regression, trees, ensembles, SVMs, clustering, evaluation and ML engineering here. Neural networks and deep learning are deferred.',
      ],
      lessonIds: [],
      sources: [],
    };
  const intent = /code|python|implement/i.test(q)
    ? 'code'
    : /math|equation|formula|deriv/i.test(q)
      ? 'math'
      : /example|numbers|worked/i.test(q)
        ? 'example'
        : /pitfall|mistake|wrong|fail|limitation/i.test(q)
          ? 'pitfalls'
          : /step|work|how/i.test(q)
            ? 'steps'
            : 'intuition';
  const generic =
    /^(explain (this|it|again)|how does (this|it) work|why|show (me )?(the )?(math|formula|code|example)|give (me )?(an? )?example|another example|what are the pitfalls|simplify this|quiz me|test me)[?.!\s]*$/i.test(
      q,
    );
  let matches = searchLessons(q, lessons);
  if (current && generic)
    matches = [
      { lesson: current, score: 99 },
      ...matches.filter((r) => r.lesson.id !== current.id),
    ];
  if (
    /loss.*(increas|explod|diverg)|learning rate.*(large|high)|overshoot/i.test(
      q,
    )
  ) {
    const gd = lessons.find((l) => l.id === 'gradient-descent');
    if (gd)
      matches = [
        { lesson: gd, score: 99 },
        ...matches.filter((r) => r.lesson.id !== gd.id),
      ];
  }
  if (!matches.length)
    return {
      matched: false,
      heading: 'I couldn’t find supporting course notes.',
      passages: [
        'I search the ML Atlas lessons and return relevant explanations, math, and examples. Try naming a topic such as gradient descent, PCA, attention, or data leakage. I cannot solve new problems or browse the web.',
      ],
      lessonIds: [],
      sources: [],
    };
  const l = matches[0].lesson;
  if (/quiz me|test me/i.test(q))
    return {
      matched: true,
      heading: l.title + ' · self-check',
      passages: [
        l.quiz.question,
        ...l.quiz.options.map((o, i) => String.fromCharCode(65 + i) + '. ' + o),
        'Open the lesson’s quick check to submit an answer and see feedback.',
      ],
      lessonIds: [l.id],
      sources: l.sources,
    };
  let passages: string[], formula: string | undefined, code: string | undefined;
  if (intent === 'code') {
    passages = [
      'This is the original Python example from the lesson. Open Practice to edit and run it.',
    ];
    code = l.code;
  } else if (intent === 'math') {
    passages = [l.symbols, ...l.example.steps];
    formula = l.formula;
  } else if (intent === 'example') {
    passages = [l.example.title + ': ' + l.example.body, ...l.example.steps];
  } else if (intent === 'pitfalls') {
    passages = l.pitfalls;
  } else if (intent === 'steps') {
    passages = [l.intuition[0], ...l.steps];
  } else {
    const terms = words(q);
    const section = l.chapter?.sections
      .map((s) => ({
        section: s,
        score: terms.reduce(
          (n, t) =>
            n +
            (words(s.title + ' ' + s.paragraphs.join(' ')).includes(t) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score)[0];
    passages =
      section && section.score > 0 ? section.section.paragraphs : l.intuition;
  }
  if (
    /loss.*(increas|explod|diverg)|overshoot/i.test(q) &&
    l.id === 'gradient-descent'
  )
    passages = [l.example.body, ...l.example.steps, l.pitfalls[1]];
  const compare =
    /versus|\bvs\b|difference between|compare/i.test(q) && matches.length > 1;
  if (compare) {
    const other = matches[1].lesson;
    passages = [
      l.title + ': ' + l.intuition[0],
      other.title + ': ' + other.intuition[0],
      'These are the two closest course explanations. Open each lesson for its assumptions, worked example, and limitations.',
    ];
  }
  return {
    matched: true,
    heading: compare ? 'Compare the course explanations' : l.title,
    passages,
    formula,
    code,
    lessonIds: matches.slice(0, compare ? 2 : 3).map((r) => r.lesson.id),
    sources: compare ? [...l.sources, ...matches[1].lesson.sources] : l.sources,
  };
}
