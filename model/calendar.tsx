import moment from 'moment';
import {BillQR} from '../components/view/fab/forms/qrScan';

export interface ICalendar {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

export enum Precision {
  Day,
  Month,
  Year,
}
export default class Calendar implements ICalendar {
  static rusMonth = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  static rusWeekDay = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];

  // TODO: FIXME: I might be the problem .___.
  static neighborDay = ['Завтра', 'Сегодня', 'Вчера'];

  day: number;
  month: number;
  year: number;
  get dateString(): string {
    return [this.year, this.month, this.day]
      .map((number) =>
        number.toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }),
      )
      .join('-');
  }

  get copy(): Calendar {
    return Object.create(this);
  }

  get date(): Date {
    var date = new Date();
    date.setFullYear(this.year, this.month - 1, this.day);
    return date;
  }

  set date(v: Date) {
    this.year = v.getFullYear();
    this.month = v.getMonth() + 1;
    this.day = v.getDate();
  }

  constructor(calendar?: ICalendar) {
    const iCal = calendar ?? Calendar.for(new Date());
    this.day = iCal.day;
    this.month = iCal.month;
    this.year = iCal.year;
  }

  static for(date: Date): Calendar {
    const iCalendar: ICalendar = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      dateString: '',
    };

    return new Calendar(iCalendar);
  }

  static derive(dateString: string): Calendar {
    const dates = dateString.split('-').map((date) => Number(date));
    const iCalendar: ICalendar = {
      day: dates[2],
      month: dates[1],
      year: dates[0],
      dateString: dateString,
    };

    return new Calendar(iCalendar);
  }

  static of(year: number, month: number, day: number): Calendar {
    return new Calendar({
      year: year,
      month: month,
      day: day,
      dateString: [year, month, day].join('-'),
    });
  }

  static qr(qr: BillQR): Calendar {
    return this.of(qr.year, qr.month, qr.day);
  }

  add(days: number) {
    var date = this.date;
    date.setDate(date.getDate() + days);
    this.date = date;
  }

  nextDay(date: Date, days: number): Calendar {
    const nextDay = Calendar.for(date);
    nextDay.add(days);
    return nextDay;
  }

  daysDifference(to?: Calendar): number {
    if (!to)
      return moment(new Calendar().dateString).diff(this.dateString, 'days');
    return moment(this.dateString).diff(to.dateString, 'days');
  }

  monthsDifference(to?: Calendar): number {
    if (!to)
      return moment(new Calendar().dateString).diff(this.dateString, 'months');
    return moment(this.dateString).diff(to.dateString, 'months');
  }

  yearsDifference(to?: Calendar): number {
    if (!to)
      return moment(new Calendar().dateString).diff(this.dateString, 'years');
    return moment(this.dateString).diff(to.dateString, 'years');
  }

  isBeforeInc(day: Calendar): boolean {
    return moment(this.dateString).isSameOrBefore(day.dateString, 'day');
  }

  readableName(precision?: Precision): string {
    if (precision == Precision.Year) return this.year.toString();
    if (precision == Precision.Month)
      return `${Calendar.rusMonth[this.month - 1]}, ${this.year}`;
    const neighborNumber = this.daysDifference();
    if (precision == Precision.Day)
      return `${this.day} ${Calendar.rusMonth[this.month - 1]} ${this.year}`;
    if (Math.abs(neighborNumber) <= 1)
      return Calendar.neighborDay[neighborNumber + 1];

    return `${this.day} ${Calendar.rusMonth[this.month - 1]}, ${
      Calendar.rusWeekDay[this.date.getDay()]
    }`;
  }
}
