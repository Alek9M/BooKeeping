import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Button, Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';

export interface BudgetGraphInfo {
  month: string;
  planned: number;
  spent: number;
}

interface IProps {
  budget: BudgetGraphInfo;
  h: number;
  grey?: boolean;
  onPress?: (amount: number) => void;
}

interface IState {}

export default class BudgetGraph extends Component<IProps, IState> {
  static readonly greyColors = ['#E3E3E3', '#BCBCBC'];
  static readonly greenColors = ['#DCE7DA', '#ADF0A2'];

  constructor(props: IProps) {
    super(props);
  }

  get spentPercent(): number {
    return (this.props.budget.spent / this.props.budget.planned) * 100;
  }

  render() {
    return (
      <Div alignItems="center" flex={1}>
        <TouchableOpacity
          onPress={() => this.props.onPress?.(this.props.budget.spent)}>
          <Text fontSize="S">{this.props.budget.spent.toFixed(0)}₽</Text>
        </TouchableOpacity>

        <Div
          my={10}
          mx={3}
          bg={
            (this.props.grey
              ? BudgetGraph.greyColors
              : BudgetGraph.greenColors)[0]
          }
          rounded={7}
          h={this.props.h}
          justifyContent="flex-end">
          <Div
            rounded={7}
            h={`${Math.min(100, this.spentPercent).toFixed(0)}%`}
            bg={
              (this.props.grey
                ? BudgetGraph.greyColors
                : BudgetGraph.greenColors)[1]
            }
            justifyContent="flex-end"
            alignItems="center">
            <Text
              mb={15}
              mx={15}
              color="transparent"
              fontSize="S"
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
              {this.spentPercent.toFixed(0)}%
            </Text>
          </Div>
          <Div position="absolute" alignItems="center">
            <Text
              numberOfLines={1}
              mb={15}
              mx={14}
              fontSize="S"
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
              {this.spentPercent.toFixed(0)}%
            </Text>
          </Div>
        </Div>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => this.props.onPress?.(this.props.budget.planned)}>
          <Text
            fontSize="L"
            mb={6}
            fontFamily={MarkelovTheme.fontFamily.SemiBold600}>
            {this.props.budget.month}
          </Text>
          <Text fontSize="S">{this.props.budget.planned.toFixed(0)}₽</Text>
        </TouchableOpacity>
      </Div>
    );
  }
}
