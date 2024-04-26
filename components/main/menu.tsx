import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Button, Div, Icon, Modal, Text} from 'react-native-magnus';
import {RootStackParamList} from './navigation';
import Settings from './settings';

type Props = StackScreenProps<RootStackParamList, 'Menu'>;

interface IProps {}

interface IState {
  isSettingsOpen: boolean;
}

export default class Menu extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isSettingsOpen: false,
    };
  }

  menuButton(title: string, onPress: () => void): Element {
    return (
      <Button
        w="100%"
        bg="transparent"
        justifyContent="flex-start"
        onPress={onPress}>
        <Text
          fontSize="4xl"
          flex={1}
          textShadowColor="gray500"
          textShadowRadius={15}>
          {title}
        </Text>
      </Button>
    );
  }

  render() {
    return (
      <Div p="lg" mt="3xl" justifyContent="space-between" flex={1}>
        <Div>
          {this.menuButton('Сегодня', () => {
            this.props.navigation.navigate({name: 'Today', params: {}});
          })}
          {this.menuButton('Планы', () => {
            this.props.navigation.navigate({name: 'Plans', params: {}});
          })}
          {this.menuButton('Контакты', () => {
            this.props.navigation.navigate({name: 'Contacts', params: {}});
          })}
          {this.menuButton('Деньги', () => {
            this.props.navigation.navigate({
              name: 'MoneyNavigation',
              params: {},
            });
          })}
          {this.menuButton('Товары/Работы', () => {
            this.props.navigation.navigate({name: 'Prices', params: {}});
          })}
          {this.menuButton('Сделано', () => {
            this.props.navigation.navigate({name: 'Done', params: {}});
          })}
          {this.menuButton('Проекты', () => {
            this.props.navigation.navigate({name: 'Projects', params: {}});
          })}
        </Div>
        <Button
          mb="3xl"
          bg="transparent"
          onPress={() => this.setState({isSettingsOpen: true})}>
          <Div row>
            <Icon name="settings" fontFamily="Ionicons" fontSize="xl" pr="sm" />
            <Text fontSize="2xl">Настройки</Text>
          </Div>
        </Button>
        <Modal
          isVisible={this.state.isSettingsOpen}
          h="95%"
          useNativeDriver
          propagateSwipe
          swipeDirection="down"
          onSwipeComplete={() => {
            this.setState({isSettingsOpen: false});
          }}>
          <Settings />
        </Modal>
      </Div>
    );
  }
}
