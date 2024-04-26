import React, {Component} from 'react';
//
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-magnus';
import {BlurView} from '@react-native-community/blur';

//
// import ToDo from '../toDo/toDo';
// import Contacts from '../../contacts';
import {SafeAreaView} from 'react-native-safe-area-context';
import Prices from '../AS/prices';
import ASNavigator from '../AS/asNavigator';
import {StyleSheet} from 'react-native';
import Contacts from '../contacts/contacts';
import Money from '../money/money';
import ContactsNavigator from '../contacts/contactsNavigator';
import BudgetsNavigator from '../money/moneyNavigator';
import ToDo from '../../markeloView/toDo/todo';
import {
  contactsBold,
  contactsRegular,
  itemsBold,
  itemsRegular,
  moneyBold,
  moneyRegular,
  todoBold,
  todoRegular,
} from '../../markeloView/icons/tab/svg';
import {HeaderContext, HeaderContextValue} from '../../../App';

interface IProps {}

interface IState {}

const Tab = createBottomTabNavigator();

export default class TabNavigation extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  hideProjects(hide: boolean, headerContext: HeaderContextValue) {
    if (hide == headerContext.areProjectsVisible) {
      headerContext.setProjectsVisible(!hide);
    }
  }

  render() {
    return (
      <NavigationContainer>
        <HeaderContext.Consumer>
          {(headerContext) => (
            <Tab.Navigator
              // initialRouteName="Ежедневник"
              initialRouteName="Ежедневник"
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  //   let iconName;
                  switch (route.name) {
                    case 'Деньги':
                      return focused ? moneyBold({}) : moneyRegular({});
                    case 'Продукты':
                      return focused ? itemsBold({}) : itemsRegular({});
                    case 'Контакты':
                      return focused ? contactsBold({}) : contactsRegular({});
                    case 'Ежедневник':
                      return focused ? todoBold({}) : todoRegular({});
                  }
                  //   if (route.name === 'Home') {
                  //     iconName = focused
                  //       ? 'ios-information-circle'
                  //       : 'ios-information-circle-outline';
                  //   } else if (route.name === 'Settings') {
                  //     iconName = focused ? 'ios-list-box' : 'ios-list';
                  //   }

                  //   // You can return any component that you like here!
                  return (
                    <Icon name="book" fontFamily="Foundation" opacity={0} />
                  ); // <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
              tabBarOptions={{
                activeTintColor: '#576880',
                inactiveTintColor: '#7D90AB',
                // TODO: padding? 😑
                style: {
                  backgroundColor: '#F3F7FD',
                  paddingHorizontal: 27.5,
                  paddingTop: 12,
                  // TODO: dynamic height
                  height: 90,
                },
              }}>
              <Tab.Screen
                name="Деньги"
                component={BudgetsNavigator}
                initialParams={{headerContext: headerContext}}
              />
              <Tab.Screen
                name="Продукты"
                component={ASNavigator}
                initialParams={{headerContext: headerContext}}
              />
              <Tab.Screen
                name="Контакты"
                component={ContactsNavigator}
                initialParams={{headerContext: headerContext}}
              />
              <Tab.Screen
                name="Ежедневник"
                component={ToDo}
                initialParams={{headerContext: headerContext}}
              />
              <Tab.Screen
                name=" "
                component={ToDo}
                initialParams={{headerContext: headerContext}}
              />
            </Tab.Navigator>
          )}
        </HeaderContext.Consumer>
      </NavigationContainer>
    );
  }
}
