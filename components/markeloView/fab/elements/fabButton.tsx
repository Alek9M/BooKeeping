import React, {Component} from 'react';
import {Div} from 'react-native-magnus';
import FabCircleButton from './fabCircleButton';
import FabTextButton from './fabTextButton';

interface IProps {
  text: string;
  icon: Element;
  onPress: () => void;
}

interface IState {}

export default class FabButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Div
        row
        w={170}
        my={12}
        justifyContent="space-between"
        style={{
          shadowRadius: 12,
          shadowColor: '#4D607C59',
          shadowOpacity: 0.35,
          shadowOffset: {width: 0, height: 4},
        }}>
        <FabTextButton onPress={this.props.onPress} text={this.props.text} />
        <FabCircleButton onPress={this.props.onPress} icon={this.props.icon} />
      </Div>
    );
  }
}
