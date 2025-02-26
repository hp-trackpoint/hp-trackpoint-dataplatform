import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/index';
import HomePage from './pages/HomePage';
import AppCrashAnalysisPage from './pages/AppCrashAnalysisPage';
import EventAnalysisPage from './pages/EventAnalysisPage';
import TrendAnalysisPage from './pages/TrendAnalysisPage';
import UserAnalysisPage from './pages/UserAnalysis/UserAnalysisPage';
import NotFoundPage from './pages/NotFound';
import TrackPointLayout from './layouts/TrackPointLayout';
import PageTrackPointManagePage from './pages/PageTrackPointManagePage';
import ModuleTrackPointManagePage from './pages/ModuleTrackPointManagePage';
import RegionalAnalysisPage from './pages/RegionalAnalysis';
import EntrancePage from './pages/EntrancePage/EntrancePage';
import VisitedPage from './pages/VisitedPage/VisitedPage';
import PerformanceAnalysisPage from './pages/PerformanceAnalysis';
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
      { path: 'visitanalysis', element: <NotFoundPage /> },
      {
        path: 'visitoranalysis',
        children: [
          { path: 'regionalanalysis', element: <RegionalAnalysisPage /> },

          { path: 'useranalysis', element: <UserAnalysisPage /> },
        ],
      },
      {
        path: 'visitanalysis',
        children: [
          { path: 'visited', element: <VisitedPage /> },
          { path: 'entrance', element: <EntrancePage /> },
        ],
      },
      { path: 'performanceanalysis', element: <PerformanceAnalysisPage /> },
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
  },
]);
