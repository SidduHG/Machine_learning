# ML Atlas

An open machine learning school: understand the concept, inspect the math, change an experiment, run Python, and build a project.

**Website:** [ML Atlas](https://ml-atlas-siddu.sidduabd41.chatgpt.site) · **Source:** [SidduHG/Machine_learning](https://github.com/SidduHG/Machine_learning)

## What learners get

- **30 detailed chapters in six modules:** Python/data, mathematics, supervised learning, model families, unsupervised learning, and ML engineering. Each has intuition, equations, a worked example, Python, pitfalls, an exercise, a quiz and primary references.
- **Seven interactive labs:** regression, gradient descent, logistic classification, nearest neighbors, decision trees, k-means and PCA. Live Three.js views show regression loss surfaces and 3D clustering; every lab includes readable numerical results.
- **Python practice:** edit and run the lesson examples in a dedicated browser worker, stop execution, and download scripts.
- **Four project notebooks:** tabular regression, multiclass classification, classical digit classifiers and a clustering audit, with baselines, evaluation and extension rubrics.
- **Local learning tools:** completion, quizzes, bookmarks, personal notes and JSON backup/import. Markdown lesson downloads and print styles support offline study.
- **Ask Atlas:** a contextual course-search assistant that returns original explanations, equations, code, examples and references. It is explicitly **not a generative LLM** and does not solve arbitrary new problems.

All learning routes are public. No paid account, database or API key is needed. Progress belongs to the current browser; export it before clearing site data or moving devices.

Additional learning tools include a **30-question intermediate/advanced assessment** with saved attempts and per-option explanations, plus **13 complete scikit-learn implementations** alongside the standard-library calculations. Deep learning is deferred.

## Technology

React 19 + TypeScript, Next.js-compatible App Router through Vinext, Tailwind CSS, Shadcn/Base UI, Three.js/React Three Fiber, KaTeX and Pyodide. Sites deploys the app as a Cloudflare Worker. Vinext is beta; the app uses standard React and App Router patterns to keep migration feasible. Algorithm geometry is calculated live, so it does not need Blender assets.

The curriculum is versioned JSON with original prose and linked primary sources, including ISLP, Inria, Stanford CS229, StatQuest, scikit-learn, NumPy, pandas and original research papers. It is a broad practical path, not an exhaustive research library or a promise of employment.

## Run locally

Use **Node 24.13.0** and npm 11.6.2 to match CI. Python 3.12+ is needed only for native example/project verification.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Routes: `/`, `/learn`, `/learn/<lesson-id>`, `/labs?lab=<lab-id>`, `/practice`, `/progress`, `/resources`.

```sh
npm run typecheck
npm run lint
npm test
python tests/verify_examples.py
python -m pip install -r requirements-dev.txt
python tests/verify_projects.py
python tests/verify_practical.py
npm run build
npm start
```

The production preview uses Wrangler; use its printed local URL. `npm audit` checks dependency advisories. CI validates types, lint, behavior, every lesson example, all project notebooks and the production build.

## Content and projects

`lib/curriculum/*.json` contains the typed lessons; `lib/algorithms.ts` contains independent numerical functions. `lib/projects.json` is the project source. After changing it, run `node scripts/generate-notebooks.mjs` to regenerate `public/notebooks/*.ipynb` and then verify the projects. Keep explanations specific, cite primary references, and test numerical invariants rather than screenshots of formulas.

## Privacy and limitations

The app adds no analytics, advertising or identity requirement. Hosts may retain access logs. Ask Atlas questions remain in memory and clear when its panel closes. Python runs in a worker on the learner's machine after downloading Pyodide from jsDelivr; its first load requires internet and can take up to 90 seconds. Do not run untrusted Python: browser code can still make network requests available to that origin. Long runs can be stopped; the runner does not support arbitrary pip packages. Full scikit-learn projects run in Jupyter or another Python environment.

WebGL is optional; 2D projections and text remain available. 3D code loads on demand. Animations respect reduced-motion preferences. Optional WebMCP tools expose course search, completion read-back and explicit completion updates in supporting browsers; normal use does not depend on this experimental API.

## Delivery and hosting

Read [AGENTS.md](AGENTS.md), the [six-feature roadmap](docs/roadmap.md), and each feature's `feature.md` and `plan.md` before development. Start each feature from current `main`; test, commit, open a PR to `main`, and merge only within the owner's authorization.

The Sites identity is in `.openai/hosting.json`. Build the tested source, push that exact commit to the Sites source repository with an ephemeral credential, package through the Sites hosting helper, save the version, deploy to the owner-authorized public audience, and verify terminal deployment success plus unauthenticated HTTP access. Keep credentials and archives out of Git. See [release verification](docs/release-quality/verification.md).

## License

Application and example code: [MIT](LICENSE). Original educational prose: [CC BY 4.0](CONTENT_LICENSE.md). Linked publications, datasets, libraries and fonts retain their own licenses. Report corrections through [GitHub issues](https://github.com/SidduHG/Machine_learning/issues).
