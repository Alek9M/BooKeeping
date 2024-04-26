import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Button, Div, Text} from 'react-native-magnus';
import {ContactCardModel} from '../../data/contactCardModel';
import {ContactModel} from '../../data/contactModel';
import {database} from '../../data/database';
import ProjectModel from '../../data/projectModel';
import {movement} from '../../model/satatements/statement';
import ProjectChooser from '../view/tab/tabWide/projectChooser';
import * as rxjs from 'rxjs';
import IContact, {Contact} from '../../model/contact';

interface IProps {
  movements: movement[];
  onMovementsChange: (movements: movement[]) => void;
  movement: movement;
  cards: ContactCardModel[];
  contacts?: ContactModel;
  onChooseContact: (onPress: (contact: IContact) => void) => void;
}

interface IState {}

class Movement extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  componentDidUpdate() {
    if (
      !this.props.contacts ||
      !this.props.movement.contact ||
      this.props.movement.contact?.iContact
    )
      return;
    const contact = new Contact(this.props.contacts.recordID);
    contact.load().then(() => {
      this.props.movement.contact!.iContact = contact;
      this.forceUpdate();
    });
  }

  render() {
    return (
      <Button
        bg={
          this.props.movements.includes(this.props.movement)
            ? 'indigo300'
            : 'indigo100'
        }
        rounded="md"
        m="md"
        onPress={() =>
          this.props.onMovementsChange(
            this.props.movements.includes(this.props.movement)
              ? this.props.movements.filter(
                  (movement) => movement != this.props.movement,
                )
              : [...this.props.movements, this.props.movement],
          )
        }>
        <Div flex={1}>
          <Div row justifyContent="space-between" flex={1}>
            <Div>
              <Text fontSize="lg" fontWeight="700">
                {this.props.movement.type}
              </Text>
              {this.props.movement.contact && (
                <>
                  <Text fontSize="md" maxW="60%">
                    {this.props.movement.contact.name}
                  </Text>
                  <Text fontSize="md" maxW="60%">
                    {this.props.movement.contact.card}
                  </Text>
                </>
              )}
              {!this.props.movement.contact && (
                <Text fontSize="md" maxW="60%">
                  {this.props.movement.description}
                </Text>
              )}
            </Div>
            <Div>
              <Text
                fontSize="lg"
                color={this.props.movement.incoming ? 'green' : 'red'}>
                {this.props.movement.amount}
              </Text>
              <Text fontSize="md">{this.props.movement.date?.dateString}</Text>
            </Div>
          </Div>
          {this.props.movements.includes(this.props.movement) && (
            <>
              {this.props.movement.contact && (
                <Button
                  onPress={() =>
                    this.props.onChooseContact((contact) => {
                      this.props.movement.contact!.iContact = contact;
                      this.forceUpdate();
                    })
                  }>
                  <Text>
                    {this.props.movement.contact?.iContact
                      ? Contact.displayedName(
                          this.props.movement.contact.iContact,
                        )
                      : 'Выбрать'}
                  </Text>
                </Button>
              )}

              <ProjectChooser
                chosen={[this.props.movement.iProject].filter(
                  (proj) => proj != undefined,
                )}
                onPress={(project: ProjectModel) => {
                  this.props.movements.find(
                    (movement) => movement == this.props.movement,
                  )!.iProject = project;
                  this.forceUpdate();
                }}
              />
            </>
          )}
        </Div>
      </Button>
    );
  }
}

const enhanceWithCards = withObservables(
  ['movement'],
  ({movement}: {movement: movement}) => {
    let or = [];
    if (movement.contact?.name) or.push(Q.where('name', movement.contact.name));
    if (movement.contact?.card)
      or.push(Q.where('number', movement.contact.card));
    let and = [];
    if (or.length > 0) {
      and.push(Q.or(...or));
      if (movement?.bank) and.push(Q.where('bank', movement?.bank));
    }
    return {
      cards: database.get('contact_cards').query(...and),
    };
  },
);

const enhanceWithContact = withObservables(
  ['cards'],
  ({cards}: {cards: ContactCardModel[]}) => ({
    contacts: cards.length == 1 ? cards[0].contact : rxjs.of(undefined),
  }),
);

export default enhanceWithCards(enhanceWithContact(Movement));
