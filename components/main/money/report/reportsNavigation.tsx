import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Button, Div, Text} from 'react-native-magnus';
import {RootStackParamList} from '../../navigation';

type Props = StackScreenProps<RootStackParamList, 'ReportsNavigation'>;

interface IProps {}

interface IState {}

export default class ReportsNavigation extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Div>
        <Button bg="transparent">
          <Text fontSize="xl">Отчет по Доходам/Расходам</Text>
        </Button>
        <Button bg="transparent">
          <Text fontSize="xl">Отчет о доходности проекта</Text>
        </Button>
      </Div>
    );
  }
}
