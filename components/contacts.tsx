import React, {Component} from 'react';
import {SectionList, View} from 'react-native';
import {StackActions} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {FabModalRootStackParamList} from './fabMenu';

import ContactsAPI from 'react-native-contacts';
import {Button, Text, Div, Icon, Input} from 'react-native-magnus';
import IContact from '../model/contact';

interface IProps {
  onPress: (contact: IContact) => void;
  onPressInfo?: (contact: IContact) => void;
}

interface IState {
  contacts: IContact[];
  search: string;
}

const FlatListItemSeparator = () => {
  return (
    //Item Separator
    <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}} />
  );
};

function contactComparator(a: IContact, b: IContact): number {
  let familyNameComparison = a.familyName.localeCompare(b.familyName);
  if (familyNameComparison == 0) {
    return a.givenName.localeCompare(b.givenName);
  } else {
    return familyNameComparison;
  }
}

export default class Contacts extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      contacts: [],
      search: '',
    };
  }

  sectionedContacts(): {title: string; data: IContact[]}[] {
    let contacts = this.state.contacts.filter(
      (contact) =>
        contact.givenName.includes(this.state.search) ||
        contact.familyName.includes(this.state.search),
    );
    return [
      {
        title: 'Клиенты',
        data: [],
      },
      {
        title: 'Прочие контакты',
        data: contacts.sort(contactComparator),
      },
    ];
  }

  displayedName(contact: IContact): string {
    return contact.givenName + ' ' + contact.familyName;
  }

  render() {
    ContactsAPI.getAll().then((value: IContact[]) => {
      this.setState({contacts: value});
    });

    return (
      <Div>
        <Input
          placeholder="Поиск"
          p={10}
          m="lg"
          value={this.state.search}
          onChangeText={(text) => this.setState({search: text})}
          suffix={<Icon name="search" color="gray900" fontFamily="Feather" />}
        />
        <SectionList
          ItemSeparatorComponent={FlatListItemSeparator}
          sections={this.sectionedContacts()}
          keyExtractor={(item, index) => item.recordID}
          renderItem={({item}) => (
            <Button
              onPress={() => this.props.onPress(item)}
              bg="transparent"
              w="100%"
              m={0}
              p="md">
              <Div
                row
                justifyContent="space-between"
                w="100%"
                alignItems="center">
                <Text fontSize="lg">{this.displayedName(item)}</Text>
                {this.props.onPressInfo && (
                  <Button
                    onPress={() => this.props.onPressInfo!(item)}
                    bg="transparent"
                    py="md"
                    px="lg"
                    alignItems="center"
                    justifyContent="center">
                    <Icon
                      name="info"
                      fontSize="lg"
                      fontFamily="Feather"
                      color="blue700"
                    />
                  </Button>
                )}
              </Div>
            </Button>
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text fontSize="3xl" py="lg" px="md">
              {title}
            </Text>
          )}
        />
      </Div>
    );
  }
}
