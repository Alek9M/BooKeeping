import React, {Component} from 'react';
import {SectionList, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {FabModalRootStackParamList} from './fabMenu';

import Contacts from '../contacts';
import {Button, Text, Div, Icon, Input} from 'react-native-magnus';
import IContact from '../../model/contact';

type Props = StackScreenProps<FabModalRootStackParamList, 'Contacts'>;

interface IProps {
  onPress: (contact: IContact) => void;
  onPressInfo: (contact: IContact) => void;
}

interface IState {
  contacts: IContact[];
  search: string;
}

export default class ContactsList extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      contacts: [],
      search: '',
    };
  }

  render() {
    return (
      <Contacts
        onPress={(item: IContact) => {
          this.props.route.params.onPress(item);
          this.props.navigation.dispatch(StackActions.popToTop());
        }}
        onPressInfo={(item: IContact) => {
          this.props.navigation.navigate('Contact', {
            contact: item,
            onPress: this.props.route.params.onPress,
          });
        }}
      />
    );
  }
}
