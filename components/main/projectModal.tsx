import SegmentedControl from '@react-native-community/segmented-control';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {Avatar, Button, Div, Modal} from 'react-native-magnus';
import Project from '../../model/project';
import ModalHeader from '../fab/customComponents/modalHeader';
import TextInput from '../fab/customComponents/TextInput';
import {ProjectViewContext} from './projects';

interface IProps {
  isModalVisible: boolean;
  onHide: () => void;
  project?: Project;
}

interface IState {
  project: Project;
}

const vividness: number = 400;

export default class ProjectModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    let project = new Project({});
    project.color = Project.colors[0];
    this.state = {
      project: props.project ?? project,
    };
  }

  //   UNSAFE_componentWillReceiveProps(props: IProps) {
  //     if (props.project) {
  //       this.setState({project: props.project});
  //     } else {
  //       let project = new Project();
  //       project.color = Project.colors[0];
  //       this.state = {
  //         project: props.project ?? project,
  //       };
  //     }
  //   }

  render() {
    return (
      <ProjectViewContext.Consumer>
        {(value) => {
          //   let project: Project;
          //   let set: (project: Project) => void;
          //   if (value.project) {
          //     project = value.project;
          //     set = value.onChange;
          //   } else {
          //     project = new Project();
          //     project.color = Project.colors[0];
          //     set = (project) => this.setState({project: project});
          //   }
          return (
            <Modal
              isVisible={this.props.isModalVisible}
              h="95%"
              useNativeDriver
              propagateSwipe
              swipeDirection="down"
              onSwipeComplete={this.props.onHide}>
              <ModalHeader
                text="Новый проект"
                onCancel={this.props.onHide}
                onSave={() => {
                  if (value.project?.isValid() ?? false) {
                    value.project!.save().then(() => this.props.onHide());
                  } else if (this.state.project.isValid()) {
                    this.state.project.save().then(() => this.props.onHide());
                  }
                }}
              />
              <Avatar
                bg={
                  (value.project?.color ?? this.state.project.color) + vividness
                }
                color={
                  (value.project?.color ?? this.state.project.color) +
                  (vividness + 200)
                }
                alignSelf="center"
                mt="lg"
                size={90}
                fontSize={45}>
                {value.project?.name.charAt(0) ??
                  this.state.project.name.charAt(0)}
              </Avatar>
              <Div m="md">
                <TextInput
                  placeholder="Название"
                  textValue={value.project?.name ?? this.state.project.name}
                  onChange={(text) => {
                    if (value.project) {
                      let project = value.project;
                      project.name = text;
                      value.onChange(project);
                    } else {
                      this.setState((state, props) => {
                        let project = state.project;
                        project.name = text;
                        return {project: project};
                      });
                    }
                  }}
                />
                <SegmentedControl
                  values={['Суммовой', 'Количественно-суммовой']}
                  selectedIndex={value.project?.type ?? this.state.project.type}
                  onChange={(event) => {
                    let index = event.nativeEvent.selectedSegmentIndex;
                    if (value.project) {
                      let project = value.project;
                      project.type = index;
                      value.onChange(project);
                    } else {
                      this.setState((state, props) => {
                        let project = state.project;
                        project.type = index;
                        return {project: project};
                      });
                    }
                  }}
                />
                <FlatList
                  data={Project.colors}
                  renderItem={(item) => {
                    return (
                      <Button
                        bg="transparent"
                        onPress={() => {
                          if (value.project) {
                            let project = value.project;
                            project.color = item.item;
                            value.onChange(project);
                          } else {
                            this.setState((state, props) => {
                              let project = state.project;
                              project.color = item.item;
                              return {project: project};
                            });
                          }
                        }}>
                        <Avatar
                          borderColor={item.item + (vividness + 200)}
                          borderWidth={
                            (value.project?.color ??
                              this.state.project.color) == item.item
                              ? 3
                              : 0
                          }
                          bg={item.item + vividness}
                          size={32}
                        />
                      </Button>
                    );
                  }}
                  keyExtractor={(item) => item}
                  horizontal
                  scrollEnabled
                  showsHorizontalScrollIndicator={false}
                />
              </Div>
            </Modal>
          );
        }}
      </ProjectViewContext.Consumer>
    );
  }
}
