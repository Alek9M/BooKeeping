import {Q, Query} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import EntryModel from '../../../data/entryModel';
import NoteModel from '../../../data/noteModel';
import PaymentModel from '../../../data/paymentModel';
import ProjectModel from '../../../data/projectModel';
import PurchaseModel from '../../../data/purchaseModel';
import SaleModel from '../../../data/saleModel';
import Calendar, {Precision} from '../../../model/calendar';
import Entry, {EntryTable} from '../../../model/entry';
import EntryBlock from './entryBlock';

interface Section {
  title: string;
  data: EntryModel[];
  showRowDate?: boolean;
}

interface IProps {
  notes: NoteModel[];
  payments: PaymentModel[];
  purchases: PurchaseModel[];
  sales: SaleModel[];
  queries: Q.WhereDescription[];
  searchWord: string;
  selectedProjects: ProjectModel[];
  multiSelected?: EntryModel[];
  onMultiSelect?: (entry: EntryModel) => void;
}

interface IState {}

class EntryBlockList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  unitedEntryModels(): EntryModel[] {
    return (this.props.notes as EntryModel[])
      .concat(this.props.payments)
      .concat(this.props.purchases)
      .concat(this.props.sales)
      .sort((a, b) => {
        if (a.year != b.year) return a.year - b.year;
        if (a.month != b.month) return a.month - b.month;
        return a.day - b.day;
      });
  }

  sectionedList(): Section[] {
    const sections: Section[] = [];
    const checkAndPush = (
      title: string,
      entry: EntryModel,
      showRowDate?: boolean,
    ) => {
      const i = sections.findIndex((section) => section.title == title);
      if (i >= 0) {
        sections[i].data.push(entry);
      } else {
        sections.push({title: title, data: [entry], showRowDate: showRowDate});
      }
    };

    this.unitedEntryModels().forEach((entry) => {
      const entryDay = Calendar.derive(entry.date);
      if (
        Math.abs(entryDay.daysDifference()) < 7 &&
        entryDay.monthsDifference() == 0
      )
        checkAndPush(entryDay.readableName(), entry);
      else if (entryDay.yearsDifference() == 0)
        checkAndPush(entryDay.readableName(Precision.Month), entry, true);
      else checkAndPush(entryDay.readableName(Precision.Year), entry, true);
    });
    return sections;
  }

  render() {
    return (
      /* Doesn't like lists within scrollView */
      //   <FlatList
      //     data={this.sectionedList()}
      //     keyExtractor={(item) => item.title}
      //     renderItem={(info) => (
      //       <EntryBlock entries={info.item.data} title={info.item.title} />
      //     )}
      //   />
      <>
        {this.sectionedList().map((section) => (
          <EntryBlock
            entries={section.data}
            title={section.title}
            onPress={this.props.onPress}
            showRowDate={section.showRowDate}
            multiSelected={this.props.multiSelected}
            onMultiSelect={this.props.onMultiSelect}
          />
        ))}
      </>
    );
  }
}

function filterByProject(projects: ProjectModel[]): Q.Or {
  return Q.or(
    Q.where('project_id', Q.oneOf(projects.map((project) => project.id))),
    Q.where('project_id', null),
  );
}
function filterBySearch(searchWord: string): Q.WhereDescription {
  return Q.where('title', Q.like(`%${Q.sanitizeLikeString(searchWord)}%`));
}

const enhanceWithEntries = withObservables(
  ['selectedProjects', 'searchWord', 'queries', 'entryFor'],
  ({
    selectedProjects,
    searchWord,
    queries,
    entryFor,
  }: {
    selectedProjects: ProjectModel[];
    searchWord: string;
    queries: Q.WhereDescription[];
    entryFor: (table: EntryTable) => Query<EntryModel>;
  }) =>
    Object.values(EntryTable).reduce((enhanced, table) => {
      enhanced[table] = entryFor(table).extend(
        filterByProject(selectedProjects),
        filterBySearch(searchWord),
        ...queries,
      );
      return enhanced;
    }, {}),
);

const enhanceWithTEntries = withObservables(
  ['selectedProjects'],
  ({selectedProjects}) => ({
    notes: Entry.upToTodayUndoneFor(EntryTable.Notes).extend(
      Q.or(filterByProject(selectedProjects), Q.where('project_id', null)),
    ),
    payments: Entry.upToTodayUndoneFor(EntryTable.Payments).extend(
      filterByProject(selectedProjects),
    ),
    purchases: Entry.upToTodayUndoneFor(EntryTable.Purchases).extend(
      filterByProject(selectedProjects),
    ),
    sales: Entry.upToTodayUndoneFor(EntryTable.Sales).extend(
      filterByProject(selectedProjects),
    ),
  }),
);

export default enhanceWithEntries(EntryBlockList);
