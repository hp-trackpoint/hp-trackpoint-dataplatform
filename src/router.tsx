import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/index';
import HomePage from './pages/HomePage';
import AppCrashAnalysisPage from './pages/AppCrashAnalysisPage';
import EventAnalysisPage from './pages/EventAnalysisPage';
import TrendAnalysisPage from './pages/TrendAnalysisPage';
import UserAnalysisPage from './pages/UserAnalysisPage';
import VisitAnalysisPage from './pages/VisitAnalysisPage';
import VisitorAnalysisPage from './pages/VisitorAnalysisPage';
import NotFoundPage from './pages/NotFound';
import TrackPointLayout from './layouts/TrackPointLayout';
import PageTrackPointManagePage from './pages/PageTrackPointManagePage';
import ModuleTrackPointManagePage from './pages/ModuleTrackPointManagePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'appcrash', element: <AppCrashAnalysisPage /> },
      { path: 'eventanalysis', element: <EventAnalysisPage /> },
      { path: 'trendanalysis', element: <TrendAnalysisPage /> },
      { path: 'useranalysis', element: <UserAnalysisPage /> },
      { path: 'visitanalysis', element: <VisitAnalysisPage /> },
      { path: 'visitoranalysis', element: <VisitorAnalysisPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/manage',
    element: <TrackPointLayout />,
    children: [
      { path: 'pagemanage', element: <PageTrackPointManagePage /> },
      { path: 'modulemanage', element: <ModuleTrackPointManagePage /> },
    ],
  }
]);
