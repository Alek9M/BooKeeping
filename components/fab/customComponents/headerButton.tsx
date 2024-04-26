import React, {Component} from 'react';

import {Button, Text} from 'react-native-magnus';

interface IProps {
  title: string;
  onPress: () => void;
  disabled: boolean;
}

interface IState {}

export default class Class extends Component<IProps, IState> {
  public static defaultProps = {
    disabled: false,
  };

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Button
        onPress={this.props.onPress}
        bg="transparent"
        m={0}
        disabled={this.props.disabled}>
        <Text pb="xl" style={{fontWeight: '400'}} color="#007bff" fontSize="xl">
          {this.props.title}
        </Text>
      </Button>
    );
  }
}
