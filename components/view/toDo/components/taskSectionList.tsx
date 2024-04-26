import React, {Component} from 'react';
import {SectionList, View} from 'react-native';
//
import {Text} from 'react-native-magnus';
//
import EntryModel from '../../../../data/entryModel';
import PurchaseModel from '../../../../data/purchaseModel';
import NoteModel from '../../../../data/noteModel';
import PaymentModel from '../../../../data/paymentModel';
import Calendar from '../../../../model/calendar';
import Task from './task';
import SaleModel from '../../../../data/saleModel';

interface IProps {
  notes: NoteModel[];
  payments: PaymentModel[];
  purchases: PurchaseModel[];
  sales: SaleModel[];
  searchWord: string;
}

interface IState {}

interface Section {
  title: string;
  data: EntryModel[];
}

export default class TaskSectionList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  nextDay(day: Date, add: number): Date {
    const nextDate = new Date(day);
    nextDate.setDate(nextDate.getDate() + add);
    return nextDate;
  }

  sectionEntryModels(entries: EntryModel[]): Section[] {
    const now = new Calendar();
    const todayDate = new Date();
    const tomorrow = Calendar.for(this.nextDay(todayDate, 1)).dateString;
    const yesterday = Calendar.for(this.nextDay(todayDate, -1)).dateString;
    const withinWeekDates = [-2, -3, -4, -5, -6, 2, 3, 4, 5, 6].map((step) =>
      this.nextDay(todayDate, step),
    );
    const withinWeek = withinWeekDates.map(
      (date) => Calendar.for(date).dateString,
    );

    const sections: Section[] = [];

    const checkAndPush = (title: string, entry: EntryModel) => {
      const i = sections.findIndex((section) => section.title == title);
      if (i >= 0) {
        sections[i].data.push(entry);
      } else {
        sections.push({title: title, data: [entry]});
      }
    };

    entries.forEach((entry) => {
      if (withinWeek.includes(entry.date)) {
        const i = withinWeek.findIndex(
          (dateString) => dateString == entry.date,
        );
        const weekDayNumber = (withinWeekDates[i].getDay() + 6) % 7; // Monday - Sunday : 0 - 6
        checkAndPush(`Week day ${weekDayNumber}`, entry);
      } else if (tomorrow == entry.date) {
        checkAndPush('Завтра', entry);
      } else if (yesterday == entry.date) {
        checkAndPush('Вчера', entry);
      } else if (now.dateString == entry.date) {
        checkAndPush('Сегодня', entry);
      } else if (now.year == entry.year) {
        checkAndPush(`Month ${entry.month}`, entry);
      } else {
        checkAndPush(entry.year.toString(), entry);
      }
    });

    return sections;
  }

  unitedEntryModels(): EntryModel[] {
    return (this.props.notes as EntryModel[])
      .concat(this.props.payments)
      .concat(this.props.purchases)
      .concat(this.props.sales);
  }

  FlatListItemSeparator = () => {
    return (
      //Item Separator
      <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}} />
    );
  };

  render() {
    return (
      <SectionList
        style={{height: '100%'}}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        sections={this.sectionEntryModels(
          this.unitedEntryModels().filter((model) =>
            model.title
              .toLowerCase()
              .includes(this.props.searchWord.toLowerCase()),
          ),
        )}
        keyExtractor={(item, index) => item.uuid.toString()}
        renderItem={({item}) => <Task entry={item} />}
        renderSectionHeader={({section: {title}}) => (
          <Text fontSize="3xl" py="lg">
            {title}
          </Text>
        )}
      />
    );
  }
}
