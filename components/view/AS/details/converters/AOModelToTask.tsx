import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {Button, Div, Text} from 'react-native-magnus';
import {EntryContext} from '../../../../../App';
import ArticleInModel from '../../../../../data/articleInModel';
import ArticleModel from '../../../../../data/articleModel';
import ArticleOutModel from '../../../../../data/articleOutModel';
import ProjectModel from '../../../../../data/projectModel';
import SaleModel from '../../../../../data/saleModel';
import Entry from '../../../../../model/entry';
import Project from '../../../../../model/project';
import Sale from '../../../../../model/sale';

interface IProps {
  articleOut: ArticleOutModel;
  article: ArticleModel;
  project: ProjectModel;
  sale: SaleModel;
}

interface IState {}

class AOModelToTask extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  async demodelAndChange(onChange: (entry: Entry) => void) {
    const project = new Project({model: this.props.project});
    const sale = new Sale(project, {
      model: this.props.sale,
    });
    await sale.load();
    onChange(sale);
  }

  render() {
    return (
      <EntryContext.Consumer>
        {(value) => (
          <Button
            bg={this.props.project?.color ?? 'transparent'}
            color="black"
            m="sm"
            onPress={() => {
              this.demodelAndChange(value.onChangeEntry);
            }}
            flex={1}>
            <Div flex={1}>
              <Text textAlign="left" flex={1}>
                {this.props.sale.title}
              </Text>
              <Text>
                {this.props.articleOut.priceOut}₽ x
                {this.props.articleOut.quantity} =
                {this.props.articleOut.priceOut *
                  this.props.articleOut.quantity}
                ₽
              </Text>
            </Div>
          </Button>
        )}
      </EntryContext.Consumer>
    );
  }
}

const enhanceWithFirst = withObservables(
  ['articleOut'],
  ({articleOut}: {articleOut: ArticleOutModel}) => ({
    articleOut: articleOut,
    article: articleOut.article,
    sale: articleOut.sale,
  }),
);

const enhanceWithSecond = withObservables(
  ['sale'],
  ({sale}: {sale: SaleModel}) => ({
    project: sale.project,
  }),
);

export default enhanceWithFirst(enhanceWithSecond(AOModelToTask));
