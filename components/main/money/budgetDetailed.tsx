import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Div, Icon, Text} from 'react-native-magnus';
import {RootStackParamList} from '../navigation';
import {Calendar, CalendarList} from 'react-native-calendars';
import {FlatList} from 'react-native-gesture-handler';
import withObservables from '@nozbe/with-observables';
import BudgetTagModel from '../../../data/budgetTagModel';
import NoteModel from '../../../data/noteModel';
import PaymentModel from '../../../data/paymentModel';
import ProjectModel from '../../../data/projectModel';
import {ListRenderItemInfo} from 'react-native';

type Props = StackScreenProps<RootStackParamList, 'BudgetDetailed'>;

interface EProps extends Props {
  tag: BudgetTagModel;
  notes: NoteModel[];
  payments: PaymentModel[];
  project: ProjectModel;
}

interface IState {
  countries: string[];
}

class BudgetDetailed extends Component<EProps, IState> {
  constructor(props: EProps) {
    super(props);

    props.navigation.setOptions({title: props.route.params.tag.title});
  }

  render() {
    return (
      <Div>
        {/* <Calendar
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          onVisibleMonthsChange={(months) => {
            console.log('now these months are visible', months);
          }}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: 50,
            overflow: 'hidden',
          }}
        /> */}
        <Div row justifyContent="space-between">
          <Text>План:</Text>
          <Text>{this.props.tag.amount}</Text>
        </Div>
        <FlatList
          data={this.props.payments}
          renderItem={(item: ListRenderItemInfo<PaymentModel>) => {
            return (
              <Div row justifyContent="space-between">
                <Text flex={1}> {item.item.date} </Text>
                <Text flex={1}>{item.item.title}</Text>
                <Text flex={1}> {item.item.amount} </Text>
              </Div>
            );
          }}
        />
        <Div row justifyContent="space-between">
          <Text>Факт:</Text>
          <Text>
            {this.props.payments
              .map((payment) => payment.amount)
              .reduce((sum, curr) => (sum += curr), 0)}
          </Text>
        </Div>
      </Div>
    );
  }
}

const enhanceTag = withObservables(['route'], ({route}) => ({
  tag: route.params.tag,
  project: route.params.tag.project,
  notes: route.params.tag.notes,
  payments: route.params.tag.payments,
}));

export default enhanceTag(BudgetDetailed);
