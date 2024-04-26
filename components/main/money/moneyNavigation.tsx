import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Transactions from './transactions';
import {Div, Icon} from 'react-native-magnus';
import Budgets from './budgets';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation';
import HeaderButton from '../../fab/customComponents/headerButton';
import ReportsNavigation from './report/reportsNavigation';

const Tab = createBottomTabNavigator();

type Props = StackScreenProps<RootStackParamList, 'MoneyNavigation'>;

interface IProps {}

interface IState {}

export default class MoneyNavigation extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      //   <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName: string;
            let iconFamily: string;
            switch (route.name) {
              case 'Транзакции':
                iconName = 'book';
                iconFamily = 'Foundation';
                break;
              case 'Бюджет':
                iconName = 'cash-register';
                iconFamily = 'MaterialCommunityIcons';
                break;
              case 'Отчеты':
                iconName = 'ios-document-text';
                iconFamily = 'Ionicons';
                break;
            }
            return (
              <Icon
                name={iconName}
                fontFamily={iconFamily}
                fontSize={size}
                color={color}
              />
            ); //<Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Транзакции" component={Transactions} />
        <Tab.Screen name="Бюджет" component={Budgets} />
        <Tab.Screen name="Отчеты" component={ReportsNavigation} />
      </Tab.Navigator>
      //   </NavigationContainer>
    );
  }
}
