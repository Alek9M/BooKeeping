import React, {Component} from 'react';
import {ListRenderItemInfo} from 'react-native';
//
import SegmentedControl from '@react-native-community/segmented-control';
import {StackScreenProps} from '@react-navigation/stack';
import {Button, Modal, Text} from 'react-native-magnus';
import withObservables from '@nozbe/with-observables';
import {FlatList} from 'react-native-gesture-handler';
//
import HeaderButton from '../../fab/customComponents/headerButton';

// import {Service, ServicePrice} from '../../model/service';
// import Article from '../../model/article';
// import ArticleModel from '../../data/articleModel';
// import ServiceModel from '../../data/serviceModel';
// import {FabModalRootStackParamList} from '../view/fab/entryModalNavigator';
import SegmentComponentController from '../../controller/segmentComponentController';
import AddServiceModal from './services/addServiceModal';
import Articles from './articles/articles';
import Services from './services/services';
import ArticleModel from '../../../data/articleModel';
import ServiceModel from '../../../data/serviceModel';
import {Service} from '../../../model/service';
import {FabModalRootStackParamList} from '../fab/entryModalNavigator';
import {SafeAreaView} from 'react-native-safe-area-context';
import Article from '../../../model/article';
import MainTabScreen from '../tab/mainTabScreen';
import BasicTab from '../../markeloView/basicViews/basicTab';
import BasicModalView from '../../markeloView/basicViews/basicModalView';

type Props = StackScreenProps<FabModalRootStackParamList, 'Prices'>;

interface EProps extends Props {
  articles: ArticleModel[];
  services: ServiceModel[];
}

interface IState {
  newModal: boolean;
  // segment: SegmentComponentController;
  service?: Service;
}

export default class Prices extends Component<EProps, IState> {
  constructor(props: EProps) {
    super(props);

    this.state = {
      // segment: new SegmentComponentController([
      //   {
      //     title: 'Товары',
      //     component: (
      //       <Articles
      //         navigation={props.navigation}
      //         onPress={props.route?.params?.onPress}
      //       />
      //     ),
      //   },
      //   {
      //     title: 'Услуги',
      //     component: <Services navigation={props.navigation} />,
      //   },
      // ]),
      newModal: false,
    };

    props?.navigation?.setOptions?.({
      headerShown: false,
      // headerRight: () => {
      //   if (!props.route.params.onAdd) return;
      //   return <HeaderButton title="+" onPress={props.route.params.onAdd!} />;
      // },
    });
  }

  modal(screens) {
    if (!this.props?.route?.params?.hideSelect) return this.base(screens);
    return (
      <BasicModalView
        px={0}
        py={0}
        title="Выбор позиции"
        left="Назад"
        onPressLeft={this.props.navigation.popToTop}
        right="Добавить"
        onPressRight={this.props?.route?.params?.onAdd}>
        {this.base(screens)}
      </BasicModalView>
    );
  }

  base(screens) {
    return (
      <BasicTab
        screens={screens}
        hideSelect={this.props?.route?.params?.hideSelect}
      />
    );
  }

  render() {
    const screens = [];

    if (this.props.route?.params?.isArticlesVisible ?? true)
      screens.push({
        title: 'Товары',
        screen: Articles,
        props: {
          navigation: this.props.navigation,
          onPress: this.props.route?.params?.onPress,
        },
      });

    if (this.props.route?.params?.isServicesVisible ?? true)
      screens.push({
        title: 'Услуги',
        screen: Services,
        props: {
          navigation: this.props.navigation,
          onPress: this.props.route?.params?.onPress,
        },
      });

    return (
      <>
        {this.modal(screens)}

        {/* <MainTabScreen
          isSettingsButtonVisible={
            this.props.route?.params?.isSettingsVisible ?? true
          }
          selectedProjects={this.props.route?.params?.selectedProjects}
          screens={screens}
        /> */}
        {/* <SafeAreaView>
          <SegmentedControl
            values={this.state.segment.titles}
            selectedIndex={this.state.segment.index}
            onChange={(event) => {
              const i = event.nativeEvent.selectedSegmentIndex;
              this.setState((state, _) => {
                state.segment.index = i;
                return {segment: state.segment};
              });
            }}
          />
          {this.state.segment.view}
        </SafeAreaView> */}
        {/* <AddServiceModal
          isVisible={this.state.newModal}
          service={this.state.service}
        /> */}
      </>
    );
  }
}
