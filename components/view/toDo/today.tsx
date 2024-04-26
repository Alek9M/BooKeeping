import React, {Component, useEffect} from 'react';
import {ListRenderItemInfo, TouchableOpacity} from 'react-native';
//
import withObservables from '@nozbe/with-observables';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {Div, Text} from 'react-native-magnus';
//
import NoteModel from '../../../data/noteModel';
import PaymentModel from '../../../data/paymentModel';
import PurchaseModel from '../../../data/purchaseModel';
import Entry, {EntryTable} from '../../../model/entry';
import Task from './components/task';
import EntryModel from '../../../data/entryModel';
import {FlatList} from 'react-native-gesture-handler';
import SaleModel from '../../../data/saleModel';
import {Q} from '@nozbe/watermelondb';
import ProjectModel from '../../../data/projectModel';

interface IProps {
  notes: NoteModel[];
  payments: PaymentModel[];
  purchases: PurchaseModel[];
  sales: SaleModel[];
  searchWord: string;
}

interface IState {}

class Today extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  unitedEntryModels(): EntryModel[] {
    return (this.props.notes as EntryModel[])
      .concat(this.props.payments)
      .concat(this.props.purchases)
      .concat(this.props.sales);
  }

  sortEntryModels(models: EntryModel[]): EntryModel[] {
    const starts: EntryModel[] = models.filter(
      (model) => model.previous == undefined,
    );
    const result = starts
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((start) => {
        let dayArray: EntryModel[] = [start];
        let current = start;
        while (current.next) {
          const next = models.find((model) => model.uuid == current.next);
          if (next) {
            dayArray.push(next);
            current = next;
          }
        }
        return dayArray;
      })
      .reduce((current, next) => current.concat(next), []);
    return result;
  }

  renderItem({item, index, drag, isActive}: RenderItemParams<EntryModel>) {
    return <Task entry={item} onLongPress={drag} />;
  }

  async updatePointers(entries: EntryModel[]) {
    const length = entries.length;

    if (
      entries[0].previous != undefined ||
      (length > 1 && entries[0].next != entries[1].uuid)
    ) {
      await entries[0].setPointers(
        undefined,
        length > 1 ? entries[1].uuid : undefined,
      );
    }
    for (let i = 1; i < length - 1; i++) {
      if (
        entries[i].previous != entries[i - 1].uuid ||
        entries[i].next != entries[i + 1].uuid
      ) {
        await entries[i].setPointers(entries[i - 1].uuid, entries[i + 1].uuid);
      }
    }
    if (
      entries[length - 1].next != undefined ||
      (entries.length > 1 &&
        entries[length - 1].previous != entries[length - 1 - 1].uuid)
    ) {
      await entries[length - 1].setPointers(
        length > 1 ? entries[length - 1 - 1].uuid : undefined,
        undefined,
      );
    }
    this.forceUpdate();
  }

  taskModels() {
    // return this.sortEntryModels(this.unitedEntryModels()).filter((model) =>
    //   model.title.toLowerCase().includes(this.props.searchWord.toLowerCase()),
    // );
    return this.unitedEntryModels().filter((model) =>
      model.title.toLowerCase().includes(this.props.searchWord.toLowerCase()),
    );
  }

  uuidExtractor(item: any) {
    return item.uuid.toString();
  }

  flatRender(item: ListRenderItemInfo<any>) {
    // return <Text>{item.item.title}</Text>;
    return <Task entry={item.item} key={item.item.uuid} />;
  }

  render() {
    return (
      <>
        {/* <DraggableFlatList
          data={this.sortEntryModels(this.unitedEntryModels())}
          renderItem={this.renderItem}
          keyExtractor={(item, _index) => item.uuid}
          onDragEnd={({data}) => this.updatePointers(data)}
        /> */}
        <FlatList
          style={{height: '100%'}}
          data={this.taskModels()}
          keyExtractor={this.uuidExtractor}
          renderItem={this.flatRender}
        />
      </>
    );
  }
}

function filterByProject(projects: ProjectModel[]): Q.WhereDescription {
  return Q.where('project_id', Q.oneOf(projects.map((project) => project.id)));
}

const enhanceWithEntries = withObservables(
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

export default enhanceWithEntries(Today);
