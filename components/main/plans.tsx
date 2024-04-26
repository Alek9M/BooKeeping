import withObservables from '@nozbe/with-observables';
import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {SectionList, View} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import {EntrysModel} from '../../data/database';
import {futureUndoneNotes} from '../../data/helpers';
import NoteModel from '../../data/noteModel';
import PaymentModel from '../../data/paymentModel';
import Calendar from '../../model/calendar';
import Entry, {EntryTable} from '../../model/entry';
import CustomCheckbox from '../fab/customComponents/customCheckbox';
import Task from './customElements/task';
import {RootStackParamList} from './navigation';
import {Today} from './today';

type Props = StackScreenProps<RootStackParamList, 'Plans'>;

interface IProps {
  notes: NoteModel[];
  payments: PaymentModel[];
}

interface IState {
  plans: {title: string; data: EntrysModel[]}[];
}

export const FlatListItemSeparator = () => {
  return (
    //Item Separator
    <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}} />
  );
};

export class Plans extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const plans: {title: string; data: EntrysModel[]}[] = [];
    const today = new Calendar();
    props.notes.forEach((note) => {
      const date = Calendar.derive(note.date);
      if (date.year == today.year) {
        if (date.month == today.month) {
          if (date.day - today.day <= 7) {
            // TODO: finish
            switch (date.day - today.day) {
              case 0:
                var tit = 'Сегодня';
                var i = plans.findIndex((plan) => plan.title == tit);
                if (i >= 0) {
                  plans[i].data.push(note);
                } else {
                  plans.push({title: tit, data: [note]});
                }
                break;
              case 1:
                var tit = 'Завтра';
                var i = plans.findIndex((plan) => plan.title == tit);
                if (i >= 0) {
                  plans[i].data.push(note);
                } else {
                  plans.push({title: tit, data: [note]});
                }
                break;

              default:
                break;
            }
          } else {
            const i = plans.findIndex((plan) => plan.title == date.month);
            if (i >= 0) {
              plans[i].data.push(note);
            } else {
              plans.push({title: date.month, data: [note]});
            }
          }
        } else {
          const i = plans.findIndex((plan) => plan.title == date.month);
          if (i >= 0) {
            plans[i].data.push(note);
          } else {
            plans.push({title: date.month, data: [note]});
          }
        }
      } else {
        const i = plans.findIndex((plan) => plan.title == date.year);
        if (i >= 0) {
          plans[i].data.push(note);
        } else {
          plans.push({title: date.year, data: [note]});
        }
      }
    });

    this.state = {
      plans: plans,
    };
  }

  render() {
    return (
      <Div mx="md" h="100%">
        <SectionList
          ItemSeparatorComponent={FlatListItemSeparator}
          sections={this.state.plans}
          keyExtractor={(item, index) => item.uuid.toString()}
          renderItem={({item}) => (
            <Task
              title={item.title}
              note={item}
              onDelete={() => {
                this.setState((state, props) => {
                  let plans = state.plans;
                  let newPlans: {
                    title: string;
                    data: {uuid: number; title: string}[];
                  }[] = [];
                  plans.forEach((plan) =>
                    newPlans.push({
                      title: plan.title,
                      data: plan.data.filter((data) => data.uuid != item.uuid),
                    }),
                  );
                  return {
                    plans: newPlans.filter((plan) => plan.data.length > 0),
                  };
                });
              }}
            />
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text fontSize="3xl" py="lg">
              {title}
            </Text>
          )}
        />
      </Div>
    );
  }
}

const enhanceWithNotes = withObservables([], () => ({
  notes: Entry.futureUndoneFor(EntryTable.Notes),
  payments: Entry.futureUndoneFor(EntryTable.Payments),
}));

export default enhanceWithNotes(Plans);
