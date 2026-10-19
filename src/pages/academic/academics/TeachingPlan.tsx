import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import {
  ACADEMIC_PLANNING_KEYS,
  ACADEMIC_YEARS,
  CLASSES,
  DEFAULT_ATPS,
  DEFAULT_CURRICULUM_CHAPTERS,
  DEFAULT_LESSON_PLANS,
  DEFAULT_TEACHING_PLAN_FILTERS,
  DEFAULT_WEEKLY_PLANS,
  SUBJECTS,
  loadPlanningCollection,
  mondayOfDate,
  savePlanningCollection,
  type AnnualTeachingPlanRecord,
  type CurriculumChapter,
  type LessonPlanRecord,
  type TeachingPlanFilters,
  type WeeklyTeachingItem
} from './academicPlanningData';
import { PageHeader, SelectField } from './academicPlanningData';
import { WeeklyTeachingPlan } from './WeeklyTeachingPlan';

const SECTIONS = ['All Sections', 'A', 'B', 'C', 'D'];
const DEPARTMENTS = ['All Departments', 'Science', 'Mathematics', 'Languages', 'Social Science', 'Computer Science'];
const TEACHERS = ['All Teachers', 'Mr. R. Kumar', 'Mrs. S. Joshi', 'Mr. V. Patel', 'Ms. P. Roy', 'Mrs. P. Gupta', 'Mrs. Singh', 'Ms. Roy'];

export function TeachingPlan() {
  const [filters, setFilters] = useState<TeachingPlanFilters>(DEFAULT_TEACHING_PLAN_FILTERS);
  const [atps] = useState<AnnualTeachingPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.atps, DEFAULT_ATPS));
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyTeachingItem[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, DEFAULT_WEEKLY_PLANS));
  const [lessons, setLessons] = useState<LessonPlanRecord[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, DEFAULT_LESSON_PLANS));
  const [chapters] = useState<CurriculumChapter[]>(() => loadPlanningCollection(ACADEMIC_PLANNING_KEYS.chapters, DEFAULT_CURRICULUM_CHAPTERS));
  const [weekStart, setWeekStart] = useState(mondayOfDate());

  const persistWeekly = (next: WeeklyTeachingItem[]) => { setWeeklyPlans(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.weeklyPlans, next); };
  const persistLessons = (next: LessonPlanRecord[]) => { setLessons(next); savePlanningCollection(ACADEMIC_PLANNING_KEYS.lessons, next); };
  const setFilter = <K extends keyof TeachingPlanFilters,>(key: K, value: TeachingPlanFilters[K]) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-5 p-4 md:p-6">
      <PageHeader
        title="Teaching Plan"
        description="Create teaching plans teacher-wise. Chapter and topic lists come from Curriculum Master for the selected class."
      />

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <SelectField label="Academic Year" value={filters.academicYear} onChange={(value) => setFilter('academicYear', value)} options={ACADEMIC_YEARS} />
          <SelectField label="Class" value={filters.className} onChange={(value) => setFilter('className', value)} options={['All Classes', ...CLASSES]} />
          <SelectField label="Section" value={filters.section} onChange={(value) => setFilter('section', value)} options={SECTIONS} />
          <SelectField label="Subject" value={filters.subject} onChange={(value) => setFilter('subject', value)} options={['All Subjects', ...SUBJECTS]} />
          <SelectField label="Teacher" value={filters.teacher} onChange={(value) => setFilter('teacher', value)} options={TEACHERS} />
          <SelectField label="Department" value={filters.department} onChange={(value) => setFilter('department', value)} options={DEPARTMENTS} />
        </div>
      </Card>

      <WeeklyTeachingPlan
        items={weeklyPlans}
        persistItems={persistWeekly}
        lessonPlans={lessons}
        persistLessons={persistLessons}
        atps={atps}
        chapters={chapters}
        filters={filters}
        weekStart={weekStart}
        onWeekStartChange={setWeekStart}
      />
    </div>
  );
}

export const TeachingPlanManager = TeachingPlan;
export default TeachingPlan;
