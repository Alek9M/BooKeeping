import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Button, Div} from 'react-native-magnus';

interface IProps {
  px?: number;
  py?: number;
  mb?: number;
  mt?: number;
  ml?: number;
  h?: number;
  w?: number;
  onPress?: () => void;
}

interface IState {}

export default class BasicRectangleView extends Component<IProps, IState> {
  static defaultProps = {
    px: 15,
    py: 15,
  };

  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        disabled={!this.props.onPress}
        onPress={this.props.onPress}>
        <Div
          px={this.props.px}
          py={this.props.py}
          mb={this.props.mb}
          mt={this.props.mt}
          ml={this.props.ml}
          h={this.props.h}
          w={this.props.w}
          minH={40}
          justifyContent="center"
          rounded={7}
          bg="#F9F9FA"
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.15,
            shadowRadius: 4,
            shadowOffset: {height: 1, width: 0},
          }}>
          {this.props.children}
        </Div>
      </TouchableOpacity>
    );
  }
}
