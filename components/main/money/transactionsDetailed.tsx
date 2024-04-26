import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FlatList} from 'react-native';
import {Div, Text} from 'react-native-magnus';
import Task from '../customElements/task';
import {RootStackParamList} from '../navigation';

type Props = StackScreenProps<RootStackParamList, 'MoneyDetailed'>;

interface IProps {}

interface IState {}

interface Dets {
  name: string;
  in?: number;
  out?: number;
}

export default class TransactionsDetailed extends Component<Props, IState> {
  constructor(props: Props) {
    super(props);
  }

  data: Dets[] = [
    {name: 'Баня', in: 1500},
    {name: 'Такси', out: 200},
    {name: 'Масло', in: 150},
    {name: 'Веники', out: 400},
  ];

  render() {
    return (
      <Div>
        <Text style={{fontWeight: '800'}} fontSize="xl">
          {this.props.route.params.money.date}
        </Text>
        <Text>Остаток на начало дня: {0}₽</Text>
        <FlatList
          data={this.data}
          renderItem={(item) => (
            <Div row justifyContent="space-between" m="md">
              <Task title={item.item.name} onDelete={() => {}} />
              <Text color={item.item.in ? 'green' : 'red'}>
                {item.item.in ?? item.item.out}{' '}
              </Text>
            </Div>
          )}
        />
        <Div justifyContent="flex-end" row>
          <Text color="red">600</Text>
          <Text color="green">1650</Text>
        </Div>
        <Text>
          Остаток на конец дня: {this.props.route.params.money.remainer}₽
        </Text>
      </Div>
    );
  }
}
