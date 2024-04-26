import React, {Component} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import CalendarPicker, {
  CalendarPickerType,
} from '../../../view/tab/tabWide/calendarPicker';
import BasicSeparator from '../../basicViews/basicSeparator';
import Title from '../../elements/title';
import MoneyLegend from '../moneyLegend';
import ProfitBar from './profitBar';

interface IProps {}

interface IState {}

export default class Profitability extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  amounts = [9000, 15000, 3000];

  render() {
    return (
      <BasicSeparator vertical={24}>
        <CalendarPicker
          type={CalendarPickerType.Month}
          onDayChange={() => {}}
        />
        <Div row>
          <Div row justifyContent="space-around" flex={1}>
            <ProfitBar title="Пассивы" amount={[9000]} />
            <ProfitBar title="Пассивы" amount={this.amounts} />
            {/* <Div flex={1}></Div> */}
          </Div>
          <Div flex={1}>
            <FlatList
              data={this.amounts}
              renderItem={(item) => (
                <MoneyLegend
                  title="Остаток денежных средств"
                  amount={item.item}
                  color={MarkelovTheme.profitColors[item.index]}
                />
              )}
            />
          </Div>
        </Div>
        <Div row justifyContent="space-between">
          <Title text="Прибыль" mb={0} />
          <Text
            fontFamily={MarkelovTheme.fontFamily.Bold700}
            color={MarkelovTheme.colors.Green}>
            ₽
          </Text>
        </Div>
        <Div row justifyContent="space-between">
          <Title text="Убыток" color={MarkelovTheme.colors.Red} mb={0} />
          <Text
            fontFamily={MarkelovTheme.fontFamily.Bold700}
            color={MarkelovTheme.colors.Red}>
            ₽
          </Text>
        </Div>
      </BasicSeparator>
    );
  }
}
