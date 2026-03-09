import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout, LoadingState } from '@shared/ui'

// Lazy load pages
const Dashboard = lazy(() => import('@pages/Dashboard'))
const Projects = lazy(() => import('@pages/Projects'))
const ProjectDetail = lazy(() => import('@pages/Projects/ProjectDetail'))
const Materials = lazy(() => import('@pages/Materials'))
const Warehouse = lazy(() => import('@pages/Warehouse'))
const Requests = lazy(() => import('@pages/Requests'))
const Procurement = lazy(() => import('@pages/Procurement'))
const Suppliers = lazy(() => import('@pages/Suppliers'))
const ConstructionProgress = lazy(() => import('@pages/ConstructionProgress'))
const Sales = lazy(() => import('@pages/Sales'))
const Reports = lazy(() => import('@pages/Reports'))
const MapView = lazy(() => import('@pages/MapView'))
const Cameras = lazy(() => import('@pages/Cameras'))
const PhotoReports = lazy(() => import('@pages/PhotoReports'))
const Documents = lazy(() => import('@pages/Documents'))
const Estimates = lazy(() => import('@pages/Estimates'))
const Users = lazy(() => import('@pages/Users'))
const Settings = lazy(() => import('@pages/Settings'))

function PageLoader() {
  return <LoadingState text="Загрузка страницы..." />
}

export function AppRouter() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/estimates" element={<Estimates />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/construction-progress" element={<ConstructionProgress />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/photo-reports" element={<PhotoReports />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </AppLayout>
  )
}
