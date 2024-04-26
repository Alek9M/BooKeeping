import React, {Component} from 'react';
import Collapsible from 'react-native-collapsible';
//
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';
//
import Calendar, {ICalendar, Precision} from '../../../model/calendar';
import BasicRectangleView from '../../markeloView/elements/basicRectangleView';
import {arrowUp} from '../../markeloView/icons/fab/svg';
import CalendarPicker from '../tab/tabWide/calendarPicker';

interface IProps {
  day: ICalendar;
  onDayChange: (day: ICalendar) => void;
  title: string;
  mt?: number;
}

interface IState {
  isVisible: boolean;
  month?: ICalendar;
}

export default class CalendarPickerRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <BasicRectangleView py={2} mt={this.props.mt}>
          <Button
            w="100%"
            bg="transparent"
            mx={0}
            my="md"
            p={0}
            onPress={() =>
              this.setState((state, _props) => {
                return {isVisible: !state.isVisible};
              })
            }>
            <Div
              row
              flex={1}
              justifyContent="space-between"
              alignItems="center">
              <Text
                fontSize="M"
                lineHeight={24}
                fontFamily={MarkelovTheme.fontFamily.Bold700}>
                {this.state.isVisible
                  ? new Calendar(this.state.month).readableName(Precision.Month)
                  : new Calendar(this.props.day).readableName(Precision.Day)}
              </Text>
              {/* // FIXME: small arrows */}
              {this.state.isVisible ? (
                arrowUp({})
              ) : (
                <Div style={{transform: [{rotateX: '180deg'}]}}>
                  {arrowUp({})}
                </Div>
              )}
            </Div>
          </Button>
          <Collapsible collapsed={!this.state.isVisible} duration={500}>
            <CalendarPicker
              day={this.props.day}
              onDayChange={(day) => {
                this.props.onDayChange(day);
                this.setState({isVisible: false});
              }}
              onMonthChange={(month) => this.setState({month: month})}
            />
          </Collapsible>
        </BasicRectangleView>
      </ThemeProvider>
    );
  }
}
