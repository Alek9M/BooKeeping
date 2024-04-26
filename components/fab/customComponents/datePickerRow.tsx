import React, {Component} from 'react';

import {Text, Div, Button} from 'react-native-magnus';
import ICalendar from '../../../model/calendar';

import ModalCalendar from './calendar';
import NamedButtonRow from './namedButtonRow';

interface IProps {
  title?: string;
  buttonTitle?: string;
  day?: ICalendar;
  onDayChange: (day: ICalendar) => void;
}

interface IState {
  isCalendarVisible: boolean;
}

export default class DatePickerRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isCalendarVisible: false,
    };
  }

  render() {
    return (
      <>
        <NamedButtonRow
          name={this.props.title ?? 'Дата'}
          onPress={() => this.setState({isCalendarVisible: true})}
          buttonName={
            this.props.day
              ? this.props.day.day +
                '.' +
                this.props.day.month +
                '.' +
                this.props.day.year
              : this.props.buttonTitle ?? 'Сегодня'
          }
        />
        <ModalCalendar
          isVisible={this.state.isCalendarVisible}
          onDismiss={() => this.setState({isCalendarVisible: false})}
          onSelect={(day) => {
            this.props.onDayChange(day);
          }}
          day={this.props.day}
        />
      </>
    );
  }
}
