export interface BudgetData {
  month: string
  planned: number
  actual: number
}

export interface ProgressData {
  month: string
  planned: number
  actual: number
}

export interface CostBreakdown {
  category: string
  value: number
  color: string
}

export interface ResourceUsage {
  resource: string
  planned: number
  actual: number
  unit: string
}

export interface RiskItem {
  id: string
  title: string
  category: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  status: 'active' | 'mitigated' | 'closed'
  description: string
}

export interface KPIMetric {
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

export const mockBudgetData: BudgetData[] = [
  { month: 'Янв', planned: 150, actual: 145 },
  { month: 'Фев', planned: 280, actual: 295 },
  { month: 'Мар', planned: 420, actual: 410 },
  { month: 'Апр', planned: 580, actual: 620 },
  { month: 'Май', planned: 750, actual: 780 },
  { month: 'Июн', planned: 920, actual: 950 },
  { month: 'Июл', planned: 1100, actual: 1120 },
  { month: 'Авг', planned: 1300, actual: 1350 },
  { month: 'Сен', planned: 1520, actual: 1580 },
  { month: 'Окт', planned: 1750, actual: 1820 },
  { month: 'Ноя', planned: 2000, actual: 2100 },
  { month: 'Дек', planned: 2280, actual: 2180 },
]

export const mockProgressData: ProgressData[] = [
  { month: 'Янв', planned: 5, actual: 5 },
  { month: 'Фев', planned: 12, actual: 11 },
  { month: 'Мар', planned: 20, actual: 18 },
  { month: 'Апр', planned: 28, actual: 26 },
  { month: 'Май', planned: 38, actual: 35 },
  { month: 'Июн', planned: 48, actual: 46 },
  { month: 'Июл', planned: 58, actual: 55 },
  { month: 'Авг', planned: 68, actual: 64 },
  { month: 'Сен', planned: 76, actual: 72 },
  { month: 'Окт', planned: 84, actual: 78 },
  { month: 'Ноя', planned: 92, actual: 85 },
  { month: 'Дек', planned: 100, actual: 52.5 },
]

export const mockCostBreakdown: CostBreakdown[] = [
  { category: 'Материалы', value: 42, color: '#4F46E5' },
  { category: 'Работы', value: 35, color: '#10B981' },
  { category: 'Оборудование', value: 12, color: '#F59E0B' },
  { category: 'Проектирование', value: 6, color: '#3B82F6' },
  { category: 'Прочее', value: 5, color: '#6B7280' },
]

export const mockResourceUsage: ResourceUsage[] = [
  { resource: 'Бетон', planned: 5880, actual: 5420, unit: 'м³' },
  { resource: 'Арматура', planned: 1593, actual: 1480, unit: 'т' },
  { resource: 'Кирпич', planned: 120, actual: 85, unit: 'тыс. шт.' },
  { resource: 'Утеплитель', planned: 14500, actual: 12100, unit: 'м²' },
  { resource: 'Кабель', planned: 85, actual: 52, unit: 'км' },
]

export const mockRisks: RiskItem[] = [
  {
    id: 'r1',
    title: 'Задержка поставки окон',
    category: 'Поставки',
    probability: 'medium',
    impact: 'high',
    status: 'active',
    description: 'Возможная задержка поставки оконных блоков на 2-3 недели',
  },
  {
    id: 'r2',
    title: 'Рост цен на металл',
    category: 'Финансы',
    probability: 'high',
    impact: 'medium',
    status: 'active',
    description: 'Прогнозируемый рост цен на арматуру до 15%',
  },
  {
    id: 'r3',
    title: 'Нехватка квалифицированных сварщиков',
    category: 'Персонал',
    probability: 'low',
    impact: 'medium',
    status: 'mitigated',
    description: 'Дефицит специалистов в регионе',
  },
  {
    id: 'r4',
    title: 'Погодные условия',
    category: 'Внешние факторы',
    probability: 'medium',
    impact: 'low',
    status: 'active',
    description: 'Возможные задержки из-за неблагоприятных погодных условий',
  },
]

export const mockKPIs: KPIMetric[] = [
  { name: 'SPI (Schedule Performance Index)', value: 0.94, target: 1.0, unit: '', trend: 'down', trendValue: -3 },
  { name: 'CPI (Cost Performance Index)', value: 0.97, target: 1.0, unit: '', trend: 'up', trendValue: 2 },
  { name: 'Производительность труда', value: 2.4, target: 2.5, unit: 'м²/чел.день', trend: 'up', trendValue: 5 },
  { name: 'Качество работ', value: 98.2, target: 95, unit: '%', trend: 'stable', trendValue: 0 },
]

export const mockMonthlyExpenses = [
  { month: 'Янв', materials: 85, labor: 45, equipment: 15, other: 5 },
  { month: 'Фев', materials: 120, labor: 65, equipment: 25, other: 8 },
  { month: 'Мар', materials: 95, labor: 70, equipment: 18, other: 12 },
  { month: 'Апр', materials: 180, labor: 95, equipment: 35, other: 15 },
  { month: 'Май', materials: 145, labor: 85, equipment: 28, other: 10 },
  { month: 'Июн', materials: 160, labor: 90, equipment: 32, other: 18 },
  { month: 'Июл', materials: 130, labor: 78, equipment: 22, other: 14 },
  { month: 'Авг', materials: 175, labor: 105, equipment: 40, other: 20 },
  { month: 'Сен', materials: 190, labor: 115, equipment: 45, other: 22 },
  { month: 'Окт', materials: 165, labor: 98, equipment: 38, other: 19 },
]

export const mockWorkforceData = [
  { month: 'Янв', workers: 45, planned: 50 },
  { month: 'Фев', workers: 62, planned: 60 },
  { month: 'Мар', workers: 78, planned: 75 },
  { month: 'Апр', workers: 95, planned: 100 },
  { month: 'Май', workers: 112, planned: 110 },
  { month: 'Июн', workers: 125, planned: 120 },
  { month: 'Июл', workers: 118, planned: 125 },
  { month: 'Авг', workers: 132, planned: 130 },
  { month: 'Сен', workers: 145, planned: 140 },
  { month: 'Окт', workers: 138, planned: 145 },
]
