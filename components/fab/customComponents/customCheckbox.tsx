import React, {Component} from 'react';

import {Checkbox, Text} from 'react-native-magnus';

interface IProps {
  title?: string;
  isChecked?: boolean;
  onChecked: (checked: boolean) => void;
  suffix?: boolean;
  onLongPress?: () => void;
}

interface IState {}

export default class CustomCheckbox extends Component<IProps, IState> {
  my = 'md';

  constructor(props: IProps) {
    super(props);
  }

  title(): Element {
    return <Text fontSize="xl">{this.props.title}</Text>;
  }

  render() {
    return this.props.isChecked != undefined && this.props.isChecked != null ? (
      <Checkbox
        onLongPress={this.props.onLongPress}
        my={this.my}
        checked={this.props.isChecked}
        onChecked={this.props.onChecked}
        prefix={!this.props.suffix && this.title()}
        suffix={this.props.suffix && this.title()}
      />
    ) : (
      <Checkbox
        bg="red"
        onLongPress={this.props.onLongPress}
        my={this.my}
        onChecked={this.props.onChecked}
        prefix={!this.props.suffix && this.title()}
        suffix={this.props.suffix && this.title()}
      />
    );
  }
}
