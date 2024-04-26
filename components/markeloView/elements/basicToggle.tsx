import React, {Component} from 'react';
import {Switch} from 'react-native';
import {Div, Toggle} from 'react-native-magnus';

interface IProps {
  isOn: boolean;
  onSwitch: (isOn: boolean) => void;
}

interface IState {}

export default class BasicToggle extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Toggle
        // TODO: add shadow
        w={28}
        h={16}
        rounded={16}
        on={this.props.isOn}
        bg="#CBCBCB"
        activeBg="#767676"
        circleBg="#F9F9FA"
        onPress={() => this.props.onSwitch(!this.props.isOn)}
      />
      // TODO: decide which one to use, still no shadow tho
      // <Div w={28} h={16}>
      //   <Switch
      //     value={this.props.isOn}
      //     onValueChange={this.props.onSwitch}
      //     thumbColor="#F9F9FA"
      //     trackColor={{false: '#CBCBCB', true: '#767676'}}
      //     ios_backgroundColor="#CBCBCB"
      //     style={{
      //       //   width: 28,
      //       height: 16,

      //       transform: [{scale: 0.5}, {translateX: -15}, {translateY: -5}],
      //     }}
      //   />
      // </Div>
    );
  }
}
