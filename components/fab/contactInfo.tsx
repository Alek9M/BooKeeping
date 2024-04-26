import React, {Component} from 'react';
import {Linking} from 'react-native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {FabModalRootStackParamList} from './fabModal';

import {Div, Text, Button} from 'react-native-magnus';
import ContactView from '../contact';
import ContactDetail from '../markeloView/contacts/contactDetail';

type Props = StackScreenProps<FabModalRootStackParamList, 'Contact'>;

interface IProps {}

interface IState {}

export default class ContactInfo extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    props.navigation.setOptions({headerShown: false});
  }

  render() {
    return (
      <ContactDetail
        contact={this.props.route.params.contact}
        isNotModal
        left="Назад"
        onPressLeft={() => this.props.navigation.goBack()}
        right="Выбрать"
        onPressRight={() =>
          this.props.route.params.onPress(this.props.route.params.contact)
        }
      />
    );
    return <ContactView contact={this.props.route.params.contact} />;
  }
}
