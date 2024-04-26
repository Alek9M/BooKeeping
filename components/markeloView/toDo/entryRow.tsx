import React, {Component} from 'react';
import {Alert, Dimensions} from 'react-native';
//
import {Button, Div, Image, Text, ThemeProvider} from 'react-native-magnus';
import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import withObservables from '@nozbe/with-observables';
import * as rxjs from 'rxjs';
//
import EntryModel from '../../../data/entryModel';
import NoteModel from '../../../data/noteModel';
import PaymentModel from '../../../data/paymentModel';
import ProjectModel from '../../../data/projectModel';
import PurchaseModel from '../../../data/purchaseModel';
import SaleModel from '../../../data/saleModel';
import CheckBox from '../elements/checkbox';
import {bin, duplicate, share, update} from '../icons/svg';
import Payment, {PaymentType} from '../../../model/payment';
import {EntryContext, EntryContextValue, MarkelovTheme} from '../../../App';
import Entry from '../../../model/entry';
import Note from '../../../model/note';
import Purchase from '../../../model/purchase';
import Sale from '../../../model/sale';
import Project from '../../../model/project';

interface IProps {
  entry: EntryModel;
  project?: ProjectModel;
  selected: boolean;
  onSelect?: () => void;
  onPress: () => void;
  showDate?: boolean;
}

interface IState {}

class EntryRow extends Component<IProps, IState> {
  static defaultProps = {
    selected: false,
    showDate: false,
  };

  constructor(props: IProps) {
    super(props);
  }

  // Options
  static optionsWidth = 320;

  // Text palate
  red = '#ED4949';
  green = '#45B600';
  gray = '#92969C';
  black = '#444D56';

  //Text
  titleSize = MarkelovTheme.fontSize.M;
  amountSize = MarkelovTheme.fontSize.S;
  noteSize = MarkelovTheme.fontSize.XXS;

