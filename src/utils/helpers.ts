import {Priority, Todo, FilterMode, SortMode} from '../types';
import {Colors} from '../theme';
import {PRIORITY_LABELS} from '../constants';

let idCounter = 0;

export function generateId(): string {
  idCounter += 1;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}-${idCounter}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatDueDate(dateString: string | null): string {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (due.getTime() - today.getTime()) / 86400000,
  );

  if (diffDays < 0) {
    return `${Math.abs(diffDays)}d overdue`;
  }
  if (diffDays === 0) {
    return 'Due today';
  }
  if (diffDays === 1) {
    return 'Due tomorrow';
  }
  if (diffDays <= 7) {
    return `Due in ${diffDays}d`;
  }
  return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
}

export function isDueDateOverdue(dateString: string | null): boolean {
  if (!dateString) {
    return false;
  }
  const due = new Date(dateString);
  const now = new Date();
  return due.getTime() < now.getTime();
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case Priority.HIGH:
      return Colors.priority.high;
    case Priority.MEDIUM:
      return Colors.priority.medium;
    case Priority.LOW:
      return Colors.priority.low;
    default:
      return Colors.priority.none;
  }
}

export function getPriorityBgColor(priority: Priority): string {
  switch (priority) {
    case Priority.HIGH:
      return Colors.priority.highBg;
    case Priority.MEDIUM:
      return Colors.priority.mediumBg;
    case Priority.LOW:
      return Colors.priority.lowBg;
    default:
      return Colors.priority.noneBg;
  }
}

export function getPriorityLabel(priority: Priority): string {
  return PRIORITY_LABELS[priority] || 'None';
}

export function getPriorityValue(priority: Priority): number {
  switch (priority) {
    case Priority.HIGH:
      return 3;
    case Priority.MEDIUM:
      return 2;
    case Priority.LOW:
      return 1;
    default:
      return 0;
  }
}

export function filterTodos(todos: Todo[], filter: FilterMode): Todo[] {
  switch (filter) {
    case FilterMode.COMPLETED:
      return todos.filter(t => t.completed);
    case FilterMode.PENDING:
      return todos.filter(t => !t.completed);
    default:
      return todos;
  }
}

export function sortTodos(todos: Todo[], sort: SortMode): Todo[] {
  const sorted = [...todos];
  switch (sort) {
    case SortMode.NEWEST:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case SortMode.OLDEST:
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case SortMode.PRIORITY:
      return sorted.sort(
        (a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority),
      );
    default:
      return sorted;
  }
}

export function searchItems<T extends {title: string}>(
  items: T[],
  query: string,
): T[] {
  const lower = query.toLowerCase().trim();
  if (!lower) {
    return items;
  }
  return items.filter(item => item.title.toLowerCase().includes(lower));
}

export function getCompletedCount(todos: Todo[]): number {
  return todos.filter(t => t.completed).length;
}

export function getCompletionPercentage(todos: Todo[]): number {
  if (todos.length === 0) {
    return 0;
  }
  return Math.round((getCompletedCount(todos) / todos.length) * 100);
}
