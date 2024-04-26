import React, {Component} from 'react';
import ProjectModel from '../../data/projectModel';
import Calendar from '../calendar';
import IContact from '../contact';
import {IProject} from '../project';

enum Bank {
  Sberbank = 'Сбербанк',
}

export type movement = {
  incoming: boolean;
  amount: number;
  type?: string;
  description?: string;
  date?: Calendar;
  contact?: contact;
  iProject?: ProjectModel;
  bank?: string;
};

type contact = {
  name: string;
  card: string;
  iContact?: IContact;
};

export default class Statement {
  static regexBank = new Map<Bank, RegExp>([
    [Bank.Sberbank, new RegExp('.*СберБанк Онлайн.*')],
  ]);

  originalStatement: string[][];
  movement: movement[] = [];
  period?: {start: Calendar; finish: Calendar};
  bank?: Bank;

  constructor(pages: string[]) {
    this.originalStatement = pages.map((page) => page.split('\n'));
    this.parse();
  }

  parse() {
    // if (this.originalStatement.length < 3) return;
    this.getBank();
    if (this.bank == undefined) return;
    this.getPeriod(this.originalStatement[0]);
    for (const page of this.originalStatement) {
      let movements = this.getMovements(page);
      if (!movements.length) continue;
      this.getDates(page, movements);
      this.movement.push(...movements);
    }
  }

  dateToCalendar(dateString: string): Calendar | undefined {
    const dateRegex = new RegExp('[\\s]*\\d{2}.\\d{2}.\\d{4}');
    if (!dateRegex.test(dateString)) return undefined;
    return Calendar.derive(dateString.split('.').reverse().join('-'));
  }

  getBank() {
    for (const regex of Statement.regexBank) {
      if (regex[1].test(this.originalStatement[0][0])) this.bank = regex[0];
    }
  }

  getPeriod(page: string[]) {
    switch (this.bank) {
      case Bank.Sberbank:
        const spaceSplit = page[0].split(' ');
        const start = this.dateToCalendar(spaceSplit[spaceSplit.length - 3]);
        const finish = this.dateToCalendar(spaceSplit[spaceSplit.length - 1]);
        if (!start || !finish) break;
        this.period = {
          start: start,
          finish: finish,
        };
        break;
      default:
        break;
    }
  }

  getMovements(page: string[]): movement[] {
    if (this.bank != Bank.Sberbank) return [];
    const beginAmount = page.findIndex((text) =>
      text.includes('Сумма в валюте операции'),
    );
    if (beginAmount < 2) return [];
    const moneyRegex = new RegExp('^[\\d\\s+,]{3,}$');
    let movements: movement[] = [];
    for (let index = beginAmount + 1; index < page.length; index++) {
      if (!moneyRegex.test(page[index])) break;
      const spaceSplits = page[index].split(' ');
      let number = '';
      let incoming = false;
      for (const spaceSplit of spaceSplits) {
        if (spaceSplit.includes('+')) incoming = true;
        number += spaceSplit.replace('+', '').replace(',', '.');
        if (spaceSplit.includes(',')) {
          movements.push({
            incoming: incoming,
            amount: Number(number),
            bank: this.bank,
          });
          number = '';
          incoming = false;
        }
      }
    }

    const descriptionBegin = page.findIndex((text) =>
      text.includes('Название операции'),
    );

    for (
      let index = 0, movementIndex = 0;
      movementIndex < movements.length;
      index += 2, movementIndex++
    ) {
      if (page[descriptionBegin + 1 + index] == 'ОСТАТОК ПО СЧЁТУ') {
        const letterRegex = new RegExp('^[а-яА-Я\\s]+$');
        do {
          index++;
        } while (!letterRegex.test(page[descriptionBegin + 1 + index]));
      }

      const current = page[descriptionBegin + 1 + index];
      movements[movementIndex].type = current;
      const next = page[descriptionBegin + 1 + index + 1];
      let description = next;
      const nextNext = page[descriptionBegin + 1 + index + 1 + 1];
      //   if (nextNext.toUpperCase() === nextNext) {
      //     description += nextNext;
      //     index++;
      //   }
      movements[movementIndex].description = description;
      if (description.indexOf('SBOL перевод') == 0) {
        const splitDescription = description.split(' ');
        movements[movementIndex].contact = {
          card: splitDescription[2],
          name: splitDescription.slice(3).join(' '),
        };
      }
    }

    return movements;
  }

  getDates(page: string[], movements: movement[]) {
    if (this.bank != Bank.Sberbank) return;
    const dateRegex = new RegExp('[\\s]{4}\\d{2}.\\d{2}.\\d{4}');
    const datesBegin = page.findIndex((text) => dateRegex.test(text));
    for (
      let index = 0, movementIndex = 0;
      movementIndex < movements.length;
      index += 2, movementIndex++
    ) {
      movements[movementIndex].date = this.dateToCalendar(
        page[datesBegin + index],
      );
    }
  }
}
