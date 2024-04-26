import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import BudgetTagModel from '../../../data/budgetTagModel';
import BasicTab from '../../markeloView/basicViews/basicTab';
import Profitability from '../../markeloView/money/profitability/profitability';
import Report from '../../markeloView/money/report/report';
//
import MainTabScreen from '../tab/mainTabScreen';
import Budgets from './budget/budgets';
import {BudgetsRootStackParamList} from './moneyNavigator';
import Transactions from './transactions/transactions';

type Props = StackNavigationProp<BudgetsRootStackParamList, 'Main'>;

interface IProps extends Props {}

interface IState {}

export default class Money extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <>
        <BasicTab
          screens={[
            {
              title: 'Бюджет',
              screen: Budgets,
              props: {
                onPressBudget: (budget: BudgetTagModel) => {
                  this.props.navigation.navigate('Budget', {model: budget});
                },
              },
            },
            {title: 'Отчёт', screen: Report},
            {title: 'Доходность', screen: Profitability},
          ]}
        />
      </>
    );
  }
}
