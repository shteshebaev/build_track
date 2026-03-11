export interface WarehouseItem {
  id: string
  name: string
  category: string
  unit: string
  quantity: number
  reserved: number
  minStock: number
  price: number
  totalValue: number
  lastMovement: string
  location: string
  supplier?: string
}

export interface WarehouseMovement {
  id: string
  date: string
  type: 'in' | 'out' | 'transfer'
  itemName: string
  quantity: number
  unit: string
  fromLocation?: string
  toLocation?: string
  document: string
  responsible: string
}

export interface WarehouseCategory {
  name: string
  count: number
  totalValue: number
  icon: string
}

export const mockProjectWarehouseItems: WarehouseItem[] = [
  {
    id: 'w-1',
    name: 'Цемент М400',
    category: 'Вяжущие материалы',
    unit: 'т',
    quantity: 45,
    reserved: 12,
    minStock: 20,
    price: 8500000,
    totalValue: 382500000,
    lastMovement: '2024-03-10',
    location: 'Склад А-1',
    supplier: 'ООО "ЦементСтрой"',
  },
  {
    id: 'w-2',
    name: 'Арматура А500С Ø12',
    category: 'Металлопрокат',
    unit: 'т',
    quantity: 28,
    reserved: 8,
    minStock: 15,
    price: 92000000,
    totalValue: 2576000000,
    lastMovement: '2024-03-09',
    location: 'Склад Б-2',
    supplier: 'АО "МеталлТрейд"',
  },
  {
    id: 'w-3',
    name: 'Арматура А500С Ø16',
    category: 'Металлопрокат',
    unit: 'т',
    quantity: 22,
    reserved: 5,
    minStock: 10,
    price: 94000000,
    totalValue: 2068000000,
    lastMovement: '2024-03-09',
    location: 'Склад Б-2',
    supplier: 'АО "МеталлТрейд"',
  },
  {
    id: 'w-4',
    name: 'Кирпич керамический М150',
    category: 'Стеновые материалы',
    unit: 'тыс. шт.',
    quantity: 85,
    reserved: 20,
    minStock: 30,
    price: 12000000,
    totalValue: 1020000000,
    lastMovement: '2024-03-08',
    location: 'Склад В-1',
    supplier: 'ООО "КирпичПром"',
  },
  {
    id: 'w-5',
    name: 'Песок строительный',
    category: 'Сыпучие материалы',
    unit: 'м³',
    quantity: 320,
    reserved: 50,
    minStock: 100,
    price: 450000,
    totalValue: 144000000,
    lastMovement: '2024-03-10',
    location: 'Открытый склад',
    supplier: 'ООО "ПесокГрупп"',
  },
  {
    id: 'w-6',
    name: 'Щебень фр. 5-20',
    category: 'Сыпучие материалы',
    unit: 'м³',
    quantity: 180,
    reserved: 30,
    minStock: 80,
    price: 1200000,
    totalValue: 216000000,
    lastMovement: '2024-03-10',
    location: 'Открытый склад',
    supplier: 'ООО "ЩебеньДоставка"',
  },
  {
    id: 'w-7',
    name: 'Утеплитель минераловатный 100мм',
    category: 'Теплоизоляция',
    unit: 'м²',
    quantity: 2400,
    reserved: 500,
    minStock: 1000,
    price: 4500,
    totalValue: 10800000,
    lastMovement: '2024-03-07',
    location: 'Склад Г-1',
    supplier: 'ООО "ТеплоСтрой"',
  },
  {
    id: 'w-8',
    name: 'Гидроизоляция рулонная',
    category: 'Гидроизоляция',
    unit: 'м²',
    quantity: 1800,
    reserved: 200,
    minStock: 500,
    price: 2800,
    totalValue: 5040000,
    lastMovement: '2024-03-06',
    location: 'Склад Г-1',
    supplier: 'ООО "ИзолПром"',
  },
  {
    id: 'w-9',
    name: 'Труба ПНД Ø110',
    category: 'Трубы и фитинги',
    unit: 'м.п.',
    quantity: 450,
    reserved: 100,
    minStock: 150,
    price: 8500,
    totalValue: 3825000,
    lastMovement: '2024-03-05',
    location: 'Склад Д-1',
    supplier: 'ООО "ТрубаПласт"',
  },
  {
    id: 'w-10',
    name: 'Кабель ВВГнг 3х2.5',
    category: 'Электрика',
    unit: 'м.п.',
    quantity: 3200,
    reserved: 800,
    minStock: 1000,
    price: 1850,
    totalValue: 5920000,
    lastMovement: '2024-03-09',
    location: 'Склад Д-2',
    supplier: 'ООО "ЭлектроКабель"',
  },
  {
    id: 'w-11',
    name: 'Оконный блок ПВХ 1400х1200',
    category: 'Окна и двери',
    unit: 'шт.',
    quantity: 48,
    reserved: 16,
    minStock: 20,
    price: 45000000,
    totalValue: 2160000000,
    lastMovement: '2024-03-08',
    location: 'Склад Е-1',
    supplier: 'ООО "ОкнаПроф"',
  },
  {
    id: 'w-12',
    name: 'Дверь межкомнатная 800х2000',
    category: 'Окна и двери',
    unit: 'шт.',
    quantity: 64,
    reserved: 12,
    minStock: 30,
    price: 35000000,
    totalValue: 2240000000,
    lastMovement: '2024-03-07',
    location: 'Склад Е-1',
    supplier: 'ООО "ДвериСтиль"',
  },
]

