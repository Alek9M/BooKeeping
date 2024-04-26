import React, {useState, useEffect, useCallback, Component} from 'react';
import {
  AppRegistry,
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  NativeModules,
  Platform,
} from 'react-native';
//
import {EntryContext} from '../../App';
import Note from '../../model/note';
import {Button, Div, Modal, Text} from 'react-native-magnus';
// import PDFExtractor from '../../native/pdfExtractor/ios/RNpdfTextExtractor';
import Statement, {movement} from '../../model/statements/statement';
import ProjectChooser from '../view/tab/tabWide/projectChooser';
import ProjectModel from '../../data/projectModel';
import Payment, {IPayment, PaymentType} from '../../model/payment';
import Project from '../../model/project';
import Movement from './movement';
import {StackNavigationProp} from '@react-navigation/stack';
import ShareNavigator, {ShareRootStackParamList} from './shareNavigator';
import IContact, {Contact} from '../../model/contact';
import {database} from '../../data/database';
import {ContactCardModel} from '../../data/contactCardModel';

const {PDFextract, PDFExtractor} = NativeModules;

type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

type Props = StackNavigationProp<ShareRootStackParamList, 'Main'>;

interface IProps extends Props {
  sharedData?: SharedItem;
  onDismiss: () => Promise<void>;
}

interface IState {
  text: string;
  read: boolean;
  statement?: Statement;
  movements: movement[];
}

interface NIState {}

export default class NavigatedSharedView extends Component<IProps, NIState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Modal isVisible={!!this.props.sharedData} h="95%">
        <ShareNavigator {...this.props} />
      </Modal>
    );
  }
}

export class SharedView extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      text: 'Shared experience',
      read: false,
      movements: [],
    };
  }

  componentDidUpdate() {
    if (!this.state.read) this.setState({read: true}, () => this.parsePDF());
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  // componentDidMount() {
  //   this.componentDidUpdate();
  // }

  bankHeader() {
    if (!this.state.statement?.bank) return <></>;
    return (
      <Text textAlign="center" fontWeight="600" fontSize="5xl">
        Выписка из {this.state.statement.bank.valueOf()}
      </Text>
    );
  }

  periodHeader() {
    if (!this.state.statement?.period) return <></>;
    return (
      <Text textAlign="center" fontWeight="600" fontSize="xl">
        За период с {this.state.statement.period.start.dateString} по
        {this.state.statement.period.finish.dateString}
      </Text>
    );
  }

  movements() {
    if (!this.state.statement?.movement.length) return <></>;
    return (
      <FlatList
        data={this.state.statement.movement}
        renderItem={(item: ListRenderItemInfo<movement>) => (
          <>
            <Movement
              movement={item.item}
              movements={this.state.movements}
              onMovementsChange={(movements: movement[]) =>
                this.setState({movements: movements})
              }
              onChooseContact={(onPress: (contact: IContact) => void) => {
                this.props.navigation.navigate('Contacts', {
                  onPress: (contact) => {
                    onPress(contact);
                    this.props.navigation.goBack();
                  },
                });
              }}
            />
          </>
        )}
      />
    );
  }

  async parsePDF() {
    if (!this.props.route?.params?.sharedData) return;
    if (Platform.OS === 'ios') {
      PDFExtractor.extractTextFrom(
        this.props.route.params.sharedData.data,
        (text: string) => {
          console.log(text);
          const statement = new Statement(text.split('\t\n\t'));
          this.setState({
            text: statement.movement
              .map(
                (movement) =>
                  `${movement.date?.dateString} ${movement.amount} ${movement.description}`,
              )
              .join('\n'),
            statement: statement,
          });
        },
      );
    } else if (Platform.OS === 'android') {
      const text = await PDFextract.extract(
        this.props.route.params.sharedData.data,
      );
      const statement = new Statement(text.split('\t\n\t'));
      this.setState({
        text: statement.movement
          .map(
            (movement) =>
              `${movement.date?.dateString} ${movement.amount} ${movement.description}`,
          )
          .join('\n'),
        statement: statement,
      });
    }
  }

  render() {
    return (
      // <Modal isVisible={!!this.props.route?.params?.sharedData} h="95%">
      <>
        <Div row justifyContent="space-between">
          <Button
            bg="transparent"
            onPress={this.props.route?.params?.onDismiss}>
            <Text>Отмена</Text>
          </Button>
          <EntryContext.Consumer>
            {(value) => (
              <Button
                bg="transparent"
                disabled={!this.state.movements.length}
                onPress={async () => {
                  for (const movement of this.state.movements.filter(
                    (movement) =>
                      movement.contact?.iContact != undefined &&
                      movement.bank != undefined &&
                      movement.contact.name != undefined &&
                      movement.contact.card != undefined,
                  )) {
                    const contact = await Contact.getModelByRecordID(
                      movement.contact!.iContact!.recordID,
                    );
                    await database.action(async () => {
                      return await database
                        .get('contact_cards')
                        .create((record: ContactCardModel) => {
                          record.bank = movement.bank!.valueOf();
                          record.name = movement.contact!.name;
                          record.number = movement.contact!.card;
                          record.contact.set(contact);
                        });
                    });
                  }
                  const entries = this.state.movements
                    .filter((movement) => movement.iProject != undefined)
                    .map((movement) => {
                      const project = new Project({
                        model: movement.iProject!,
                      });
                      const iPayment: IPayment = {
                        title: movement.description ?? '',
                        type: movement.incoming
                          ? PaymentType.Income
                          : PaymentType.Outcome,
                        done: true,
                        totalAmount: movement.amount,
                        date: movement.date,
                        project: project,
                        contact: movement.contact?.iContact,
                      };
                      return new Payment(project, {
                        payment: iPayment,
                      });
                    });
                  this.props.route?.params?.onDismiss?.().then(() =>
                    setTimeout(() => {
                      value.onChangeQueue([...value.queue, ...entries]);
                    }, 1),
                  );

                  // const entry = entries.pop();
                  // value.onChangeQueue([...value.queue, ...entries]);
                  // // TODO: set timeout (?)
                  // value.onChangeEntry(entry);
                }}>
                <Text>Выбрать</Text>
              </Button>
            )}
          </EntryContext.Consumer>
        </Div>
        {this.bankHeader()}
        {this.periodHeader()}
        {this.movements()}
      </>
      // </Modal>
    );
  }
}
