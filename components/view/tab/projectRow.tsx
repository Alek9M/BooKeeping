import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {
  ListRenderItemInfo,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Avatar, Button, Div, Icon, Input, Text} from 'react-native-magnus';
import ProjectModel from '../../../data/projectModel';
import Project from '../../../model/project';
import pSBC from '../../pSBC';
import ProjectIcon from './tabWide/projectIcon';

interface IProps {
  project: ProjectModel;
}

interface IState {
  isEditing: boolean;
  name: string;
}

const vividness: number = 400;

export default class ProjectRow extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isEditing: props.project.name.length == 0,
      name: '',
    };
  }

  render() {
    return (
      <Div borderTopWidth={1} borderColor="gray" my="sm">
        <Div px="sm" row alignItems="center">
          <Button bg="transparent" onPress={() => this.props.project.delete()}>
            <Icon color="red" name="ios-trash-bin" fontFamily="Ionicons" />
          </Button>
          <Button
            bg="transparent"
            onPress={() => {
              this.props.project.terminate();
              this.setState({isEditing: false});
            }}>
            <Icon color="red" name="ios-lock-closed" fontFamily="Ionicons" />
          </Button>

          {this.props.project.name.length > 0 &&
            !this.state.isEditing &&
            !this.props.project.terminated && (
              <Text
                fontSize="lg"
                // color={this.props.project.terminated ? 'grey' : 'black'}
                onPress={() => {
                  if (this.props.project.terminated) return;
                  this.setState({
                    isEditing: true,
                    name: this.props.project.name,
                  });
                }}>
                {this.props.project.name}
              </Text>
            )}

          {this.props.project.terminated && (
            <Div
              row
              justifyContent="space-between"
              alignItems="center"
              flex={1}>
              <ProjectIcon isOn project={this.props.project} />
              <Text fontSize="lg" color="grey">
                Завершён
              </Text>
            </Div>
          )}

          {(this.props.project.name.length == 0 || this.state.isEditing) && (
            <Input
              autoFocus={true}
              placeholder="Назовите проект"
              value={this.state.name}
              onChangeText={(text) => this.setState({name: text})}
              onSubmitEditing={(
                e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
              ) => {
                const name = e.nativeEvent.text;
                this.props.project.setName(name);
                this.setState({isEditing: false});
              }}
            />
          )}
        </Div>
        {!this.props.project.terminated && (
          <FlatList
            data={Project.colorsCustom}
            contentContainerStyle={{alignItems: 'center'}}
            renderItem={(colorItem: ListRenderItemInfo<string>) => {
              return (
                <Button
                  bg="transparent"
                  onPress={() => {
                    this.props.project.setColor(colorItem.item);
                  }}>
                  <Div>
                    <Avatar
                      borderColor={pSBC(-0.3, colorItem.item, '#000000', true)}
                      borderWidth={
                        this.props.project.color == colorItem.item ? 3 : 0
                      }
                      bg={colorItem.item}
                      size={
                        this.props.project.color == colorItem.item ? 35 : 32
                      }
                      mb={5}
                    />
                  </Div>
                </Button>
              );
            }}
            keyExtractor={(item) => item}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
          />
        )}
      </Div>
    );
  }
}

// const enhanceWithProject = withObservables(['project'], (project) => ({
//   project: project,
// }));

// export default enhanceWithProject(ProjectRow);
