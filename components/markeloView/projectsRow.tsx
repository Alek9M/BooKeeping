import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {FlatList, ScrollView} from 'react-native';
import {Button, Div} from 'react-native-magnus';
import {observeProjects} from '../../data/helpers';
import ProjectModel from '../../data/projectModel';
import {gear} from './icons/svg';
import EProjectBadge, {ProjectBadge} from './elements/projectBadge';
import {HeaderContext} from '../../App';

interface IProps {
  projects: ProjectModel[];
  onPress: (project: ProjectModel[]) => void;
  onPressSettings?: () => void;
  selected: ProjectModel[];
  hasSelectAll?: boolean;
  pl?: number;
}

interface IState {}

class ProjectsRow extends Component<IProps, IState> {
  static defaultProps = {
    hasSelectAll: true,
  };

  constructor(props: IProps) {
    super(props);
  }

  get areAllSelected(): boolean {
    return this.props.projects.length == this.props.selected.length;
  }

  settingsButton() {
    if (!this.props.onPressSettings) return;
    return (
      <Button bg="transparent" p={0} onPress={this.props.onPressSettings}>
        {gear({})}
      </Button>
    );
  }

  selectAllButton() {
    if (!this.props.hasSelectAll) return;
    return (
      <Div ml={12} mr={6}>
        <ProjectBadge
          project={{name: 'все', color: '#F9F9FA'}}
          isOn={this.areAllSelected}
          onPress={() =>
            this.areAllSelected
              ? this.props.onPress([])
              : this.props.onPress(this.props.projects)
          }
        />
      </Div>
    );
  }

  render() {
    return (
      <ScrollView horizontal>
        <HeaderContext.Consumer>
          {(value) => (
            <Div pl={this.props.pl} row alignItems="center">
              {this.settingsButton()}
              {value.areProjectsVisible && (
                <>
                  {this.props.projects.length > 1 && this.selectAllButton()}
                  <FlatList
                    horizontal
                    data={this.props.projects}
                    renderItem={(info) => (
                      <Div mx={6}>
                        <EProjectBadge
                          project={info.item}
                          isOn={this.props.selected.includes(info.item)}
                          onPress={() => this.props.onPress([info.item])}
                        />
                      </Div>
                    )}
                  />
                </>
              )}
            </Div>
          )}
        </HeaderContext.Consumer>
      </ScrollView>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects().observeWithColumns(['name']),
}));

export default enhanceWithProjects(ProjectsRow);
