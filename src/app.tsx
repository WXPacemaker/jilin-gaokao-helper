import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import ScorePage from '@/pages/ScorePage/ScorePage';
import RecommendPage from '@/pages/RecommendPage/RecommendPage';
import GuidePage from '@/pages/GuidePage/GuidePage';
import SubjectMajorPage from '@/pages/SubjectMajorPage/SubjectMajorPage';
import SpecialAdmissionPage from '@/pages/SpecialAdmissionPage/SpecialAdmissionPage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="score" element={<ScorePage />} />
        <Route path="recommend" element={<RecommendPage />} />
        <Route path="subject-major" element={<SubjectMajorPage />} />
        <Route path="special" element={<SpecialAdmissionPage />} />
        <Route path="guide" element={<GuidePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
