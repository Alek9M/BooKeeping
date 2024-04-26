import React, {Component} from 'react';
import {Button, Text} from 'react-native-magnus';

interface IProps {
  onPress: () => void;
  title: string;
}

interface IState {}

export default class BoldButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Button p={0} bg="transparent" onPress={this.props.onPress}>
        <Text style={{fontWeight: 'bold'}} fontSize="xl" color="blue700">
          {this.props.title}
        </Text>
      </Button>
    );
  }
}
