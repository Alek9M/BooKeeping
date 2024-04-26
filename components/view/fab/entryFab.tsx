import React, {useState, Component} from 'react';
import {Dimensions, SafeAreaView} from 'react-native';
import 'react-native-gesture-handler';
//
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
import withObservables from '@nozbe/with-observables';
//
import FabOptionButton from './fabOptionButton';
import FabModal from './fabModal';
import {NoteInt} from './note';
import {BlurContext, EntryContext, EntryContextValue} from '../../../App';
import ProjectsDropdown, {projectsDropdownRef} from './projectsDropdown';
import EntryModalNavigator from './entryModalNavigator';
import Project from '../../../model/project';
import Entry from '../../../model/entry';
import Note from '../../../model/note';
import Payment from '../../../model/payment';
import Purchase from '../../../model/purchase';
import Sale from '../../../model/sale';
import {observeProjects} from '../../../data/helpers';
import ProjectModel from '../../../data/projectModel';
import {Q} from '@nozbe/watermelondb';
import FabButton from '../../markeloView/fab/elements/fabButton';
import {
  closedFab,
  note,
  openFab,
  payment,
  purchase,
  sale,
} from '../../markeloView/icons/fab/svg';

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
  projects: ProjectModel[];
}

interface IState {
  createEntry?: (project: Project) => Entry;
  isOpen: boolean;
}

interface FabOptionButtonData {
  text: string;
  icon: Element;
  creator: (project: Project) => Entry;
}

class EntryFab extends Component<IProps, IState> {
  color = 'blue600';
  backBlurColor = 'white';
  optionSize = 'lg';
  size = 50;

  get buttons(): FabOptionButtonData[] {
    if (this.props.projects.length == 0) return [];

    return [
      {
        text: 'Оплата',
        icon: payment({}),
        creator: (project) => new Payment(project, {}),
      },
      {
        text: 'Покупка',
        icon: purchase({}),
        creator: (project) => new Purchase(project, {}),
      },
      {
        text: 'Продажа',
        icon: sale({}),
        creator: (project) => new Sale(project, {}),
      },
    ];
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      createEntry: undefined,
      isOpen: false,
    };
  }

  applyProject(project: Project, value: EntryContextValue) {
    if (this.state.createEntry) {
      const entry = this.state.createEntry(project);
      this.setState({createEntry: undefined}, () => value.onChangeEntry(entry));
    }
  }

  render() {
    return (
      <>
        {this.props.children}
        <BlurContext.Consumer>
          {(blurValue) => (
            <EntryContext.Consumer>
              {(value) => (
                <>
                  <EntryModalNavigator />
                  <ProjectsDropdown
                    onSelect={(project: Project) =>
                      this.applyProject(project, value)
                    }
                  />
                  <Fab
                    bg="#F5F9FF" //{this.color}
                    h={48} //{this.size}
                    w={48} //{this.size}
                    p={0}
                    shadow={0}
                    bottom={50}
                    borderColor="#7D90AB"
                    borderWidth={2}
                    icon={openFab({})}
                    activeIcon={closedFab({})}
                    overlayOpacity={0}
                    disabled={blurValue.isVisible && !this.state.isOpen}
                    onOpen={() => {
                      blurValue.set(true);
                      this.setState({isOpen: true});
                    }}
                    onClose={() => {
                      blurValue.set(false);
                      this.setState({isOpen: false});
                    }}

                    // showOverlay={false}
                    // mr={Dimensions.get('window').width / 2 - this.size / 2}
                  >
                    <FabButton
                      text="Задача"
                      icon={note({})}
                      onPress={() => {
                        value.onChangeEntry(new Note({}));
                      }}
                    />
                    {this.buttons.map((button) => (
                      <FabButton
                        text={button.text}
                        icon={button.icon}
                        onPress={() => {
                          this.setState(
                            {
                              createEntry: button.creator,
                            },
                            () =>
                              this.props.projects.length > 1
                                ? projectsDropdownRef.current?.open()
                                : this.applyProject(
                                    new Project({
                                      model: this.props.projects[0],
                                    }),
                                    value,
                                  ),
                          );
                        }}
                      />
                    ))}
                  </Fab>
                </>
              )}
            </EntryContext.Consumer>
          )}
        </BlurContext.Consumer>
      </>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects().extend(Q.where('terminated', false)),
}));

export default enhanceWithProjects(EntryFab);
