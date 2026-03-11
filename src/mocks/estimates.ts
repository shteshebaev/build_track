export interface EstimateItem {
  id: string
  name: string
  unit: string
  quantity: number
  unitPrice: number
  totalPrice: number
  category: 'work' | 'material' | 'equipment' | 'other'
}

export interface EstimateSection {
  id: string
  name: string
  items: EstimateItem[]
  totalPlanned: number
  totalActual: number
}

export interface ProjectEstimate {
  id: string
  name: string
  number: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'revision'
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
  totalPlanned: number
  totalActual: number
  sections: EstimateSection[]
  description?: string
  stage: string
}

export const mockProjectEstimates: ProjectEstimate[] = [
  {
    id: 'est-1',
    name: 'Смета на земляные работы и фундамент',
    number: 'СМ-2024-001',
    status: 'approved',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-10',
    approvedAt: '2024-02-15',
    approvedBy: 'Козлов А.К.',
    totalPlanned: 450000000,
    totalActual: 480000000,
    stage: 'Земляные работы и фундамент',
    description: 'Смета включает все работы по устройству котлована, свайного поля и монолитной плиты фундамента',
    sections: [
      {
        id: 'sec-1-1',
        name: 'Земляные работы',
        totalPlanned: 85000000,
        totalActual: 82000000,
        items: [
          { id: 'item-1', name: 'Разработка грунта экскаватором', unit: 'м³', quantity: 12500, unitPrice: 4500, totalPrice: 56250000, category: 'work' },
          { id: 'item-2', name: 'Вывоз грунта', unit: 'м³', quantity: 12500, unitPrice: 1800, totalPrice: 22500000, category: 'work' },
          { id: 'item-3', name: 'Планировка дна котлована', unit: 'м²', quantity: 2800, unitPrice: 350, totalPrice: 980000, category: 'work' },
          { id: 'item-4', name: 'Устройство водоотлива', unit: 'компл.', quantity: 1, unitPrice: 5270000, totalPrice: 5270000, category: 'work' },
        ],
      },
      {
        id: 'sec-1-2',
        name: 'Свайные работы',
        totalPlanned: 180000000,
        totalActual: 195000000,
        items: [
          { id: 'item-5', name: 'Буронабивные сваи Ø600мм', unit: 'шт.', quantity: 156, unitPrice: 850000, totalPrice: 132600000, category: 'work' },
          { id: 'item-6', name: 'Арматурные каркасы свай', unit: 'т', quantity: 78, unitPrice: 95000, totalPrice: 7410000, category: 'material' },
          { id: 'item-7', name: 'Бетон М400', unit: 'м³', quantity: 420, unitPrice: 85000, totalPrice: 35700000, category: 'material' },
          { id: 'item-8', name: 'Испытание свай', unit: 'шт.', quantity: 12, unitPrice: 1607500, totalPrice: 19290000, category: 'work' },
        ],
      },
      {
        id: 'sec-1-3',
        name: 'Монолитная плита',
        totalPlanned: 185000000,
        totalActual: 203000000,
        items: [
          { id: 'item-9', name: 'Опалубка', unit: 'м²', quantity: 2800, unitPrice: 12000, totalPrice: 33600000, category: 'material' },
          { id: 'item-10', name: 'Арматура А500С', unit: 'т', quantity: 245, unitPrice: 92000, totalPrice: 22540000, category: 'material' },
          { id: 'item-11', name: 'Бетон М350', unit: 'м³', quantity: 1680, unitPrice: 78000, totalPrice: 131040000, category: 'material' },
          { id: 'item-12', name: 'Работы по бетонированию', unit: 'м³', quantity: 1680, unitPrice: 9500, totalPrice: 15960000, category: 'work' },
        ],
      },
    ],
  },
  {
    id: 'est-2',
    name: 'Смета на возведение каркаса',
    number: 'СМ-2024-002',
    status: 'approved',
    createdAt: '2024-04-15',
    updatedAt: '2024-04-28',
    approvedAt: '2024-05-01',
    approvedBy: 'Козлов А.К.',
    totalPlanned: 1200000000,
    totalActual: 1180000000,
    stage: 'Возведение каркаса',
    description: 'Смета на монолитные работы по возведению 16-этажного каркаса здания',
    sections: [
      {
        id: 'sec-2-1',
        name: 'Монолитные колонны',
        totalPlanned: 320000000,
        totalActual: 312000000,
        items: [
          { id: 'item-13', name: 'Опалубка колонн', unit: 'м²', quantity: 8500, unitPrice: 15000, totalPrice: 127500000, category: 'material' },
          { id: 'item-14', name: 'Арматура колонн', unit: 'т', quantity: 380, unitPrice: 94000, totalPrice: 35720000, category: 'material' },
          { id: 'item-15', name: 'Бетон М400', unit: 'м³', quantity: 1450, unitPrice: 86000, totalPrice: 124700000, category: 'material' },
          { id: 'item-16', name: 'Работы', unit: 'м³', quantity: 1450, unitPrice: 22000, totalPrice: 31900000, category: 'work' },
        ],
      },
      {
        id: 'sec-2-2',
        name: 'Монолитные перекрытия',
        totalPlanned: 580000000,
        totalActual: 568000000,
        items: [
          { id: 'item-17', name: 'Опалубка перекрытий', unit: 'м²', quantity: 28000, unitPrice: 8500, totalPrice: 238000000, category: 'material' },
          { id: 'item-18', name: 'Арматура перекрытий', unit: 'т', quantity: 890, unitPrice: 93000, totalPrice: 82770000, category: 'material' },
          { id: 'item-19', name: 'Бетон М300', unit: 'м³', quantity: 4200, unitPrice: 75000, totalPrice: 315000000, category: 'material' },
          { id: 'item-20', name: 'Работы', unit: 'м³', quantity: 4200, unitPrice: 18000, totalPrice: 75600000, category: 'work' },
        ],
      },
      {
        id: 'sec-2-3',
        name: 'Лестницы и шахты',
        totalPlanned: 300000000,
        totalActual: 300000000,
        items: [
          { id: 'item-21', name: 'Лестничные марши', unit: 'шт.', quantity: 64, unitPrice: 2800000, totalPrice: 179200000, category: 'material' },
          { id: 'item-22', name: 'Монтаж лестниц', unit: 'шт.', quantity: 64, unitPrice: 450000, totalPrice: 28800000, category: 'work' },
          { id: 'item-23', name: 'Стены лифтовых шахт', unit: 'м³', quantity: 680, unitPrice: 135000, totalPrice: 91800000, category: 'work' },
        ],
      },
    ],
  },
  {
    id: 'est-3',
    name: 'Смета на инженерные системы',
    number: 'СМ-2024-003',
    status: 'approved',
    createdAt: '2024-07-20',
    updatedAt: '2024-08-05',
    approvedAt: '2024-08-10',
    approvedBy: 'Петров И.С.',
    totalPlanned: 800000000,
    totalActual: 520000000,
    stage: 'Инженерные системы',
    description: 'Смета на монтаж всех инженерных систем здания',
    sections: [
      {
        id: 'sec-3-1',
        name: 'Электроснабжение',
        totalPlanned: 280000000,
        totalActual: 275000000,
        items: [
          { id: 'item-24', name: 'Кабельная продукция', unit: 'км', quantity: 85, unitPrice: 1800000, totalPrice: 153000000, category: 'material' },
          { id: 'item-25', name: 'Электрощитовое оборудование', unit: 'компл.', quantity: 18, unitPrice: 3500000, totalPrice: 63000000, category: 'equipment' },
          { id: 'item-26', name: 'Монтажные работы', unit: 'компл.', quantity: 1, unitPrice: 64000000, totalPrice: 64000000, category: 'work' },
        ],
      },
      {
        id: 'sec-3-2',
        name: 'Отопление и вентиляция',
        totalPlanned: 260000000,
        totalActual: 140000000,
        items: [
          { id: 'item-27', name: 'Радиаторы отопления', unit: 'шт.', quantity: 520, unitPrice: 85000, totalPrice: 44200000, category: 'material' },
          { id: 'item-28', name: 'Трубы отопления', unit: 'м.п.', quantity: 12000, unitPrice: 4500, totalPrice: 54000000, category: 'material' },
          { id: 'item-29', name: 'Вентиляционное оборудование', unit: 'компл.', quantity: 1, unitPrice: 95000000, totalPrice: 95000000, category: 'equipment' },
          { id: 'item-30', name: 'Монтажные работы', unit: 'компл.', quantity: 1, unitPrice: 66800000, totalPrice: 66800000, category: 'work' },
        ],
      },
      {
        id: 'sec-3-3',
        name: 'Водоснабжение и канализация',
        totalPlanned: 180000000,
        totalActual: 75000000,
        items: [
          { id: 'item-31', name: 'Трубы водоснабжения', unit: 'м.п.', quantity: 8500, unitPrice: 6500, totalPrice: 55250000, category: 'material' },
          { id: 'item-32', name: 'Канализационные трубы', unit: 'м.п.', quantity: 6200, unitPrice: 4200, totalPrice: 26040000, category: 'material' },
          { id: 'item-33', name: 'Сантехническое оборудование', unit: 'компл.', quantity: 256, unitPrice: 185000, totalPrice: 47360000, category: 'equipment' },
          { id: 'item-34', name: 'Монтажные работы', unit: 'компл.', quantity: 1, unitPrice: 51350000, totalPrice: 51350000, category: 'work' },
        ],
      },
      {
        id: 'sec-3-4',
        name: 'Слаботочные системы',
        totalPlanned: 80000000,
        totalActual: 30000000,
        items: [
          { id: 'item-35', name: 'Система видеонаблюдения', unit: 'компл.', quantity: 1, unitPrice: 25000000, totalPrice: 25000000, category: 'equipment' },
          { id: 'item-36', name: 'Система домофонии', unit: 'компл.', quantity: 1, unitPrice: 18000000, totalPrice: 18000000, category: 'equipment' },
          { id: 'item-37', name: 'Интернет и ТВ', unit: 'компл.', quantity: 1, unitPrice: 22000000, totalPrice: 22000000, category: 'equipment' },
          { id: 'item-38', name: 'Монтажные работы', unit: 'компл.', quantity: 1, unitPrice: 15000000, totalPrice: 15000000, category: 'work' },
        ],
      },
    ],
  },
  {
    id: 'est-4',
    name: 'Смета на фасадные работы',
    number: 'СМ-2024-004',
    status: 'pending',
    createdAt: '2024-09-01',
    updatedAt: '2024-09-10',
    totalPlanned: 600000000,
    totalActual: 0,
    stage: 'Фасадные работы',
    description: 'Смета на утепление и облицовку фасада, остекление',
    sections: [
      {
        id: 'sec-4-1',
        name: 'Утепление фасада',
        totalPlanned: 180000000,
        totalActual: 0,
        items: [
          { id: 'item-39', name: 'Утеплитель минераловатный', unit: 'м²', quantity: 14500, unitPrice: 4500, totalPrice: 65250000, category: 'material' },
          { id: 'item-40', name: 'Крепёж фасадный', unit: 'шт.', quantity: 58000, unitPrice: 85, totalPrice: 4930000, category: 'material' },
          { id: 'item-41', name: 'Работы по утеплению', unit: 'м²', quantity: 14500, unitPrice: 7500, totalPrice: 108750000, category: 'work' },
        ],
      },
      {
        id: 'sec-4-2',
        name: 'Остекление',
        totalPlanned: 250000000,
        totalActual: 0,
        items: [
          { id: 'item-42', name: 'Оконные блоки ПВХ', unit: 'м²', quantity: 4200, unitPrice: 45000, totalPrice: 189000000, category: 'material' },
          { id: 'item-43', name: 'Монтаж окон', unit: 'м²', quantity: 4200, unitPrice: 8500, totalPrice: 35700000, category: 'work' },
          { id: 'item-44', name: 'Отливы и откосы', unit: 'м.п.', quantity: 8400, unitPrice: 3000, totalPrice: 25200000, category: 'material' },
        ],
      },
      {
        id: 'sec-4-3',
        name: 'Облицовка фасада',
        totalPlanned: 170000000,
        totalActual: 0,
        items: [
          { id: 'item-45', name: 'Керамогранит фасадный', unit: 'м²', quantity: 8500, unitPrice: 12000, totalPrice: 102000000, category: 'material' },
          { id: 'item-46', name: 'Подсистема вентфасада', unit: 'м²', quantity: 8500, unitPrice: 4500, totalPrice: 38250000, category: 'material' },
          { id: 'item-47', name: 'Монтажные работы', unit: 'м²', quantity: 8500, unitPrice: 3500, totalPrice: 29750000, category: 'work' },
        ],
      },
    ],
  },
  {
    id: 'est-5',
    name: 'Смета на внутреннюю отделку',
    number: 'СМ-2024-005',
    status: 'draft',
    createdAt: '2024-10-01',
    updatedAt: '2024-10-05',
    totalPlanned: 900000000,
    totalActual: 0,
    stage: 'Внутренняя отделка',
    description: 'Смета на черновую и чистовую отделку квартир и МОП',
    sections: [
      {
        id: 'sec-5-1',
        name: 'Черновая отделка квартир',
        totalPlanned: 350000000,
        totalActual: 0,
        items: [
          { id: 'item-48', name: 'Штукатурка стен', unit: 'м²', quantity: 85000, unitPrice: 1200, totalPrice: 102000000, category: 'work' },
          { id: 'item-49', name: 'Стяжка пола', unit: 'м²', quantity: 28000, unitPrice: 1800, totalPrice: 50400000, category: 'work' },
          { id: 'item-50', name: 'Материалы', unit: 'компл.', quantity: 1, unitPrice: 197600000, totalPrice: 197600000, category: 'material' },
        ],
      },
      {
        id: 'sec-5-2',
        name: 'Чистовая отделка квартир',
        totalPlanned: 420000000,
        totalActual: 0,
        items: [
          { id: 'item-51', name: 'Обои, покраска', unit: 'м²', quantity: 85000, unitPrice: 850, totalPrice: 72250000, category: 'work' },
          { id: 'item-52', name: 'Напольные покрытия', unit: 'м²', quantity: 28000, unitPrice: 4500, totalPrice: 126000000, category: 'material' },
          { id: 'item-53', name: 'Двери межкомнатные', unit: 'шт.', quantity: 768, unitPrice: 45000, totalPrice: 34560000, category: 'material' },
          { id: 'item-54', name: 'Работы по отделке', unit: 'м²', quantity: 28000, unitPrice: 6650, totalPrice: 186200000, category: 'work' },
        ],
      },
      {
        id: 'sec-5-3',
        name: 'Отделка МОП',
        totalPlanned: 130000000,
        totalActual: 0,
        items: [
          { id: 'item-55', name: 'Керамогранит полы', unit: 'м²', quantity: 4500, unitPrice: 8500, totalPrice: 38250000, category: 'material' },
          { id: 'item-56', name: 'Отделка стен', unit: 'м²', quantity: 12000, unitPrice: 3500, totalPrice: 42000000, category: 'work' },
          { id: 'item-57', name: 'Потолки подвесные', unit: 'м²', quantity: 4500, unitPrice: 5500, totalPrice: 24750000, category: 'material' },
          { id: 'item-58', name: 'Прочие работы', unit: 'компл.', quantity: 1, unitPrice: 25000000, totalPrice: 25000000, category: 'work' },
        ],
      },
    ],
  },
]
