import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { AnnualTeachingPlan } from './AnnualTeachingPlan';
import { MonthlyTeachingPlan } from './MonthlyTeachingPlan';
import { WeeklyTeachingPlan } from './WeeklyTeachingPlan';

type PlanView = 'annual' | 'monthly' | 'weekly';

const VIEWS: Array<{ value: PlanView; label: string }> = [
  { value: 'annual', label: 'Annual Teaching Plan' },
  { value: 'monthly', label: 'Monthly Teaching Plan' },
  { value: 'weekly', label: 'Weekly Teaching Plan' }
];

// One page for the annual, monthly and weekly teaching plans. Only the active view is mounted.
export function TeachingPlan() {
  const [view, setView] = useState<PlanView>('annual');
  return (
    <div className="space-y-4">
      <Tabs value={view} onValueChange={(value) => setView(value as PlanView)}>
        <TabsList className="px-4 pt-2">
          {VIEWS.map((item) => <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {view === 'annual' && <AnnualTeachingPlan />}
      {view === 'monthly' && <MonthlyTeachingPlan />}
      {view === 'weekly' && <WeeklyTeachingPlan />}
    </div>
  );
}

export default TeachingPlan;
