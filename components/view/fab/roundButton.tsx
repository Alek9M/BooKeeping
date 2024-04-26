import React, {Component} from 'react';
import {Button, Div} from 'react-native-magnus';

interface IProps {
  onPress: () => void;
}

interface IState {}

export default class RoundButton extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Div
        style={{
          shadowColor: '#000000',
          shadowOffset: {width: 0, height: 0},
          shadowRadius: 2,
          shadowOpacity: 0.31,
        }}>
        <Button
          h={36}
          // w={36}
          minW={36}
          maxW={136}
          rounded={36}
          bg="#F9F9FA"
          alignItems="center"
          // borderWidth={1}
          // borderColor="black"
          p={9}
          mr={12}
          // mb="md"
          {...this.props}>
          <Div row>{this.props.children}</Div>
        </Button>
      </Div>
    );
  }
}
