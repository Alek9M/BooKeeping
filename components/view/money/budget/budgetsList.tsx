import React, {Component} from 'react';
//
import withObservables from '@nozbe/with-observables';
import {Button, Div, Text} from 'react-native-magnus';
//
import {observeBudgetTagsOn} from '../../../../data/helpers';
import BudgetTagModel from '../../../../data/budgetTagModel';
import ProjectIcon from '../../tab/tabWide/projectIcon';
import BudgetRow from './budgetRow';
import {FlatList} from 'react-native-gesture-handler';
import {ListRenderItem, SectionList} from 'react-native';
import {Q} from '@nozbe/watermelondb';
import RowActionButton from '../../tab/tabWide/rowActionButton';
import RoundButton from '../../fab/roundButton';
import {MarkelovTheme} from '../../../../App';
import BasicRectangleRow from '../../../markeloView/elements/basicRectangleRow';
import {plus} from '../../../markeloView/icons/svg';
import {arrowUp} from '../../../markeloView/icons/fab/svg';
import Collapsible from 'react-native-collapsible';
import ProjectModel from '../../../../data/projectModel';
import ProjectBudgetTags from '../../../markeloView/money/budgets/projectBudgetTags';

interface IProps {
  month: number;
  year: number;
  type: number;
  title: string;
  selectedProjects: ProjectModel[];
  budgetTags: BudgetTagModel[];
  onPressAdd: () => void;
  onPressRow: (budget: BudgetTagModel) => void;
}

interface IState {
  isCollapsed: boolean;
}

class BudgetsList extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isCollapsed: false,
    };
  }

  render() {
    return (
      <Div>
        <Div my={9}>
          <Div row justifyContent="space-between" alignItems="center" mb={24}>
            <Text fontFamily={MarkelovTheme.fontFamily.Bold700} fontSize="XXL">
              {this.props.title}
            </Text>
            <Button
              row
              alignItems="center"
              onPress={() =>
                this.setState((state, props) => {
                  return {isCollapsed: !state.isCollapsed};
                })
              }>
              <Text fontFamily={MarkelovTheme.fontFamily.SemiBold600} mr={6}>
                {this.props.budgetTags.reduce(
                  (acc, cur) => (acc += cur.amount),
                  0,
                )}
                ₽
              </Text>
              {this.state.isCollapsed ? (
                <Div style={{transform: [{rotateX: '180deg'}]}}>
                  {arrowUp({})}
                </Div>
              ) : (
                arrowUp({})
              )}
            </Button>
          </Div>
          <Collapsible collapsed={this.state.isCollapsed}>
            <BasicRectangleRow
              onPress={this.props.onPressAdd}
              text={`Добавить статью ${this.props.title.toLowerCase()}`}>
              {plus({})}
            </BasicRectangleRow>

            <Div borderColor="#EFEFF0" borderWidth={1} rounded={6}>
              <FlatList
                data={this.props.selectedProjects}
                keyExtractor={(project: ProjectModel) => project.uuid}
                renderItem={(item) => (
                  <ProjectBudgetTags
                    type={this.props.type}
                    month={this.props.month}
                    year={this.props.year}
                    project={item.item}
                    onPressRow={(budget: BudgetTagModel) =>
                      this.props.onPressRow(budget)
                    }
                  />
                )}
              />
              {/* <FlatList
                data={this.props.budgetTags.filter((tag) =>
                  tag.title.includes(this.props.searchWord),
                )}
                keyExtractor={(item: BudgetTagModel) => item.uuid}
                renderItem={(item) => (
                  <BudgetRow
                    onPress={(budget: BudgetTagModel) =>
                      this.props.onPressRow(budget)
                    }
                    budgetTag={item.item}
                  />
                )}
              /> */}
            </Div>
          </Collapsible>
        </Div>
      </Div>
    );
  }
}

const enhanceWithEntries = withObservables(
  ['month', 'year', 'type', 'selectedProjects'],
  ({month, year, type, selectedProjects}) => ({
    budgetTags: observeBudgetTagsOn(type, year, month).extend(
      Q.where(
        'project_id',
        Q.oneOf(selectedProjects.map((project) => project.id)),
      ),
    ),
  }),
);

export default enhanceWithEntries(BudgetsList);
