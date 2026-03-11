import { useState } from 'react'
import { Progress, Tag, Collapse, Row, Col, Tooltip, Button } from 'antd'
import {
  CheckCircleFilled,
  ClockCircleFilled,
  PauseCircleFilled,
  ExclamationCircleFilled,
  CalendarOutlined,
  UserOutlined,
  DownOutlined,
  RightOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { useThemeStore, useCurrencyStore, formatCurrencyCompact } from '@shared/store'
import { formatDate } from '@shared/lib'
import { mockConstructionStages, type ConstructionStage, type ConstructionTask } from '@mocks/construction'
import styles from './ConstructionTab.module.css'

interface ConstructionTabProps {
  projectId: string
}

export function ConstructionTab({ projectId }: ConstructionTabProps) {
  const { isDark } = useThemeStore()
  const { unit } = useCurrencyStore()
  const [expandedStages, setExpandedStages] = useState<string[]>(['4', '5', '6'])

  const stages = mockConstructionStages

  const totalProgress = Math.round(
    stages.reduce((acc, stage) => acc + stage.progress, 0) / stages.length
  )

  const totalPlannedCost = stages.reduce((acc, stage) => acc + stage.plannedCost, 0)
  const totalActualCost = stages.reduce((acc, stage) => acc + stage.actualCost, 0)

  const completedStages = stages.filter(s => s.status === 'completed').length
  const inProgressStages = stages.filter(s => s.status === 'in_progress').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleFilled style={{ color: '#10B981' }} />
      case 'in_progress':
        return <ClockCircleFilled style={{ color: '#3B82F6' }} />
      case 'delayed':
        return <ExclamationCircleFilled style={{ color: '#EF4444' }} />
      default:
        return <PauseCircleFilled style={{ color: '#9CA3AF' }} />
    }
  }

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      completed: { color: 'success', label: 'Завершён' },
      in_progress: { color: 'processing', label: 'В работе' },
      delayed: { color: 'error', label: 'Задержка' },
      pending: { color: 'default', label: 'Ожидает' },
    }
    const { color, label } = config[status] || config.pending
    return <Tag color={color}>{label}</Tag>
  }

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'delayed') return '#EF4444'
    if (status === 'completed') return '#10B981'
    if (progress >= 70) return '#10B981'
    if (progress >= 40) return '#F59E0B'
    return '#3B82F6'
  }

  const formatCost = (value: number) => {
    const { formatted, suffix } = formatCurrencyCompact(value, unit)
    return formatted + suffix
  }

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev =>
      prev.includes(stageId)
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    )
  }

  const renderTask = (task: ConstructionTask) => (
    <div
      key={task.id}
      className={`${styles.task} ${isDark ? styles.dark : ''}`}
    >
      <div className={styles.taskMain}>
        <div className={styles.taskStatus}>
          {getStatusIcon(task.status)}
        </div>
        <div className={styles.taskInfo}>
          <span className={styles.taskName}>{task.name}</span>
          <div className={styles.taskMeta}>
            <span className={styles.taskMetaItem}>
              <CalendarOutlined />
              {formatDate(task.startDate)} — {formatDate(task.endDate)}
            </span>
            {task.assignee && (
              <span className={styles.taskMetaItem}>
                <UserOutlined />
                {task.assignee}
              </span>
            )}
          </div>
        </div>
        <div className={styles.taskProgress}>
          <Progress
            percent={task.progress}
            size="small"
            strokeColor={getProgressColor(task.progress, task.status)}
            trailColor={isDark ? '#374151' : '#E5E7EB'}
          />
        </div>
      </div>
    </div>
  )

  const renderStage = (stage: ConstructionStage, index: number) => {
    const isExpanded = expandedStages.includes(stage.id)
    const costDiff = stage.actualCost - stage.plannedCost
    const costDiffPercent = stage.plannedCost > 0
      ? Math.round((costDiff / stage.plannedCost) * 100)
      : 0

    return (
      <div
        key={stage.id}
        className={`${styles.stage} ${isDark ? styles.dark : ''} ${styles[stage.status]}`}
      >
        <div
          className={styles.stageHeader}
          onClick={() => toggleStage(stage.id)}
        >
          <div className={styles.stageLeft}>
            <div className={styles.stageNumber}>
              {stage.status === 'completed' ? (
                <CheckCircleFilled style={{ color: '#10B981', fontSize: 24 }} />
              ) : (
                <span className={`${styles.stageIndex} ${stage.status === 'in_progress' ? styles.active : ''}`}>
                  {index + 1}
                </span>
              )}
            </div>
            <div className={styles.stageInfo}>
              <div className={styles.stageTitleRow}>
                <h3 className={styles.stageTitle}>{stage.name}</h3>
                {getStatusTag(stage.status)}
              </div>
              <p className={styles.stageDescription}>{stage.description}</p>
              <div className={styles.stageMeta}>
                <span className={styles.stageMetaItem}>
                  <CalendarOutlined />
                  {formatDate(stage.startDate)} — {formatDate(stage.endDate)}
                </span>
                <span className={styles.stageMetaItem}>
                  <DollarOutlined />
                  <Tooltip title={`План: ${formatCost(stage.plannedCost)} / Факт: ${formatCost(stage.actualCost)}`}>
                    <span>
                      {formatCost(stage.actualCost)} / {formatCost(stage.plannedCost)}
                      {costDiff !== 0 && stage.actualCost > 0 && (
                        <span className={costDiff > 0 ? styles.costOver : styles.costUnder}>
                          {' '}({costDiff > 0 ? '+' : ''}{costDiffPercent}%)
                        </span>
                      )}
                    </span>
                  </Tooltip>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.stageRight}>
            <div className={styles.stageProgress}>
              <Progress
                type="circle"
                percent={stage.progress}
                size={56}
                strokeWidth={8}
                strokeColor={getProgressColor(stage.progress, stage.status)}
                trailColor={isDark ? '#374151' : '#E5E7EB'}
                format={(percent) => <span className={styles.progressText}>{percent}%</span>}
              />
            </div>
            <Button
              type="text"
              icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
              className={styles.expandButton}
            />
          </div>
        </div>

        {isExpanded && (
          <div className={styles.stageTasks}>
            <div className={styles.tasksHeader}>
              <span className={styles.tasksTitle}>
                Задачи ({stage.tasks.filter(t => t.status === 'completed').length}/{stage.tasks.length})
              </span>
            </div>
            <div className={styles.tasksList}>
              {stage.tasks.map(renderTask)}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className={styles.summaryRow}>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
              <Progress
                type="circle"
                percent={totalProgress}
                size={48}
                strokeWidth={6}
                strokeColor="#4F46E5"
                trailColor={isDark ? '#374151' : '#E5E7EB'}
                format={() => null}
              />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{totalProgress}%</span>
              <span className={styles.summaryLabel}>Общий прогресс</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <CheckCircleFilled style={{ color: '#10B981', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{completedStages}/{stages.length}</span>
              <span className={styles.summaryLabel}>Завершено этапов</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <ClockCircleFilled style={{ color: '#3B82F6', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <span className={styles.summaryValue}>{inProgressStages}</span>
              <span className={styles.summaryLabel}>В работе</span>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className={`${styles.summaryCard} ${isDark ? styles.dark : ''}`}>
            <div className={styles.summaryIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <DollarOutlined style={{ color: '#F59E0B', fontSize: 24 }} />
            </div>
            <div className={styles.summaryContent}>
              <Tooltip title={`План: ${formatCost(totalPlannedCost)}`}>
                <span className={styles.summaryValue}>{formatCost(totalActualCost)}</span>
              </Tooltip>
              <span className={styles.summaryLabel}>Освоено</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Timeline */}
      <div className={styles.timeline}>
        <div className={styles.timelineHeader}>
          <h2 className={styles.timelineTitle}>Этапы строительства</h2>
          <div className={styles.timelineActions}>
            <Button
              type="link"
              onClick={() => setExpandedStages(stages.map(s => s.id))}
            >
              Развернуть все
            </Button>
            <Button
              type="link"
              onClick={() => setExpandedStages([])}
            >
              Свернуть все
            </Button>
          </div>
        </div>
        <div className={styles.stages}>
          {stages.map((stage, index) => renderStage(stage, index))}
        </div>
      </div>
    </div>
  )
}
