import React, {Component} from 'react';
//
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {Button, Div, Text} from 'react-native-magnus';
//
import {ICalendar} from '../../../../model/calendar';
//
import * as ReactNative from 'react-native';
const {View, ViewPropTypes} = ReactNative;
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {MarkelovTheme} from '../../../../App';
import {arrowUp} from '../../../markeloView/icons/fab/svg';

interface CIProps {
  type: CalendarPickerType;
}

interface CIState {}

export enum CalendarPickerType {
  Date,
  Month,
  Year,
}

interface IProps {
  type: CalendarPickerType;
  onDayChange: (day: ICalendar) => void;
  day?: ICalendar;
  onMonthChange?: (month: ICalendar) => void;
}

interface IState {}

const months = [
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
];

export default class CalendarPicker extends Component<IProps, IState> {
  static defaultProps = {
    type: CalendarPickerType.Date,
  };

  constructor(props: IProps) {
    super(props);
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
      dayNamesShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
      today: 'Сегодня',
    };
    LocaleConfig.defaultLocale = 'ru';
  }

  getMarkedDates() {
    if (!this.props.day) return;
    const date = {};
    date[this.props.day.dateString] = {
      selected: true,
      selectedColor: '#DFE4EB',
    };
    return date;
  }

  render() {
    return (
      <Calendar
        // TODO: row title is month indicator
        firstDay={1}
        onDayPress={(day: ICalendar) => {
          if (this.props.type != CalendarPickerType.Date) return;
          this.props.onDayChange(day);
        }}
        onMonthChange={(month: ICalendar) => {
          if (this.props.type != CalendarPickerType.Month) return;
          this.props.onDayChange(month);
        }}
        renderArrow={(direction) => {
          switch (direction) {
            case 'left':
              return (
                <Div
                  h="100%"
                  justifyContent="flex-end"
                  style={{transform: [{rotate: 4.71}]}}>
                  {arrowUp({})}
                </Div>
              );

            case 'right':
              return (
                <Div
                  h="100%"
                  style={{transform: [{rotate: 1.57}]}}
                  justifyContent="flex-end">
                  {arrowUp({})}
                </Div>
              );
          }
        }}
        markedDates={this.getMarkedDates()}
        hideArrows={
          this.props.type != CalendarPickerType.Month || !this.props.onDayChange
        }
        onMonthChange={this.props.onMonthChange}
        // showWeekNumbers={true}
        renderHeader={(date: Date) => {
          if (!(this.props.type == CalendarPickerType.Month)) return <></>;
          return (
            <Div
              row
              justifyContent="space-around"
              alignItems="center"
              // borderWidth={1}
            >
              {/* <Button h="100%" style={{transform: [{rotate: 4.8}]}}>
                {arrowUp({})}
              </Button> */}
              <Text
                textAlign="center"
                fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                fontSize={20}>{`${
                months[date.getMonth()]
              } ${date.getFullYear()}`}</Text>
              {/* <Button h="100%" style={{transform: [{rotate: 1.7}]}}>
                {arrowUp({})}
              </Button> */}
            </Div>
          );
        }}
        theme={{
          textDayFontWeight: '400',
          arrowColor: '#007AFF',
          calendarBackground: 'transparent',
          selectedDayTextColor: '#444D56',
          todayTextColor: '#000000',
          dayTextColor: '#444D56',
          textDisabledColor: '#A2ADBE',
          textDayFontFamily: MarkelovTheme.fontFamily.Regular400,
          textDayFontWeight: '400',
          textDayFontSize: MarkelovTheme.fontSize.L,
          // TODO: make week number text smaller
          'stylesheet.calendar.header': {
            dayHeader: {
              color: '#A2ADBE',
              fontSize: MarkelovTheme.fontSize.XS,
              fontFamily: MarkelovTheme.fontFamily.Regular400,
              fontWeight: '400',
              width: 19,
            },
          },
        }}
        style={{
          backgroundColor: 'transparent',
          ...(this.props.type == CalendarPickerType.Date
            ? {}
            : {
                height: this.props.onDayChange ? 60 : 30,
                overflow: 'hidden',
              }),
        }}
        enableSwipeMonths={true}
      />
    );
  }
}
