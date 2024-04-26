import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import Contact from '../../model/contact';
import ContactInfo from './contact';
import ContactsMain from './contacts';
import Menu from './menu';
import Transactions from './money/transactions';
import TransactionsDetailed from './money/transactionsDetailed';
import Plans from './plans';
import Done from './done';
import Today from './today';
import MoneyNavigation from './money/moneyNavigation';
import BudgetDetailed from './money/budgetDetailed';
import IContact from '../../model/contact';
import Projects from './projects';
import BudgetTag from '../../model/budgetTag';
import BudgetTagModel from '../../data/budgetTagModel';
import Prices from '../view/AS/prices';
import ServiceDetail from './serviceDetail';
import ServiceModel from '../../data/serviceModel';
import ServicePriceModel from '../../data/servicePriceModel';
import ToDo from '../view/toDo/toDo';
import ArticleModel from '../../data/articleModel';
import articleDetails from '../view/AS/articles/articleDetails';

export type RootStackParamList = {
  Menu: {};
  Plans: {};
  Contacts: {};
  Today: {};
  Contact: {contact: IContact};
  Projects: {};
  Done: {};
  Transactions: {};
  TransactionsDetailed: {
    money: {
      date: string;
      in: number;
      out: number;
      remainer: number;
    };
  };
  MoneyNavigation: {};
  Budgets: {};
  BudgetDetailed: {tag: BudgetTagModel};
  ReportsNavigation: {};
  Prices: {};
  ServiceDetail: {service: ServiceModel};
  ArticleDetail: {article: ArticleModel};
};

const Stack = createStackNavigator<RootStackParamList>();

interface IProps {}

interface IState {}

export default class Navigation extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu">
          <Stack.Screen
            name="Menu"
            component={Menu}
            options={{headerShown: false, title: ''}}
          />
          <Stack.Screen
            name="ArticleDetail"
            component={articleDetails}
            options={{headerShown: false, title: ''}}
          />
          <Stack.Screen
            name="Plans"
            component={Plans}
            options={{title: 'Планы'}}
          />
          <Stack.Screen
            name="Contacts"
            component={ContactsMain}
            options={{title: 'Контакты'}}
          />
          <Stack.Screen
            name="Today"
            component={ToDo} // TODO: Today!!
            options={{title: 'Сегодня'}}
          />
          <Stack.Screen
            name="Transactions"
            component={Transactions}
            options={{title: 'Деньги'}}
          />
          <Stack.Screen
            name="TransactionsDetailed"
            component={TransactionsDetailed}
            options={{title: 'Детализация'}}
          />
          <Stack.Screen
            name="MoneyNavigation"
            component={MoneyNavigation}
            options={{title: 'Деньги'}}
          />
          <Stack.Screen
            name="BudgetDetailed"
            component={BudgetDetailed}
            // options={{title: 'Деньги'}}
          />
          <Stack.Screen name="Contact" component={ContactInfo} options={{}} />
          <Stack.Screen
            name="Projects"
            component={Projects}
            options={{title: 'Проекты'}}
          />
          <Stack.Screen
            name="Done"
            component={Done}
            options={{title: 'Сделано'}}
          />
          <Stack.Screen
            name="Prices"
            component={Prices}
            options={{title: 'Товары/Услуги'}}
          />
          <Stack.Screen
            name="ServiceDetail"
            component={ServiceDetail}
            // options={{title: 'Товары/Услуги'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
