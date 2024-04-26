import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import ProjectModel from '../../../data/projectModel';
import Entry, {EntryTable} from '../../../model/entry';
import TaskSectionList from './components/taskSectionList';

function filterByProject(projects: ProjectModel[]): Q.WhereDescription {
  return Q.where('project_id', Q.oneOf(projects.map((project) => project.id)));
}

// const enhanceWithDoneEntries = withObservables(
//   ['selectedProjects'],
//   ({selectedProjects}) => ({
//     notes: Entry.doneFor(EntryTable.Notes).extend(
//       filterByProject(selectedProjects),
//     ),
//     payments: Entry.doneFor(EntryTable.Payments).extend(
//       filterByProject(selectedProjects),
//     ),
//     purchases: Entry.doneFor(EntryTable.Purchases).extend(
//       filterByProject(selectedProjects),
//     ),
//     sales: Entry.doneFor(EntryTable.Sales).extend(
//       filterByProject(selectedProjects),
//     ),
//   }),
// );

const sampleEnhancer = withObservables(
  ['selectedProjects'],
  ({selectedProjects}) =>
    Object.values(EntryTable).reduce((enhanced, table) => {
      enhanced[table] = Entry.doneFor(table).extend(
        filterByProject(selectedProjects),
      );
      return enhanced;
    }, {}),
);

export default sampleEnhancer(TaskSectionList);
