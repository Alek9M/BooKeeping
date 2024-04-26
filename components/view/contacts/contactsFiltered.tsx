import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {SectionList, View} from 'react-native';
//
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Text} from 'react-native-magnus';
//
import IContact, {Contact} from '../../../model/contact';
import BasicSeparator from '../../markeloView/basicViews/basicSeparator';
import BasicRectangleRow from '../../markeloView/elements/basicRectangleRow';
import ContactRow from './contactRow';
import {ContactsRootStackParamList} from './contactsNavigator';
import MarkelovContactRow from '../../markeloView/contacts/contactRow';
import ContactDetailModal from '../../markeloView/contacts/contactDetail';
import {ContactModel} from '../../../data/contactModel';

type Props = StackNavigationProp<ContactsRootStackParamList, 'Main'>;

interface IProps extends Props {
  contacts: IContact[];
  onPress?: (contact: IContact) => void;
  onPressInfo?: (contact: IContact) => void;
  filter?: (contact: IContact) => boolean;
  model: boolean;
}

type Section = {title: string; data: IContact[]};

interface IState {
  contact?: IContact;
}

export default class ContactsFiltered extends Component<IProps, IState> {
  static defaultProps = {model: false};

  constructor(props: IProps) {
    super(props);

    this.state = {
      contact: undefined,
    };
  }

  get hasInfo() {
    return !(this.props.onPressInfo == undefined);
  }

  filter(contacts: IContact[]) {
    return this.props.filter
      ? this.props.contacts.filter(this.props.filter)
      : this.props.contacts;
  }

  get navigationProps(): any {
    return {navigation: this.props.navigation, route: this.props.route};
  }

  section(contacts: IContact[]) {
    return contacts.reduce(function (sections: Section[], contact) {
      const name = contact.givenName ?? contact.familyName ?? ' ';
      var letter = name.charAt(0);
      var i = sections.findIndex((section) => section.title == letter);
      if (i < 0) {
        sections.push({title: letter, data: []});
        i = sections.findIndex((section) => section.title == letter);
      }
      sections[i].data.push(contact);
      return sections;
    }, []);
  }

  flatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}} />
    );
  };

  contactRender(contact: IContact) {
    return (
      <>
        <MarkelovContactRow
          contact={contact}
          onPressInfo={
            this.hasInfo ? () => this.props.onPressInfo?.(contact) : undefined
          }
          onPress={() => {
            this.props.onPress?.(contact);
            if (this.props.onPress) return;
            this.setState({contact: contact});
            // this.props.navigation.navigate('Contact', {
            //   // model: this.props.contactModel,
            //   contact: contact,
            // });
          }}
        />
        {/* <BasicRectangleRow
          mb={12}
          h={48}
          text={Contact.displayedName(contact)}
          onPress={() => {
            this.props.onPress?.(contact);
            if (this.props.onPress) return;
            // this.props.navigation.navigate('Contact', {
            //   // model: this.props.contactModel,
            //   contact: contact,
            // });
          }}
        /> */}
        {/* <Button
          p={0}
          m={0}
          bg="transparent"
          w="100%"
          onPress={() => {
            this.props.onPress?.(contact);
            if (this.props.onPress) return;
            // this.props.navigation.navigate('Contact', {
            //   // model: this.props.contactModel,
            //   contact: contact,
            // });
          }}>
          <Div
            row
            flex={1}
            justifyContent="space-between"
            bg="#AEAEB2"
            rounded={6}
            mx={20}
            my="sm"
            py={10}
            px={20}
            alignItems="center">
            <Div>
              <Text>{Contact.displayedName(contact)}</Text>
            </Div>
          </Div>
        </Button> */}
        {/* <Div>
          <Text onPress={() => this.props.onPress?.(contact)}>
            {Contact.displayedName(contact)}
          </Text>
        </Div> */}
      </>
    );
  }

  contactModelRender(contact: IContact) {
    return (
      <ContactRow
        onPress={
          this.props.onPress ?? (() => this.setState({contact: contact}))
        }
        onPressInfo={
          this.hasInfo ? () => this.props.onPressInfo?.(contact) : undefined
        }
        contact={contact}
        {...this.navigationProps}
      />
    );
  }

  render() {
    return (
      <>
        <FlatList
          data={this.filter(this.props.contacts).filter((contact) =>
            Contact.displayedName(contact).includes(this.props.searchWord),
          )}
          renderItem={({item}) =>
            this.props.model
              ? this.contactModelRender(item)
              : this.contactRender(item)
          }
        />
        <ContactDetailModal
          contact={this.state.contact}
          onHide={() => this.setState({contact: undefined})}
        />
      </>

      // <SectionList
      //   sections={this.section(
      //     this.filter(this.props.contacts).filter((contact) =>
      //       Contact.displayedName(contact).includes(this.props.searchWord),
      //     ),
      //   ).sort((a, b) => a.title.localeCompare(b.title))}
      //   keyExtractor={(item, index) => item.recordID}
      //   ItemSeparatorComponent={this.flatListItemSeparator}
      //   renderSectionHeader={({section: {title}}) => (
      //     <Text fontSize="3xl" py="lg" px="md">
      //       {title}
      //     </Text>
      //   )}
      //   renderItem={({item}) =>
      //     this.props.model
      //       ? this.contactModelRender(item)
      //       : this.contactRender(item)
      //   }
      //   style={{height: '100%'}}
      // />
    );
  }
}
