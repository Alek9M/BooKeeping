import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import {Div} from 'react-native-magnus';
import {HeaderContext, HeaderContextValue} from '../../App';
import ProjectModel from '../../data/projectModel';
import SettingsModal from '../view/tab/settingsModal';
import Blur from './elements/blur';
import ProjectsRow from './projectsRow';

interface IProps {}

interface IState {}

export default class Header extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  setProjectsSelected(
    projects: ProjectModel[],
    headerValue: HeaderContextValue,
  ) {
    if (projects.length != 1) headerValue.setProjects(projects);
    else if (headerValue.projectsSelected.includes(projects[0]))
      headerValue.setProjects(
        headerValue.projectsSelected.filter(
          (project) => project.id != projects[0].id,
        ),
      );
    else
      headerValue.setProjects([...headerValue.projectsSelected, projects[0]]);
  }

  render() {
    return (
      <HeaderContext.Consumer>
        {(headerValue) => (
          <Div bg="#DFE5F3">
            <SettingsModal
              isVisible={headerValue.isSettingVisible}
              onSwipeComplete={() => headerValue.showSettings(false)}
            />
            <SafeAreaView>
              <>
                {headerValue.isHeaderVisible && (
                  <Div pb={12}>
                    <ProjectsRow
                      pl={27}
                      selected={headerValue.projectsSelected}
                      onPressSettings={() => headerValue.showSettings(true)}
                      onPress={(projects: ProjectModel[]) =>
                        this.setProjectsSelected(projects, headerValue)
                      }
                    />
                  </Div>
                )}
              </>
            </SafeAreaView>
            <Blur />
          </Div>
        )}
      </HeaderContext.Consumer>
    );
  }
}
