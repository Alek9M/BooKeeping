import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Button, Text} from 'react-native-magnus';
import IContact from '../../model/contact';
import ContactsView from '../view/contacts/contacts';
import {SharedView} from './main';
//

export type ShareRootStackParamList = {
  Main: {};
  Contacts: {onPress: (contact: IContact) => void};
};

const shareNavigator = createStackNavigator<ShareRootStackParamList>();

interface IProps {}

interface IState {}

export default class ShareNavigator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  mainScreen = () => (
    <shareNavigator.Screen
      name="Main"
      component={SharedView}
      initialParams={this.props}
      options={{
        headerShown: true,
      }}
    />
  );

  contactsScreen = () => (
    <shareNavigator.Screen
      name="Contacts"
      component={ContactsView}
      // options={{headerShown: false}}
    />
  );

  render() {
    return (
      <>
        <NavigationContainer independent>
          <shareNavigator.Navigator initialRouteName="Main" screenOptions={{}}>
            {this.mainScreen()}
            {this.contactsScreen()}
          </shareNavigator.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
