import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FabModalRootStackParamList} from './fabModal';

interface IProps {
  navigation: StackNavigationProp<FabModalRootStackParamList, 'Sale'>;
}

interface IState {}

export default class MultipleContactSelectList extends Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return <></>;
  }
}
