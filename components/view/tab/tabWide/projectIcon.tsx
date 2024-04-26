import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Button, Text} from 'react-native-magnus';
//
import ProjectModel from '../../../../data/projectModel';

interface IProps {
  isOn: boolean;
  project: ProjectModel;
  onPress?: () => void;
}

interface IState {}

class ProjectIcon extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <Button
        h={24}
        p={5}
        rounded={8}
        // ml={10}
        onPress={this.props.onPress}
        bg={this.props.isOn ? this.props.project.color : '#D2D2D2'}>
        <Text fontSize={12} fontWeight="400">
          {this.props.project.name}
        </Text>
      </Button>
    );
  }
}

const enhanceWithProject = withObservables(
  ['project'],
  ({project}: {project: ProjectModel}) => ({
    project: project,
  }),
);

export default enhanceWithProject(ProjectIcon);
