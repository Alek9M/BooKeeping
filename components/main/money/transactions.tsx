import SegmentedControl from '@react-native-community/segmented-control';
import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Button, Div, Text} from 'react-native-magnus';
import {RootStackParamList} from '../navigation';
import {Calendar, CalendarList} from 'react-native-calendars';
import CalendarObject from '../../../model/calendar';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

type Props = StackScreenProps<RootStackParamList, 'Transactions'>;

interface IProps {}

interface IState {
  selectedIndex: number;
}

interface IItem {
  date: string;
  in: number;
  out: number;
  remainer: number;
}

export default class Transactions extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
  }

  data: IItem[] = [
    {
      date: '2021-2-22',
      in: 2000,
      out: 1500,
      remainer: 500,
    },
    {
      date: '2021-2-21',
      in: 300,
      out: 1200,
      remainer: 800,
    },
  ];

  render() {
    return (
      <Div m="md">
        <SegmentedControl
          values={['День', 'Неделя', 'Месяц', 'Год']}
          selectedIndex={this.state.selectedIndex}
          onChange={(event) => {
            this.setState({
              selectedIndex: event.nativeEvent.selectedSegmentIndex,
            });
          }}
        />
        <CalendarList
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
            height: 150,
          }}
        />
        <FlatList
          data={this.data}
          renderItem={(date) => (
            <Button
              w="100%"
              bg="transparent"
              onPress={() =>
                this.props.navigation.navigate('TransactionsDetailed', {
                  money: date.item,
                })
              }>
              <Div flex={1}>
                <Text style={{fontWeight: 'bold'}}> {date.item.date}</Text>
                <Text>Приход: {date.item.in}</Text>
                <Text>Расход: {date.item.out}</Text>
                <Text>Остаток: {date.item.remainer}</Text>
              </Div>
            </Button>
          )}
          keyExtractor={(item) => item.date}
        />
      </Div>
    );
  }
}
