Ты выступаешь как Senior Frontend Architect, Senior Product Designer и Construction ERP Architect мирового уровня.

У тебя есть опыт разработки enterprise SaaS систем уровня:

- Procore
- Autodesk Construction Cloud
- Buildertrend
- PlanRadar
- Monday.com
- Stripe Dashboard
- Linear
- Notion

Твоя задача — спроектировать и реализовать современный frontend интерфейс системы BuildTrack.

BuildTrack — это Construction ERP / Construction Management Platform для строительных компаний.

Система предназначена для:
- девелоперов
- строительных компаний
- генподрядчиков
- субподрядчиков
- управляющих компаний.

Основная цель системы — полный контроль строительства:
- сметы
- закупки
- склад
- использование материалов
- строительство объектов
- продажи квартир
- аналитика стройки.

--------------------------------------------------

ТЕХНОЛОГИЧЕСКИЙ СТЕК FRONTEND

Использовать:

React 19
TypeScript
Vite
Ant Design
Zustand
React Router
Axios
i18next

Нельзя менять стек.

--------------------------------------------------

ГЛАВНАЯ БИЗНЕС ЛОГИКА СИСТЕМЫ

Система должна обеспечивать полный контроль:

Смета
→ План закупок
→ Закупка
→ Поставка
→ Склад
→ Заявка на материалы
→ Выдача материалов
→ Использование материалов
→ Остатки на складе

Это называется:

Material Lifecycle.

--------------------------------------------------

ФУНКЦИИ СИСТЕМЫ

Система должна включать следующие модули:

1. Dashboard
2. Projects (объекты строительства)
3. Construction Progress
4. Estimates (сметы)
5. Materials Catalog
6. Warehouse
7. Material Requests
8. Procurement (закупки)
9. Suppliers
10. Material Usage
11. Inventory Audit
12. Photo Reports
13. Construction Timeline
14. Apartment Sales
15. Financial Analytics
16. Equipment Management
17. Issue Tracking
18. Document Management
19. Notifications
20. Audit Log
21. Map View объектов
22. Camera Monitoring

--------------------------------------------------

КЛЮЧЕВЫЕ ФУНКЦИИ СИСТЕМЫ

Система должна поддерживать:

• учёт стройматериалов
• контроль сметы
• контроль закупок
• остатки на складе
• использование материалов
• прогресс строительства
• продажу квартир
• просмотр объектов на карте
• просмотр камер стройки
• фотофиксацию работ
• QR учет материалов

--------------------------------------------------

SMART ФУНКЦИИ

Система должна поддерживать:

Digital Twin стройки
Heatmap использования материалов
AI анализ перерасхода
Material Forecast
Cost per m² аналитика
Construction Timeline (Gantt Chart)
Сравнение объектов
Контроль производительности бригад

--------------------------------------------------

UX ТРЕБОВАНИЯ

Интерфейс должен быть уровня современных SaaS продуктов:

Stripe
Linear
Notion
Vercel
Monday

Интерфейс должен быть:

• минималистичный
• быстрый
• чистый
• понятный
• enterprise уровня

Использовать:

card-based layout
много воздуха
аккуратные таблицы
современные графики
минимум кликов

--------------------------------------------------

ДИЗАЙН

Дизайн должен быть в стиле:

iOS / Apple Human Interface Guidelines

Использовать:

• мягкие тени
• округлые карточки
• аккуратную типографику
• современную сетку

Layout:

12 column grid
8px spacing system

Карточки:

border-radius 12–16px
padding 20–24px

--------------------------------------------------

ЦВЕТОВАЯ СИСТЕМА

Primary — Indigo / Deep Blue  
Secondary — Gray / Slate  
Success — Green  
Warning — Orange  
Error — Red

--------------------------------------------------

ТЕМЫ ИНТЕРФЕЙСА

Обязательно реализовать:

Light Mode  
Dark Mode

В header должен быть toggle переключатель темы.

Light Mode:
- светлый фон
- мягкие тени
- нейтральные цвета

Dark Mode:
- тёмный фон
- контрастные карточки
- удобная читаемость

--------------------------------------------------

LAYOUT СИСТЕМЫ

App Layout

AppLayout
├ Sidebar
├ Header
├ Content
└ Notifications

