import withObservables from '@nozbe/with-observables';
import React, {Component} from 'react';
import {
  Alert,
  EventEmitter,
  NativeEventEmitter,
  NativeEventSubscription,
} from 'react-native';

import SearchableDropdown from './react-native-searchable-dropdown';
import BudgetTagModel from '../../../data/budgetTagModel';
import {observeBudgetTagsOn} from '../../../data/helpers';
import BudgetTag from '../../../model/budgetTag';
import Project from '../../../model/project';
import TagDropDownListItem from './tagDropDownListItem';
import DropDownPicker from './react-native-dropdown-picker';
import BudgetTagRow from '../../main/money/BudgetTagRow';
import {Text} from 'react-native-magnus';

interface SearchableItem {
  id: number;
  name: string;
}

interface ItemType {
  label: any; // required
  value: any; // required
  icon?: () => JSX.Element;
  hidden?: boolean;
  untouchable?: boolean;
  parent?: any;
  disabled?: boolean;
  selected?: boolean;
}

interface IProps {
  onSelect: (selected?: BudgetTag) => void;
  onItemAdded?: (text: string) => void;
  // items: SearchableItem[];
  placeholder: string;
  budgetTags: BudgetTagModel[];
  currentProject: Project;
  tag: BudgetTag;
  type: number;
}

interface IState {
  // items: SearchableItem[];
  textInputValue: string;
}

class CustomDropdown extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      // items: props.items,
      textInputValue: '',
    };
  }

  onDoneEnteringText(text: string) {
    let item = this.props.budgetTags.find(
      (item) => item.title.toUpperCase() == text?.toUpperCase(),
    );
    if (item) {
      this.setState({textInputValue: item.title});
      this.props.onSelect(BudgetTag.demodel(item));
    } else if (this.props.onItemAdded) {
      let maxId =
        this.state.items.length > 0
          ? this.state.items.reduce((maxValue, currentValue) =>
              maxValue.id >= currentValue.id ? maxValue : currentValue,
            ).id
          : 1;

      let newItem: SearchableItem = {
        name: text,
        id: maxId + 1,
      };
      this.setState({textInputValue: newItem.name});
      this.props.onItemAdded(newItem.name);
      // TODO: handle saving new option
      this.setState((props, state) => {
        return {
          items: state.items.push(newItem),
        };
      });
      //   alert(text);
    } else {
      this.setState({textInputValue: ''});
    }
  }

  render() {
    return (
      // <SearchableDropdown
      //   onItemSelect={(item: BudgetTagModel) => {
      //     this.setState({textInputValue: item.title});
      //     this.props.onSelect(BudgetTag.demodel(item));
      //   }}
      //   type={this.props.type}
      //   tag={this.props.tag}
      //   containerStyle={{padding:  5}}
      //   currentProject={this.props.currentProject}
      //   itemStyle={{
      //     padding: 10,
      //     //   marginHorizontal: 10,
      //     marginTop: 2,
      //     backgroundColor: '#edf2f7',
      //     borderColor: '#e2e8f0',
      //     borderWidth: 1,
      //     borderRadius: 5,
      //   }}
      //   itemTextStyle={{color: '#222'}}
      //   // itemsContainerStyle={{paddingBottom: 140}}
      //   items={
      //     this.props.budgetTags
      //     //   .map((tag) => {
      //     //   const namedTag = tag;
      //     //   namedTag.name = tag.title;
      //     //   return namedTag;
      //     // })
      //   }
      //   resetValue={false}
      //   setSort={(item: BudgetTagModel, text: string) =>
      //     item.title.toUpperCase().startsWith(text.toUpperCase())
      //   }
      //   textInputProps={{
      //     placeholder: this.props.placeholder,
      //     underlineColorAndroid: 'transparent',

      //     style: {
      //       padding: 12,
      //       height: 50,
      //       marginVertical: 8,
      //       marginHorizontal: -5,
      //       borderWidth: 1,
      //       backgroundColor: 'white',
      //       borderColor: '#ccc',
      //       borderRadius: 5,
      //     },

      //     onTextChange: (text: string) => this.setState({textInputValue: text}),
      //     // TODO: handle custom choices
      //     value: this.state.textInputValue,
      //     onEndEditing: () =>
      //       this.onDoneEnteringText(this.state.textInputValue),
      //     onSubmitEditing: (event: any) => {
      //       let text: string = event.nativeEvent.text.trim();
      //       this.onDoneEnteringText(text);
      //     },
      //   }}
      //   listProps={{
      //     nestedScrollEnabled: true,
      //   }}
      // />
      <>
        {this.props.tag?.model && (
          <DropDownPicker
            items={this.props.budgetTags.map((tag) => {
              const item: ItemType = {
                value: tag,
                label: tag.title,
              };
              return item;
            })}
            searchable={true}
            searchablePlaceholder="Поиск"
            placeholder="Категория"
            defaultValue={this.props.tag.model}
            onChangeItem={(item) => this.props.onSelect(item.value)}
            onChangeList={() => this.props.onSelect(undefined)}
            renderCustom
            chosenProjects={[this.props.currentProject]}
          />
        )}
        {!Boolean(this.props.tag?.model) && (
          <DropDownPicker
            items={this.props.budgetTags.map((tag) => {
              const item: ItemType = {
                value: tag,
                label: tag.title,
              };
              return item;
            })}
            searchable={true}
            searchablePlaceholder="Поиск"
            placeholder={this.props.placeholder}
            onChangeItem={(item) => this.props.onSelect(item.value)}
            // onChangeList={(items, callback) => {
            //   console.log('list changed');
            //   this.props.onSelect(undefined);
            // }}
            renderCustom
            chosenProjects={[this.props.currentProject]}
          />
        )}

        {/* <Text>{this.props.tag.model?.title}</Text> */}
      </>
    );
  }
}

const enhanceWithTags = withObservables(
  ['month', 'year', 'type'],
  ({month, year, type}) => ({
    budgetTags: observeBudgetTagsOn(type, year, month),
  }),
);

export default enhanceWithTags(CustomDropdown);
