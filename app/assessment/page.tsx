import type { Metadata } from 'next';
import { CourseAssessment } from '@/components/course-assessment';
export const metadata: Metadata = { title: 'Machine learning assessment' };
export default function AssessmentPage() {
  return (
    <main id="main" className="wrap assessment-page">
      <header className="assessment-head">
        <div className="eyebrow">COURSE ASSESSMENT</div>
        <h1>Test your machine learning understanding</h1>
        <p>
          30 intermediate and advanced questions on calculations, assumptions,
          evaluation and practical decisions. Choose one answer per question.
          Suggested time: 45–60 minutes.
        </p>
      </header>
      <CourseAssessment />
    </main>
  );
}
