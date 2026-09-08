# ML Atlas: six-feature delivery plan

## Product
An open, practical path into machine learning and AI engineering. A learner should be able to understand a concept, inspect its math, change a live experiment, run a small example, and build a project. No sign-in wall. Progress remains on the learner's device with export/import.

## Technology
React 19 and TypeScript, Next.js-compatible App Router through Vinext on Cloudflare Workers/Sites, Tailwind CSS and accessible Shadcn/Base UI primitives. React Three Fiber/Three.js provide live 3D; KaTeX renders equations. A Web Worker runs Python through Pyodide when requested. Node's test runner covers pure numerical and content behavior. Original structured content is committed with the app, reviewed and versioned alongside code.

Vinext is the deployment platform's scaffold and is beta; retain portability through standard React and App Router APIs. Interactive geometry uses browser calculations, so Blender is unnecessary. Authentication is unnecessary for the public-first experience. A transparent local retrieval tutor works without paid API credentials; generative chat is a separately documented integration.

## Delivery order
1. [Foundation and animated homepage](./foundation/feature.md) — branch feature/foundation
2. [Curriculum and lesson reader](./curriculum/feature.md) — branch feature/curriculum
3. [Interactive algorithm labs](./algorithm-labs/feature.md) — branch feature/algorithm-labs
4. [Practice, projects, and local progress](./practice-progress/feature.md) — branch feature/practice-progress
5. [Lesson-aware study assistant](./study-assistant/feature.md) — branch feature/study-assistant
6. [Release quality and public deployment](./release-quality/feature.md) — branch feature/release-quality

## Content scope
Foundations: Python, arrays/dataframes, linear algebra, calculus, probability, statistics, data preparation. Classical learning: problem framing, regression, optimization, regularization, classification, neighbors, Bayes, trees/ensembles, SVM, clustering, PCA, anomaly detection, evaluation, tuning. Deep learning: tensors/autograd, networks/backprop, optimization, CNNs, sequence models, attention/transformers. Engineering: embeddings/RAG, fine-tuning, deployment, testing/monitoring, responsible ML and portfolio work. Broad coverage is a curriculum, not a claim to cover every research topic or guarantee employment.

## Content provenance
Write original explanations and examples; link to primary documentation for further study. Sources include scikit-learn, NumPy, pandas, PyTorch, Google ML education, original papers and Dive into Deep Learning. Do not copy third-party course prose or imply endorsement.

## Definition of release
All six PRs merged, lesson/lab/practice/tutor flows implemented, validation passes, documented limitations, and an accessible deployment link. No fake learner counts, fabricated testimonials or unsupported completion guarantees.

