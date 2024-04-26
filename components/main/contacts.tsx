import React, {Component} from 'react';
import {SectionList, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

import {Button, Text, Div, Icon, Input} from 'react-native-magnus';
import IContact from '../../model/contact';
import {RootStackParamList} from './navigation';
import Contacts from '../contacts';

type Props = StackScreenProps<RootStackParamList, 'Contacts'>;

interface IProps {
  onPress: (contact: IContact) => void;
  onPressInfo: (contact: IContact) => void;
}

interface IState {
  contacts: IContact[];
  search: string;
}

export default class ContactsMain extends Component<Props, IState> {
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
          this.props.navigation.navigate('Contact', {
            contact: item,
          });
        }}
      />
    );
  }
}
