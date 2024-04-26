import React, {Component} from 'react';
//
import {Button} from 'react-native-magnus';
import BasicRectangleView from '../../markeloView/elements/basicRectangleView';

interface IProps {
  onPress: () => void;
}

interface IState {}

export default class ASRowButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <BasicRectangleView onPress={this.props.onPress} mb={12}>
        {this.props.children}
      </BasicRectangleView>
      // <Button
      //   m="sm"
      //   bg="transparent"
      //   borderColor="black"
      //   borderWidth={1}
      //   rounded={6}
      //   onPress={this.props.onPress}>
      //   {this.props.children}
      // </Button>
    );
  }
}
