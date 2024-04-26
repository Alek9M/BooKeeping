import React, {Component} from 'react';
import {Dimensions} from 'react-native';
//
import withObservables from '@nozbe/with-observables';
import {ScrollView} from 'react-native-gesture-handler';
import {Q} from '@nozbe/watermelondb';
import {Button, Div, Text} from 'react-native-magnus';
//
import BudgetTagModel from '../../../../data/budgetTagModel';
import {observeBudgetTagsOn} from '../../../../data/helpers';
import BudgetTag from '../../../../model/budgetTag';
import Calendar from '../../../../model/calendar';
import {PaymentType} from '../../../../model/payment';
import CalendarPicker, {
  CalendarPickerType,
} from '../../tab/tabWide/calendarPicker';
import ProjectModel from '../../../../data/projectModel';
import BarCharts from './barCharts';

interface IProps {
  selectedProjects: ProjectModel[];
}

interface IState {
  year: number;
  month: number;
}

export default class Transactions extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const today = new Calendar();

    this.state = {
      month: today.month,
      year: today.year,
    };
  }

  render() {
    return (
      <>
        <Div h={Dimensions.get('window').height}>
          <CalendarPicker
            type={CalendarPickerType.Month}
            onDayChange={(month) => {
              const selected = new Calendar(month);
              this.setState({month: selected.month, year: selected.year});
            }}
          />
          <ScrollView>
            <BarCharts
              year={this.state.year}
              month={this.state.month}
              selectedProjects={this.props.selectedProjects}
            />
          </ScrollView>
        </Div>
      </>
    );
  }
}
