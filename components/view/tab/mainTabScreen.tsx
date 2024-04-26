import React, {Component} from 'react';
//
import {BlurView} from '@react-native-community/blur';
import {SafeAreaView} from 'react-native-safe-area-context';
//
import {BlurContext, BlurContextValue} from '../../../App';
import SearchSettingsRow from './searchSettingsRow';
import SegmentedControl from '@react-native-community/segmented-control';
import ProjectChooser from './tabWide/projectChooser';
import ProjectModel from '../../../data/projectModel';
import {Div} from 'react-native-magnus';

interface IComponent {
  new (): Component;
}

interface TabScreen {
  title: string;
  screen: IComponent;
  props?: any;
}

interface IProps {
  screens: TabScreen[];
  selectedProjects?: ProjectModel[];
  isSettingsButtonVisible?: boolean;
  isProjectChooserVisible?: boolean;
}

interface IState {
  search: string;
  isSettingsVisible: boolean;
  searchFlex: number;
  selectedIndex: number;
  selectedProjects: ProjectModel[];
}

export default class MainTabScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      search: '',
      isSettingsVisible: true,
      searchFlex: 8,
      selectedIndex: 0,
      selectedProjects: [],
    };
  }

  render() {
    const Screen =
      this.props.screens.length > 0
        ? this.props.screens[this.state.selectedIndex].screen
        : undefined;

    const props =
      this.props.screens.length > 0
        ? this.props.screens[this.state.selectedIndex].props ?? []
        : undefined;

    return (
      <>
        <SafeAreaView>
          <Div bg="white">
            {/* <SearchSettingsRow
              isSettingsButtonVisible={this.props.isSettingsButtonVisible}
              onSearchChange={(text) => this.setState({search: text})}
            /> */}
            {(this.props.isProjectChooserVisible ??
              !this.props.selectedProjects ??
              true) && (
              <ProjectChooser
                initialCallback={(initialProjects: ProjectModel[]) =>
                  this.setState({selectedProjects: initialProjects})
                }
                onPress={(project: ProjectModel) =>
                  this.setState((state, _props) => ({
                    selectedProjects: state.selectedProjects.some(
                      (proj) => proj.uuid == project.uuid,
                    )
                      ? state.selectedProjects.filter(
                          (proj) => proj.uuid != project.uuid,
                        )
                      : [...state.selectedProjects, project],
                  }))
                }
                chosen={this.state.selectedProjects}
              />
            )}

            {this.props.screens.length > 1 && (
              <Div mx={14}>
                <SegmentedControl
                  values={this.props.screens.map(
                    (tabScreen) => tabScreen.title,
                  )}
                  selectedIndex={this.state.selectedIndex}
                  onChange={(event) => {
                    const i = event.nativeEvent.selectedSegmentIndex;
                    this.setState({selectedIndex: i});
                  }}
                />
              </Div>
            )}
            {this.props.screens.length >= 1 && (
              <Screen
                searchWord={this.state.search}
                selectedProjects={
                  this.props.selectedProjects ?? this.state.selectedProjects
                }
                {...props}
              />
            )}
          </Div>
        </SafeAreaView>
        <BlurContext.Consumer>
          {(value: BlurContextValue) => (
            <>
              {value.isVisible && (
                <BlurView
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                  blurType="light"
                  blurAmount={3}
                  // reducedTransparencyFallbackColor="white"
                />
              )}
            </>
          )}
        </BlurContext.Consumer>
      </>
    );
  }
}