Sidebar содержит:

Dashboard
Projects
Estimates
Materials
Warehouse
Requests
Procurement
Suppliers
Construction Progress
Sales
Reports
Users
Settings

Sidebar должен поддерживать:

- collapse
- icons
- active states

--------------------------------------------------

HEADER

Header должен содержать:

• breadcrumbs
• глобальный поиск
• notifications
• language switch
• theme toggle
• user profile

--------------------------------------------------

DASHBOARD

Dashboard должен показывать:

KPI Cards

• Total Projects
• Warehouse Value
• Materials Used
• Active Requests
• Construction Progress
• Sales

Charts:

• план / факт стройки
• использование материалов
• закупки
• финансы

--------------------------------------------------

ТАБЛИЦЫ

Все таблицы должны поддерживать:

• сортировку
• фильтрацию
• поиск
• pagination
• column settings
• массовые действия

--------------------------------------------------

КАРТОЧКА ОБЪЕКТА

Project page должна содержать:

Tabs:

Overview  
Construction Progress  
Estimates  
Warehouse  
Requests  
Procurement  
Materials  
Photo Reports  
Documents  
Sales  
Analytics

--------------------------------------------------

КАРТА ОБЪЕКТОВ

Добавить карту объектов.

На карте отображаются:

• строительные объекты
• статус стройки
• прогресс строительства

--------------------------------------------------

ВИДЕОКАМЕРЫ

Добавить страницу:

Construction Cameras

где можно смотреть:

live камеры стройки.

--------------------------------------------------

МОБИЛЬНАЯ ВЕРСИЯ

Очень важно.

Система должна быть mobile responsive.

Mobile сценарии:

• выдача материалов
• сканирование QR
• создание заявки
• фотофиксация работ
• подтверждение получения материалов

UI должен быть touch friendly.

--------------------------------------------------

АРХИТЕКТУРА FRONTEND

Использовать Feature-Sliced Design:

app
features
entities
widgets
shared

shared/ui

components:

AppLayout
Sidebar
Header
PageContainer
DataTable
StatCard
InfoCard
FormInput
FormSelect
FormDate
EmptyState
LoadingState
ErrorState

--------------------------------------------------

PERFORMANCE

Использовать:

• lazy loading
• code splitting
• memoization
• оптимизированные таблицы

--------------------------------------------------

ФОРМАТ РЕЗУЛЬТАТА

Ответ должен содержать:

1. Архитектуру frontend проекта
2. структуру папок
3. layout системы
4. дизайн систему
5. архитектуру компонентов
6. UX основных страниц
7. mobile UX
8. рекомендации по реализации.

Ответ должен быть уровня enterprise SaaS платформы.


Ты выступаешь как Senior Design System Architect.

Твоя задача — разработать полноценную UI Design System для SaaS платформы BuildTrack.

Система должна выглядеть как современный SaaS продукт уровня:

Stripe Dashboard
Linear
Notion
Apple iOS apps.

Нужно разработать дизайн систему для React + Ant Design проекта.

Включить:

1. Color System
   Primary
   Secondary
   Background
   Surface
   Success
   Warning
   Error

2. Typography

Heading H1
Heading H2
Heading H3

Body
Caption

Шрифт должен быть современный SaaS:

Inter / SF Pro style.

3. Spacing system

8px grid system

4. Border radius

Buttons: 8px
Cards: 12px
Modals: 16px

5. Shadows

Soft SaaS shadows.

6. UI Components

Buttons
Inputs
Select
Dropdown
Table
Cards
Tabs
Tags
Badges
Modals
Charts
Notifications

7. Tables

Таблицы должны поддерживать:

* sorting
* filtering
* search
* pagination
* column settings

8. Cards

Карточки должны использоваться для:

KPI
Projects
Materials
Analytics

9. Dark Mode

Нужно разработать:

Light Theme
Dark Theme

Dark mode должен быть:

* читаемый
* современный
* мягкий

10. UI принципы

• минимализм
• много воздуха
• минимум цветов
• высокая читаемость

Ответ должен быть структурированным документом дизайн системы.


Ты выступаешь как Senior Product Designer, UI Architect и SaaS Design Expert мирового уровня.

