import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const projects = JSON.parse(
  readFileSync(new URL('../lib/projects.json', import.meta.url), 'utf8'),
);
const dir = new URL('../public/notebooks/', import.meta.url);
mkdirSync(dir, { recursive: true });
for (const p of projects) {
  const markdown = (text) => ({
    cell_type: 'markdown',
    metadata: {},
    source: text.split(/(?<=\n)/),
  });
  const notebook = {
    cells: [
      markdown(
        `# ${p.title}\n\n${p.brief}\n\nDataset: ${p.dataset}\n\nReference: ${p.source}\n\nOriginal ML Atlas notebook, MIT-licensed code and CC BY 4.0 explanation. Third-party data retains its own license.\n`,
      ),
      markdown(
        '## Environment\n\nRun in Jupyter or Colab. For the scikit-learn projects, install scikit-learn >=1.4 and its dependencies in your own environment. No GPU is needed.\n',
      ),
      markdown(
        '## Plan\n\n' + p.steps.map((s, i) => `${i + 1}. ${s}\n`).join(''),
      ),
      {
        cell_type: 'code',
        execution_count: null,
        metadata: {},
        outputs: [],
        source: p.code.split(/(?<=\n)/),
      },
      markdown(
        '## Review the result\n\n' +
          p.rubric.map((s) => `- [ ] ${s}\n`).join(''),
      ),
      markdown(
        '## Extend it\n\n' +
          p.extension +
          '\n\nRecord what changed, why, and how you evaluated it.\n',
      ),
    ],
    metadata: {
      kernelspec: {
        display_name: 'Python 3',
        language: 'python',
        name: 'python3',
      },
      language_info: { name: 'python' },
    },
    nbformat: 4,
    nbformat_minor: 5,
  };
  notebook.cells.forEach((cell, index) => {
    cell.id = p.id + '-' + index;
  });
  writeFileSync(
    new URL(p.id + '.ipynb', dir),
    JSON.stringify(notebook, null, 2),
  );
}
console.log(`Generated ${projects.length} runnable project notebooks.`);
