import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import Collapsible from 'react-native-collapsible';
import {FlatList} from 'react-native-gesture-handler';
import {Button, Div, Text} from 'react-native-magnus';
import {MarkelovTheme} from '../../../../App';
import BudgetTagModel from '../../../../data/budgetTagModel';
import {observeBudgetTagsOn} from '../../../../data/helpers';
import ProjectModel from '../../../../data/projectModel';
import BasicRectangleView from '../../elements/basicRectangleView';
import ProjectBadge from '../../elements/projectBadge';
import {arrowUp} from '../../icons/fab/svg';
import BudgetTagRow from './budgetTagRow';

interface IProps {
  month: number;
  year: number;
  type: number;
  project: ProjectModel;
  budgetTags: BudgetTagModel[];
  onPressRow: (budget: BudgetTagModel) => void;
}

interface IState {
  isCollapsed: boolean;
}

class ProjectBudgetTags extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      isCollapsed: false,
    };
  }

  render() {
    if (this.props.budgetTags.length == 0) return <></>;
    return (
      <BasicRectangleView mt={24} py={10}>
        <Div row justifyContent="space-between" alignItems="center">
          <ProjectBadge isOn project={this.props.project} />
          <Button
            row
            alignSelf="center"
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
          <FlatList
            data={this.props.budgetTags}
            keyExtractor={(tag) => tag.uuid}
            renderItem={(item) => (
              <BudgetTagRow
                onPressRow={this.props.onPressRow}
                type={this.props.type}
                tag={item.item}
              />
            )}
          />
        </Collapsible>
      </BasicRectangleView>
    );
  }
}

const enhanceWithEntries = withObservables(
  ['month', 'year', 'type', 'project'],
  ({month, year, type, project}) => ({
    budgetTags: observeBudgetTagsOn(type, year, month).extend(
      Q.where('project_id', project.id),
    ),
  }),
);

export default enhanceWithEntries(ProjectBudgetTags);