  // TODO: awful. fix.
  async demodel(model: EntryModel): Promise<Entry> {
    const projectModel = await model.project?.fetch?.();
    const project = projectModel
      ? new Project({model: projectModel})
      : undefined;
    let entry: Entry | undefined = undefined;
    switch (model.constructor) {
      case NoteModel:
        return new Note({model: model as NoteModel}, project);
      case PaymentModel:
        if (project) {
          entry = new Payment(project, {
            model: model as PaymentModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Payment without Project');
        }
      case PurchaseModel:
        if (project) {
          entry = new Purchase(project, {
            model: model as PurchaseModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }
      case SaleModel:
        if (project) {
          entry = new Sale(project, {
            model: model as SaleModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }

      default:
        throw new Error("Can't demodel incompatible model");
    }

    // TODO: doesn't load
    if (entry == undefined) throw new Error("Can't demodel incompatible model");
    await entry.load();
    return entry;
  }

  note() {
    if (
      !(this.props.entry instanceof NoteModel) ||
      this.props.entry.note.length == 0
    )
      return;
    return (
      <Text
        fontFamily={MarkelovTheme.fontFamily.Regular400}
        fontSize={this.noteSize}
        color={this.gray}
        style={{lineHeight: 12}}>
        {this.props.entry.note}
      </Text>
    );
  }

  amount() {
    if (
      !(
        this.props.entry instanceof PaymentModel ||
        this.props.entry instanceof PurchaseModel ||
        this.props.entry instanceof SaleModel
      )
    )
      return;

    const color =
      this.props.entry instanceof PurchaseModel ||
      (this.props.entry instanceof PaymentModel &&
        this.props.entry.type == PaymentType.Outcome.valueOf())
        ? '#ED4949'
        : '#444D56';
    return (
      <Text
        ml={15}
        fontFamily={MarkelovTheme.fontFamily.Regular400}
        fontSize={this.amountSize}
        // TODO: numbers are not negative but are connected with the action
        color={color}
        style={{lineHeight: 16.8}}
        textAlign="right"
        numberOfLines={1}>
        {this.props.entry.amount
          .toFixed()
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        ₽
      </Text>
    );
  }

  static optionButton(
    text: string,
    logo: Element,
    onPress?: () => void,
    hasMargin?: boolean,
  ) {
    return (
      <Button
        p="xs"
        mx={hasMargin ? 15 : 0}
        bg="transparent"
        onPress={() => {
          onPress?.();
        }}>
        {logo}
        <Text ml={6} numberOfLines={1}>
          {text}
        </Text>
      </Button>
    );
  }

  date() {
    if (!this.props.showDate) return;
    const date = `${this.props.entry.day}.${this.props.entry.month}`;
    return (
      <Text
        fontFamily={MarkelovTheme.fontFamily.SemiBold600}
        fontSize={this.titleSize}
        color={this.black}
        pr={10}
        style={{lineHeight: 19.6}}>
        {date}
        {/* TODO: create repeat flag for --> {update({})} */}
      </Text>
    );
  }

  options(props: {entry: EntryModel}) {
    const {item, percentOpen} = useSwipeableItemParams<EntryModel>();
    // TODO: pass padding from top
    const width = Dimensions.get('window').width - 27.5 * 2;
    const limit = width - EntryRow.optionsWidth;
    const animStyle = useAnimatedStyle(
      () => ({marginLeft: width - width * percentOpen.value + limit}),
      [percentOpen],
    );
    return (
      <Animated.View
        style={[
          animStyle,
          {
            flex: 1,
            justifyContent: 'center',
          },
        ]} // Fade in on open
      >
        <EntryContext.Consumer>
          {(value: EntryContextValue) => (
            <Div row justifyContent="space-between" w={120}>
              {/* // TODO: make duplicateable */}
              {/* {EntryRow.optionButton('Дублировать', duplicate({}))} */}
              <Button
                p="xs"
                mx={0}
                bg="transparent"
                onPress={() => {
                  props.demodel(props.entry).then((entry) => {
                    value.onChangeQueue([...value.queue, entry.copy]);
                  });
                }}>
                {duplicate({})}
                <Text ml={6} numberOfLines={1}>
                  Дублировать
                </Text>
              </Button>
              {/* // TODO: make shareable */}
              {EntryRow.optionButton('Поделиться', share({}), undefined, true)}
              {/* {EntryRow.optionButton('Удалить', bin({}), props.entry?.delete)} */}
              <Button
                p="xs"
                mx={0}
                bg="transparent"
                onPress={() => {
                  props.demodel(props.entry).then((entry) => {
                    entry.delete();
                  });
                  // props.entry?.delete();
                }}>
                {bin({})}
                <Text ml={6} numberOfLines={1}>
                  Удалить
                </Text>
              </Button>
            </Div>
          )}
        </EntryContext.Consumer>
      </Animated.View>
    );
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Div overflow="hidden">
          {/* // TODO: make swipable back */}
          <SwipeableItem
            renderUnderlayLeft={() => (
              <this.options {...this.props} demodel={this.demodel} />
            )}
            item={this.props.entry}
            key={this.props.entry.id}
            snapPointsLeft={[EntryRow.optionsWidth]}
            overSwipe={20}>
            <Button
              row
              alignItems="center"
              w="100%"
              rounded="none"
              my={2}
              px={15}
              py={6}
              bg={this.props.selected ? '#DADEE7' : 'transparent'}
              onPress={this.props.onSelect ?? this.props.onPress}>
              <CheckBox
                checked={this.props.entry.isDone} //{true}
                onCheck={(check) => {
                  this.props.entry.setDone(check);
                }}
                badgeColor={this.props.project?.color}
              />
              <Div
                row
                ml={8}
                flex={1}
                justifyContent="space-between"
                alignItems="center">
                <Div flex={1}>
                  <Div row alignItems="center">
                    {this.date()}
                    <Text
                      fontFamily={MarkelovTheme.fontFamily.Regular400}
                      fontSize={this.titleSize}
                      color={this.black}
                      style={{lineHeight: 16.8}}>
                      {this.props.entry.title}
                      {/* TODO: create repeat flag for --> {update({})} */}
                    </Text>
                  </Div>
                  {this.note()}
                </Div>
                {this.amount()}
              </Div>
            </Button>
          </SwipeableItem>
        </Div>
      </ThemeProvider>
    );
  }
}

const enhanceWithProject = withObservables(
  ['entry'],
  ({entry}: {entry: EntryModel}) => ({
    entry: entry,
    project: entry.project ?? rxjs.of(undefined),
    purchase: entry.purchase ?? rxjs.of(undefined),
    // sale: entry.sale ?? rxjs.of(undefined),
  }),
);

export default enhanceWithProject(EntryRow);
