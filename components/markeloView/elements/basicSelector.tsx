import React, {Component} from 'react';
import {Dimensions} from 'react-native';
//
import SegmentedControl from 'rn-segmented-control';
import InsetShadow from 'react-native-inset-shadow';
import {ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';

interface IProps {
  values: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  radius: number;
  height: number;
  width: number;
  my?: number;
}

interface IState {}

export default class BasicSelector extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <InsetShadow
          shadowOpacity={0.17}
          containerStyle={{
            height: this.props.height,
            borderRadius: this.props.radius,
            marginVertical: this.props.my,
          }}>
          <SegmentedControl
            tabs={this.props.values}
            onChange={this.props.onChange}
            currentIndex={this.props.selectedIndex}
            textStyle={{
              color: '#444D56',
              fontSize: MarkelovTheme.fontSize.S,
              fontWeight: '400',
              fontFamily: MarkelovTheme.fontFamily.Regular400,
              lineHeight: 12,
            }}
            activeTextWeight="400"
            segmentedControlBackgroundColor="transparent"
            tileStyle={{
              borderRadius: this.props.radius,
            }}
            shadowStyle={{
              shadowRadius: 2,
              shadowColor: '#000000',
              shadowOffset: {height: 0, width: 0},
              shadowOpacity: 0.31,
              elevation: 1,
            }}
            // TODO: make dynamic
            width={this.props.width}
            containerStyle={{
              height: this.props.height,
              borderRadius: this.props.radius,
            }}
          />
        </InsetShadow>
      </ThemeProvider>
    );
  }
}
