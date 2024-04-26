import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
//
import Contacts from './contacts';
import IContact from '../../../model/contact';
import ContactDetail from './contact';
import {ContactModel} from '../../../data/contactModel';
import {HeaderContextValue} from '../../../App';

export type ContactsRootStackParamList = {
  Main: {};
  Contact: {contact: IContact; model: ContactModel};
};

const contactsNavigator = createStackNavigator<ContactsRootStackParamList>();

interface IProps {}

interface IState {}

export default class ContactsNavigator extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  mainScreen = () => (
    <contactsNavigator.Screen
      name="Main"
      component={Contacts}
      options={{headerShown: false}}
    />
  );

  contactScreen = () => (
    <contactsNavigator.Screen
      name="Contact"
      component={ContactDetail}
      options={{headerShown: false}}
    />
  );

  componentDidMount() {
    var currentRoute = this.props.route.key;
    const headerContext: HeaderContextValue = this.props.route.params
      .headerContext;
    const force = this.forceUpdate;
    this.props.navigation.addListener('focus', (event) => {
      console.log('Focused');

      if (currentRoute === event.target) {
        if (headerContext.areProjectsVisible) {
          headerContext.setProjectsVisible(false);
        }
      }
    });
  }

  render() {
    return (
      <>
        <NavigationContainer independent>
          <contactsNavigator.Navigator
            initialRouteName="Main"
            screenOptions={{}}>
            {this.mainScreen()}
            {this.contactScreen()}
          </contactsNavigator.Navigator>
        </NavigationContainer>
      </>
    );
  }
}
