export type Chapter = {
  id: string;
  objectives: string[];
  prerequisites: string[];
  sections: { title: string; paragraphs: string[] }[];
  derivation: {
    title: string;
    steps: { explanation: string; formula: string }[];
  };
  caseStudy: {
    title: string;
    scenario: string;
    decisions: string[];
    success: string;
  };
  problems: { question: string; hint: string; solution: string[] }[];
  reading: { resource: string; focus: string; task: string }[];
};
