import React, {Component} from 'react';
import {ListRenderItemInfo, ScrollView} from 'react-native';
//
import withObservables from '@nozbe/with-observables';
//
import {observeProjects} from '../../../../data/helpers';
import ProjectModel from '../../../../data/projectModel';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Text} from 'react-native-magnus';
import ProjectIcon from './projectIcon';

interface IProps {
  projects: ProjectModel[];
  chosen: ProjectModel[];
  single: boolean;
  onPress: (project: ProjectModel) => void;
  initialCallback?: (initialProjects: ProjectModel[]) => void;
}

interface IState {}

class ProjectChooser extends Component<IProps, IState> {
  static defaultProps = {
    chosen: [],
    single: false,
  };

  constructor(props: IProps) {
    super(props);

    props.initialCallback?.(props.projects);
  }

  render() {
    return (
      <Div row alignItems="center">
        {this.props.initialCallback && this.props.projects.length > 1 && (
          <>
            {!this.props.single && (
              <Button
                h={24}
                p={5}
                rounded={8}
                // ml={10}
                onPress={() =>
                  this.props.chosen.length == this.props.projects.length
                    ? this.props.initialCallback?.([])
                    : this.props.initialCallback?.(this.props.projects)
                }
                bg={
                  this.props.chosen.length == this.props.projects.length
                    ? 'yellow'
                    : '#D2D2D2'
                }>
                <Text fontSize={12} fontWeight="400">
                  Все
                </Text>
              </Button>
            )}
          </>
        )}

        <FlatList
          horizontal
          style={{marginBottom: 10, paddingBottom: 5, alignContent: 'center'}}
          data={this.props.projects}
          keyExtractor={(project: ProjectModel) => project.uuid}
          renderItem={(item: ListRenderItemInfo<ProjectModel>) => (
            <Div ml={10}>
              <ProjectIcon
                isOn={this.props.chosen.some(
                  (project) => project.uuid == item.item.uuid,
                )}
                onPress={() => this.props.onPress?.(item.item)}
                project={item.item}
              />
            </Div>
          )}
        />
      </Div>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects().observeWithColumns(['name']),
}));

export default enhanceWithProjects(ProjectChooser);
