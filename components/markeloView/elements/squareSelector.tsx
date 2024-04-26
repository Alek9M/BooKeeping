// import SegmentedControl from '@react-native-community/segmented-control';
import SegmentedControl from 'rn-segmented-control';
import React, {Component} from 'react';
import {Div} from 'react-native-magnus';
import InsetShadow from 'react-native-inset-shadow';
import {Dimensions} from 'react-native';
import BasicSelector from './basicSelector';

interface IProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  color?: string;
}

interface IState {}

export default class SquareSelector extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <BasicSelector
        values={this.props.values}
        onChange={this.props.onChange}
        radius={7}
        // actual height in design = 36
        height={40}
        // TODO: make dynamic
        width={Dimensions.get('screen').width - 27.5 * 2}
        selectedIndex={this.props.selectedIndex}
      />
    );
  }
}
