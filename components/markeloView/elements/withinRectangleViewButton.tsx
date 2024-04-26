import React, {Component} from 'react';
import {Button, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';

interface IProps {
  onPress: () => void;
  text: string;
}

interface IState {}

export default class WithinRectangleViewButton extends Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Button
        bg="#F1F2F5"
        mt={24}
        rounded={7}
        h={36}
        p={0}
        w="100%"
        onPress={this.props.onPress}>
        <Text
          fontSize={MarkelovTheme.fontSize.S}
          color="#444D56"
          fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
          {this.props.text}
        </Text>
      </Button>
    );
  }
}
