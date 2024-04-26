import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {RootStackParamList} from './navigation';
import HeaderButton from '../fab/customComponents/headerButton';
import {Avatar, Button, Div, Modal, Text} from 'react-native-magnus';
import ModalHeader from '../fab/customComponents/modalHeader';
import TextInput from '../fab/customComponents/TextInput';
import Project from '../../model/project';
import SegmentedControl from '@react-native-community/segmented-control';
import {FlatList, ScrollView} from 'react-native';
import ProjectModal from './projectModal';
import withObservables from '@nozbe/with-observables';
import {observeProjects} from '../../data/helpers';
import ProjectModel from '../../data/projectModel';

export const ProjectViewContext = React.createContext<{
  project?: Project;
  onChange: (project?: Project) => void;
}>({project: undefined, onChange: (_) => {}});

type Props = StackScreenProps<RootStackParamList, 'Projects'>;

interface EProps extends Props {
  projects: ProjectModel[];
}

interface IProps {}

interface IState {
  isModalVisible: boolean;
  project?: Project;
}

class Projects extends Component<EProps, IState> {
  constructor(props: EProps) {
    super(props);

    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton
            title="+"
            onPress={() =>
              this.setState({isModalVisible: true, project: undefined})
            }
          />
        );
      },
    });

    this.state = {
      isModalVisible: false,
      project: undefined,
    };
  }

  render() {
    return (
      <ProjectViewContext.Provider
        value={{
          project: this.state.project,
          onChange: (project) => this.setState({project: project}),
        }}>
        <Div>
          <FlatList
            data={this.props.projects}
            renderItem={(item) => {
              return (
                <Button
                  bg="transparent"
                  onPress={() => {
                    this.setState({
                      project: Project.demodel(item.item),
                      isModalVisible: true,
                    });
                  }}>
                  <Div row>
                    <Avatar
                      bg={item.item.color + 200}
                      color={item.item.color + 400}>
                      {item.item.name.charAt(0)}
                    </Avatar>
                    <Div>
                      <Text fontSize="xl">{item.item.name}</Text>
                      <Text>{item.item.type}</Text>
                    </Div>
                  </Div>
                </Button>
              );
            }}
            keyExtractor={(item) => item.uuid}
          />
          <ProjectModal
            onHide={() =>
              this.setState({isModalVisible: false, project: undefined})
            }
            project={this.state.project}
            isModalVisible={this.state.isModalVisible}
          />
        </Div>
      </ProjectViewContext.Provider>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects(),
}));

export default enhanceWithProjects(Projects);
