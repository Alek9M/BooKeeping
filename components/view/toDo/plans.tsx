import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import ProjectModel from '../../../data/projectModel';
import Entry, {EntryTable} from '../../../model/entry';
import TaskSectionList from './components/taskSectionList';

function filterByProject(projects: ProjectModel[]): Q.WhereDescription {
  return Q.where('project_id', Q.oneOf(projects.map((project) => project.id)));
}

// const enhanceWithFutureUndoneEntries = withObservables(
//   ['selectedProjects'],
//   ({selectedProjects}) => ({
//     notes: Entry.futureUndoneFor(EntryTable.Notes).extend(
//       filterByProject(selectedProjects),
//     ),
//     payments: Entry.futureUndoneFor(EntryTable.Payments).extend(
//       filterByProject(selectedProjects),
//     ),
//     purchases: Entry.futureUndoneFor(EntryTable.Purchases).extend(
//       filterByProject(selectedProjects),
//     ),
//     sales: Entry.futureUndoneFor(EntryTable.Sales).extend(
//       filterByProject(selectedProjects),
//     ),
//   }),
// );

// export default enhanceWithFutureUndoneEntries(TaskSectionList);

const sampleEnhancer = withObservables(
  ['selectedProjects'],
  ({selectedProjects}) =>
    Object.values(EntryTable).reduce((enhanced, table) => {
      enhanced[table] = Entry.futureUndoneFor(table).extend(
        filterByProject(selectedProjects),
      );
      return enhanced;
    }, {}),
);

export default sampleEnhancer(TaskSectionList);
