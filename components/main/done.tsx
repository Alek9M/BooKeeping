import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {doneNotes} from '../../data/helpers';
import Entry, {EntryTable} from '../../model/entry';
import {Plans} from './plans';
import {Today} from './today';

interface IProps {}

interface IState {}

class Done extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return <></>;
  }
}

const enhanceWithNotes = withObservables([], () => ({
  notes: Entry.doneFor(EntryTable.Notes),
}));

export default enhanceWithNotes(Plans);
