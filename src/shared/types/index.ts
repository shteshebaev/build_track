// Common types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Project types
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'

export interface Project extends BaseEntity {
  name: string
  description: string
  location: string
  address: string
  startDate: string
  endDate: string
  budget: number
  spent: number
  progress: number
  status: ProjectStatus
  managerId: string
  imageUrl?: string
  latitude?: number
  longitude?: number
  totalArea?: number
  floors?: number
  apartments?: number
}

// Material types
export type MaterialCategory =
  | 'concrete'
  | 'metal'
  | 'brick'
  | 'wood'
  | 'electrical'
  | 'plumbing'
  | 'finishing'
  | 'insulation'
  | 'other'

export interface Material extends BaseEntity {
  name: string
  sku: string
  category: MaterialCategory
  unit: string
  price: number
  description?: string
  minStock: number
  imageUrl?: string
}

// Warehouse types
export interface WarehouseItem extends BaseEntity {
  materialId: string
  material?: Material
  projectId?: string
  project?: Project
  quantity: number
  reservedQuantity: number
  warehouseLocation: string
}

// Request types
export type RequestStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'in_delivery'
  | 'completed'
  | 'cancelled'

export interface MaterialRequestItem {
  materialId: string
  material?: Material
  quantity: number
  unit: string
  notes?: string
}

export interface MaterialRequest extends BaseEntity {
  requestNumber: string
  projectId: string
  project?: Project
  requestedById: string
  requestedByName: string
  status: RequestStatus
  requestDate: string
  requiredDate: string
  items: MaterialRequestItem[]
  notes?: string
  approvedById?: string
  approvedByName?: string
  approvedAt?: string
}

// Procurement types
export type ProcurementStatus =
  | 'draft'
  | 'sent'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface ProcurementItem {
  materialId: string
  material?: Material
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ProcurementOrder extends BaseEntity {
  orderNumber: string
  supplierId: string
  supplier?: Supplier
  projectId?: string
  project?: Project
  status: ProcurementStatus
  orderDate: string
  expectedDeliveryDate: string
  actualDeliveryDate?: string
  items: ProcurementItem[]
  totalAmount: number
  notes?: string
}

// Supplier types
export interface Supplier extends BaseEntity {
  name: string
  contactPerson: string
  email: string
  phone: string
  address: string
  rating: number
  categories: MaterialCategory[]
  notes?: string
}

// Sales types
export type ApartmentStatus = 'available' | 'reserved' | 'sold'

export interface Apartment extends BaseEntity {
  projectId: string
  project?: Project
  floor: number
  number: string
  rooms: number
  area: number
  price: number
  pricePerSqm: number
  status: ApartmentStatus
  clientId?: string
  client?: Client
}

export interface Client extends BaseEntity {
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  notes?: string
}

// User types
export type UserRole = 'admin' | 'manager' | 'warehouse_keeper' | 'accountant' | 'viewer'

export interface User extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatar?: string
  phone?: string
  isActive: boolean
}

// Dashboard types
export interface DashboardStats {
  totalProjects: number
  projectsTrend: number
  warehouseValue: number
  warehouseTrend: number
  materialsUsed: number
  materialsTrend: number
  activeRequests: number
  requestsTrend: number
  avgProgress: number
  progressTrend: number
  salesRevenue: number
  salesTrend: number
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface ProjectProgressData {
  projectId: string
  projectName: string
  planned: number
  actual: number
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Table types
export interface TableParams {
  page: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend'
  filters?: Record<string, unknown>
  search?: string
}

// Notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification extends BaseEntity {
  type: NotificationType
  title: string
  message: string
  read: boolean
  link?: string
}
