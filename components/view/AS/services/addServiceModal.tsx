import React, {Component} from 'react';
import {TextInput} from 'react-native';
//
import {Div, Modal, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import ProjectModel from '../../../../data/projectModel';
//
import Project from '../../../../model/project';
import {Service} from '../../../../model/service';
import ModalHeader from '../../../fab/customComponents/modalHeader';
// import TextInput from '../../../fab/customComponents/TextInput';
import BasicModal from '../../../markeloView/basicViews/basicModal';
import BasicModalView from '../../../markeloView/basicViews/basicModalView';
import BasicSeparator from '../../../markeloView/basicViews/basicSeparator';
import BasicRectangleRow from '../../../markeloView/elements/basicRectangleRow';
import NumberTextInput from '../../../markeloView/elements/numberTextInput';
import TextInputRow from '../../../markeloView/elements/textInputRow';
import {bin} from '../../../markeloView/icons/svg';
import ProjectsRow from '../../../markeloView/projectsRow';
import ProjectChooser from '../../tab/tabWide/projectChooser';

interface IProps {
  isVisible: boolean;
  onDone: () => void;
}

interface IState {
  service?: Service;
}

export default class AddServiceModal extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      service: new Service({}),
    };
  }

  componentDidMount() {
    this.setState({service: new Service({})});
  }

  render() {
    return (
      <BasicModal
        title="Услуга"
        left="Отменить"
        onPressLeft={this.props.onDone}
        right="Сохранить"
        onPressRight={() => this.state.service?.save().then(this.props.onDone)}
        isVisible={this.props.isVisible}>
        <BasicSeparator vertical={12}>
          <TextInputRow
            mb={0}
            value={this.state.service?.title}
            placeholder="Название"
            onChangeText={(text) =>
              this.setState((state, props) => {
                const service = state.service;
                if (service) {
                  service.title = text;
                }
                return {service: service};
              })
            }
          />
          <ProjectsRow
            hasSelectAll={false}
            selected={
              this.state.service?.project?._model
                ? [this.state.service?.project?._model]
                : []
            }
            onPress={(projects: ProjectModel[]) => {
              if (projects.length != 1) return;
              const project = projects[0];
              this.setState((state, _props) => {
                if (!state.service) return {};
                const service = state.service;
                if (service.project?.uuid == project.uuid)
                  service.project = undefined;
                else service.project = new Project({model: project});
                return {service: service};
              });
            }}
          />
          <BasicRectangleRow text="Цена">
            <Div row pl={12}>
              <NumberTextInput
                placeholder="0"
                value={this.state.service?.lastPrice ?? 0}
                onChange={(value: number) => {
                  this.setState((state, props) => {
                    const service = state.service;
                    if (service) {
                      service.lastPrice = value;
                    }
                    return {service: service};
                  });
                }}
                postfix="₽"
              />
              {/* <TextInput
                style={{
                  fontFamily: MarkelovTheme.fontFamily.SemiBold600,
                  fontSize: MarkelovTheme.fontSize.M,
                  lineHeight: 15,
                  color: '#444D56',
                  minWidth: 20,
                  textAlign: 'right',
                }}
                placeholder=""
                value={(this.state.service?.lastPrice ?? 0).toString()}
                onChangeText={(text) => {
                  this.setState((state, props) => {
                    const service = state.service;
                    if (service) {
                      service.lastPrice = Number(text);
                    }
                    return {service: service};
                  });
                }}
              />
              <Text
                style={{
                  fontFamily: MarkelovTheme.fontFamily.SemiBold600,
                  fontSize: MarkelovTheme.fontSize.M,
                  lineHeight: 15,
                  color: '#444D56',
                }}>
                ₽
              </Text> */}
            </Div>
          </BasicRectangleRow>
          {/* // TODO: delete onPress but not here */}
          {/* <BasicRectangleRow text="" onPress={undefined}>
            <Div row alignItems="center" flex={1}>
              {bin({})}
              <Text
                ml={9}
                color="#ED4949"
                fontSize={14}
                // lineHeight={14}
                fontFamily="Inter-SemiBold">
                Удалить услугу
              </Text>
            </Div>
          </BasicRectangleRow> */}
        </BasicSeparator>
      </BasicModal>
      // <Modal
      //   isVisible={this.props.isVisible}
      //   h="95%"
      //   useNativeDriver
      //   propagateSwipe
      //   swipeDirection="down"
      //   onSwipeComplete={() => {
      //     this.setState({service: undefined});
      //   }}>
      //   <ModalHeader
      //     text="Услуга"
      //     onCancel={this.props.onDone}
      //     onSave={() => this.state.service?.save().then(this.props.onDone)}
      //   />
      // <TextInput
      //   placeholder="Название"
      //   textValue={this.state.service?.title}
      //   onChange={(text) =>
      //     this.setState((state, props) => {
      //       const service = state.service;
      //       if (service) {
      //         service.title = text;
      //       }
      //       return {service: service};
      //     })
      //   }
      // />
      //   <TextInput
      //     placeholder="Цена"
      //     type="money"
      //     textValue={(this.state.service?.lastPrice ?? 0).toString()}
      //     onChange={(text) => {
      //       this.setState((state, props) => {
      //         const service = state.service;
      //         if (service) {
      //           service.lastPrice = Number(text);
      //         }
      //         return {service: service};
      //       });
      //     }}
      //   />
      //   <ProjectChooser
      //     chosen={
      //       this.state.service?.project?._model
      //         ? [this.state.service?.project?._model]
      //         : []
      //     }
      //     onPress={(project: ProjectModel) =>
      //       this.setState((state, _props) => {
      //         if (!state.service) return {};
      //         const service = state.service;
      //         if (service.project?.uuid == project.uuid)
      //           service.project = undefined;
      //         else service.project = new Project({model: project});
      //         return {service: service};
      //       })
      //     }
      //   />
      // </Modal>
    );
  }
}
