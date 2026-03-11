export type SubjectStatus = 'ativa' | 'concluída' | 'trancada';
export type TaskStatus = 'a_fazer' | 'em_andamento' | 'concluída' | 'cancelada';
export type TaskType = 'prova' | 'trabalho' | 'atividade' | 'fórum' | 'leitura' | 'revisão' | 'outro';
export type Priority = 'alta' | 'média' | 'baixa';
export type EventType = 'prova' | 'trabalho' | 'aula_ao_vivo' | 'atividade_online' | 'fórum' | 'lembrete' | 'evento_faculdade';

export const SUBJECT_COLORS = [
  '#1A6FD4', '#22C55E', '#F59E0B', '#EF4444', '#A855F7', '#EC4899', '#14B8A6', '#F97316'
] as const;

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
  archived: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  professor: string;
  creditHours: number;
  credits: number;
  semesterId: string;
  color: string;
  description: string;
  avaLink: string;
  schedule: { day: number; time: string }[];
  status: SubjectStatus;
}

export interface Evaluation {
  id: string;
  subjectId: string;
  name: string;
  weight: number;
  score: number | null;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  type: TaskType;
  dueDate: string;
  priority: Priority;
  estimatedMinutes: number;
  checklist: { id: string; text: string; done: boolean }[];
  link: string;
  status: TaskStatus;
  kanbanColumn: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  subjectId: string;
  date: string;
  time: string;
  endTime: string;
  recurring: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | null;
  endRecurDate: string;
  description: string;
  link: string;
  priority: Priority;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  tags: string[];
  starred: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  subjectId: string;
  favicon: string;
  favorite: boolean;
  createdAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  subjectId: string;
  link: string;
  description: string;
  folder: string;
  size: string;
  createdAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  order: number;
}

export interface UserProfile {
  name: string;
  course: string;
  university: string;
  modality: string;
  email: string;
  avatarColor: string;
  onboardingDone: boolean;
  weekStartsOnMonday: boolean;
  defaultTaskView: 'list' | 'kanban' | 'calendar';
}

export interface AppState {
  profile: UserProfile;
  semesters: Semester[];
  subjects: Subject[];
  evaluations: Evaluation[];
  tasks: Task[];
  events: CalendarEvent[];
  notes: Note[];
  links: LinkItem[];
  files: FileItem[];
  kanbanColumns: KanbanColumn[];
  notifications: { id: string; message: string; read: boolean; createdAt: string }[];
}
