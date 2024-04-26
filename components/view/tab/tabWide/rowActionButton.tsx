import React, {Component} from 'react';
import {Button, Text} from 'react-native-magnus';

interface IProps {
  text: string;
  onPress: () => void;
}

interface IState {}

export default class RowActionButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Button m={6} bg="#007AFF" rounded={6} onPress={this.props.onPress}>
        <Text fontSize="lg" fontWeight="700" color="white" flex={1}>
          {this.props.text}
        </Text>
      </Button>
    );
  }
}
