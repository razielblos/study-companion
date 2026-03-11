import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Subject, Task, CalendarEvent, Note, LinkItem, FileItem, Evaluation, Semester, KanbanColumn, UserProfile } from '@/types/studyos';
import { seedData } from './seed-data';

type ID = string;
const uid = () => crypto.randomUUID();

interface Actions {
  // Profile
  updateProfile: (p: Partial<UserProfile>) => void;
  completeOnboarding: () => void;

  // Semesters
  addSemester: (s: Omit<Semester, 'id'>) => void;
  updateSemester: (id: ID, s: Partial<Semester>) => void;
  setActiveSemester: (id: ID) => void;

  // Subjects
  addSubject: (s: Omit<Subject, 'id'>) => void;
  updateSubject: (id: ID, s: Partial<Subject>) => void;
  deleteSubject: (id: ID) => void;

  // Evaluations
  addEvaluation: (e: Omit<Evaluation, 'id'>) => void;
  updateEvaluation: (id: ID, e: Partial<Evaluation>) => void;
  deleteEvaluation: (id: ID) => void;

  // Tasks
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: ID, t: Partial<Task>) => void;
  deleteTask: (id: ID) => void;
  toggleTask: (id: ID) => void;

  // Events
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: ID, e: Partial<CalendarEvent>) => void;
  deleteEvent: (id: ID) => void;

  // Notes
  addNote: (n: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: ID, n: Partial<Note>) => void;
  deleteNote: (id: ID) => void;

  // Links
  addLink: (l: Omit<LinkItem, 'id' | 'createdAt'>) => void;
  updateLink: (id: ID, l: Partial<LinkItem>) => void;
  deleteLink: (id: ID) => void;

  // Files
  addFile: (f: Omit<FileItem, 'id' | 'createdAt'>) => void;
  deleteFile: (id: ID) => void;

  // Kanban
  updateKanbanColumns: (cols: KanbanColumn[]) => void;
  moveTask: (taskId: ID, column: string) => void;

  // Notifications
  addNotification: (msg: string) => void;
  markNotificationRead: (id: ID) => void;
  clearNotifications: () => void;

  // Data
  exportData: () => string;
  importData: (json: string) => void;
  clearAllData: () => void;
}

export const useStore = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      ...seedData(),

      updateProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      completeOnboarding: () => set((s) => ({ profile: { ...s.profile, onboardingDone: true } })),

      addSemester: (s) => set((st) => ({ semesters: [...st.semesters, { ...s, id: uid() }] })),
      updateSemester: (id, s) => set((st) => ({ semesters: st.semesters.map((x) => x.id === id ? { ...x, ...s } : x) })),
      setActiveSemester: (id) => set((st) => ({
        semesters: st.semesters.map((x) => ({ ...x, active: x.id === id })),
      })),

      addSubject: (s) => set((st) => ({ subjects: [...st.subjects, { ...s, id: uid() }] })),
      updateSubject: (id, s) => set((st) => ({ subjects: st.subjects.map((x) => x.id === id ? { ...x, ...s } : x) })),
      deleteSubject: (id) => set((st) => ({ subjects: st.subjects.filter((x) => x.id !== id) })),

      addEvaluation: (e) => set((st) => ({ evaluations: [...st.evaluations, { ...e, id: uid() }] })),
      updateEvaluation: (id, e) => set((st) => ({ evaluations: st.evaluations.map((x) => x.id === id ? { ...x, ...e } : x) })),
      deleteEvaluation: (id) => set((st) => ({ evaluations: st.evaluations.filter((x) => x.id !== id) })),

      addTask: (t) => set((st) => ({ tasks: [...st.tasks, { ...t, id: uid(), createdAt: new Date().toISOString() }] })),
      updateTask: (id, t) => set((st) => ({ tasks: st.tasks.map((x) => x.id === id ? { ...x, ...t } : x) })),
      deleteTask: (id) => set((st) => ({ tasks: st.tasks.filter((x) => x.id !== id) })),
      toggleTask: (id) => set((st) => ({
        tasks: st.tasks.map((x) => x.id === id ? { ...x, status: x.status === 'concluída' ? 'a_fazer' : 'concluída' } : x),
      })),

      addEvent: (e) => set((st) => ({ events: [...st.events, { ...e, id: uid() }] })),
      updateEvent: (id, e) => set((st) => ({ events: st.events.map((x) => x.id === id ? { ...x, ...e } : x) })),
      deleteEvent: (id) => set((st) => ({ events: st.events.filter((x) => x.id !== id) })),

      addNote: (n) => set((st) => ({
        notes: [...st.notes, { ...n, id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
      })),
      updateNote: (id, n) => set((st) => ({
        notes: st.notes.map((x) => x.id === id ? { ...x, ...n, updatedAt: new Date().toISOString() } : x),
      })),
      deleteNote: (id) => set((st) => ({ notes: st.notes.filter((x) => x.id !== id) })),

      addLink: (l) => set((st) => ({ links: [...st.links, { ...l, id: uid(), createdAt: new Date().toISOString() }] })),
      updateLink: (id, l) => set((st) => ({ links: st.links.map((x) => x.id === id ? { ...x, ...l } : x) })),
      deleteLink: (id) => set((st) => ({ links: st.links.filter((x) => x.id !== id) })),

      addFile: (f) => set((st) => ({ files: [...st.files, { ...f, id: uid(), createdAt: new Date().toISOString() }] })),
      deleteFile: (id) => set((st) => ({ files: st.files.filter((x) => x.id !== id) })),

      updateKanbanColumns: (cols) => set({ kanbanColumns: cols }),
      moveTask: (taskId, column) => set((st) => ({
        tasks: st.tasks.map((x) => x.id === taskId ? { ...x, kanbanColumn: column } : x),
      })),

      addNotification: (msg) => set((st) => ({
        notifications: [{ id: uid(), message: msg, read: false, createdAt: new Date().toISOString() }, ...st.notifications],
      })),
      markNotificationRead: (id) => set((st) => ({
        notifications: st.notifications.map((x) => x.id === id ? { ...x, read: true } : x),
      })),
      clearNotifications: () => set({ notifications: [] }),

      exportData: () => {
        const { profile, semesters, subjects, evaluations, tasks, events, notes, links, files, kanbanColumns } = get();
        return JSON.stringify({ profile, semesters, subjects, evaluations, tasks, events, notes, links, files, kanbanColumns }, null, 2);
      },
      importData: (json) => {
        try {
          const data = JSON.parse(json);
          set(data);
        } catch { /* ignore */ }
      },
      clearAllData: () => set(seedData()),
    }),
    { name: 'studyos-storage' }
  )
);
