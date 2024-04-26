import React, {Component} from 'react';
import {LayoutAnimation, Share, TouchableOpacity} from 'react-native';
//
import withObservables from '@nozbe/with-observables';
import {Button, Checkbox, Div, Text} from 'react-native-magnus';
import SwipeableItem, {UnderlayParams} from 'react-native-swipeable-item';
import Animated from 'react-native-reanimated';
import * as rxjs from 'rxjs';
//
import ProjectModel from '../../../../data/projectModel';
import Note from '../../../../model/note';
import {EntryContext} from '../../../../App';
import EntryModel from '../../../../data/entryModel';
import Entry from '../../../../model/entry';
import Project from '../../../../model/project';
import PurchaseModel from '../../../../data/purchaseModel';
import PaymentModel from '../../../../data/paymentModel';
import NoteModel from '../../../../data/noteModel';
import Purchase from '../../../../model/purchase';
import Payment, {PaymentType} from '../../../../model/payment';
import SaleModel from '../../../../data/saleModel';
import Sale from '../../../../model/sale';
import ProjectIcon from '../../tab/tabWide/projectIcon';

interface IProps {
  entry: EntryModel;
  project?: ProjectModel;
  onLongPress: () => void;
  checkable: boolean;
  purchase?: PurchaseModel[];
  sale?: SaleModel;
}

interface IState {}

class Task extends Component<IProps, IState> {
  static defaultProps = {
    checkable: true,
  };

  constructor(props: IProps) {
    super(props);
  }

  demodel(): Entry {
    const project = this.props.project
      ? new Project({model: this.props.project})
      : undefined;
    switch (this.props.entry.constructor) {
      case NoteModel:
        return new Note({model: this.props.entry as NoteModel}, project);
      case PaymentModel:
        if (project) {
          return new Payment(project, {
            model: this.props.entry as PaymentModel,
          });
        } else {
          throw new Error('Trying to construct Payment without Project');
        }
      case PurchaseModel:
        if (project) {
          return new Purchase(project, {
            model: this.props.entry as PurchaseModel,
          });
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }
      case SaleModel:
        if (project) {
          return new Sale(project, {
            model: this.props.entry as PurchaseModel,
          });
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }

      default:
        throw new Error("Can't demodel incompatible model");
    }
  }

  async demodelAndChange(onChange: (entry: Entry) => void) {
    const entry = this.demodel();
    await entry.load();
    onChange(entry);
  }

  touchOpacity(text: string, color: string, onPress: () => void) {
    return (
      // <Button onPress={onPress}>
      <TouchableOpacity
        onPressOut={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          onPress();
        }}>
        <Text
          bg={color}
          h="100%"
          textAlign="right"
          p="md"
          textAlignVertical="center"
          fontSize="xl">
          {text}
        </Text>
      </TouchableOpacity>
      // </Button>
    );
  }

  renderUnderlayLeft = ({item, percentOpen}: UnderlayParams<string>) => (
    <Animated.View
      style={[{opacity: percentOpen, alignItems: 'flex-end'}]} // Fade in on open
    >
      <Div row>
        <EntryContext.Consumer>
          {(value) => (
            <>
              {this.touchOpacity('Copy', 'orange', () => {
                var demodeled = this.demodel();
                demodeled.load().then(() => {
                  if (demodeled.loadStorage) {
                    demodeled
                      .loadStorage()
                      .then(() => value.onChangeEntry(demodeled.copy as Entry));
                  } else {
                    value.onChangeEntry(demodeled.copy as Entry);
                  }
                });
              })}
              {this.touchOpacity('Share', 'green', () => {
                var demodeled = this.demodel();
                demodeled.load().then(() => {
                  Share.share({message: demodeled.text});
                });
              })}
            </>
          )}
        </EntryContext.Consumer>
        {this.touchOpacity('Delete', 'red', () => {
          this.props.entry.delete();
        })}
      </Div>

      {/* <TouchableOpacity
        onPressOut={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          this.props.entry.delete();
        }}>
        <Text
          bg="red"
          h="100%"
          textAlign="right"
          p="md"
          textAlignVertical="center"
          fontSize="xl">
          Delete
        </Text>
      </TouchableOpacity> */}
    </Animated.View>
  );

  getAmountColor(): string {
    const entry = this.props.entry;
    if (entry instanceof SaleModel) return 'green';
    if (entry instanceof PurchaseModel) return 'red';
    if (entry instanceof PaymentModel) {
      if (entry.type == PaymentType.Outcome) return 'red';
      if (entry.type == PaymentType.Income) return 'green';
    }
    return 'black';
  }

  render() {
    return (
      <SwipeableItem
        item={this.props.entry.uuid}
        key={this.props.entry.uuid}
        swipeDamping={1}
        activationThreshold={5}
        overSwipe={10}
        snapPointsLeft={[170, 0]}
        renderUnderlayLeft={this.renderUnderlayLeft}>
        <Div row m="sm" flex={1}>
          {this.props.checkable && (
            <Checkbox
              alignSelf="center"
              checked={this.props.entry.isDone}
              onChecked={(checked) => {
                this.props.entry.setDone(checked);
              }}
            />
          )}

          <EntryContext.Consumer>
            {(value) => (
              <Button
                bg={'transparent'}
                color="black"
                onLongPress={this.props.onLongPress}
                onPress={() => {
                  this.demodelAndChange(value.onChangeEntry);
                }}
                flex={1}
                row>
                <Div justifyContent="space-between" row flex={1}>
                  <Div>
                    <Text fontSize={15} textAlign="left" flex={1}>
                      {this.props.entry.title}
                    </Text>
                    {Boolean(this.props.entry.note) &&
                      this.props.entry.note?.length > 0 && (
                        <Text color="gray" fontSize={10}>
                          {this.props.entry.note}
                        </Text>
                      )}
                    {this.props.project && (
                      <ProjectIcon project={this.props.project} isOn />
                    )}
                  </Div>

                  {this.props.entry.amount != undefined && (
                    <Text fontWeight="600" color={this.getAmountColor()}>
                      {this.props.entry.amount.toFixed(2)}₽
                    </Text>
                  )}
                </Div>
              </Button>
            )}
          </EntryContext.Consumer>
        </Div>
      </SwipeableItem>
    );
  }
}

const enhanceWithProject = withObservables(
  ['entry'],
  ({entry}: {entry: EntryModel}) => ({
    entry: entry,
    project: entry.project,
    purchase: entry.purchase ?? rxjs.of(undefined),
    sale: entry.sale ?? rxjs.of(undefined),
  }),
);

export default enhanceWithProject(Task);
