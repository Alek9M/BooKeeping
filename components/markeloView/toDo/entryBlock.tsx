import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import EntryModel from '../../../data/entryModel';
import Calendar from '../../../model/calendar';
import EntryRow from './entryRow';
import Title from '../elements/title';

interface IProps {
  entries: EntryModel[];
  title?: string;
  onPress: (entry: EntryModel) => void;
  showRowDate?: boolean;
  multiSelected?: EntryModel[];
  onMultiSelect?: (entry: EntryModel) => void;
}

interface IState {}

export default class EntryBlock extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  title() {
    // TODO: make readable
    if (this.props.entries.length == 0) return;
    return (
      <Text
        fontFamily="Inter-Bold"
        fontSize={24}
        lineHeight={24}
        color="#444D56">
        {this.props.title ??
          Calendar.derive(this.props.entries[0].date).readableName()}
      </Text>
    );
  }

  render() {
    return (
      <Div my={16}>
        {/* {this.title()} */}
        <Title
          text={
            this.props.title ??
            Calendar.derive(this.props.entries[0].date).readableName()
          }
        />
        <Div
          bg="#F9F9FA"
          // TODO: check if shadow is correct
          style={{
            shadowColor: '#000000',
            shadowOpacity: 0.15,
            shadowOffset: {width: 0, height: 1},
          }}
          rounded={15}
          // mt={24}
          // 16 - 2 cuz entryRow needz 4px between rows
          py={14}>
          {/* Doesn't like lists within scrollView */}
          {/* <FlatList
            data={this.props.entries}
            scrollEnabled={false}
            renderItem={(entryItem) => <EntryRow entry={entryItem.item} />}
          /> */}
          {this.props.entries.map((entry) => (
            <EntryRow
              entry={entry}
              onPress={() => this.props.onPress(entry)}
              showDate={this.props.showRowDate}
              onSelect={
                !!this.props.onMultiSelect
                  ? () => this.props.onMultiSelect?.(entry)
                  : undefined
              }
              selected={this.props.multiSelected?.includes(entry)}
            />
          ))}
        </Div>
      </Div>
    );
  }
}
