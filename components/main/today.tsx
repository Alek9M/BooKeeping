import {StackScreenProps} from '@react-navigation/stack';
import React, {Component, useCallback, FC} from 'react';
import {FlatList} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import {RootStackParamList} from './navigation';
import DraggableFlatList, {
  DragEndParams,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Task from './customElements/task';
import {FlatListItemSeparator} from './plans';
import {EntryContext} from '../../App';
import {NoteInt} from '../fab/note';
import {
  observeNotes,
  observePayments,
  // todayNotes,
  updateNotesLinks,
  upToTodayUndoneNotes,
} from '../../data/helpers';
import withObservables from '@nozbe/with-observables';
import Note, {INote} from '../../model/note';
import NoteModel from '../../data/noteModel';
import PaymentModel from '../../data/paymentModel';
import {Model} from '@nozbe/watermelondb';
import {EntrysModel} from '../../data/database';
import Entry, {EntryTable} from '../../model/entry';

type Props = StackScreenProps<RootStackParamList, 'Today'>;

interface IProps {}

interface IState {
  // data: {uuid: number; title: string; id: number}[];
}

interface EProps extends Props {
  notes: NoteModel[];
  payments: PaymentModel[];
}

export class Today extends Component<EProps, IState> {
  constructor(props: EProps) {
    super(props);

    // let data: {uuid: number; title: string; id: number}[] = [];

    // if (props.notes.length > 0) {
    //   data = props.notes.map((note) => {
    //     let r = {uuid: 6, title: note.title, id: 6};
    //     return r;
    //   });
    // } else {
    //   data = [
    //     {uuid: 7, title: 'Plan 7', id: 1},
    //     {uuid: 8, title: 'Plan 8', id: 2},
    //     {uuid: 9, title: 'Plan 9', id: 3},
    //   ];
    // }

    // this.state = {
    //   data: data,
    // };
  }

  renderItem(
    {item, index, drag, isActive}: RenderItemParams<Model>, // value: { //   object: NoteInt | undefined; //   onChange: (object: NoteInt | undefined) => void; // },
  ) {
    return (
      <TouchableOpacity onLongPress={drag}>
        <Div>
          <Task
            note={item}
            // entry={item}
            onLongPress={drag}
            // title={item.title}
            // onDelete={() => {
            //   item.delete();
            // }}
          />
        </Div>
      </TouchableOpacity>
    );
  }

  sortEntryModels(models: EntrysModel[]): EntrysModel[] {
    const starts: EntrysModel[] = models.filter(
      (model) => model.previous == undefined,
    );
    if (starts.length > 0) {
      const dayArrays = starts
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((start) => {
          let dayArray: EntrysModel[] = [start];
          let current = start;
          while (current.next) {
            const next = models.find((model) => model.uuid == current.next);
            if (next) {
              dayArray.push(next);
              current = next;
            }
          }
          return dayArray;
        });
      return dayArrays.reduce((current, next) => current.concat(next));
    }
    return [];
  }

  render() {
    return (
      //   <TaskContext.Consumer>
      //     {(value) => (
      <DraggableFlatList
        ItemSeparatorComponent={FlatListItemSeparator}
        data={this.sortEntryModels(
          this.props.notes
            .concat(this.props.payments)
            .concat(this.props.purchases),
        )}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.uuid}
        onDragEnd={(params: DragEndParams<NoteModel>) => {
          const newOrder = params.data;
          const currentModel = newOrder[params.to];
          const previousModel = this.props.notes.find(
            (note) => note.uuid == currentModel.previous,
          );
          const nextModel = this.props.notes.find(
            (note) => note.uuid == currentModel.next,
          );
          let updatee: Note[] = [];
          if (previousModel) {
            const previous = new Note({model: previousModel});
            previous._next = currentModel.next;
            updatee.push(previous);
          }
          if (nextModel) {
            const next = new Note({model: nextModel});
            next._previous = currentModel.previous;
            updatee.push(next);
          }
          const current = new Note({model: currentModel});
          if (newOrder[params.to - 1]) {
            const newPrevious =
              updatee.find((up) => up.uuid == newOrder[params.to - 1].uuid) ??
              new Note({model: newOrder[params.to - 1]});
            current._previous = newPrevious.uuid;
            newPrevious._next = current.uuid;
            updatee.filter((up) => up.uuid != newPrevious.uuid);
            updatee.push(newPrevious);
          } else {
            current._previous = undefined;
          }
          if (newOrder[params.to + 1]) {
            const newNext =
              updatee.find((up) => up.uuid == newOrder[params.to + 1].uuid) ??
              new Note({model: newOrder[params.to + 1]});
            current._next = newNext.uuid;
            newNext._previous = current.uuid;
            updatee.filter((up) => up.uuid != newNext.uuid);
            updatee.push(newNext);
          } else {
            current._next = undefined;
          }
          updatee.push(current);
          // updateNotesLinks(updatee).then(() => this.forceUpdate());
          EntrysModel.updatePointers(updatee).then(() => this.forceUpdate());
        }}
        autoscrollThreshold={0}
        activationDistance={0}
      />
      // )}
      //   </TaskContext.Consumer>
    );
  }
}

const enhanceWithNotes = withObservables([], () => ({
  notes: Entry.upToTodayUndoneFor(EntryTable.Notes), //EntryModel.upToTodayUndone('notes'),
  payments: Entry.upToTodayUndoneFor(EntryTable.Payments), //EntryModel.upToTodayUndone('payments'), //observePayments(),
  purchases: Entry.upToTodayUndoneFor(EntryTable.Purchases),
}));

export default enhanceWithNotes(Today);
