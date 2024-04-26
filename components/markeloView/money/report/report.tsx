import React, {Component} from 'react';
import {Div} from 'react-native-magnus';
import CalendarPicker, {
  CalendarPickerType,
} from '../../../view/tab/tabWide/calendarPicker';
import BasicSeparator from '../../basicViews/basicSeparator';
import SquareSelector from '../../elements/squareSelector';
import InfiniteScroll from 'react-native-infinite-looping-scroll';
import BudgetGraph from '../budgets/budgetGraph';
import MoneyLegend from '../moneyLegend';

interface IProps {}

interface IState {
  type: number;
}

export default class Report extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      type: 0,
    };
  }

  pagecolor = {active: '#444D56', inactive: '#92969C'};

  render() {
    return (
      <>
        <SquareSelector
          values={['Клиенты', 'Товары', 'Услуги']}
          selectedIndex={this.state.type}
          onChange={(index: number) => this.setState({type: index})}
          // color={undefined}
        />
        <CalendarPicker
          onDayChange={() => {}}
          type={CalendarPickerType.Month}
        />
        <InfiniteScroll
          data={[{}, {}, {}]}
          renderItem={({item}) => (
            <Div>
              <MoneyLegend title={undefined} amount={undefined} />
            </Div>
          )}
        />
        <Div row justifyContent="center">
          <BasicSeparator horizontal={8}>
            <Div bg={this.pagecolor.active} w={6} h={6} rounded={10} />
            <Div bg={this.pagecolor.active} w={6} h={6} rounded={10} />
            <Div bg={this.pagecolor.inactive} w={6} h={6} rounded={10} />
          </BasicSeparator>
        </Div>
      </>
    );
  }
}
