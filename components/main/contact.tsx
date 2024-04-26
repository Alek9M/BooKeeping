import React, {Component} from 'react';
import {Linking} from 'react-native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {FabModalRootStackParamList} from './fabModal';

import {Div, Text, Button} from 'react-native-magnus';
import ContactView from '../contact';
import {RootStackParamList} from './navigation';

type Props = StackScreenProps<RootStackParamList, 'Contact'>;

interface IProps {}

interface IState {}

export default class ContactInfo extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    props.navigation.setOptions({title: props.route.params.contact.givenName});
  }

  render() {
    return <ContactView contact={this.props.route.params.contact} />;
  }
}
