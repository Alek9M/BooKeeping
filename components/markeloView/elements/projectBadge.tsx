import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Button, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../../App';
import ProjectModel from '../../../data/projectModel';

interface IProps {
  onPress?: () => void;
  isOn?: boolean;
  project: ProjectModel;
}

interface IState {}

export class ProjectBadge extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  // Badge
  height = 30;
  borderWidth = 1;
  borderColor = 'rgba(0, 0, 0, 0.1)';

  // Text
  textColor = 'rgba(0, 0, 0, 0.6)';
  horizontalOffset = 12;

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <Button
          onPress={this.props.onPress}
          bg={this.props.isOn ? this.props.project.color : 'transparent'}
          h={this.height}
          py={0}
          px={this.horizontalOffset}
          rounded={this.height}
          borderWidth={this.borderWidth}
          borderColor={this.borderColor}>
          <Text color={this.textColor}>{this.props.project.name}</Text>
        </Button>
      </ThemeProvider>
    );
  }
}

const enhanceWithProject = withObservables(
  ['project'],
  ({project}: {project: ProjectModel}) => ({
    project: project,
  }),
);

export default enhanceWithProject(ProjectBadge) as ProjectBadge;
