import React, {Component} from 'react';
//
import {EntryContext, HeaderContextValue} from '../../../App';
import EntryModel from '../../../data/entryModel';
import NoteModel from '../../../data/noteModel';
import PaymentModel from '../../../data/paymentModel';
import PurchaseModel from '../../../data/purchaseModel';
import SaleModel from '../../../data/saleModel';
import Entry, {EntryTable} from '../../../model/entry';
import Note from '../../../model/note';
import Payment from '../../../model/payment';
import Project from '../../../model/project';
import Purchase from '../../../model/purchase';
import Sale from '../../../model/sale';
import BasicTab from '../basicViews/basicTab';
import EntryBlockList from './entryBlockList';

interface IProps {}

interface IState {
  multiSelected?: any[];
}

export default class ToDo extends Component<IProps, IState> {
  focusListener = undefined;
  constructor(props: IProps) {
    super(props);

    this.state = {
      multiSelected: undefined,
    };
  }

  async getProject(model: EntryModel): Promise<Project | undefined> {
    const projectModel = await model.project?.fetch?.();
    return projectModel ? new Project({model: projectModel}) : undefined;
  }

  // TODO: awful. fix.
  async demodel(model: EntryModel): Promise<Entry> {
    const project = await this.getProject(model);
    let entry: Entry | undefined = undefined;
    switch (model.constructor) {
      case NoteModel:
        entry = new Note({model: model as NoteModel}, project);
        break;
      case PaymentModel:
        if (project) {
          entry = new Payment(project, {
            model: model as PaymentModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Payment without Project');
        }
      case PurchaseModel:
        if (project) {
          entry = new Purchase(project, {
            model: model as PurchaseModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }
      case SaleModel:
        if (project) {
          entry = new Sale(project, {
            model: model as SaleModel,
          });
          break;
        } else {
          throw new Error('Trying to construct Purchase without Project');
        }

      default:
        throw new Error("Can't demodel incompatible model");
    }

    // TODO: doesn't load
    await entry.load();
    return entry;
  }

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
      <EntryContext.Consumer>
        {(value) => {
          const demodelAndChange = (entry: EntryModel) =>
            this.demodel(entry).then((entry) => value.onChangeEntry(entry));
          let sharedProps = {
            onPress: demodelAndChange,
            multiSelected: this.state.multiSelected,
            onMultiSelect: !!this.state.multiSelected
              ? (entry: EntryModel) => {
                  this.setState((prevState, _) => {
                    let newState = prevState.multiSelected;
                    if (newState == undefined) return {};
                    if (newState.includes(entry)) {
                      newState = prevState.multiSelected?.filter(
                        (value) => value != entry,
                      );
                    } else {
                      newState.push(entry);
                    }
                    return {multiSelected: newState};
                  });
                }
              : undefined,
          };
          return (
            <BasicTab
              screens={[
                {
                  // FIXME: got mad at dates, figure it out
                  // make into one block
                  title: 'Сегодня',
                  screen: EntryBlockList,
                  props: {
                    entryFor: (table: EntryTable) => {
                      return Entry.upToTodayUndoneFor(table);
                    },
                    ...sharedProps,
                    // onPress: demodelAndChange,
                  },
                },
                {
                  title: 'Планы',
                  screen: EntryBlockList,
                  props: {
                    entryFor: (table: EntryTable) => {
                      return Entry.futureUndoneFor(table);
                    },
                    ...sharedProps,
                    // onPress: demodelAndChange,
                  },
                },
                {
                  title: 'Сделано',
                  screen: EntryBlockList,
                  props: {
                    entryFor: (table: EntryTable) => {
                      return Entry.doneFor(table);
                    },
                    ...sharedProps,
                    // onPress: demodelAndChange,
                  },
                },
              ]}
              multiSelected={this.state.multiSelected}
              switchMulti={() =>
                this.setState((prevState, _) => {
                  return {
                    multiSelected: !!prevState.multiSelected ? undefined : [],
                  };
                })
              }
              onDelete={async () => {
                if (this.state.multiSelected == undefined) return;
                for (const entryModel of this.state.multiSelected) {
                  const entry = await this.demodel(entryModel);
                  await entry.delete();
                }
                this.setState({multiSelected: undefined});
              }}
              onDuplicate={async () => {
                if (this.state.multiSelected == undefined) return;
                let copies: Entry[] = [];
                for (const entryModel of this.state.multiSelected) {
                  if (
                    entryModel instanceof PaymentModel &&
                    ((await entryModel.purchase.fetch()) != undefined ||
                      (await entryModel.sale.fetch()) != undefined)
                  )
                    continue;
                  const entry = await this.demodel(entryModel);
                  if (entry instanceof Sale || entry instanceof Purchase) {
                    (entry as Sale | Purchase).undelay();
                  }
                  copies.push(entry.copy);
                }
                value.onChangeQueue([...value.queue, ...copies]);
              }}
            />
          );
        }}
      </EntryContext.Consumer>
    );
  }
}
