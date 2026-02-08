import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import dayjs from 'dayjs';
import {
    DashboardState,
    Habit,
    Task,
    DailyTasks,
    WeeklyTasks,
    MonthlyTasks,
    TaskViewMode,
    DAY_NAMES,
    WEEK_NAMES,
    MONTH_DAYS,
    DayKey,
    WeekKey,
    CompletionRate,
} from '@/types/dashboard';

// Helper to get start of current week (Monday)
const getWeekStart = (): string => {
    const today = dayjs();
    const dayOfWeek = today.day();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    return today.add(diff, 'day').format('YYYY-MM-DD');
};

// Initial habits
const initialHabits: Habit[] = [
    { id: 'habit-1', name: 'Morning Exercise', color: '#10b981', weeklyProgress: [false, false, false, false, false, false, false] },
    { id: 'habit-2', name: 'Read 30 minutes', color: '#6366f1', weeklyProgress: [false, false, false, false, false, false, false] },
    { id: 'habit-3', name: 'Drink 8 glasses of water', color: '#3b82f6', weeklyProgress: [false, false, false, false, false, false, false] },
    { id: 'habit-4', name: 'Meditation', color: '#8b5cf6', weeklyProgress: [false, false, false, false, false, false, false] },
    { id: 'habit-5', name: 'No social media before noon', color: '#f59e0b', weeklyProgress: [false, false, false, false, false, false, false] },
];

// Initial daily tasks
const initialDailyTasks: DailyTasks = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
};

// Initial weekly tasks
const initialWeeklyTasks: WeeklyTasks = {
    week1: [],
    week2: [],
    week3: [],
    week4: [],
};

// Initial monthly tasks
const initialMonthlyTasks: MonthlyTasks = {};
MONTH_DAYS.forEach(day => {
    initialMonthlyTasks[day] = [];
});

// Main dashboard state with localStorage persistence
export const dashboardStateAtom = atomWithStorage<DashboardState>('planex-dashboard-v2', {
    habits: initialHabits,
    dailyTasks: initialDailyTasks,
    weeklyTasks: initialWeeklyTasks,
    monthlyTasks: initialMonthlyTasks,
    taskViewMode: 'daily',
    currentMonth: dayjs().month() + 1,
    currentYear: dayjs().year(),
    weekStartDate: getWeekStart(),
});

// Theme atom with localStorage persistence
export const themeAtom = atomWithStorage<'light' | 'dark'>('planex-theme', 'dark');

// Task view mode atom (also persisted)
export const taskViewModeAtom = atom(
    (get) => get(dashboardStateAtom).taskViewMode,
    (get, set, mode: TaskViewMode) => {
        const state = get(dashboardStateAtom);
        set(dashboardStateAtom, { ...state, taskViewMode: mode });
    }
);

// ============================================
// HABIT DERIVED ATOMS
// ============================================

export const habitProgressAtom = atom((get) => {
    const state = get(dashboardStateAtom);
    return state.habits.map(habit => {
        const completed = habit.weeklyProgress.filter(Boolean).length;
        return {
            ...habit,
            completedDays: completed,
            percentage: Math.round((completed / 7) * 100),
        };
    });
});

// ============================================
// DAILY TASKS DERIVED ATOMS
// ============================================

