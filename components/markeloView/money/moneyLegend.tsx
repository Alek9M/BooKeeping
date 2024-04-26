import React, {Component} from 'react';
import {Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';

interface IProps {
  title: string;
  amount: number;
  color?: string;
}

interface IState {}

export default class MoneyLegend extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Div mb={8}>
        <Div row alignItems="center">
          <Div
            w={6}
            h="100%"
            // p="md"
            rounded={4}
            bg={this.props.color ?? 'grey'}
          />
          <Text ml={6} fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
            {this.props.title}
          </Text>
        </Div>
        <Text ml={12} mt={4} fontSize="S">
          {this.props.amount}₽
        </Text>
      </Div>
    );
  }
}