export const mockWarehouseMovements: WarehouseMovement[] = [
  {
    id: 'mov-1',
    date: '2024-03-10',
    type: 'in',
    itemName: 'Цемент М400',
    quantity: 15,
    unit: 'т',
    toLocation: 'Склад А-1',
    document: 'ПН-2024-0342',
    responsible: 'Иванов А.С.',
  },
  {
    id: 'mov-2',
    date: '2024-03-10',
    type: 'out',
    itemName: 'Песок строительный',
    quantity: 25,
    unit: 'м³',
    fromLocation: 'Открытый склад',
    document: 'РН-2024-0891',
    responsible: 'Петров И.К.',
  },
  {
    id: 'mov-3',
    date: '2024-03-09',
    type: 'in',
    itemName: 'Арматура А500С Ø12',
    quantity: 12,
    unit: 'т',
    toLocation: 'Склад Б-2',
    document: 'ПН-2024-0339',
    responsible: 'Сидоров В.М.',
  },
  {
    id: 'mov-4',
    date: '2024-03-09',
    type: 'out',
    itemName: 'Кабель ВВГнг 3х2.5',
    quantity: 450,
    unit: 'м.п.',
    fromLocation: 'Склад Д-2',
    document: 'РН-2024-0887',
    responsible: 'Козлов Д.Н.',
  },
  {
    id: 'mov-5',
    date: '2024-03-08',
    type: 'transfer',
    itemName: 'Кирпич керамический М150',
    quantity: 10,
    unit: 'тыс. шт.',
    fromLocation: 'Склад В-1',
    toLocation: 'Рабочая зона',
    document: 'ВП-2024-0156',
    responsible: 'Николаев Р.А.',
  },
  {
    id: 'mov-6',
    date: '2024-03-08',
    type: 'in',
    itemName: 'Оконный блок ПВХ 1400х1200',
    quantity: 24,
    unit: 'шт.',
    toLocation: 'Склад Е-1',
    document: 'ПН-2024-0336',
    responsible: 'Морозов С.И.',
  },
  {
    id: 'mov-7',
    date: '2024-03-07',
    type: 'out',
    itemName: 'Утеплитель минераловатный 100мм',
    quantity: 320,
    unit: 'м²',
    fromLocation: 'Склад Г-1',
    document: 'РН-2024-0879',
    responsible: 'Волков П.С.',
  },
]

export const mockWarehouseCategories: WarehouseCategory[] = [
  { name: 'Металлопрокат', count: 2, totalValue: 4644000000, icon: 'tool' },
  { name: 'Стеновые материалы', count: 1, totalValue: 1020000000, icon: 'build' },
  { name: 'Сыпучие материалы', count: 2, totalValue: 360000000, icon: 'container' },
  { name: 'Окна и двери', count: 2, totalValue: 4400000000, icon: 'border' },
  { name: 'Вяжущие материалы', count: 1, totalValue: 382500000, icon: 'experiment' },
  { name: 'Теплоизоляция', count: 1, totalValue: 10800000, icon: 'fire' },
  { name: 'Электрика', count: 1, totalValue: 5920000, icon: 'thunderbolt' },
  { name: 'Трубы и фитинги', count: 1, totalValue: 3825000, icon: 'apartment' },
]
