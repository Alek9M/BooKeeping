import React, {Component} from 'react';
//
import withObservables from '@nozbe/with-observables';
import {Div, Dropdown, DropdownRef, Text} from 'react-native-magnus';
//
import {observeProjects} from '../../../data/helpers';
import ProjectModel from '../../../data/projectModel';
import Project from '../../../model/project';
import {Q} from '@nozbe/watermelondb';
import ProjectBadge from '../../markeloView/elements/projectBadge';
import {MarkelovTheme} from '../../../App';

interface IProps {
  projects: ProjectModel[];
  onSelect: (project: Project) => void;
}

interface IState {}

export const projectsDropdownRef: React.RefObject<DropdownRef> = React.createRef();

class ProjectsDropdown extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      // TODO: add shadow
      // <Div
      //   style={{
      //     shadowColor: '#4D607C59',
      //     shadowOpacity: 0.35,
      //     shadowRadius: 20,
      //     shadowOffset: {height: -5, width: 0},
      //   }}>
      <Dropdown
        ref={projectsDropdownRef}
        title={
          <Div justifyContent="center" alignItems="center" mb={29}>
            <Div bg="#DCDFE5" w={80} h={8} rounded={8} />
            <Text
              textAlign="center"
              mt={15}
              color="#444D56"
              fontSize={MarkelovTheme.fontSize.XL}
              fontFamily={MarkelovTheme.fontFamily.SemiBold600}
              lineHeight={18}>
              Выберите проект
            </Text>
          </Div>
        }
        // mt="md"
        // pb="2xl"
        minH="65%"
        showSwipeIndicator={false}
        backdropOpacity={0.35}
        bg="#F1F2F5"
        roundedTop={24}>
        {this.props.projects.map((project) => (
          // FIXME: margins and paddings aren't responding and thus don't reflect the design
          <Dropdown.Option
            key={project.uuid}
            value={project.uuid}
            // mb={12}
            // ml={28}
            p={0}
            // h={30}
            bg="transparent"
            style={{padding: 0}}
            onPress={() => {
              setTimeout(
                () => this.props.onSelect(new Project({model: project})),
                500,
              );
            }}
            block>
            <ProjectBadge
              project={project}
              isOn
              onPress={() => {
                projectsDropdownRef.current?.close();
                setTimeout(
                  () => this.props.onSelect(new Project({model: project})),
                  500,
                );
              }}
            />
            {/* {project.name} */}
          </Dropdown.Option>
        ))}
      </Dropdown>
      // </Div>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects().extend(Q.where('terminated', false)),
}));

export default enhanceWithProjects(ProjectsDropdown);
