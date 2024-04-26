import React, {useState, Component} from 'react';
import {SafeAreaView} from 'react-native';
import 'react-native-gesture-handler';

import {
  Fab,
  Button,
  Text,
  Icon,
  Div,
  Modal,
  DropdownRef,
  Dropdown,
} from 'react-native-magnus';

import FabOptionButton from './fabOptionButton';
import FabModal from './fabModal';
import {NoteInt} from './note';
import {EntryContext} from '../../App';
import ProjectsDropdown, {projectsDropdownRef} from './projectsDropdown';
import Project from '../../model/project';

export type screens =
  | 'Contact'
  | 'Contacts'
  | 'AddContact'
  | 'Note'
  | 'Payment'
  | 'Purchase'
  | 'Sale'
  | 'ItemsList'
  | 'ViewItem'
  | undefined;

interface IProps {
  children: React.ReactNode;
  note?: NoteInt;
  initScreen?:
    | 'Contact'
    | 'Contacts'
    | 'AddContact'
    | 'Note'
    | 'Payment'
    | 'Purchase'
    | 'Sale'
    | 'ItemsList'
    | 'ViewItem';
}

interface IState {
  initialStack: screens;
  stackToBe: screens;
}

export default class FabMenu extends Component<IProps, IState> {
  color = 'blue600';
  backBlurColor = 'white';
  optionSize = 'lg';
  size = 50;

  constructor(props: IProps) {
    super(props);

    this.state = {
      initialStack: props.initScreen,
      stackToBe: undefined,
    };
  }

  hideModal() {
    this.setState({initialStack: undefined});
  }

  render() {
    return (
      <>
        {this.props.children}
        <EntryContext.Consumer>
          {(value) => (
            <>
              <FabModal
                hideModal={() => {
                  this.hideModal();
                  value.onChangeEntry(undefined);
                }}
                note={this.props.note}
                initialStack={this.state.initialStack}
              />
              <ProjectsDropdown
                onSelect={(project: Project) => {
                  value.onChangeProject(project);
                  this.setState((state, props) => {
                    return {initialStack: state.stackToBe};
                  });
                }}
              />
            </>
          )}
        </EntryContext.Consumer>

        <Fab bg={this.color} h={this.size} w={this.size} p={0} bottom={80}>
          <FabOptionButton
            text="Задача"
            iconName="sticky-note-o"
            fontFamily="FontAwesome"
            color={this.color}
            size={this.size}
            onPress={() => {
              this.setState({
                initialStack: 'Note',
              });
            }}
          />
          <FabOptionButton
            text="Деньги"
            iconName="attach-money"
            fontFamily="MaterialIcons"
            color={this.color}
            size={this.size}
            onPress={() => {
              this.setState(
                {
                  stackToBe: 'Payment',
                },
                () => projectsDropdownRef.current?.open(),
              );
            }}
          />
          <FabOptionButton
            text="Покупка"
            iconName="buy-n-large"
            fontFamily="FontAwesome5"
            color={this.color}
            size={this.size}
            onPress={() => {
              this.setState(
                {
                  stackToBe: 'Purchase',
                },
                () => projectsDropdownRef.current?.open(),
              );
            }}
          />
          <FabOptionButton
            text="Продажа"
            iconName="point-of-sale"
            fontFamily="MaterialCommunityIcons"
            color={this.color}
            size={this.size}
            onPress={() => {
              this.setState(
                {
                  stackToBe: 'Sale',
                },
                () => projectsDropdownRef.current?.open(),
              );
            }}
          />
        </Fab>
      </>
    );
  }
}
