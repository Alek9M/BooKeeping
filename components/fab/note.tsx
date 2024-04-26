import React, {Component} from 'react';
import {ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {TypedNavigator} from '@react-navigation/native';

import {Div} from 'react-native-magnus';

import ModalHeader from './customComponents/modalHeader';
import Input from './customComponents/TextInput';
import ProjectsPicker from './customComponents/projectsPicker';
import DatePickerRow from './customComponents/datePickerRow';
import BasicModal from './customComponents/basicModal';
import HeaderButton from './customComponents/headerButton';
import ICalendar from '../../model/calendar';
import {StackScreenProps} from '@react-navigation/stack';
import {FabModalRootStackParamList} from './fabModal';

import Calendar from '../../model/calendar';
import Project from '../../model/project';
import CNote, {INote} from '../../model/note';
import withObservables from '@nozbe/with-observables';
import NoteModel from '../../data/noteModel';
import ProjectModel from '../../data/projectModel';

export interface NoteInt {
  title: string;
  note: string;
  day?: ICalendar;
  project?: string;
}

type Props = StackScreenProps<FabModalRootStackParamList, 'Note'>;

interface IProps {
  onDone: () => void;
  note?: CNote;
  project?: ProjectModel;
  navigation: any;
}

interface IState {
  note: CNote;
}

class Note extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    let note = props.note ? props.note : new CNote({});
    // note.project = props.project ? Project.demodel(props.project) : undefined;

    this.state = {
      note: note,
    };
  }

  componentDidUpdate() {
    this.props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton
            title="Сохранить"
            disabled={!this.state.note.isValid()}
            onPress={() => {
              this.state.note.save().then(() => this.props.onDone());
            }}
          />
        );
      },
    });
  }

  render() {
    return (
      <>
        <BasicModal>
          <Div px="md">
            <Input
              textValue={this.state.note.title}
              onChange={(text) => {
                this.setState((state, props) => {
                  let note = state.note;
                  note.title = text;
                  return {note: note};
                });
              }}
              placeholder="Новая задача"
            />
            <Input
              textValue={this.state.note.note}
              onChange={(text) => {
                this.setState((state, props) => {
                  let note = state.note;
                  note.note = text;
                  return {note: note};
                });
              }}
              placeholder="Заметка"
              type="multiline"
            />
            <DatePickerRow
              day={this.state.note.date}
              onDayChange={(date) => {
                this.setState((state, props) => {
                  let note = state.note;
                  note.date = date;
                  return {note: note};
                });
              }}
            />

            <ProjectsPicker
              selected={this.state.note.project}
              onSelect={(project: Project) => {
                this.setState((state, props) => {
                  let note = state.note;
                  note.project = project;
                  return {note: note};
                });
              }}
            />
          </Div>
        </BasicModal>
      </>
    );
  }
}

const enhance = withObservables(['note'], ({note}) => ({
  note: note,
  project: note.project,
}));

const Enhanced = enhance(Note);

export default class NoteExtactor extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      note: props.route.params.note ?? new CNote({}),
    };
  }

  render() {
    // const render = this.props.route.params.note ?
    return (
      <>
        {/* {this.props.route.params.note == undefined && ( */}
        <Note
          onDone={this.props.route.params.onDone}
          note={this.props.route.params.note}
          navigation={this.props.navigation}
        />
        {/* // )} */}
        {/* {this.props.route.params.note && (
          <Enhanced
            onDone={this.props.route.params.onDone}
            note={this.props.route.params.note.model}
            navigation={this.props.navigation}
          />
        )} */}
      </>
    );
  }
}
