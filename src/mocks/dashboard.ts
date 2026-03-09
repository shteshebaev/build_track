import type { DashboardStats, ChartDataPoint, ProjectProgressData } from '@shared/types'

export const mockDashboardStats: DashboardStats = {
  totalProjects: 6,
  projectsTrend: 20,
  warehouseValue: 2850000000,
  warehouseTrend: 8.5,
  materialsUsed: 1250000000,
  materialsTrend: -5.2,
  activeRequests: 12,
  requestsTrend: 15,
  avgProgress: 52.5,
  progressTrend: 8,
  salesRevenue: 45000000000,
  salesTrend: 25.3,
}

export const mockConstructionProgressData: ChartDataPoint[] = [
  { date: '2024-07', value: 35, label: 'Июль' },
  { date: '2024-08', value: 42, label: 'Август' },
  { date: '2024-09', value: 48, label: 'Сентябрь' },
  { date: '2024-10', value: 55, label: 'Октябрь' },
  { date: '2024-11', value: 62, label: 'Ноябрь' },
  { date: '2024-12', value: 68, label: 'Декабрь' },
]

export const mockMaterialUsageData: ChartDataPoint[] = [
  { date: 'Бетон', value: 450000000 },
  { date: 'Металл', value: 380000000 },
  { date: 'Кирпич', value: 180000000 },
  { date: 'Отделочные', value: 120000000 },
  { date: 'Электрика', value: 75000000 },
  { date: 'Сантехника', value: 45000000 },
]

export const mockProcurementData: ChartDataPoint[] = [
  { date: '2024-07', value: 180000000 },
  { date: '2024-08', value: 220000000 },
  { date: '2024-09', value: 195000000 },
  { date: '2024-10', value: 280000000 },
  { date: '2024-11', value: 250000000 },
  { date: '2024-12', value: 310000000 },
]

export const mockProjectsProgressData: ProjectProgressData[] = [
  { projectId: '1', projectName: 'ЖК "Солнечный"', planned: 72, actual: 68 },
  { projectId: '2', projectName: 'БЦ "Технопарк"', planned: 35, actual: 32 },
  { projectId: '3', projectName: 'ЖК "Зелёный квартал"', planned: 95, actual: 92 },
  { projectId: '4', projectName: 'ТЦ "Мега Молл"', planned: 18, actual: 15 },
]

export const mockProjectStatusData = [
  { status: 'В процессе', count: 4, color: '#4F46E5' },
  { status: 'Планирование', count: 1, color: '#3B82F6' },
  { status: 'Завершён', count: 1, color: '#10B981' },
]

export const mockRecentActivity: Array<{
  id: string
  type: string
  title: string
  description: string
  time: string
  status: 'success' | 'warning' | 'info' | 'error'
}> = [
  {
    id: '1',
    type: 'request_approved',
    title: 'Заявка #1234 одобрена',
    description: 'Заявка на материалы для ЖК "Солнечный"',
    time: '5 минут назад',
    status: 'success',
  },
  {
    id: '2',
    type: 'low_stock',
    title: 'Низкий остаток',
    description: 'Цемент М400 - осталось 25 тонн',
    time: '1 час назад',
    status: 'warning',
  },
  {
    id: '3',
    type: 'delivery',
    title: 'Поставка получена',
    description: 'Арматура А500 - 15 тонн',
    time: '2 часа назад',
    status: 'info',
  },
  {
    id: '4',
    type: 'progress_update',
    title: 'Обновлён прогресс',
    description: 'ЖК "Зелёный квартал" - 92%',
    time: '3 часа назад',
    status: 'success',
  },
  {
    id: '5',
    type: 'new_request',
    title: 'Новая заявка #1235',
    description: 'Запрос материалов для БЦ "Технопарк"',
    time: '4 часа назад',
    status: 'info',
  },
]
