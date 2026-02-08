'use client';

import { useState, useRef, useEffect } from 'react';
import { Popconfirm, Popover, message } from 'antd';
import {
  CheckOutlined,
  PlusOutlined,
  DeleteOutlined,
  SunOutlined,
  MoonOutlined,
  ReloadOutlined,
  FireOutlined,
  PieChartOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useDashboard } from '@/hooks/useDashboard';
import {
  DAY_NAMES,
  DAY_LABELS,
  DAY_FULL_LABELS,
  WEEK_NAMES,
  WEEK_LABELS,
  MONTH_DAYS,
  DayKey,
  WeekKey,
  TaskViewMode,
} from '@/types/dashboard';
import { isToday, HABIT_COLORS, getRandomHabitColor } from '@/lib/utils';
import styles from './page.module.css';

export default function Dashboard() {
  const {
    habits,
    dailyTasks,
    weeklyTasks,
    monthlyTasks,
    taskViewMode,
    theme,
    habitProgress,
    dailyTasksCompletion,
    dailyOverallCompletion,
    weeklyTasksCompletion,
    weeklyOverallCompletion,
    monthlyTasksCompletion,
    monthlyOverallCompletion,
    toggleTheme,
    setTaskViewMode,
    toggleHabitDay,
    addHabit,
    removeHabit,
    updateHabit,
    toggleDailyTask,
    addDailyTask,
    removeDailyTask,
    toggleWeeklyTask,
    addWeeklyTask,
    removeWeeklyTask,
    toggleMonthlyTask,
    addMonthlyTask,
    removeMonthlyTask,
    resetHabits,
    resetDailyTasks,
    resetWeeklyTasks,
    resetMonthlyTasks,
  } = useDashboard();

  // Local state for input fields
  const [dailyInputs, setDailyInputs] = useState<Record<DayKey, string>>({
    monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: ''
  });
  const [weeklyInputs, setWeeklyInputs] = useState<Record<WeekKey, string>>({
    week1: '', week2: '', week3: '', week4: ''
  });
  const [monthlyInputs, setMonthlyInputs] = useState<Record<number, string>>({});

  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitColor, setNewHabitColor] = useState(HABIT_COLORS[0]);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editInputRef.current && editingHabit) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingHabit]);

  // Handlers
  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim(), newHabitColor);
      setNewHabitName('');
      setNewHabitColor(getRandomHabitColor());
      setShowAddHabit(false);
      message.success('Habit added!');
    }
  };

  const handleUpdateHabit = (habitId: string, name: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit && name.trim()) {
      updateHabit(habitId, name.trim(), habit.color);
    }
    setEditingHabit(null);
  };

  const handleAddDailyTask = (day: DayKey) => {
    const text = dailyInputs[day].trim();
    if (text) {
      addDailyTask(day, text);
      setDailyInputs({ ...dailyInputs, [day]: '' });
    }
  };

  const handleAddWeeklyTask = (week: WeekKey) => {
    const text = weeklyInputs[week].trim();
    if (text) {
      addWeeklyTask(week, text);
      setWeeklyInputs({ ...weeklyInputs, [week]: '' });
    }
  };

  const handleAddMonthlyTask = (day: number) => {
    const text = (monthlyInputs[day] || '').trim();
    if (text) {
      addMonthlyTask(day, text);
      setMonthlyInputs({ ...monthlyInputs, [day]: '' });
    }
  };

  const handleReset = () => {
    if (taskViewMode === 'daily') {
      resetDailyTasks();
      message.success('Daily tasks reset!');
    } else if (taskViewMode === 'weekly') {
      resetWeeklyTasks();
      message.success('Weekly tasks reset!');
    } else {
      resetMonthlyTasks();
      message.success('Monthly tasks reset!');
    }
  };

  // Get completion data based on view mode
  const getCompletionData = () => {
    switch (taskViewMode) {
      case 'daily':
        return { overall: dailyOverallCompletion, perUnit: dailyTasksCompletion };
      case 'weekly':
        return { overall: weeklyOverallCompletion, perUnit: weeklyTasksCompletion };
      case 'monthly':
        return { overall: monthlyOverallCompletion, perUnit: monthlyTasksCompletion };
      default:
        return { overall: dailyOverallCompletion, perUnit: dailyTasksCompletion };
    }
  };

  const completionData = getCompletionData();

  // Pie chart calculations
  const pieRadius = 70;
  const pieCircumference = 2 * Math.PI * pieRadius;
  const pieOffset = pieCircumference - (completionData.overall.percentage / 100) * pieCircumference;

  // Color picker content
  const colorPickerContent = (
    <div className={styles.colorPicker}>
      {HABIT_COLORS.map((color) => (
        <div
          key={color}
          className={`${styles.colorOption} ${newHabitColor === color ? styles.colorOptionSelected : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => setNewHabitColor(color)}
        />
      ))}
    </div>
  );

  const getViewLabel = () => {
    switch (taskViewMode) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Weekly Dashboard</h1>
          <p className={styles.subtitle}>Track your habits and tasks in one place</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Habit Tracker Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}><FireOutlined /></span>
              Habit Tracker
            </h2>
            <Popconfirm
              title="Reset Habits"
              description="Clear all habit progress for the week?"
              onConfirm={() => { resetHabits(); message.success('Habits reset!'); }}
              okText="Reset"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <button className={styles.resetBtn}>
                <ReloadOutlined />
                Reset
              </button>
            </Popconfirm>
          </div>
          <div className={styles.habitTracker}>
            {habitProgress.map((habit) => (
              <div key={habit.id} className={styles.habitRow}>
                <div className={styles.habitInfo}>
                  <div
                    className={styles.habitColorDot}
                    style={{ backgroundColor: habit.color }}
                  />
                  {editingHabit === habit.id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      className={styles.habitNameInput}
                      defaultValue={habit.name}
                      onBlur={(e) => handleUpdateHabit(habit.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateHabit(habit.id, e.currentTarget.value);
                        else if (e.key === 'Escape') setEditingHabit(null);
                      }}
                    />
                  ) : (
                    <span
                      className={styles.habitName}
                      onDoubleClick={() => setEditingHabit(habit.id)}
                    >
                      {habit.name}
                    </span>
                  )}
                  <div className={styles.habitActions}>
                    <Popconfirm
                      title="Delete habit"
                      description="Are you sure?"
                      onConfirm={() => removeHabit(habit.id)}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true }}
                    >
                      <button className={`${styles.habitActionBtn} ${styles.habitActionBtnDanger}`}>
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </div>
                </div>

                <div className={styles.habitCheckboxes}>
                  {habit.weeklyProgress.map((checked, dayIndex) => {
                    const isTodayDay = isToday(DAY_NAMES[dayIndex]);
                    return (
                      <button
                        key={dayIndex}
                        className={`${styles.habitCheckbox} ${checked ? styles.habitCheckboxChecked : ''} ${isTodayDay ? styles.habitCheckboxToday : ''}`}
                        style={checked ? { backgroundColor: habit.color } : undefined}
                        onClick={() => toggleHabitDay(habit.id, dayIndex)}
                        title={DAY_FULL_LABELS[DAY_NAMES[dayIndex]]}
                      >
                        {checked && <CheckOutlined />}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.habitProgress}>
                  <div className={styles.habitProgressBar}>
                    <div
                      className={styles.habitProgressFill}
                      style={{ width: `${habit.percentage}%`, backgroundColor: habit.color }}
                    />
                  </div>
                  <span className={styles.habitProgressText}>{habit.completedDays}/7</span>
                </div>
              </div>
            ))}

            {/* Add Habit */}
            {showAddHabit ? (
              <div className={styles.habitRow}>
                <div className={styles.habitInfo}>
                  <Popover content={colorPickerContent} trigger="click" placement="bottom">
                    <div
                      className={styles.habitColorDot}
                      style={{ backgroundColor: newHabitColor, cursor: 'pointer' }}
                    />
                  </Popover>
                  <input
                    type="text"
                    className={styles.habitNameInput}
                    placeholder="Enter habit name..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddHabit();
                      else if (e.key === 'Escape') { setShowAddHabit(false); setNewHabitName(''); }
                    }}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className={styles.addTaskBtn} onClick={handleAddHabit} disabled={!newHabitName.trim()}>
                    <CheckOutlined />
                  </button>
                  <button className={styles.habitActionBtn} onClick={() => { setShowAddHabit(false); setNewHabitName(''); }}>
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <button className={styles.addHabitBtn} onClick={() => setShowAddHabit(true)}>
                <PlusOutlined /> Add New Habit
              </button>
            )}
          </div>
        </section>

        {/* Completion Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}><PieChartOutlined /></span>
              Completion
            </h2>
            <div className={styles.viewModeToggle}>
              {(['daily', 'weekly', 'monthly'] as TaskViewMode[]).map((mode) => (
                <button
                  key={mode}
                  className={`${styles.viewModeBtn} ${taskViewMode === mode ? styles.viewModeBtnActive : ''}`}
                  onClick={() => setTaskViewMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.completionSection}>
            <p className={styles.completionViewLabel}>
              Showing <span className={styles.completionViewLabelHighlight}>{getViewLabel()}</span> Task Completion
            </p>

            {/* Pie Chart */}
            <div className={styles.completionChart}>
              <div className={styles.pieChartContainer}>
                <svg className={styles.pieChartSvg} width="180" height="180" viewBox="0 0 180 180">
                  <circle className={styles.pieChartBg} cx="90" cy="90" r={pieRadius} />
                  <circle
                    className={styles.pieChartFill}
                    cx="90"
                    cy="90"
                    r={pieRadius}
                    stroke={completionData.overall.percentage === 100 ? '#10b981' : '#6366f1'}
                    strokeDasharray={pieCircumference}
                    strokeDashoffset={pieOffset}
                  />
                </svg>
                <div className={styles.pieChartCenter}>
                  <span className={styles.pieChartPercent}>{completionData.overall.percentage}%</span>
                  <span className={styles.pieChartLabel}>Complete</span>
                </div>
              </div>
            </div>

            {/* Per-unit completion bars */}
            <div className={`${styles.completionMiniCards} ${taskViewMode === 'weekly' ? styles.completionMiniCardsWeekly :
              taskViewMode === 'monthly' ? styles.completionMiniCardsMonthly : ''
              }`}>
              {taskViewMode === 'daily' && DAY_NAMES.map((day) => {
                const rate = dailyTasksCompletion[day];
                const isTodayDay = isToday(day);
                return (
                  <div key={day} className={`${styles.completionMiniCard} ${isTodayDay ? styles.completionMiniCardActive : ''}`}>
                    <div className={styles.completionMiniBar}>
                      <div
                        className={styles.completionMiniBarFill}
                        style={{ height: `${Math.max(5, rate.percentage)}%` }}
                      />
                    </div>
                    <span className={styles.completionMiniPercent}>{rate.percentage}%</span>
                    <span className={styles.completionMiniLabel}>{DAY_LABELS[day]}</span>
                  </div>
                );
              })}
              {taskViewMode === 'weekly' && WEEK_NAMES.map((week) => {
                const rate = weeklyTasksCompletion[week];
                return (
                  <div key={week} className={styles.completionMiniCard}>
                    <div className={styles.completionMiniBar}>
                      <div
                        className={styles.completionMiniBarFill}
                        style={{ height: `${Math.max(5, rate.percentage)}%` }}
                      />
                    </div>
                    <span className={styles.completionMiniPercent}>{rate.percentage}%</span>
                    <span className={styles.completionMiniLabel}>{WEEK_LABELS[week]}</span>
                  </div>
                );
              })}
              {taskViewMode === 'monthly' && MONTH_DAYS.map((day) => {
                const rate = monthlyTasksCompletion[day];
                return (
                  <div key={day} className={styles.completionMiniCard}>
                    <div className={styles.completionMiniBar}>
                      <div
                        className={styles.completionMiniBarFill}
                        style={{ height: `${Math.max(5, rate.percentage)}%` }}
                      />
                    </div>
                    <span className={styles.completionMiniPercent}>{rate.percentage}%</span>
                    <span className={styles.completionMiniLabel}>Day {day}</span>
                  </div>
                );
              })}
            </div>

            <div className={styles.completionStats}>
              <div className={styles.completionStatItem}>
                <span className={styles.completionStatValue}>{completionData.overall.completed}</span>
                <span className={styles.completionStatTitle}>Completed</span>
              </div>
              <div className={styles.completionStatItem}>
                <span className={styles.completionStatValue}>{completionData.overall.total - completionData.overall.completed}</span>
                <span className={styles.completionStatTitle}>Remaining</span>
              </div>
              <div className={styles.completionStatItem}>
                <span className={styles.completionStatValue}>{completionData.overall.total}</span>
                <span className={styles.completionStatTitle}>Total</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tasks Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>
                {taskViewMode === 'monthly' ? <CalendarOutlined /> : <UnorderedListOutlined />}
              </span>
              Tasks
            </h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className={styles.viewModeToggle}>
                {(['daily', 'weekly', 'monthly'] as TaskViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    className={`${styles.viewModeBtn} ${taskViewMode === mode ? styles.viewModeBtnActive : ''}`}
                    onClick={() => setTaskViewMode(mode)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
              <Popconfirm
                title={`Reset ${getViewLabel()} Tasks`}
                description="Mark all tasks as incomplete?"
                onConfirm={handleReset}
                okText="Reset"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <button className={styles.resetBtn}>
                  <ReloadOutlined />
                  Reset
                </button>
              </Popconfirm>
            </div>
          </div>

          <div className={styles.tasksSection}>
            {/* Daily Tasks View */}
            {taskViewMode === 'daily' && (
              <div className={styles.dailyTasksGrid}>
                {DAY_NAMES.map((day) => {
                  const tasks = dailyTasks[day];
                  const rate = dailyTasksCompletion[day];
                  const isTodayDay = isToday(day);
                  const isComplete = rate.total > 0 && rate.completed === rate.total;

                  return (
                    <div key={day} className={`${styles.taskCard} ${isTodayDay ? styles.taskCardToday : ''} ${styles.animated}`}>
                      <div className={styles.taskCardHeader}>
                        <span className={styles.taskCardTitle}>{DAY_FULL_LABELS[day]}</span>
                        <span className={`${styles.taskCardBadge} ${isComplete ? styles.taskCardBadgeComplete : ''}`}>
                          {rate.completed}/{rate.total}
                        </span>
                      </div>

                      <div className={styles.taskCardList}>
                        {tasks.length === 0 ? (
                          <div className={styles.taskCardEmpty}>No tasks</div>
                        ) : (
                          tasks.map((task) => (
                            <div key={task.id} className={styles.taskItem}>
                              <button
                                className={`${styles.taskCheckbox} ${task.completed ? styles.taskCheckboxChecked : ''}`}
                                onClick={() => toggleDailyTask(day, task.id)}
                              >
                                {task.completed && <CheckOutlined />}
                              </button>
                              <span className={`${styles.taskText} ${task.completed ? styles.taskTextCompleted : ''}`}>
                                {task.text}
                              </span>
                              <button className={styles.taskDeleteBtn} onClick={() => removeDailyTask(day, task.id)}>
                                <DeleteOutlined />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className={styles.addTaskForm}>
                        <input
                          type="text"
                          className={styles.addTaskInput}
                          placeholder="Add task..."
                          value={dailyInputs[day]}
                          onChange={(e) => setDailyInputs({ ...dailyInputs, [day]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddDailyTask(day)}
                        />
                        <button
                          className={styles.addTaskBtn}
                          onClick={() => handleAddDailyTask(day)}
                          disabled={!dailyInputs[day].trim()}
                        >
                          <PlusOutlined />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Weekly Tasks View */}
            {taskViewMode === 'weekly' && (
              <div className={styles.weeklyTasksGrid}>
                {WEEK_NAMES.map((week) => {
                  const tasks = weeklyTasks[week];
                  const rate = weeklyTasksCompletion[week];
                  const isComplete = rate.total > 0 && rate.completed === rate.total;

                  return (
                    <div key={week} className={`${styles.taskCard} ${styles.animated}`}>
                      <div className={styles.taskCardHeader}>
                        <span className={styles.taskCardTitle}>{WEEK_LABELS[week]}</span>
                        <span className={`${styles.taskCardBadge} ${isComplete ? styles.taskCardBadgeComplete : ''}`}>
                          {rate.completed}/{rate.total}
                        </span>
                      </div>

                      <div className={styles.taskCardList}>
                        {tasks.length === 0 ? (
                          <div className={styles.taskCardEmpty}>No tasks</div>
                        ) : (
                          tasks.map((task) => (
                            <div key={task.id} className={styles.taskItem}>
                              <button
                                className={`${styles.taskCheckbox} ${task.completed ? styles.taskCheckboxChecked : ''}`}
                                onClick={() => toggleWeeklyTask(week, task.id)}
                              >
                                {task.completed && <CheckOutlined />}
                              </button>
                              <span className={`${styles.taskText} ${task.completed ? styles.taskTextCompleted : ''}`}>
                                {task.text}
                              </span>
                              <button className={styles.taskDeleteBtn} onClick={() => removeWeeklyTask(week, task.id)}>
                                <DeleteOutlined />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className={styles.addTaskForm}>
                        <input
                          type="text"
                          className={styles.addTaskInput}
                          placeholder="Add task..."
                          value={weeklyInputs[week]}
                          onChange={(e) => setWeeklyInputs({ ...weeklyInputs, [week]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddWeeklyTask(week)}
                        />
                        <button
                          className={styles.addTaskBtn}
                          onClick={() => handleAddWeeklyTask(week)}
                          disabled={!weeklyInputs[week].trim()}
                        >
                          <PlusOutlined />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Monthly Tasks View */}
            {taskViewMode === 'monthly' && (
              <div className={styles.monthlyTasksGrid}>
                {MONTH_DAYS.map((day) => {
                  const tasks = monthlyTasks[day] || [];
                  const rate = monthlyTasksCompletion[day];
                  const isComplete = rate.total > 0 && rate.completed === rate.total;

                  return (
                    <div key={day} className={`${styles.taskCard} ${styles.animated}`}>
                      <div className={styles.taskCardHeader}>
                        <span className={styles.taskCardTitle}>Day {day}</span>
                        <span className={`${styles.taskCardBadge} ${isComplete ? styles.taskCardBadgeComplete : ''}`}>
                          {rate.completed}/{rate.total}
                        </span>
                      </div>

                      <div className={styles.taskCardList}>
                        {tasks.length === 0 ? (
                          <div className={styles.taskCardEmpty}>No tasks</div>
                        ) : (
                          tasks.map((task) => (
                            <div key={task.id} className={styles.taskItem}>
                              <button
                                className={`${styles.taskCheckbox} ${task.completed ? styles.taskCheckboxChecked : ''}`}
                                onClick={() => toggleMonthlyTask(day, task.id)}
                              >
                                {task.completed && <CheckOutlined />}
                              </button>
                              <span className={`${styles.taskText} ${task.completed ? styles.taskTextCompleted : ''}`}>
                                {task.text}
                              </span>
                              <button className={styles.taskDeleteBtn} onClick={() => removeMonthlyTask(day, task.id)}>
                                <DeleteOutlined />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className={styles.addTaskForm}>
                        <input
                          type="text"
                          className={styles.addTaskInput}
                          placeholder="Add..."
                          value={monthlyInputs[day] || ''}
                          onChange={(e) => setMonthlyInputs({ ...monthlyInputs, [day]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddMonthlyTask(day)}
                        />
                        <button
                          className={styles.addTaskBtn}
                          onClick={() => handleAddMonthlyTask(day)}
                          disabled={!(monthlyInputs[day] || '').trim()}
                        >
                          <PlusOutlined />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