export const dailyTasksCompletionAtom = atom((get) => {
    const state = get(dashboardStateAtom);
    const rates: Record<DayKey, CompletionRate> = {} as Record<DayKey, CompletionRate>;

    DAY_NAMES.forEach((day) => {
        const tasks = state.dailyTasks[day];
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        rates[day] = {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    });

    return rates;
});

export const dailyOverallCompletionAtom = atom((get) => {
    const dailyRates = get(dailyTasksCompletionAtom);
    let totalTasks = 0;
    let completedTasks = 0;

    DAY_NAMES.forEach((day) => {
        totalTasks += dailyRates[day].total;
        completedTasks += dailyRates[day].completed;
    });

    return {
        total: totalTasks,
        completed: completedTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
});

// ============================================
// WEEKLY TASKS DERIVED ATOMS
// ============================================

export const weeklyTasksCompletionAtom = atom((get) => {
    const state = get(dashboardStateAtom);
    const rates: Record<WeekKey, CompletionRate> = {} as Record<WeekKey, CompletionRate>;

    WEEK_NAMES.forEach((week) => {
        const tasks = state.weeklyTasks[week];
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        rates[week] = {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    });

    return rates;
});

export const weeklyOverallCompletionAtom = atom((get) => {
    const weeklyRates = get(weeklyTasksCompletionAtom);
    let totalTasks = 0;
    let completedTasks = 0;

    WEEK_NAMES.forEach((week) => {
        totalTasks += weeklyRates[week].total;
        completedTasks += weeklyRates[week].completed;
    });

    return {
        total: totalTasks,
        completed: completedTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
});

// ============================================
// MONTHLY TASKS DERIVED ATOMS
// ============================================

export const monthlyTasksCompletionAtom = atom((get) => {
    const state = get(dashboardStateAtom);
    const rates: Record<number, CompletionRate> = {};

    MONTH_DAYS.forEach((day) => {
        const tasks = state.monthlyTasks[day] || [];
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        rates[day] = {
            total,
            completed,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
    });

    return rates;
});

export const monthlyOverallCompletionAtom = atom((get) => {
    const monthlyRates = get(monthlyTasksCompletionAtom);
    let totalTasks = 0;
    let completedTasks = 0;

    MONTH_DAYS.forEach((day) => {
        totalTasks += monthlyRates[day].total;
        completedTasks += monthlyRates[day].completed;
    });

    return {
        total: totalTasks,
        completed: completedTasks,
        percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
});

// ============================================
// DYNAMIC COMPLETION ATOM (based on current view)
// ============================================

export const currentCompletionAtom = atom((get) => {
    const state = get(dashboardStateAtom);
    const mode = state.taskViewMode;

    switch (mode) {
        case 'daily':
            return get(dailyOverallCompletionAtom);
        case 'weekly':
            return get(weeklyOverallCompletionAtom);
        case 'monthly':
            return get(monthlyOverallCompletionAtom);
        default:
            return get(dailyOverallCompletionAtom);
    }
});

// Per-unit completion rates based on current view
export const currentUnitCompletionAtom = atom((get) => {
    const state = get(dashboardStateAtom);
    const mode = state.taskViewMode;

    switch (mode) {
        case 'daily':
            return { type: 'daily' as const, data: get(dailyTasksCompletionAtom) };
        case 'weekly':
            return { type: 'weekly' as const, data: get(weeklyTasksCompletionAtom) };
        case 'monthly':
            return { type: 'monthly' as const, data: get(monthlyTasksCompletionAtom) };
        default:
            return { type: 'daily' as const, data: get(dailyTasksCompletionAtom) };
    }
});

// ============================================
// ACTION ATOMS - HABITS
// ============================================

export const toggleHabitDayAtom = atom(
    null,
    (get, set, { habitId, dayIndex }: { habitId: string; dayIndex: number }) => {
        const state = get(dashboardStateAtom);
        const updatedHabits = state.habits.map(habit => {
            if (habit.id === habitId) {
                const newProgress = [...habit.weeklyProgress];
                newProgress[dayIndex] = !newProgress[dayIndex];
                return { ...habit, weeklyProgress: newProgress };
            }
            return habit;
        });
        set(dashboardStateAtom, { ...state, habits: updatedHabits });
    }
);

export const addHabitAtom = atom(
    null,
    (get, set, { name, color }: { name: string; color: string }) => {
        const state = get(dashboardStateAtom);
        const newHabit: Habit = {
            id: `habit-${Date.now()}`,
            name,
            color,
            weeklyProgress: [false, false, false, false, false, false, false],
        };
        set(dashboardStateAtom, { ...state, habits: [...state.habits, newHabit] });
    }
);

export const removeHabitAtom = atom(
    null,
    (get, set, habitId: string) => {
        const state = get(dashboardStateAtom);
        set(dashboardStateAtom, {
            ...state,
            habits: state.habits.filter(h => h.id !== habitId),
        });
    }
);

export const updateHabitAtom = atom(
    null,
    (get, set, { habitId, name, color }: { habitId: string; name: string; color: string }) => {
        const state = get(dashboardStateAtom);
        const updatedHabits = state.habits.map(habit =>
            habit.id === habitId ? { ...habit, name, color } : habit
        );
        set(dashboardStateAtom, { ...state, habits: updatedHabits });
    }
);

// ============================================
// ACTION ATOMS - DAILY TASKS
// ============================================

export const toggleDailyTaskAtom = atom(
    null,
    (get, set, { day, taskId }: { day: DayKey; taskId: string }) => {
        const state = get(dashboardStateAtom);
        const updatedTasks = {
            ...state.dailyTasks,
            [day]: state.dailyTasks[day].map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
        };
        set(dashboardStateAtom, { ...state, dailyTasks: updatedTasks });
    }
);

export const addDailyTaskAtom = atom(
    null,
    (get, set, { day, text }: { day: DayKey; text: string }) => {
        const state = get(dashboardStateAtom);
        const newTask: Task = {
            id: `task-daily-${day}-${Date.now()}`,
            text,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const updatedTasks = {
            ...state.dailyTasks,
            [day]: [...state.dailyTasks[day], newTask],
        };
        set(dashboardStateAtom, { ...state, dailyTasks: updatedTasks });
    }
);

export const removeDailyTaskAtom = atom(
    null,
    (get, set, { day, taskId }: { day: DayKey; taskId: string }) => {
        const state = get(dashboardStateAtom);
        const updatedTasks = {
            ...state.dailyTasks,
            [day]: state.dailyTasks[day].filter(task => task.id !== taskId),
        };
        set(dashboardStateAtom, { ...state, dailyTasks: updatedTasks });
    }
);

export const updateDailyTaskAtom = atom(
    null,
    (get, set, { day, taskId, text }: { day: DayKey; taskId: string; text: string }) => {
        const state = get(dashboardStateAtom);
        const updatedTasks = {
            ...state.dailyTasks,
            [day]: state.dailyTasks[day].map(task =>
                task.id === taskId ? { ...task, text } : task
            ),
        };
        set(dashboardStateAtom, { ...state, dailyTasks: updatedTasks });
    }
);

// ============================================
// ACTION ATOMS - WEEKLY TASKS
// ============================================

export const toggleWeeklyTaskAtom = atom(
    null,
    (get, set, { week, taskId }: { week: WeekKey; taskId: string }) => {
        const state = get(dashboardStateAtom);
        const updatedTasks = {
            ...state.weeklyTasks,
            [week]: state.weeklyTasks[week].map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
        };
        set(dashboardStateAtom, { ...state, weeklyTasks: updatedTasks });
    }
);

export const addWeeklyTaskAtom = atom(
    null,
    (get, set, { week, text }: { week: WeekKey; text: string }) => {
        const state = get(dashboardStateAtom);
        const newTask: Task = {
            id: `task-weekly-${week}-${Date.now()}`,
            text,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const updatedTasks = {
            ...state.weeklyTasks,
            [week]: [...state.weeklyTasks[week], newTask],
        };
        set(dashboardStateAtom, { ...state, weeklyTasks: updatedTasks });
    }
);

export const removeWeeklyTaskAtom = atom(
    null,
    (get, set, { week, taskId }: { week: WeekKey; taskId: string }) => {
        const state = get(dashboardStateAtom);
        const updatedTasks = {
            ...state.weeklyTasks,
            [week]: state.weeklyTasks[week].filter(task => task.id !== taskId),
        };
        set(dashboardStateAtom, { ...state, weeklyTasks: updatedTasks });
    }
);

export const updateWeeklyTaskAtom = atom(
    null,
    (get, set, { week, taskId, text }: { week: WeekKey; taskId: string; text: string }) => {
        const state = get(dashboardStateAtom);
        const updatedTasks = {
            ...state.weeklyTasks,
            [week]: state.weeklyTasks[week].map(task =>
                task.id === taskId ? { ...task, text } : task
            ),
        };
        set(dashboardStateAtom, { ...state, weeklyTasks: updatedTasks });
    }
);

// ============================================
// ACTION ATOMS - MONTHLY TASKS
// ============================================

export const toggleMonthlyTaskAtom = atom(
    null,
    (get, set, { day, taskId }: { day: number; taskId: string }) => {
        const state = get(dashboardStateAtom);
        const dayTasks = state.monthlyTasks[day] || [];
        const updatedTasks = {
            ...state.monthlyTasks,
            [day]: dayTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
        };
        set(dashboardStateAtom, { ...state, monthlyTasks: updatedTasks });
    }
);

export const addMonthlyTaskAtom = atom(
    null,
    (get, set, { day, text }: { day: number; text: string }) => {
        const state = get(dashboardStateAtom);
        const newTask: Task = {
            id: `task-monthly-${day}-${Date.now()}`,
            text,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const dayTasks = state.monthlyTasks[day] || [];
        const updatedTasks = {
            ...state.monthlyTasks,
            [day]: [...dayTasks, newTask],
        };
        set(dashboardStateAtom, { ...state, monthlyTasks: updatedTasks });
    }
);

export const removeMonthlyTaskAtom = atom(
    null,
    (get, set, { day, taskId }: { day: number; taskId: string }) => {
        const state = get(dashboardStateAtom);
        const dayTasks = state.monthlyTasks[day] || [];
        const updatedTasks = {
            ...state.monthlyTasks,
            [day]: dayTasks.filter(task => task.id !== taskId),
        };
        set(dashboardStateAtom, { ...state, monthlyTasks: updatedTasks });
    }
);

export const updateMonthlyTaskAtom = atom(
    null,
    (get, set, { day, taskId, text }: { day: number; taskId: string; text: string }) => {
        const state = get(dashboardStateAtom);
        const dayTasks = state.monthlyTasks[day] || [];
        const updatedTasks = {
            ...state.monthlyTasks,
            [day]: dayTasks.map(task =>
                task.id === taskId ? { ...task, text } : task
            ),
        };
        set(dashboardStateAtom, { ...state, monthlyTasks: updatedTasks });
    }
);

// ============================================
// RESET ATOMS
// ============================================

export const resetHabitsAtom = atom(
    null,
    (get, set) => {
        const state = get(dashboardStateAtom);
        const resetHabits = state.habits.map(h => ({
            ...h,
            weeklyProgress: [false, false, false, false, false, false, false] as boolean[],
        }));
        set(dashboardStateAtom, { ...state, habits: resetHabits });
    }
);

export const resetDailyTasksAtom = atom(
    null,
    (get, set) => {
        const state = get(dashboardStateAtom);
        const resetTasks: DailyTasks = {} as DailyTasks;
        DAY_NAMES.forEach((day) => {
            resetTasks[day] = state.dailyTasks[day].map(t => ({ ...t, completed: false }));
        });
        set(dashboardStateAtom, { ...state, dailyTasks: resetTasks });
    }
);

export const resetWeeklyTasksAtom = atom(
    null,
    (get, set) => {
        const state = get(dashboardStateAtom);
        const resetTasks: WeeklyTasks = {} as WeeklyTasks;
        WEEK_NAMES.forEach((week) => {
            resetTasks[week] = state.weeklyTasks[week].map(t => ({ ...t, completed: false }));
        });
        set(dashboardStateAtom, { ...state, weeklyTasks: resetTasks });
    }
);

export const resetMonthlyTasksAtom = atom(
    null,
    (get, set) => {
        const state = get(dashboardStateAtom);
        const resetTasks: MonthlyTasks = {};
        MONTH_DAYS.forEach((day) => {
            const dayTasks = state.monthlyTasks[day] || [];
            resetTasks[day] = dayTasks.map(t => ({ ...t, completed: false }));
        });
        set(dashboardStateAtom, { ...state, monthlyTasks: resetTasks });
    }
);

export const resetAllAtom = atom(
    null,
    (get, set) => {
        set(resetHabitsAtom);
        set(resetDailyTasksAtom);
        set(resetWeeklyTasksAtom);
        set(resetMonthlyTasksAtom);
    }
);
