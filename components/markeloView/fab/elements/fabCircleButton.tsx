import React, {Component} from 'react';
import {Button, Div, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';

interface IProps {
  icon: Element;
  onPress: () => void;
}

interface IState {}

export default class FabCircleButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  diameter = 48;
  color = '#F9F9FA';

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Div
          style={{
            shadowColor: '#4D607C59',
            shadowOffset: {height: 4, width: 0},
            shadowOpacity: 0.35,
            shadowRadius: 12,
          }}>
          <Button
            bg={this.color}
            w={this.diameter}
            h={this.diameter}
            rounded={this.diameter}
            onPress={this.props.onPress}>
            {this.props.icon}
          </Button>
        </Div>
      </ThemeProvider>
    );
  }
}
