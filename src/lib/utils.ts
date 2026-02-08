import dayjs from 'dayjs';
import { DayKey, DAY_NAMES } from '@/types/dashboard';

// Get a consistent hash color from a string
export function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

// Get current day of week as DayKey
export function getCurrentDay(): DayKey {
    const dayIndex = dayjs().day();
    // Convert Sunday (0) to index 6, otherwise subtract 1
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return DAY_NAMES[adjustedIndex];
}

// Get day index from DayKey
export function getDayIndex(day: DayKey): number {
    return DAY_NAMES.indexOf(day);
}

// Check if a day is today
export function isToday(day: DayKey): boolean {
    return day === getCurrentDay();
}

// Format percentage with bounds
export function formatPercentage(value: number): number {
    return Math.min(100, Math.max(0, Math.round(value)));
}

// Generate unique ID
export function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Color palette for habits
export const HABIT_COLORS = [
    '#10b981', // emerald
    '#6366f1', // indigo
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#f59e0b', // amber
    '#ef4444', // red
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#84cc16', // lime
];

// Get a random color from palette
export function getRandomHabitColor(): string {
    return HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)];
}

// Class name helper
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
