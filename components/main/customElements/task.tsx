import React, {Component} from 'react';
import {Button, Div, Icon, Text} from 'react-native-magnus';
import CustomCheckbox from '../../fab/customComponents/customCheckbox';
import SwipeableItem, {UnderlayParams} from 'react-native-swipeable-item';
import Animated from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LayoutAnimation} from 'react-native';
import {EntryContext} from '../../../App';
import Entry from '../../../model/entry';
import Note from '../../../model/note';
import withObservables from '@nozbe/with-observables';
import NoteModel from '../../../data/noteModel';
import {Model} from '@nozbe/watermelondb';
import ProjectModel from '../../../data/projectModel';
import BudgetTagModel from '../../../data/budgetTagModel';
import PaymentModel from '../../../data/paymentModel';
import Payment from '../../../model/payment';
import Project from '../../../model/project';
import BudgetTag from '../../../model/budgetTag';
import PurchaseModel from '../../../data/purchaseModel';
import Purchase from '../../../model/purchase';

interface EProps {
  note: Model;
  project: ProjectModel;
  onLongPress?: () => void;
}

interface IState {}

class Task extends Component<EProps, IState> {
  constructor(props: EProps) {
    super(props);
  }

  renderUnderlayLeft = ({item, percentOpen}: UnderlayParams<string>) => (
    <Animated.View
      style={[{opacity: percentOpen, alignItems: 'flex-end'}]} // Fade in on open
    >
      <TouchableOpacity
        onPressOut={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          const note = new Note({model: this.props.note}).delete();
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
      </TouchableOpacity>
    </Animated.View>
  );

  onChecked(checked: boolean) {
    new Note({model: this.props.note}).setDone(checked);
  }

  onPress(onChange: (entry: Entry) => void) {
    const entr = this.demodel(
      this.props.note,
      this.props.project,
      this.props.tag,
    );
    entr?.load().then(() => onChange(entr));
  }

  demodel(model: Model, project: ProjectModel, tag?: BudgetTagModel) {
    const cProject = new Project({model: project});
    const cTag = tag
      ? new BudgetTag({
          budget: {
            title: tag.title,
            amount: tag.amount,
            month: tag.month,
            year: tag.year,
            type: tag.type,
          },
        })
      : undefined;
    switch (model.constructor) {
      case NoteModel:
        return new Note({model: model as NoteModel});
      case PaymentModel:
        return new Payment(
          cProject,
          {
            model: model as PaymentModel,
          },
          cTag,
        );
      case PurchaseModel:
        return new Purchase(cProject, {model: model as PurchaseModel}, cTag);
      default:
        break;
    }
  }

  render() {
    return (
      <EntryContext.Consumer>
        {(value) => (
          <SwipeableItem
            item={this.props.note.title}
            key={this.props.note.uuid}
            swipeDamping={1}
            activationThreshold={5}
            overSwipe={10}
            snapPointsLeft={[70, 0]}
            renderUnderlayLeft={this.renderUnderlayLeft}>
            <Button
              bg={
                this.props.project?.color
                  ? this.props.project.color + 200
                  : 'transparent'
              }
              p={0}
              m={0}
              w="100%"
              onLongPress={this.props.onLongPress}
              onPress={() => this.onPress(value.onChangeEntry)}>
              <Div px="md" row justifyContent="space-between" w="100%">
                <Div row>
                  <CustomCheckbox
                    onLongPress={this.props.onLongPress}
                    suffix
                    isChecked={this.props.note.isDone}
                    onChecked={(checked) => {
                      this.onChecked(checked);
                    }}
                  />
                  <Text
                    m="sm"
                    p="md"
                    onLongPress={this.props.onLongPress}
                    onPress={() => this.onPress(value.onChangeEntry)}>
                    {this.props.note.title}
                  </Text>
                </Div>

                <Icon name="arrow-right" fontFamily="SimpleLineIcons" pl="sm" />
              </Div>
            </Button>
          </SwipeableItem>
        )}
      </EntryContext.Consumer>
    );
  }
}

const enhance = withObservables(['note'], ({note}) =>
  note instanceof NoteModel
    ? {
        note,
        project: note.project,
        // tag: note.budgetTag,
      }
    : {
        note,
        project: note.project,
        tag: note.budgetTag,
      },
);
export default enhance(Task);
