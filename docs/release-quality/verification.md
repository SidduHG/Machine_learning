# Release verification

## Release scope

ML Atlas publishes 30 classical machine learning chapters across six modules, seven interactive algorithm labs, 13 complete scikit-learn examples, four executable project notebooks, and a 30-question assessment with explanations for every answer choice. Deep learning material is deferred outside the published curriculum.

The reader follows theory, mathematics, worked example, Python, visualization, real-world application, exercises, and references. It includes chapter navigation, section tracking, reading progress, syntax highlighting, downloadable notes, and responsive layouts.

## Checks performed

- TypeScript type checking and authored-code lint pass.
- All 27 Node tests pass: numerical invariants, content and equation validation, chapter prerequisites, assessment grading and persistence validation, learning progress, worker lifecycle, study tools, and course retrieval.
- All 30 standard-library lesson programs execute successfully in native Python.
- All 13 downloadable scikit-learn programs execute successfully; their contents match the displayed examples.
- All four project programs execute successfully; notebook code matches the project definitions.
- The production build succeeds. The optional Three.js visualization bundle produces a size warning and is loaded on demand.
- The production HTTP smoke test verifies 57 pages and assets return 200 without authentication, with unknown and deferred lesson routes returning 404.
- The dependency audit reports zero known production vulnerabilities at release validation. Dependencies and the lockfile are pinned together; the CI workflow uses Node 24.13.0 and Python 3.12.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
python tests/verify_examples.py
python -m pip install -r requirements-dev.txt
python tests/verify_projects.py
python tests/verify_practical.py
npm run build
npm start -- --port 4173
# In another terminal:
node tests/smoke-routes.mjs http://127.0.0.1:4173
```

## Public deployment

Release URL: [ML Atlas](https://ml-atlas-siddu.sidduabd41.chatgpt.site).

The release procedure pushes the tested GitHub main source to the existing Sites source repository, packages its production output, saves that exact full commit SHA, and publishes with public access. A release handoff requires a terminal successful deployment and a repeat of the unauthenticated HTTP smoke test against the returned URL. Deployment status and the exact URL are also reported in the release handoff.

## Content and verification boundaries

Original explanations and examples are accompanied by links and guided reading tasks for ISLP, Stanford CS229, Google's Machine Learning Crash Course, the Inria scikit-learn course, official Python/NumPy/pandas/scikit-learn documentation, and foundational papers. The resource page links specific videos from StatQuest's official index. Third-party books and video transcripts are not republished.

The assistant performs local course retrieval; it is not a generative model. Progress and assessment answers are stored on the current device. Browser Python loads Pyodide from a CDN on request; no course question or code is sent to an inference API.

Automated HTTP and contract checks do not constitute visual browser QA. WebMCP was unavailable in the inspected browser context, so its real browser integration remains unverified; its tool contracts pass unit tests. The actual browser Pyodide execution was not conclusively verified in this run; worker lifecycle tests and native Python execution pass. Screen-reader, cross-browser, and device testing remain useful release follow-up work.
