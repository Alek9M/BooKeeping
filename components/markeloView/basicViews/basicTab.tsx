import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {ScrollView, TextInput} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {Button, Div, Input, Text, ThemeProvider} from 'react-native-magnus';
import {
  BlurContext,
  BlurContextValue,
  HeaderContext,
  MarkelovTheme,
} from '../../../App';
import ProjectModel from '../../../data/projectModel';
import Blur from '../elements/blur';
import {
  binBig,
  duplicateBig,
  magnifyingGlass,
  multiCross,
  multiSelect,
  shareBig,
} from '../icons/svg';
import SquareSelector from '../elements/squareSelector';

interface TabScreen {
  title: string;
  screen: Element;
  props?: any;
}

interface IProps {
  //   selectorValues: string[];
  //   selectorIndex: number;
  //   onSelectorChange: (index: number) => void;
  screens: TabScreen[];
  projectsSelected?: ProjectModel[];
  hideSelect?: boolean;
  px?: number;
  py?: number;
  multiSelected?: any[];
  switchMulti?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

interface IState {
  // isMultiSelectOff: boolean;
  searchValue: string;
  selectorIndex: number;
}

export default class BasicTab extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {searchValue: '', selectorIndex: 0};
  }

  // Palate
  darkBlue = '#DFE5F3';
  lightBlue = '#F1F2F5';
  white = '#F9F9FA';
  // Text
  selected = '#7D90AB';
  placeholder = '#7D8694';

  // Paddings
  px = 27.5;
  pb = 12;
  pt = 15;
  pxSearch = 15;

  // Sizes
  height = 36;

  // toggleToMultiSelected(item: any) {
  //   if (this.state.multiSelected == undefined) return;
  //   this.setState((prevState, _) => {
  //     let newState = prevState.multiSelected;
  //     if (newState == undefined) return {};
  //     if (newState.includes(item)) {
  //       newState = prevState.multiSelected?.filter((value) => value != item);
  //     } else {
  //       newState.push(item);
  //     }
  //     return {multiSelected: newState};
  //   });
  // }

  whiteCircleButton(icon: Element, onPress?: () => void) {
    return (
      <Button
        ml={10}
        w={this.height}
        h={this.height}
        rounded={this.height}
        bg={this.white}
        onPress={onPress}>
        {icon}
      </Button>
    );
  }

  searchInput() {
    return (
      <Div
        row
        alignItems="center"
        flex={1}
        bg={this.white}
        pl={this.pxSearch}
        rounded={this.height}>
        {magnifyingGlass({})}
        <TextInput
          style={{
            borderRadius: this.height,
            height: this.height,
            flex: 1,
            paddingRight: this.pxSearch,
            paddingLeft: 8,
          }}
          value={this.state.searchValue}
          onChangeText={(text) => this.setState({searchValue: text})}
          placeholderTextColor={this.placeholder}
          placeholder="Поиск"
        />
      </Div>
    );
  }

  selector() {
    if (this.props.screens.length < 2) return;
    return (
      <Div bg={this.darkBlue} px={this.props.px ?? this.px}>
        <Div pb={this.pb}>
          <SquareSelector
            values={this.props.screens.map((screen) => screen.title)}
            selectedIndex={this.state.selectorIndex}
            onChange={(index) => this.setState({selectorIndex: index})}
            color={this.darkBlue}
          />
        </Div>
      </Div>
    );
  }

  select() {
    if (this.props.hideSelect) return;
    // TODO: onPress
    return this.whiteCircleButton(
      !!this.props.multiSelected ? multiCross({}) : multiSelect({}),
      this.props.switchMulti,
    );
  }

  render() {
    const Screen =
      this.props.screens.length > 0 ? (
        this.props.screens[this.state.selectorIndex].screen
      ) : (
        <></>
      );

    const props =
      this.props.screens.length > 0
        ? this.props.screens[this.state.selectorIndex].props ?? []
        : [];
    return (
      <>
        <ThemeProvider theme={MarkelovTheme}>
          <Div>
            {this.selector()}
            <ScrollView
              contentOffset={{
                x: 0,
                y: this.height + (this.props.py ?? this.pb),
              }}
              stickyHeaderIndices={
                !this.props.multiSelected || this.state.searchValue.length > 0
                  ? []
                  : [0]
              }
              style={{
                //   marginTop: -(this.height + this.pb),
                height: '100%',
                backgroundColor: this.lightBlue,
              }}>
              <Div
                pb={this.props.py ?? this.pb}
                px={this.props.px ?? this.px}
                bg={this.darkBlue}>
                <Div row>
                  {this.searchInput()}
                  {this.select()}
                </Div>
                <Collapsible collapsed={!this.props.multiSelected}>
                  <Div
                    row
                    alignItems="center"
                    justifyContent="space-between"
                    pt={this.props.py ?? this.pb}>
                    <Text
                      fontSize="M"
                      lineHeight={14}
                      fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                      color={this.selected}>
                      Выбрано: {this.props.multiSelected?.length}
                    </Text>
                    <Div row>
                      {/* //TODO: onPress */}
                      {this.whiteCircleButton(
                        duplicateBig({}),
                        this.props.onDuplicate,
                      )}
                      {this.whiteCircleButton(shareBig({}))}
                      {this.whiteCircleButton(binBig({}), this.props.onDelete)}
                    </Div>
                  </Div>
                </Collapsible>
              </Div>

              <Div
                h="100%"
                px={this.props.px ?? this.px}
                pt={this.props.py ?? this.pt}>
                <HeaderContext.Consumer>
                  {(value) => (
                    <Screen
                      searchWord={this.state.searchValue}
                      selectedProjects={
                        this.props.projectsSelected ?? value.projectsSelected
                      }
                      queries={[]}
                      {...props}
                    />
                  )}
                </HeaderContext.Consumer>
              </Div>
            </ScrollView>
          </Div>
          <Blur />
        </ThemeProvider>
      </>
    );
  }
}
