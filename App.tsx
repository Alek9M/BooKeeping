import React, {Component, useCallback, useContext, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Platform,
  PermissionsAndroid,
  UIManager,
  Alert,
} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Fab, Button, Text, Icon, Div, ThemeProvider} from 'react-native-magnus';
import {Calendar} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SegmentedControl from '@react-native-community/segmented-control';
import Contacts from 'react-native-contacts';
import SearchableDropdown from 'react-native-searchable-dropdown';

import FingerprintPopup from './components/authComponents/iosPopUp';
import BiometricPopup from './components/authComponents/androidPopUp';

import Entry from './model/entry';
import Project from './model/project';
import Today from './components/view/toDo/today';
import EntryFab from './components/view/fab/entryFab';
import TabNavigation from './components/view/tab/tabNavigation';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import {database} from './data/database';
import withObservables from '@nozbe/with-observables';
import {observeProjects} from './data/helpers';
import ProjectModel from './data/projectModel';
import {useEffect} from 'react';
import ShareMenu, {ShareMenuReactView} from 'react-native-share-menu';
import Note from './model/note';
import SharedView from './components/shareExtension/main';
import Checkbox from './components/markeloView/elements/checkbox';
import ProjectBadge from './components/markeloView/elements/projectBadge';
import EntryRow from './components/markeloView/toDo/entryRow';
import NoteModel from './data/noteModel';
import EntryBlock from './components/markeloView/toDo/entryBlock';
import ProjectsRow from './components/markeloView/projectsRow';
import SquareSelector from './components/markeloView/elements/squareSelector';
import Header from './components/markeloView/header';
import BasicTab from './components/markeloView/basicViews/basicTab';
import EntryBlockList from './components/markeloView/toDo/entryBlockList';
import ToDo from './components/markeloView/toDo/todo';

export const MarkelovTheme = {
  colors: {
    GraphicItems: '#7F8FA7',
    SwitcherUnactive: '#CBCBCB',
    Anatation: '#92969C',
    Green: '#45B600',
    NavigationBackbround: '#F5F9FF',
    ActiveNavigation: '#576880',
    CalendarSelectItem: '#DFE4EB',
    UnactiveNavigation: '#7D90AB',
    HeaderBackground: '#DFE5F3',
    Black20: 'rgba(0, 0, 0, 0.2)',
    CalendarItems: '#A2ADBE',
    DarkIcon: '#7D8694',
    GrayBackbround: '#F1F2F5',
    Black40: 'rgba(0, 0, 0, 0.4)',
    Black80: 'rgba(0, 0, 0, 0.8)',
    Black60: 'rgba(0, 0, 0, 0.6)',
    Black100: '#000000',
    Black10: 'rgba(0, 0, 0, 0.1)',
    Red: '#ED4949',
    CheckboxNSwitcher: '#767676',
    BlackBodyText: '#444D56',
    WhiteBackground: '#F9F9FA',
  },
  fontSize: {
    XXL: 21, // *ORIGIN* 24,
    XL: 18,
    L: 16,
    M: 14,
    S: 12,
    XS: 11,
    XXS: 10,
  },
  fontFamily: {
    Regular400: 'Inter',
    SemiBold600: 'Inter-SemiBold',
    Bold700: 'Inter-Bold',
  },

  components: {
    Button: {
      bg: 'transparent',
      p: 0,
    },
    Text: {
      fontFamily: 'Inter',
      fontSize: 14,
      color: '#444D56',
    },
  },
  profitColors: ['#8DB863', '#E59042', '#8376D1'],
};

const Stack = createStackNavigator();

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type EntryContextValue = {
  entry?: Entry;
  onChangeEntry: (object: Entry | undefined) => void;
  project?: Project;
  onChangeProject: (object: Project | undefined) => void;
  queue: Entry[];
  onChangeQueue: (object: Entry[]) => void;
};

export type HeaderContextValue = {
  isSettingVisible: boolean;
  showSettings: (isVisible: boolean) => void;
  projectsSelected: ProjectModel[];
  setProjects: (projects: ProjectModel[]) => void;
  areProjectsVisible: boolean;
  setProjectsVisible: (isVisible: boolean) => void;
  isHeaderVisible: boolean;
  setHeaderVisible: (isVisible: boolean) => void;
};

export type BlurContextValue = {
  isVisible: boolean;
  set: (isVisible: boolean) => void;
};

export const EntryContext = React.createContext<EntryContextValue>({
  entry: undefined,
  onChangeEntry: (_) => {},
  project: undefined,
  onChangeProject: (_) => {},
  queue: [],
  onChangeQueue: (_) => {},
});

export const HeaderContext = React.createContext<HeaderContextValue>({
  isSettingVisible: false,
  showSettings: (_) => {},
  projectsSelected: [],
  setProjects: (_) => {},
  areProjectsVisible: true,
  setProjectsVisible: (_) => {},
  isHeaderVisible: true,
  setHeaderVisible: (_) => {},
});

