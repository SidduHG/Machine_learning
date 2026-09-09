import type { Lesson } from './curriculum/types';
import { getChapter } from './chapters';
import library from './reading-library.json';
import practicalExamples from './practical-examples.json';
export function lessonMarkdown(l: Lesson) {
  const c = getChapter(l.id);
  const practical = practicalExamples.find((example) => example.id === l.id);
  const numbered = (items: string[]) =>
    items.map((s, i) => `${i + 1}. ${s}`).join('\n');
  const parts = [
    `# ${l.title}`,
    l.summary,
    c
      ? `## Learning objectives\n\n${c.objectives.map((o) => '- ' + o).join('\n')}`
      : '',
    `## Theory\n\n${l.intuition.join('\n\n')}`,
    c
      ? c.sections
          .map((s) => `### ${s.title}\n\n${s.paragraphs.join('\n\n')}`)
          .join('\n\n')
      : '',
    `## Procedure\n\n${numbered(l.steps)}`,
    `## Mathematical explanation\n\n$$\n${l.formula}\n$$\n\n${l.symbols}`,
    c
      ? `### ${c.derivation.title}\n\n${c.derivation.steps.map((s, i) => `Step ${i + 1}. ${s.explanation}\n\n$$\n${s.formula}\n$$`).join('\n\n')}`
      : '',
    `## Worked example: ${l.example.title}\n\n${l.example.body}\n\n${numbered(l.example.steps)}`,
    `## Python implementation\n\n\`\`\`python\n${l.code}\n\`\`\``,
    practical
      ? `### ${practical.title}\n\n${practical.environment}\n\n\`\`\`python\n${practical.code}\n\`\`\`\n\nExperiment: ${practical.experiment}`
      : '',
    l.lab ? `Interactive lab: /labs?lab=${l.lab}` : '',
    c
      ? `## Real-world application: ${c.caseStudy.title}\n\n${c.caseStudy.scenario}\n\n${numbered(c.caseStudy.decisions)}\n\nExpected deliverable: ${c.caseStudy.success}`
      : '',
    `## Limitations\n\n${l.pitfalls.map((p) => '- ' + p).join('\n')}`,
    `## Exercises\n\n${l.exercise}\n\nSolution: ${l.solution}`,
    c
      ? c.problems
          .map(
            (p, i) =>
              `### Exercise ${i + 2}\n\n${p.question}\n\nHint: ${p.hint}\n\n${numbered(p.solution)}`,
          )
          .join('\n\n')
      : '',
    c
      ? `## Guided reading\n\n${c.reading
          .map((r) => {
            const source = library.find((s) => s.id === r.resource);
            return `[${source?.title ?? r.resource}](${source?.url ?? ''})\n\nRead: ${r.focus}\n\nApply: ${r.task}`;
          })
          .join('\n\n')}`
      : '',
    `## Technical references\n\n${l.sources.map((s) => `- [${s.title}](${s.url})`).join('\n')}`,
    'Original ML Atlas notes. CC BY 4.0. External resources retain their own licenses.',
  ];
  return parts.filter(Boolean).join('\n\n') + '\n';
}
