import React, {Component} from 'react';
import {Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';

interface IProps {
  title: string;
  amount: number[];
}

interface IState {}

export default class ProfitBar extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  get singleBar(): Element {
    return <Div h={170} w={50} bg="#BCBCBC" rounded={7} />;
  }

  get godBar(): Element {
    return (
      <Div h={170} w={50} rounded={7} overflow="hidden">
        {this.props.amount.map((amount, index, array) => {
          const total = array.reduce((acc, cur) => (acc += cur), 0);
          const percent = (amount / total) * 100;
          return (
            <Div
              h={`${percent}%`}
              w="100%"
              bg={MarkelovTheme.profitColors[index]}
              alignItems="center"
              justifyContent="center">
              <Text
                color={MarkelovTheme.colors.GrayBackbround}
                fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
                {percent.toFixed(0)}%
              </Text>
            </Div>
          );
        })}
      </Div>
    );
  }

  get bar(): Element {
    if (this.props.amount.length == 1) return this.singleBar;
    if (this.props.amount.length == 3) return this.godBar;
    return <></>;
  }

  render() {
    if (this.props.amount.length != 1 && this.props.amount.length != 3)
      return <></>;
    return (
      <Div alignItems="center">
        {this.bar}
        <Div mt={10} alignItems="center">
          <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
            {this.props.title}
          </Text>
          <Text fontSize="S" mt={6}>
            {this.props.amount.reduce((acc, cur) => (acc += cur), 0).toFixed(0)}
            ₽
          </Text>
        </Div>
      </Div>
    );
  }
}