export const BlurContext = React.createContext<BlurContextValue>({
  isVisible: false,
  set: (_) => {},
});

interface IProps {
  projects: ProjectModel[];
}

interface IState {
  object?: Entry;
  project?: Project;
  queue: Entry[];
  isSettingsVisible: boolean;
  isBlurVisible: boolean;
  shared?: SharedItem;
  projectsSelected: ProjectModel[];
  areProjectsVisible: boolean;
  isHeaderVisible: boolean;
}

class App extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      object: undefined,
      project: undefined,
      queue: [],
      isSettingsVisible: props.projects.length == 0,
      isBlurVisible: false,
      projectsSelected: props.projects,
      areProjectsVisible: true,
      isHeaderVisible: true,
    };

    if (Platform.OS == 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      });
    }
  }

  componentDidMount() {
    database.adapter.getLocal('authentication').then((authentication) => {
      if (!authentication) return;
      FingerprintScanner.isSensorAvailable()
        .then((biometryType) => {
          this.setState({isBlurVisible: true}, () => {
            FingerprintScanner.authenticate({description: 'Авторизуйтесь'})
              .then(() => {
                this.setState({isBlurVisible: false});
                // Alert.alert('Вы супер!');
              })
              .catch((error) => {
                Alert.alert(error.message);
              });
          });
        })
        .catch((error) => {
          Alert.alert(error.message);
          database.adapter.setLocal('authentication', '');
        });
    });

    const handleShare = (item?: SharedItem) => {
      if (!item) {
        return;
      }

      this.setState({shared: item});
    };

    ShareMenu.getInitialShare(handleShare);
    ShareMenu.addNewShareListener(handleShare);
  }

  render() {
    return (
      <>
        <EntryContext.Provider
          value={{
            entry: this.state.object,
            onChangeEntry: (object) => {
              this.setState({object: object}, () => {
                if (!this.state.queue.length || this.state.object) return;
                setTimeout(() => {
                  this.setState({object: this.state.queue.pop()});
                }, 1);
              });
            },
            project: this.state.project,
            onChangeProject: (project) => this.setState({project: project}),
            queue: this.state.queue,
            onChangeQueue: (objects) => {
              const obj = this.state.object ? this.state.object : objects.pop();
              setTimeout(() => {
                this.setState({
                  queue: objects, //objects.filter((obj) => obj.project != undefined),
                  object: obj,
                });
              }, 1);
            },
          }}>
          <HeaderContext.Provider
            value={{
              isSettingVisible: this.state.isSettingsVisible,
              showSettings: (isVisible: boolean) =>
                this.setState({isSettingsVisible: isVisible}),
              projectsSelected: this.state.projectsSelected,
              setProjects: (projects) =>
                this.setState({projectsSelected: projects}),
              areProjectsVisible: this.state.areProjectsVisible,
              setProjectsVisible: (isVisible: boolean) =>
                this.setState(
                  {areProjectsVisible: isVisible},
                  // this.forceUpdate,
                ),
              isHeaderVisible: this.state.isHeaderVisible,
              setHeaderVisible: (isVisible: boolean) =>
                this.setState({isHeaderVisible: isVisible}, this.forceUpdate),
            }}>
            <BlurContext.Provider
              value={{
                isVisible: this.state.isBlurVisible,
                set: (isVisible: boolean) =>
                  this.setState({isBlurVisible: isVisible}),
              }}>
              <ThemeProvider theme={MarkelovTheme}>
                {/* <FabMenu> */}
                <EntryFab>
                  {/* <Navigation /> */}
                  <SharedView
                    sharedData={this.state.shared}
                    onDismiss={async () => this.setState({shared: undefined})}
                  />

                  <Header />
                  {/* <ToDo /> */}
                  <TabNavigation />
                </EntryFab>
                {/* </FabMenu> */}
              </ThemeProvider>
            </BlurContext.Provider>
          </HeaderContext.Provider>
        </EntryContext.Provider>
      </>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects(),
}));

type SharedItem = {
  mimeType: string;
  data: string;
  extraData: any;
};

function withShareListener(MComponent) {
  const handleShare = useCallback((item?: SharedItem) => {
    if (!item) {
      return;
    }

    const context = useContext(EntryContext);
    context.onChangeEntry(new Note({}));

    // const {mimeType, data, extraData} = item;

    // setSharedData(data);
    // setSharedMimeType(mimeType);
    // // You can receive extra data from your custom Share View
    // console.log(extraData);
    // console.log('Extension run');
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, []);

  // return function WrappedComponent(props) {
  return <MComponent />;
  // };
}

App.contextType = EntryContext;

export default enhanceWithProjects(App);

// export default App;
