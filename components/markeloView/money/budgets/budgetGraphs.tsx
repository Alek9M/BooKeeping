import React, {Component} from 'react';
import {Div} from 'react-native-magnus';
import BudgetGraph, {BudgetGraphInfo} from './budgetGraph';

interface IProps {
  budgets: BudgetGraphInfo[];
  onPress?: (amount: number) => void;
}

interface IState {}

export default class BudgetGraphs extends Component<IProps, IState> {
  static readonly maxGraphHeight = 170;

  constructor(props: IProps) {
    super(props);
  }

  get plannedMax(): number {
    return Math.max(...this.props.budgets.map((budget) => budget.planned));
  }

  get averageBudget(): BudgetGraphInfo {
    return {
      month: 'Среднее',
      planned:
        this.props.budgets.reduce((acc, cur) => (acc += cur.planned), 0) /
        this.props.budgets.length,
      spent:
        this.props.budgets.reduce((acc, cur) => (acc += cur.spent), 0) /
        this.props.budgets.length,
    };
  }

  render() {
    return (
      <Div row justifyContent="space-between" alignItems="flex-end">
        {this.props.budgets.slice(undefined, 3).map((budget) => (
          <Div row flex={1} justifyContent="center">
            <BudgetGraph
              budget={budget}
              onPress={this.props.onPress}
              h={
                BudgetGraphs.maxGraphHeight * (budget.planned / this.plannedMax)
              }
            />
          </Div>
        ))}
        {this.props.budgets.length > 1 && (
          <Div row flex={1} justifyContent="center">
            <BudgetGraph
              grey
              budget={this.averageBudget}
              onPress={this.props.onPress}
              h={
                BudgetGraphs.maxGraphHeight *
                (this.averageBudget.planned / this.plannedMax)
              }
            />
          </Div>
        )}
      </Div>
    );
  }
}
