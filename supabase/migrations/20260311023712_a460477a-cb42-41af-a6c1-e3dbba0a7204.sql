
-- Fix all RLS policies to be PERMISSIVE instead of RESTRICTIVE

-- Drop all existing restrictive policies and recreate as permissive

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- workspaces
DROP POLICY IF EXISTS "Users manage own workspaces" ON public.workspaces;
CREATE POLICY "Users manage own workspaces" ON public.workspaces FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- subjects
DROP POLICY IF EXISTS "Users manage own subjects" ON public.subjects;
CREATE POLICY "Users manage own subjects" ON public.subjects FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- tasks
DROP POLICY IF EXISTS "Users manage own tasks" ON public.tasks;
CREATE POLICY "Users manage own tasks" ON public.tasks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- events
DROP POLICY IF EXISTS "Users manage own events" ON public.events;
CREATE POLICY "Users manage own events" ON public.events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- evaluations
DROP POLICY IF EXISTS "Users manage own evaluations" ON public.evaluations;
CREATE POLICY "Users manage own evaluations" ON public.evaluations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notes
DROP POLICY IF EXISTS "Users manage own notes" ON public.notes;
CREATE POLICY "Users manage own notes" ON public.notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- links
DROP POLICY IF EXISTS "Users manage own links" ON public.links;
CREATE POLICY "Users manage own links" ON public.links FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- files
DROP POLICY IF EXISTS "Users manage own files" ON public.files;
CREATE POLICY "Users manage own files" ON public.files FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- kanban_columns
DROP POLICY IF EXISTS "Users manage own kanban columns" ON public.kanban_columns;
CREATE POLICY "Users manage own kanban columns" ON public.kanban_columns FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notifications
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- subject_weeks
DROP POLICY IF EXISTS "Users manage own subject weeks" ON public.subject_weeks;
CREATE POLICY "Users manage own subject weeks" ON public.subject_weeks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- week_notes
DROP POLICY IF EXISTS "Users manage own week notes" ON public.week_notes;
CREATE POLICY "Users manage own week notes" ON public.week_notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- week_files
DROP POLICY IF EXISTS "Users manage own week files" ON public.week_files;
CREATE POLICY "Users manage own week files" ON public.week_files FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- week_links
DROP POLICY IF EXISTS "Users manage own week links" ON public.week_links;
CREATE POLICY "Users manage own week links" ON public.week_links FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
