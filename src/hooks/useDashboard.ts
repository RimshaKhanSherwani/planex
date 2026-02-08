import { useAtom } from 'jotai';
import {
    dashboardStateAtom,
    themeAtom,
    taskViewModeAtom,
    habitProgressAtom,
    dailyTasksCompletionAtom,
    dailyOverallCompletionAtom,
    weeklyTasksCompletionAtom,
    weeklyOverallCompletionAtom,
    monthlyTasksCompletionAtom,
    monthlyOverallCompletionAtom,
    currentCompletionAtom,
    currentUnitCompletionAtom,
    toggleHabitDayAtom,
    addHabitAtom,
    removeHabitAtom,
    updateHabitAtom,
    toggleDailyTaskAtom,
    addDailyTaskAtom,
    removeDailyTaskAtom,
    updateDailyTaskAtom,
    toggleWeeklyTaskAtom,
    addWeeklyTaskAtom,
    removeWeeklyTaskAtom,
    updateWeeklyTaskAtom,
    toggleMonthlyTaskAtom,
    addMonthlyTaskAtom,
    removeMonthlyTaskAtom,
    updateMonthlyTaskAtom,
    resetHabitsAtom,
    resetDailyTasksAtom,
    resetWeeklyTasksAtom,
    resetMonthlyTasksAtom,
    resetAllAtom,
} from '@/store/dashboardStore';
import { DayKey, WeekKey, TaskViewMode } from '@/types/dashboard';

export function useDashboard() {
    // Core state
    const [dashboardState] = useAtom(dashboardStateAtom);
    const [theme, setTheme] = useAtom(themeAtom);
    const [taskViewMode, setTaskViewMode] = useAtom(taskViewModeAtom);

    // Habit state
    const [habitProgress] = useAtom(habitProgressAtom);

    // Daily completion state
    const [dailyTasksCompletion] = useAtom(dailyTasksCompletionAtom);
    const [dailyOverallCompletion] = useAtom(dailyOverallCompletionAtom);

    // Weekly completion state
    const [weeklyTasksCompletion] = useAtom(weeklyTasksCompletionAtom);
    const [weeklyOverallCompletion] = useAtom(weeklyOverallCompletionAtom);

    // Monthly completion state
    const [monthlyTasksCompletion] = useAtom(monthlyTasksCompletionAtom);
    const [monthlyOverallCompletion] = useAtom(monthlyOverallCompletionAtom);

    // Dynamic completion (based on current view)
    const [currentCompletion] = useAtom(currentCompletionAtom);
    const [currentUnitCompletion] = useAtom(currentUnitCompletionAtom);

    // Habit actions
    const [, toggleHabitDay] = useAtom(toggleHabitDayAtom);
    const [, addHabit] = useAtom(addHabitAtom);
    const [, removeHabit] = useAtom(removeHabitAtom);
    const [, updateHabit] = useAtom(updateHabitAtom);

    // Daily task actions
    const [, toggleDailyTask] = useAtom(toggleDailyTaskAtom);
    const [, addDailyTask] = useAtom(addDailyTaskAtom);
    const [, removeDailyTask] = useAtom(removeDailyTaskAtom);
    const [, updateDailyTask] = useAtom(updateDailyTaskAtom);

    // Weekly task actions
    const [, toggleWeeklyTask] = useAtom(toggleWeeklyTaskAtom);
    const [, addWeeklyTask] = useAtom(addWeeklyTaskAtom);
    const [, removeWeeklyTask] = useAtom(removeWeeklyTaskAtom);
    const [, updateWeeklyTask] = useAtom(updateWeeklyTaskAtom);

    // Monthly task actions
    const [, toggleMonthlyTask] = useAtom(toggleMonthlyTaskAtom);
    const [, addMonthlyTask] = useAtom(addMonthlyTaskAtom);
    const [, removeMonthlyTask] = useAtom(removeMonthlyTaskAtom);
    const [, updateMonthlyTask] = useAtom(updateMonthlyTaskAtom);

    // Reset actions
    const [, resetHabits] = useAtom(resetHabitsAtom);
    const [, resetDailyTasks] = useAtom(resetDailyTasksAtom);
    const [, resetWeeklyTasks] = useAtom(resetWeeklyTasksAtom);
    const [, resetMonthlyTasks] = useAtom(resetMonthlyTasksAtom);
    const [, resetAll] = useAtom(resetAllAtom);

    return {
        // Core state
        habits: dashboardState.habits,
        dailyTasks: dashboardState.dailyTasks,
        weeklyTasks: dashboardState.weeklyTasks,
        monthlyTasks: dashboardState.monthlyTasks,
        taskViewMode,
        theme,

        // Habit derived state
        habitProgress,

        // Daily completion
        dailyTasksCompletion,
        dailyOverallCompletion,

        // Weekly completion
        weeklyTasksCompletion,
        weeklyOverallCompletion,

        // Monthly completion
        monthlyTasksCompletion,
        monthlyOverallCompletion,

        // Dynamic completion (adapts to current view)
        currentCompletion,
        currentUnitCompletion,

        // Theme action
        toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
        setTheme,

        // Task view mode action
        setTaskViewMode: (mode: TaskViewMode) => setTaskViewMode(mode),

        // Habit actions
        toggleHabitDay: (habitId: string, dayIndex: number) => toggleHabitDay({ habitId, dayIndex }),
        addHabit: (name: string, color: string) => addHabit({ name, color }),
        removeHabit: (habitId: string) => removeHabit(habitId),
        updateHabit: (habitId: string, name: string, color: string) => updateHabit({ habitId, name, color }),

        // Daily task actions
        toggleDailyTask: (day: DayKey, taskId: string) => toggleDailyTask({ day, taskId }),
        addDailyTask: (day: DayKey, text: string) => addDailyTask({ day, text }),
        removeDailyTask: (day: DayKey, taskId: string) => removeDailyTask({ day, taskId }),
        updateDailyTask: (day: DayKey, taskId: string, text: string) => updateDailyTask({ day, taskId, text }),

        // Weekly task actions
        toggleWeeklyTask: (week: WeekKey, taskId: string) => toggleWeeklyTask({ week, taskId }),
        addWeeklyTask: (week: WeekKey, text: string) => addWeeklyTask({ week, text }),
        removeWeeklyTask: (week: WeekKey, taskId: string) => removeWeeklyTask({ week, taskId }),
        updateWeeklyTask: (week: WeekKey, taskId: string, text: string) => updateWeeklyTask({ week, taskId, text }),

        // Monthly task actions
        toggleMonthlyTask: (day: number, taskId: string) => toggleMonthlyTask({ day, taskId }),
        addMonthlyTask: (day: number, text: string) => addMonthlyTask({ day, text }),
        removeMonthlyTask: (day: number, taskId: string) => removeMonthlyTask({ day, taskId }),
        updateMonthlyTask: (day: number, taskId: string, text: string) => updateMonthlyTask({ day, taskId, text }),

        // Reset actions
        resetHabits: () => resetHabits(),
        resetDailyTasks: () => resetDailyTasks(),
        resetWeeklyTasks: () => resetWeeklyTasks(),
        resetMonthlyTasks: () => resetMonthlyTasks(),
        resetAll: () => resetAll(),
    };
}
