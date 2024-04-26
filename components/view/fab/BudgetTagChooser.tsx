import React, {Component} from 'react';
import {Dimensions, ListRenderItemInfo, TextInput} from 'react-native';
//
import {FlatList} from 'react-native-gesture-handler';
import withObservables from '@nozbe/with-observables';
import {Button, Div, Icon, Input, Text} from 'react-native-magnus';
import {Q} from '@nozbe/watermelondb';
//
import {observeBudgetTagsOn} from '../../../data/helpers';
import BudgetTagModel from '../../../data/budgetTagModel';
import {PaymentType} from '../../../model/payment';
import RoundButton from './roundButton';
import BudgetModal from '../money/budget/budgetModal';
import BudgetTag from '../../../model/budgetTag';
import ProjectModel from '../../../data/projectModel';
import Project from '../../../model/project';
import {magnifyingGlass, plusThin} from '../../markeloView/icons/fab/svg';
import {MarkelovTheme} from '../../../App';

interface IProps {
  budgetTags: BudgetTagModel[];
  month: number;
  year: number;
  type: PaymentType;
  project: ProjectModel;
  onChoose: (tag?: BudgetTagModel) => void;
  chosen?: BudgetTagModel;
}

interface IState {
  searchWord: string;
  isSearching: boolean;
  newBudget?: BudgetTag;
}

class BudgetTagChooser extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      searchWord: '',
      isSearching: false,
    };
  }

  render() {
    return (
      <Div row alignItems="center">
        <RoundButton
          onPress={() =>
            this.setState({
              newBudget: new BudgetTag(
                {
                  budget: {
                    title: '',
                    month: this.props.month,
                    year: this.props.year,
                    type: this.props.type,
                  },
                },
                new Project({model: this.props.project}),
              ),
            })
          }>
          {plusThin({})}
        </RoundButton>
        <RoundButton
          onPress={() =>
            this.setState((state, props) => {
              return {isSearching: !state.isSearching, searchWord: ''};
            })
          }>
          {magnifyingGlass({})}
          {this.state.isSearching && (
            <TextInput
              value={this.state.searchWord}
              onChangeText={(text) => this.setState({searchWord: text})}
              style={{
                width: 100,
                paddingHorizontal: 10,
                fontSize: MarkelovTheme.fontSize.M,
                fontFamily: MarkelovTheme.fontFamily.Regular400,
                color: '#444D56',
              }}
              autoFocus
            />
            // <Input
            //   style={{paddingVertical: 0}}
            //   flex={1}
            //   p={0}
            //   m={0}
            //   onChangeText={(text) => this.setState({searchWord: text})}
            // />
          )}
        </RoundButton>
        <FlatList
          horizontal
          data={this.props.budgetTags.filter((tag) =>
            tag.title.includes(this.state.searchWord),
          )}
          keyExtractor={(tag) => tag.uuid}
          renderItem={(item: ListRenderItemInfo<BudgetTagModel>) => (
            <Div
              p={3}
              style={{
                shadowColor: '#000000',
                shadowOffset: {width: 0, height: 0},
                shadowRadius: 2,
                shadowOpacity: 0.31,
              }}>
              <Button
                rounded={36}
                bg={
                  item.item.uuid == this.props.chosen?.uuid
                    ? MarkelovTheme.colors.WhiteBackground
                    : 'rgba(0, 0, 0, 0.01)' // *ORIGIN*'#F1F2F5'
                }
                mr={12}
                px={15}
                py={11}
                onPress={() => {
                  this.setState({searchWord: '', isSearching: false});
                  this.props.onChoose(
                    item.item.uuid == this.props.chosen?.uuid
                      ? undefined
                      : item.item,
                  );
                }}>
                <Text
                  fontSize={MarkelovTheme.fontSize.M}
                  lineHeight={14}
                  color="#444D56"
                  fontFamily={MarkelovTheme.fontFamily.Regular400}>
                  {item.item.title}
                </Text>
              </Button>
            </Div>
          )}
        />
        <BudgetModal
          budgetTag={this.state.newBudget}
          onChange={(budget) => {
            if (!budget?._model) {
              this.setState({newBudget: budget});
            } else {
              this.props.onChoose(budget?._model);
              this.setState({newBudget: undefined});
            }
          }}
        />
      </Div>
    );
  }
}

const enhanceWithTags = withObservables(
  ['month', 'year', 'type', 'project'],
  ({month, year, type, project}) => ({
    budgetTags: observeBudgetTagsOn(type, year, month).extend(
      Q.where('project_id', project.id),
    ),
  }),
);

export default enhanceWithTags(BudgetTagChooser);
