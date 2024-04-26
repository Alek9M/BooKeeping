import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {
  ListRenderItemInfo,
  NativeSyntheticEvent,
  Switch,
  TextInputSubmitEditingEventData,
} from 'react-native';
import FingerprintScanner, {Biometrics} from 'react-native-fingerprint-scanner';
import {FlatList} from 'react-native-gesture-handler';
//
import {Avatar, Button, Div, Input, Modal, Text} from 'react-native-magnus';
import {database} from '../../../data/database';
//
import {observeProjects} from '../../../data/helpers';
import ProjectModel from '../../../data/projectModel';
import Project from '../../../model/project';
import BasicModal from '../../markeloView/basicViews/basicModal';
import BasicRectangleRow from '../../markeloView/elements/basicRectangleRow';
import BasicToggle from '../../markeloView/elements/basicToggle';
import {
  arrowDown,
  arrowUp,
  shareExcel,
} from '../../markeloView/icons/settings/svg';
import ModalHeader from '../../markeloView/modalHeader';
import Title from '../../markeloView/elements/title';
import RoundSelector from '../../markeloView/elements/roundSelector';
import ProjectRow from './projectRow';
import BasicRectangleView from '../../markeloView/elements/basicRectangleView';
import {bill, plusBig} from '../../markeloView/icons/svg';
import ProjectPanel from '../../markeloView/projectPanel';
import RectangleToggleRow from '../../markeloView/elements/rectangleToggleRow';

interface IProps {
  isVisible: boolean;
  projects: ProjectModel[];
  onSwipeComplete: () => void;
}

interface IState {
  biometryType?: Biometrics;
  isBiometric: boolean;
  isArchiveVisible: boolean;
}

class SettingsModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      biometryType: undefined,
      isBiometric: false,
      isArchiveVisible: false,
    };

    FingerprintScanner.isSensorAvailable().then((biometryType) => {
      this.setState({biometryType: biometryType});
      database.adapter
        .getLocal('authentication')
        .then((value) =>
          this.setState({isBiometric: value?.length ? true : false}),
        );
    });
  }

  render() {
    return (
      <BasicModal
        isVisible={this.props.isVisible}
        title="Настройки"
        left="Назад"
        onPressLeft={this.props.onSwipeComplete}
        onHide={this.props.onSwipeComplete}>
        <Div>
          {/* <ModalHeader
            title="Настройки"
            left="Назад"
            onPressLeft={this.props.onSwipeComplete}
          /> */}
          <Title text="Основные" />
          {this.state.biometryType && (
            <RectangleToggleRow
              text="Face ID"
              mb={12}
              isOn={this.state.isBiometric}
              onSwitch={(value) => {
                database.adapter.setLocal('authentication', value ? 'on' : '');
                this.setState({isBiometric: value});
              }}
            />
            // <Div row m="lg" justifyContent="space-between">
            //   <Text fontSize="lg">{this.state.biometryType.toString()}</Text>
            //   <Switch
            //     onValueChange={(value) => {
            //       database.adapter.setLocal(
            //         'authentication',
            //         value ? 'on' : '',
            //       );
            //       this.setState({isBiometric: value});
            //     }}
            //     value={this.state.isBiometric}
            //   />
            // </Div>
          )}
          <BasicRectangleRow text="Выгрузить в Excel" mb={12}>
            {shareExcel({})}
          </BasicRectangleRow>
          <RoundSelector values={['Русский', 'English']} selectedIndex={0} />
          <Title mt={24} text="Проекты">
            <Button
              p={0}
              bg="transparent"
              onPress={() => {
                const project = new Project({});
                project.save();
              }}>
              {plusBig({})}
            </Button>
          </Title>
          <BasicRectangleView py={17}>
            <Div row justifyContent="space-between">
              <Text fontSize={14} lineHeight={14} fontFamily="Inter-Bold">
                Движение средств
              </Text>
              {bill({})}
            </Div>
          </BasicRectangleView>
          <FlatList
            data={this.props.projects.filter((project) => !project.terminated)}
            keyExtractor={(project) => project.id}
            renderItem={(projectItem: ListRenderItemInfo<ProjectModel>) => {
              return <ProjectPanel project={projectItem.item} />;
            }}
          />
          {this.props.projects.filter((project) => project.terminated).length >
            0 && (
            <>
              <Title mt={24} mb={0} text="Архивные проекты">
                <Button
                  p={0}
                  bg="transparent"
                  onPress={() =>
                    this.setState((state, _) => {
                      return {isArchiveVisible: !state.isArchiveVisible};
                    })
                  }>
                  {this.state.isArchiveVisible ? arrowUp({}) : arrowDown({})}
                </Button>
              </Title>
              {this.state.isArchiveVisible && (
                <FlatList
                  data={this.props.projects.filter(
                    (project) => project.terminated,
                  )}
                  keyExtractor={(project) => project.id}
                  renderItem={(
                    projectItem: ListRenderItemInfo<ProjectModel>,
                  ) => {
                    return <ProjectPanel disabled project={projectItem.item} />;
                  }}
                />
              )}
            </>
          )}

          {/* <Button
            bg="gray300"
            w="100%"
            rounded="none"
            onPress={() => {
              const project = new Project({});
              project.save();
            }}>
            <Text flex={1} p="sm" fontSize="lg">
              + Add project
            </Text>
          </Button> */}
          <Div h={200} />
        </Div>
      </BasicModal>
    );
  }
}

const enhanceWithProjects = withObservables([], () => ({
  projects: observeProjects().observeWithColumns([
    'color',
    'name',
    'terminated',
  ]),
}));

export default enhanceWithProjects(SettingsModal);
