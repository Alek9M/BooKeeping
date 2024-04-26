import React, {Component} from 'react';
import {FlatList, Linking} from 'react-native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {FabModalRootStackParamList} from './fabMenu';

import {Div, Text, Button, Icon} from 'react-native-magnus';
import Contact from '../../model/contact';
import {EntryContext} from '../App';

interface IProps {
  contact: Contact;
}

interface IState {}

export default class ContactView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  money: {amount: number; type: number; title: string; date: string}[] = [
    {amount: 1703, type: 0, title: 'Масло для бани', date: '20.01.2020'},
    {amount: 500, type: -1, title: 'Yoga', date: '21.01.2020'},
    {amount: 239, type: 1, title: 'Букет дуре', date: '22.02.2020'},
    {amount: 5400, type: 0, title: 'Такси в час пик', date: '23.02.2020'},
    {amount: 99, type: -1, title: 'Бургер', date: '24.02.2021'},
  ];

  contacts = () =>
    this.props.contact.phoneNumbers.map((phoneNumber) => (
      <Div row py="sm" alignItems="center">
        <Text fontSize="lg" w="20%">
          {phoneNumber.label}
        </Text>
        <Button
          bg="transparent"
          color="black"
          p={0}
          onPress={() => {
            Linking.openURL(`tel:${phoneNumber.number}`);
          }}>
          {phoneNumber.number}
        </Button>
      </Div>
    ));

  emails = () =>
    this.props.contact.emailAddresses.map((emailAddress) => (
      <Div row py="sm" alignItems="center">
        <Text fontSize="lg" w="20%">
          {emailAddress.label}
        </Text>
        <Text>{emailAddress.email}</Text>
      </Div>
    ));

  moneys(money: {
    amount: number;
    type: number;
    title: string;
    date: string;
  }): Element {
    return (
      <EntryContext.Consumer>
        {(value) => (
          <Div
            row
            alignSelf="center"
            justifyContent="space-between"
            w="80%"
            alignItems="center">
            <Button
              bg="gray100"
              m="sm"
              onPress={() =>
                value.onChangeEntry({
                  title: money.title,
                  note: money.date,
                })
              }>
              <Div flex={1}>
                <Text fontSize="xl">{money.title}</Text>
                <Text>{money.date}</Text>
              </Div>
              <Text
                color={
                  money.type == 0 ? 'black' : money.type < 0 ? 'red' : 'green'
                }
                fontSize="xl">
                {money.amount}₽
              </Text>
              <Icon name="arrow-right" fontFamily="SimpleLineIcons" pl="sm" />
            </Button>
          </Div>
        )}
      </EntryContext.Consumer>
    );
  }

  render() {
    const contact: Contact = this.props.contact;
    return (
      <Div px="md" py="xl">
        <Div row w="100%" justifyContent="center">
          <Text fontSize="3xl">
            {contact.givenName +
              ' ' +
              contact.middleName +
              ' ' +
              contact.familyName}
          </Text>
        </Div>
        {contact.birthday && (
          <Div row w="100%" justifyContent="center">
            <Text fontSize="lg">
              {contact.birthday.day +
                '.' +
                contact.birthday.month +
                '.' +
                contact.birthday.year}
            </Text>
          </Div>
        )}
        {contact.company.length > 0 && (
          <Div row w="100%" justifyContent="center">
            <Text fontSize="md">{contact.company}</Text>
          </Div>
        )}
        <Div h={50} />
        {this.contacts()}
        <Div h={20} />
        {this.emails()}
        <FlatList
          data={this.money}
          renderItem={(money) => this.moneys(money.item)}
        />
      </Div>
    );
  }
}
