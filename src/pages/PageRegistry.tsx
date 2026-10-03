import { dashboardRegistry } from './registries/dashboardRegistry';
import { academicRegistry } from './registries/academicRegistry';
import { studentRegistry } from './registries/studentRegistry';
import { financeRegistry } from './registries/financeRegistry';
import { hrRegistry } from './registries/hrRegistry';
import { assessmentRegistry } from './registries/assessmentRegistry';
import { adminRegistry } from './registries/adminRegistry';
import { moreRegistry } from './registries/moreRegistry';
import { myDetailsRegistry } from './registries/myDetailsRegistry';
import { pluginsRegistry } from './registries/pluginsRegistry';

/**
 * Page-registry composition.
 *
 * The registries are merged in the order listed below and, as with any object
 * spread, the LAST registration of an id WINS. When the same id is registered
 * by two registries the screen from the later registry is the one that renders
 * for every sidebar link using that id — even links that belong to the other
 * module. That silent override is exactly what made an updated page keep
 * showing the old screen, so every collision is now reported on the console.
 *
 * Precedence is intentionally unchanged: later registry wins.
 */
const REGISTRY_SOURCES: Array<{ name: string; registry: Record<string, () => any> }> = [
  { name: 'dashboardRegistry', registry: dashboardRegistry },
  { name: 'academicRegistry', registry: academicRegistry },
  { name: 'studentRegistry', registry: studentRegistry },
  { name: 'financeRegistry', registry: financeRegistry },
  { name: 'hrRegistry', registry: hrRegistry },
  { name: 'assessmentRegistry', registry: assessmentRegistry },
  { name: 'adminRegistry', registry: adminRegistry },
  { name: 'moreRegistry', registry: moreRegistry },
  { name: 'myDetailsRegistry', registry: myDetailsRegistry },
  { name: 'pluginsRegistry', registry: pluginsRegistry }
];

const shadowedIds: string[] = [];

export const pageRegistry: Record<string, () => any> = REGISTRY_SOURCES.reduce<Record<string, () => any>>(
  (acc, { name, registry }) => {
    Object.keys(registry).forEach((id) => {
      if (acc[id]) {
        shadowedIds.push(`${id}  — ${name} overrides an earlier registration`);
      }
      acc[id] = registry[id];
    });
    return acc;
  },
  {}
);

if (shadowedIds.length > 0 && typeof console !== 'undefined' && console.warn) {
  console.warn(
    '[PageRegistry] duplicate page ids detected across registries ' +
      '(the last registered screen wins — check for a stale page shadowing a newer one):\n  - ' +
      shadowedIds.join('\n  - ')
  );
}
