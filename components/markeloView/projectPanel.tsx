import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {MarkelovTheme} from '../../App';
import ProjectModel from '../../data/projectModel';
import Project from '../../model/project';
import BasicRectangleView from './elements/basicRectangleView';
import Checkbox from './elements/checkbox';
import TextInputRow from './elements/textInputRow';
import {archive, bin, unarchive} from './icons/settings/svg';

interface IProps {
  project: ProjectModel;
  disabled?: boolean;
}

interface IState {}

class ProjectPanel extends Component<IProps, IState> {
  static defaultProps = {
    disabled: false,
  };

  constructor(props: IProps) {
    super(props);
  }

  colors() {
    if (this.props.disabled) return;
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={Project.colorsCustom}
        renderItem={(info) => (
          <Div mr={16}>
            <Checkbox
              color={info.item}
              checked={info.item == this.props.project.color}
              onCheck={() => this.props.project.setColor(info.item)}
            />
          </Div>
        )}
      />
    );
  }

  async deleteProject() {
    const project = new Project({model: this.props.project});
    await project.load();
    await project.delete();
  }

  render() {
    return (
      <ThemeProvider theme={MarkelovTheme}>
        <BasicRectangleView mt={24}>
          <TextInputRow
            value={this.props.project.name}
            placeholder="Название"
            onChangeText={(text) => this.props.project.setName(text)}
            disabled={this.props.disabled}
          />
          {this.colors()}
          <Div row justifyContent="space-evenly" mt={18}>
            <Button
              bg="transparent"
              p={0}
              onPress={() => {
                this.deleteProject();
              }}>
              {bin({})}
              <Text ml={6}>Удалить</Text>
            </Button>
            <Button
              bg="transparent"
              p={0}
              onPress={() => this.props.project.terminate()}>
              {this.props.disabled ? unarchive({}) : archive({})}
              <Text ml={6}>
                {this.props.disabled ? 'Разархивировать' : 'Архивировать'}
              </Text>
            </Button>
          </Div>
        </BasicRectangleView>
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

export default enhanceWithProject(ProjectPanel);
