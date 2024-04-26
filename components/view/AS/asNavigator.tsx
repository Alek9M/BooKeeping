import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
//

import Prices from '../AS/prices';
import ArticleInModel from '../../../data/articleInModel';
import articleDetails from './articles/articleDetails';
import serviceDetails from './services/serviceDetails';
import ServiceModel from '../../../data/serviceModel';
import {HeaderContextValue} from '../../../App';

export type ASRootStackParamList = {
  Main: {};
  ArticleDetail: {article: ArticleInModel};
  ServiceDetail: {service: ServiceModel};
};

const asNavigator = createStackNavigator<ASRootStackParamList>();

interface IProps {}

interface IState {}

export default class ASNavigator extends Component<IProps, IState> {
  focusListener = undefined;

  constructor(props: IProps) {
    super(props);
  }

  mainScreen = () => (
    <asNavigator.Screen
      name="Main"
      component={Prices}
      options={{headerShown: false}}
    />
  );

  articleDetailScreen = () => (
    <asNavigator.Screen
      name="ArticleDetail"
      component={articleDetails}
      //   options={{headerShown: false}}
    />
  );

  serviceDetailScreen = () => (
    <asNavigator.Screen
      name="ServiceDetail"
      component={serviceDetails}
      //   options={{headerShown: false}}
    />
  );

  componentDidMount() {
    var currentRoute = this.props.route.key;
    const headerContext: HeaderContextValue = this.props.route.params
      .headerContext;
    this.focusListener = this.props.navigation.addListener('focus', (event) => {
      console.log('Focused');

      if (currentRoute === event.target) {
        // if (!headerContext.areProjectsVisible) {
        headerContext.setProjectsVisible(true);
        // }
      }
    });
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.focusListener);
  }

  render() {
    return (
      <>
        <Prices />
      </>
      // <>
      //   <NavigationContainer independent>
      //     <asNavigator.Navigator initialRouteName="Main" screenOptions={{}}>
      //       {this.mainScreen()}
      //       {this.articleDetailScreen()}
      //       {this.serviceDetailScreen()}
      //     </asNavigator.Navigator>
      //   </NavigationContainer>
      // </>
    );
  }
}
