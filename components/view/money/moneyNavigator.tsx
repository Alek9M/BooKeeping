import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import {HeaderContext, HeaderContextValue} from '../../../App';
//
import BudgetTagModel from '../../../data/budgetTagModel';
import BudgetDetail from './budget/budgetDetail';
import Money from './money';

export type BudgetsRootStackParamList = {
  Main: {};
  Budget: {model: BudgetTagModel};
};

const moneyNavigator = createStackNavigator<BudgetsRootStackParamList>();

interface IProps {}

interface IState {}

export default class MoneyNavigator extends Component<IProps, IState> {
  focusListener = undefined;

  constructor(props: IProps) {
    super(props);
  }

  mainScreen = () => (
    <moneyNavigator.Screen
      name="Main"
      component={Money}
      options={{headerShown: false}}
    />
  );

  budgetScreen = (headerContext) => (
    <moneyNavigator.Screen
      name="Budget"
      component={BudgetDetail}
      // options={{headerShown: false}}
      initialParams={{headerContext: headerContext}}
    />
  );

  componentDidMount() {
    var currentRoute = this.props.route.key;
    const headerContext: HeaderContextValue = this.props.route.params
      .headerContext;
    const force = this.forceUpdate;
    this.focusListener = this.props.navigation.addListener('focus', (event) => {
      console.log('Focused');

      if (currentRoute === event.target) {
        if (!headerContext.areProjectsVisible) {
          headerContext.setProjectsVisible(true);
        }
      }
    });
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.focusListener);
  }

  render() {
    return (
      <>
        <HeaderContext.Consumer>
          {(headerContext) => (
            <NavigationContainer independent>
              <moneyNavigator.Navigator
                initialRouteName="Main"
                screenOptions={{}}>
                {this.mainScreen()}
                {this.budgetScreen(headerContext)}
              </moneyNavigator.Navigator>
            </NavigationContainer>
          )}
        </HeaderContext.Consumer>
      </>
    );
  }
}
