import {Q} from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Button, Div, Text, ThemeProvider} from 'react-native-magnus';
import {EntryContext, MarkelovTheme} from '../../../../../App';
import ArticleInModel from '../../../../../data/articleInModel';
import ArticleModel from '../../../../../data/articleModel';
import ArticleOutModel from '../../../../../data/articleOutModel';
import ProjectModel from '../../../../../data/projectModel';
import PurchaseModel from '../../../../../data/purchaseModel';
import Calendar, {Precision} from '../../../../../model/calendar';
import Entry from '../../../../../model/entry';
import Project from '../../../../../model/project';
import Purchase from '../../../../../model/purchase';
import BasicRectangleView from '../../../../markeloView/elements/basicRectangleView';
import ProjectBadge from '../../../../markeloView/elements/projectBadge';

interface IProps {
  articleIn: ArticleInModel;
  article: ArticleModel;
  project: ProjectModel;
  purchase: PurchaseModel;
  articleOuts: ArticleOutModel[];
}

interface IState {}

class AIModelToTask extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  async demodelAndChange(onChange: (entry: Entry) => void) {
    const project = new Project({model: this.props.project});
    const purchase = new Purchase(project, {
      model: this.props.purchase,
    });
    await purchase.load();
    onChange(purchase);
  }

  render() {
    return (
      <EntryContext.Consumer>
        {(value) => (
          <ThemeProvider theme={MarkelovTheme}>
            <BasicRectangleView
              mb={12}
              onPress={() => {
                this.demodelAndChange(value.onChangeEntry);
              }}>
              <Div row justifyContent="space-between" mb={6}>
                <Div>
                  <Text
                    fontSize="XL"
                    fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                    color="#444D56">
                    {this.props.purchase.title}
                  </Text>
                  <Text fontSize="XXS" color="#444D56" mt={4}>
                    {Calendar.derive(this.props.purchase.date).readableName(
                      Precision.Day,
                    )}
                  </Text>
                </Div>
                <ProjectBadge project={this.props.project} isOn />
              </Div>
              <Div row mb={6}>
                <Text mr={6}>Количество:</Text>
                <Text>{this.props.articleIn.quantity}шт</Text>
              </Div>
              {this.props.articleIn.suggestedPriceOut && (
                <Div row mb={6}>
                  <Text mr={6}>Цена продажи:</Text>
                  <Text>{this.props.articleIn.suggestedPriceOut}₽</Text>
                </Div>
              )}

              <Div row mb={6}>
                <Text mr={6}>Сумма:</Text>
                <Text>
                  {this.props.articleIn.priceIn * this.props.articleIn.quantity}
                  ₽
                </Text>
              </Div>
              {this.props.articleIn.suggestedPriceOut && (
                <Div row mb={6}>
                  <Text mr={6}>Прибыль:</Text>
                  <Text>
                    {(this.props.articleIn.suggestedPriceOut -
                      this.props.articleIn.priceIn) *
                      this.props.articleIn.quantity}
                  </Text>
                </Div>
              )}
            </BasicRectangleView>
          </ThemeProvider>
          // <Button
          //   bg={this.props.project?.color ?? 'transparent'}
          //   color="black"
          //   m="sm"
          //   borderWidth={1}
          //   borderColor="black"
          //   rounded={8}
          // onPress={() => {
          //   this.demodelAndChange(value.onChangeEntry);
          // }}
          //   flex={1}>
          //   <Div
          //     m={0}
          //     p="sm"
          //     justifyContent="space-between"
          //     row
          //     flex={1}
          //     alignItems="center">
          //     <Div>
          //       <Text>{this.props.articleIn.createdAt.toLocaleString()}</Text>
          //       <Text>Партия {this.props.articleIn.quantity}</Text>
          //       <Text>
          //         Остаток{' '}
          //         {this.props.articleIn.quantity -
          //           this.props.articleOuts.reduce(
          //             (acc, next) => (acc += next.quantity),
          //             0,
          //           )}
          //       </Text>
          //       <Text>Закупочная цена {this.props.articleIn.priceIn}₽</Text>
          //     </Div>
          //     <Text>
          //       {this.props.articleIn.priceIn * this.props.articleIn.quantity}₽
          //     </Text>
          //   </Div>
          // </Button>
        )}
      </EntryContext.Consumer>
    );
  }
}

const enhanceWithFirst = withObservables(
  ['articleIn'],
  ({articleIn}: {articleIn: ArticleInModel}) => ({
    articleIn: articleIn,
    articleOuts: articleIn.atricleOuts.extend(
      Q.experimentalJoinTables(['sales']),
      Q.on('sales', 'is_done', true),
    ),
    article: articleIn.article,
    purchase: articleIn.purchases,
  }),
);

const enhanceWithSecond = withObservables(
  ['purchase'],
  ({purchase}: {purchase: PurchaseModel}) => ({
    purchase: purchase,
    project: purchase.project,
  }),
);

export default enhanceWithFirst(enhanceWithSecond(AIModelToTask));
