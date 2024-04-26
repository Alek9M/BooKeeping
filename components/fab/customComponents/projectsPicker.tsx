import React, {Component} from 'react';

// import SearchableDropdown from 'react-native-searchable-dropdown';
import {Picker} from '@react-native-picker/picker';
import BudgetTag from '../../../model/budgetTag';
import Project, {IProject, ProjectType} from '../../../model/project';
import {observeProjects} from '../../../data/helpers';
import withObservables from '@nozbe/with-observables';
import ProjectModel from '../../../data/projectModel';
import projects from '../../main/projects';

// import CustomDropdown from './customDropdown';

interface SearchableItem {
  id: number;
  name: string;
}

interface IProps {
  selected?: Project;
  tag?: BudgetTag;
  onSelect: (project: Project) => void;
  projects: ProjectModel[];
  isOptional: boolean;
  // onError?: () => void;
}

interface IState {
  selectedItem: Project | undefined;
}

class ProjectsPicker extends Component<IProps, IState> {
  // TODO: load projects

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedItem: props.selected ?? undefined, //Project.demodel(this.props.projects[0]),
    };

    // if (!Boolean(props.selected)) {
    //   props.onSelect(Project.demodel(props.projects[0]));
    // }

    // if (props.projects.length == 0 && props.onError) {
    //   props.onError();
    // }
  }

  public static defaultProps = {
    isOptional: true,
  };

  componentDidUpdate() {
    if (!this.props.isOptional && this.props.selected == undefined) {
      this.props.onSelect(Project.demodel(this.props.projects[0]));
    }
  }
  // for tags?
  // componentDidUpdate() {
  //   if (!this.props.isOptional && this.props.tag?.project == undefined) {
  //     this.props.onSelect(Project.demodel(this.props.projects[0]));
  //   }
  // }

  render() {
    return (
      // TODO: make it default picker
      <Picker
        selectedValue={
          this.state.selectedItem?.uuid ??
          (this.props.isOptional ? 0 : this.props.projects[0].uuid)
        }
        style={{height: 50}}
        onValueChange={(itemValue, itemIndex) => {
          const selected = this.props.projects.find(
            (project) => project.uuid == itemValue,
          );
          if (selected) {
            this.setState((state, props) => {
              const project = Project.demodel(selected);
              props.onSelect(project);
              return {
                selectedItem: project,
              };
            });
          } else {
            this.props.onSelect(undefined);
            this.setState({selectedItem: undefined});
          }
        }}>
        {this.props.isOptional && (
          <Picker.Item label={'-- Проект --'} value={'0'} />
        )}

        {this.props.projects.map((project) => (
          <Picker.Item label={project.name} value={project.uuid} />
        ))}
      </Picker>
      // <CustomDropdown
      //   onSelect={this.props.onSelect}
      //   items={this.items}
      //   placeholder="Проект"
      // />
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects(),
}));

export default enhanceWithProjects(ProjectsPicker);
