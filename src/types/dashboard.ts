// Dashboard Types - Weekly Planning & Tracking

// Task View Modes
export type TaskViewMode = 'daily' | 'weekly' | 'monthly';

// Base Task Interface
export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
}

// Habit Interface (repetitive, same every day)
export interface Habit {
    id: string;
    name: string;
    color: string;
    weeklyProgress: boolean[]; // Mon-Sun (7 days)
}

// Daily Tasks Structure (7 days: Monday - Sunday)
export interface DailyTasks {
    monday: Task[];
    tuesday: Task[];
    wednesday: Task[];
    thursday: Task[];
    friday: Task[];
    saturday: Task[];
    sunday: Task[];
}

// Weekly Tasks Structure (4 weeks in a month)
export interface WeeklyTasks {
    week1: Task[];
    week2: Task[];
    week3: Task[];
    week4: Task[];
}

// Monthly Tasks Structure (30 days)
export interface MonthlyTasks {
    [day: number]: Task[]; // 1-30
}

export type DayKey = keyof DailyTasks;
export type WeekKey = keyof WeeklyTasks;

// Completion Rate Types
export interface CompletionRate {
    total: number;
    completed: number;
    percentage: number;
}

export interface DailyCompletionRates {
    [key: string]: CompletionRate; // day key -> completion rate
}

export interface WeeklyCompletionRates {
    [key: string]: CompletionRate; // week key -> completion rate
}

export interface MonthlyCompletionRates {
    [day: number]: CompletionRate; // day number -> completion rate
}

// Dashboard State
export interface DashboardState {
    habits: Habit[];
    dailyTasks: DailyTasks;
    weeklyTasks: WeeklyTasks;
    monthlyTasks: MonthlyTasks;
    taskViewMode: TaskViewMode;
    currentMonth: number; // 1-12
    currentYear: number;
    weekStartDate: string; // ISO date string for the Monday of current week
}

// Day names for iteration
export const DAY_NAMES: DayKey[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
];

export const DAY_LABELS: Record<DayKey, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun'
};

export const DAY_FULL_LABELS: Record<DayKey, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
};

export const WEEK_NAMES: WeekKey[] = ['week1', 'week2', 'week3', 'week4'];

export const WEEK_LABELS: Record<WeekKey, string> = {
    week1: 'Week 1',
    week2: 'Week 2',
    week3: 'Week 3',
    week4: 'Week 4'
};

// Generate day numbers for monthly view (1-30)
export const MONTH_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
