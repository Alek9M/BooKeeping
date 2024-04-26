import React, {Component} from 'react';

import {Div, Text} from 'react-native-magnus';

interface IProps {
  title: string;
  required: boolean;
  warn: boolean;
}

interface IState {}

export default class NamedRow extends Component<IProps, IState> {
  public static defaultProps = {
    required: false,
    warn: false,
  };

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Div row justifyContent="space-between" alignItems="center" my="md">
        <Text
          fontSize="xl"
          color={this.props.required && this.props.warn ? 'red' : 'black'}>
          {this.props.title}
        </Text>
        {this.props.children}
      </Div>
    );
  }
}
