import React, {Component} from 'react';

import {Div, Text, Button} from 'react-native-magnus';
import BoldButton from './boldButton';
import NamedRow from './customRow';

interface IProps {
  name: string;
  buttonName: string;
  onPress: () => void;
  required: boolean;
  warn: boolean;
}

interface IState {}

export default class NamedButtonRow extends Component<IProps, IState> {
  public static defaultProps = {
    required: false,
    warn: false,
  };

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <NamedRow
        title={this.props.name}
        warn={this.props.warn}
        required={this.props.required}>
        <BoldButton
          title={this.props.buttonName}
          onPress={this.props.onPress}
        />
      </NamedRow>
    );
  }
}
