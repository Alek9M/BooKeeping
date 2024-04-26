import React, {Component} from 'react';
import Calendar, {ICalendar} from '../../model/calendar';
import CalendarPickerRow from '../view/fab/calendarPickerRow';
import RectangleToggleRow from './elements/rectangleToggleRow';

interface IProps {
  text: string;
  day?: ICalendar;
  onDayChange: (day: ICalendar | undefined) => void;
  onSwitch?: (checked: boolean) => void;
}

interface IState {}

export default class RectangleSwitchCalendar extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <RectangleToggleRow
        text={this.props.text}
        isOn={!!this.props.day}
        onSwitch={(checked) => {
          this.props.onSwitch?.(checked);
          if (checked) this.props.onDayChange(new Calendar());
          else this.props.onDayChange(undefined);
        }}>
        {!!this.props.day && (
          <CalendarPickerRow
            title="Дата окончания повтора"
            day={this.props.day}
            onDayChange={this.props.onDayChange}
          />
        )}
      </RectangleToggleRow>
    );
  }
}
