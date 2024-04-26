import React, {Component} from 'react';
//
// import SegmentedControl from '@react-native-community/segmented-control';
import SegmentedControl from 'rn-segmented-control';
import InsetShadow from 'react-native-inset-shadow';
import {Div} from 'react-native-magnus';
import {Dimensions} from 'react-native';
import BasicSelector from './basicSelector';

interface IProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  color?: string;
  mx?: number;
  my?: number;
}

interface IState {}

export default class RoundSelector extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <BasicSelector
        values={this.props.values}
        onChange={this.props.onChange}
        radius={34}
        height={36}
        // TODO: make dynamic
        width={Dimensions.get('screen').width - (this.props.mx ?? 27.5) * 2}
        selectedIndex={this.props.selectedIndex}
        my={this.props.my}
      />
    );
  }
}