У тебя есть опыт проектирования интерфейсов для продуктов уровня:

* Apple VisionOS
* Stripe Dashboard
* Linear
* Notion
* Vercel
* Arc Browser
* iOS apps (Apple Human Interface Guidelines)

Твоя задача — разработать современный интерфейс для веб-платформы BuildTrack.

BuildTrack — это Construction ERP / PropTech платформа для управления строительными проектами, строительными материалами, закупками, складом и продажами квартир.

Интерфейс должен выглядеть как современный SaaS продукт 2025–2026 года.

Ориентиры дизайна:

Apple VisionOS
Stripe Dashboard
Linear
Notion
Apple iOS apps

Главные принципы дизайна:

• минимализм
• чистый layout
• много воздуха
• аккуратная типографика
• мягкие тени
• глубина интерфейса
• glass / translucent элементы
• card based layout

Интерфейс должен создавать ощущение:

"современной профессиональной SaaS платформы уровня Apple".

---

ДИЗАЙН ПРИНЦИПЫ

Использовать:

• большие отступы
• визуальную иерархию
• мягкие границы
• прозрачные панели
• аккуратные тени

Карточки должны выглядеть как:

glass / soft UI.

---

GRID SYSTEM

12 column grid

Spacing system:

8px base grid

---

CARDS

Карточки должны иметь:

border radius: 16px
padding: 24px
soft shadow
light blur background

Card стиль:

modern SaaS glass card.

---

ЦВЕТОВАЯ СИСТЕМА

Primary
Deep Indigo

Secondary
Slate Gray

Success
Green

Warning
Orange

Error
Red

Background:

neutral light gray.

---

ТЕМЫ ИНТЕРФЕЙСА

Обязательно поддерживать:

Light Mode
Dark Mode

Header должен содержать toggle переключатель темы.

Light Mode:

• светлый фон
• мягкие тени
• прозрачные карточки

Dark Mode:

• тёмный фон
• контрастные карточки
• soft glow элементы

---

LAYOUT СИСТЕМЫ

App Layout

AppLayout

├ Sidebar
├ Header
├ Main Content
└ Notifications

---

SIDEBAR

Sidebar должен быть современный, минималистичный.

Особенности:

• icons + text
• collapse режим
• активные состояния
• мягкая подсветка активного пункта

Меню:

Dashboard
Projects
Estimates
Materials
Warehouse
Requests
Procurement
Suppliers
Construction Progress
Sales
Reports
Users
Settings

---

HEADER

Header должен содержать:

• breadcrumbs
• глобальный поиск
• notifications
• language switch
• theme toggle
• user profile

Header должен быть:

semi-transparent glass panel.

---

DASHBOARD

Dashboard должен выглядеть как современный аналитический центр.

Использовать:

KPI Cards

например:

Total Projects
Warehouse Value
Active Requests
Construction Progress
Sales Revenue

Charts:

• construction progress
• material usage
• procurement spending
• financial analytics

Charts должны выглядеть как Stripe style charts.

---

TABLES

Таблицы должны быть современными:

• clean
• много воздуха
• hover states
• мягкие разделители

Поддерживать:

search
filter
sorting
pagination
column settings

---

UX ПРИНЦИПЫ

Минимизировать количество кликов.

Основные действия должны выполняться быстро.

Пример:

создание заявки ≤ 30 секунд.

---

ANIMATIONS

Использовать современные микроанимации:

• hover animations
• smooth transitions
• soft card lift effect
• плавные dropdown

Анимации должны быть:

быстрые
ненавязчивые
современные.

---

МОБИЛЬНАЯ ВЕРСИЯ

Интерфейс должен быть responsive.

Mobile сценарии:

• выдача материалов
• QR сканирование
• фотофиксация работ
• создание заявок

UI должен быть touch friendly.

---

ФОРМАТ ОТВЕТА

Ответ должен содержать:

1. дизайн концепцию
2. layout системы
3. дизайн карточек
4. структуру dashboard
5. дизайн sidebar
6. дизайн header
7. дизайн таблиц
8. дизайн компонентов
9. light / dark theme систему
10. рекомендации по UI реализации.

Интерфейс должен выглядеть как SaaS продукт уровня Apple / Stripe.
