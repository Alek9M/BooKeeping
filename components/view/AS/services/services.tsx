import React, {Component} from 'react';
//
import withObservables from '@nozbe/with-observables';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Text} from 'react-native-magnus';
import {StackNavigationProp} from '@react-navigation/stack';
//
import {Service} from '../../../../model/service';
import RowActionButton from '../../tab/tabWide/rowActionButton';
import AddServiceModal from './addServiceModal';
import ServiceModel from '../../../../data/serviceModel';
import ASRowButton from '../asRowButton';
import ServiceRow from './serviceRow';
import {ASRootStackParamList} from '../asNavigator';
import Entry from '../../../../model/entry';
import BasicRectangleView from '../../../markeloView/elements/basicRectangleView';
import {plus} from '../../../markeloView/icons/fab/svg';
import ServiceDetails from './serviceDetails';

interface IProps {
  services: ServiceModel[];
  navigation: StackNavigationProp<ASRootStackParamList, 'Main'>;
  onPress?: (service: Service) => void;
  searchWord: string;
}

interface IState {
  isModalVisible: boolean;
  service?: ServiceModel;
}

class Services extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  render() {
    return (
      <>
        <BasicRectangleView
          h={44}
          mb={24}
          onPress={() => this.setState({isModalVisible: true})}>
          <Div row justifyContent="space-between">
            <Text>Добавить услугу</Text>
            {plus({})}
          </Div>
        </BasicRectangleView>
        {/* <RowActionButton
          text="+ Add service"
          onPress={() => this.setState({isModalVisible: true})}
        /> */}
        <FlatList
          style={{height: '100%'}}
          data={this.props.services.filter((article) =>
            article.title.includes(this.props.searchWord),
          )}
          keyExtractor={(item) => item.uuid}
          renderItem={(item) => (
            <ServiceRow
              service={item.item}
              onPress={() => {
                console.log('pressed');
                this.props.onPress?.(new Service({model: item.item}));
                if (this.props.onPress) return;
                this.setState({service: item.item});
                // this.props.navigation.navigate('ServiceDetail', {
                //   service: item.item,
                // });
              }}
            />
          )}
        />
        {/* // TODO: onChange option */}
        <ServiceDetails
          service={this.state.service}
          onHide={() => {
            this.setState({service: undefined});
          }}
        />
        <AddServiceModal
          onDone={() => this.setState({isModalVisible: false})}
          isVisible={this.state.isModalVisible}
        />
      </>
    );
  }
}

const enhanceWithServices = withObservables(
  ['selectedProjects'],
  ({selectedProjects}) => ({
    services: Service.observe().extend(
      Entry.filterByProjectDescription(selectedProjects),
    ),
  }),
);

export default enhanceWithServices(Services);
