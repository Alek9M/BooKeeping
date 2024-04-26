import React, {Component} from 'react';
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';

interface IProps {
  text: string;
  onPress: () => void;
}

interface IState {}

export default class FabTextButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  height = 48;
  width = 110;
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
            w={this.width}
            h={this.height}
            rounded={this.height}
            onPress={this.props.onPress}>
            <Text
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              fontSize="M"
              lineHeight={14}
              color="#576880">
              {this.props.text}
            </Text>
          </Button>
        </Div>
      </ThemeProvider>
    );
  }
}
