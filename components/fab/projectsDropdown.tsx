import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Dropdown, DropdownRef, Text} from 'react-native-magnus';
import {observeProjects} from '../../data/helpers';
import ProjectModel from '../../data/projectModel';
import Project from '../../model/project';

interface IProps {
  projects: ProjectModel[];
  ref: React.RefObject<DropdownRef>;
  onSelect: (project: Project) => void;
}

interface IState {}

export const projectsDropdownRef: React.RefObject<DropdownRef> = React.createRef();

class ProjectsDropdown extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  //   componentDidUpdate() {
  //     setTimeout(() => {
  //       if (this.props.projects.length == 0) {
  //         projectsDropdownRef.current?.close();
  //       } else if (this.props.projects.length == 1) {
  //         this.props.onSelect(Project.demodel(this.props.projects[0]));
  //         projectsDropdownRef.current?.close();
  //       }
  //     }, 100);
  //   }

  render() {
    return (
      <Dropdown
        ref={projectsDropdownRef}
        title={
          <Text mx="xl" color="gray500" pb="md">
            Выбирите проект
          </Text>
        }
        mt="md"
        pb="2xl"
        showSwipeIndicator={true}
        roundedTop="xl">
        {this.props.projects.map((project) => (
          <Dropdown.Option
            key={project.uuid}
            py="md"
            px="xl"
            onPress={() => {
              setTimeout(
                () => this.props.onSelect(Project.demodel(project)),
                500,
              );
            }}
            block>
            {project.name}
          </Dropdown.Option>
        ))}
      </Dropdown>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects(),
}));

export default enhanceWithProjects(ProjectsDropdown);
