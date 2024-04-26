import React, {Component} from 'react';
//
import SegmentedControl from '@react-native-community/segmented-control';
import {Button, Div, Icon, Input, Text} from 'react-native-magnus';
import {BlurView} from '@react-native-community/blur';
//
import SegmentComponentController from '../../controller/segmentComponentController';
import Today from './today';
import Plans from './plans';
import Done from './done';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
import SearchSettingsRow from '../tab/searchSettingsRow';
import {BlurContext, BlurContextValue} from '../../../App';
import MainTabScreen from '../tab/mainTabScreen';
import withObservables from '@nozbe/with-observables';
import Entry, {EntryTable} from '../../../model/entry';
import {Model, Q, Query} from '@nozbe/watermelondb';
import TaskSectionList from './components/taskSectionList';
import ProjectModel from '../../../data/projectModel';

interface IProps {}

interface IState {}

export default class ToDo extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  filterByProject(projects: ProjectModel[]): Q.WhereDescription {
    return Q.where(
      'project_id',
      Q.oneOf(projects.map((project) => project.id)),
    );
  }

  getEnhancer(getQuery: (table: EntryTable) => Query<Model>) {
    let queries = Object.values(EntryTable).reduce((enhanced, table) => {
      enhanced[table] = getQuery(table).extend(
        this.filterByProject(selectedProjects),
      );
      return enhanced;
    }, {});

    return withObservables(['selectedProjects'], ({selectedProjects}) =>
      Object.values(EntryTable).reduce((enhanced, table) => {
        enhanced[table] = getQuery(table).extend(
          this.filterByProject(selectedProjects),
        );
        return enhanced;
      }, {}),
    );
  }

  getEnhancedTaskSectionList(getQuery: (table: EntryTable) => Query<Model>) {
    return this.getEnhancer(getQuery)(TaskSectionList);
  }

  render() {
    return (
      <>
        <MainTabScreen
          isSettingsButtonVisible
          screens={[
            {title: 'Сегодня', screen: Today},
            {
              title: 'Планы',
              screen: Plans, //this.getEnhancedTaskSectionList(Entry.futureUndoneFor),
            },
            {
              title: 'Сделано',
              screen: Done, //this.getEnhancedTaskSectionList(Entry.doneFor),
            },
          ]}
        />
      </>
    );
  }
}
