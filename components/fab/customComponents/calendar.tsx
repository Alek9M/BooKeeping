import React, {Component} from 'react';

import {Modal, Overlay} from 'react-native-magnus';
import {Calendar, LocaleConfig} from 'react-native-calendars';

import ICalendar from '../../../model/calendar';

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв.',
    'Фев.',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл.',
    'Авг',
    'Сен.',
    'Окт.',
    'Ноя.',
    'Дек.',
  ],
  dayNames: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ],
  dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

interface Marked {
  selected: boolean;
  selectedColor: string;
}

interface MarkedDates {}

declare global {
  interface Date {
    toCalendarObject: () => ICalendar;
  }
}

Date.prototype.toCalendarObject = function (): ICalendar {
  function toDateString(x: number): string {
    let xString = x.toString();
    if (xString.length == 1) {
      xString = '0' + xString;
    }
    return xString;
  }

  const date = {
    day: this.getDate(),
    month: this.getMonth() + 1,
    year: this.getFullYear(),
  };
  return {
    day: date.day,
    month: date.month,
    year: date.year,
    dateString:
      date.year.toString() +
      '-' +
      toDateString(date.month) +
      '-' +
      toDateString(date.day),
  };
};

interface IProps {
  isVisible: boolean;
  day?: ICalendar;
  onSelect: (date: ICalendar) => void;
  onDismiss: () => void;
}

interface IState {
  markedDates: {[id: string]: Marked};
}

export default class ModalCalendar extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const dates: {[id: string]: Marked} = {};

    this.state = {
      markedDates: this.props.day
        ? this.dayToMarkedDates(this.props.day)
        : this.dayToMarkedDates(new Date().toCalendarObject()),
    };
  }

  dayToMarkedDates(day: ICalendar): {[id: string]: Marked} {
    const dates: {[id: string]: Marked} = {};
    dates[day.dateString] = {
      selected: true,
      selectedColor: '#2b6cb0',
    };
    return dates;
  }

  render() {
    return (
      <Overlay
        visible={this.props.isVisible}
        onBackdropPress={() => this.props.onDismiss()}>
        <Calendar
          firstDay={1}
          enableSwipeMonths={true}
          showWeekNumbers={true}
          markedDates={this.state.markedDates}
          onDayPress={(day: ICalendar) => {
            this.setState({markedDates: this.dayToMarkedDates(day)});
            this.props.onSelect(day);
            this.props.onDismiss();
          }}
        />
      </Overlay>
    );
  }
}
