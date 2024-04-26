import {BlurView} from '@react-native-community/blur';
import MaskedView from '@react-native-community/masked-view';
import {StackScreenProps} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Button, Div, Text} from 'react-native-magnus';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {MarkelovTheme} from '../../../../App';
import BasicModalView from '../../../markeloView/basicViews/basicModalView';
import {QRbig} from '../../../markeloView/icons/fab/svg';
import ModalHeader from '../../../markeloView/modalHeader';
import {FabModalRootStackParamList} from '../entryModalNavigator';

type Props = StackScreenProps<FabModalRootStackParamList, 'QR'>;

interface IProps extends Props {}

interface IState {
  flash: 'on' | 'off' | 'auto';
}

export interface BillQR {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  sum: number;
  fn: number;
  i: number;
  fp: number;
  n: number;
  data: string;
  rawData: string;
}

interface E {
  data: string;
  rawData: string;
  target: number;
  type: string;
  bounds: {
    origin: {x: string; y: string};
    size: {height: string; width: string};
  };
}

const regex = new RegExp(
  't=\\d{8}T\\d{4,6}&s=\\d+.\\d{2}&fn=\\d+&i=\\d+&fp=\\d+&n=\\d{1}',
);

// t=20210723T2134&s=315.96&fn=9960440300269764&i=7386&fp=3385126993&n=1
export default class QRScan extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    props.navigation.setOptions({headerShown: false});

    this.state = {
      flash: 'auto',
    };
  }

  onSuccess(e: E) {
    const data = e.data as string;
    if (!(regex.test(e.data) && e.type == 'org.iso.QRCode')) return;
    const datas = data.split('&').map((dat) => {
      return {
        type: dat.split('=')[0],
        value: dat.split('=')[1],
      };
    });
    const numberFinder = (
      type: string,
      datas: {
        type: string;
        value: string;
      }[],
    ) => {
      return Number(datas.find((dat) => dat.type == type)!.value);
    };
    const fullDate = datas.find((dat) => dat.type == 't')!.value.split('T');

    const qrFound: BillQR = {
      fn: numberFinder('fn', datas),
      fp: numberFinder('fp', datas),
      i: numberFinder('i', datas),
      n: numberFinder('n', datas),
      sum: numberFinder('s', datas),
      year: Number(fullDate[0].substr(0, 4)),
      month: Number(fullDate[0].substr(4, 2)),
      day: Number(fullDate[0].substr(6, 2)),
      hour: Number(fullDate[1].substr(0, 2)),
      minute: Number(fullDate[1].substr(2, 2)),
      data: e.data,
      rawData: e.rawData,
    };

    this.props.route.params.onQRFound(qrFound);
    this.props.navigation.goBack();
    // this.props.navigation.navigate('Entry', {qr: qrFound});
  }

  get py(): number {
    const dimensions = Dimensions.get('window');
    return (dimensions.height - this.markerSize) / 2;
  }

  get px(): number {
    return (Dimensions.get('window').width - this.markerSize) / 2;
  }

  get markerSize(): number {
    return Dimensions.get('window').width * 0.7;
  }

  get marker(): Element {
    const borderWidth = 9;
    const rounded = 25;
    const borderColor = 'rgba(255, 255, 255, 0.8)';
    return (
      <Div
        w={this.markerSize}
        h={this.markerSize}
        justifyContent="space-between">
        <Div
          position="absolute"
          w="100%"
          h="100%"
          justifyContent="center"
          alignItems="center">
          {QRbig({})}
        </Div>
        <Div row justifyContent="space-between" h="50%">
          <Div
            roundedTopLeft={rounded}
            borderTopWidth={borderWidth}
            borderLeftWidth={borderWidth}
            borderColor={borderColor}
            h="60%"
            w="30%"
          />
          <Div
            roundedTopRight={rounded}
            borderTopWidth={borderWidth}
            borderRightWidth={borderWidth}
            borderColor={borderColor}
            h="60%"
            w="30%"
          />
        </Div>
        <Div row justifyContent="space-between" alignItems="flex-end" h="50%">
          <Div
            roundedBottomLeft={rounded}
            borderBottomWidth={borderWidth}
            borderLeftWidth={borderWidth}
            borderColor={borderColor}
            h="60%"
            w="30%"
          />
          <Div
            roundedBottomRight={rounded}
            borderBottomWidth={borderWidth}
            borderRightWidth={borderWidth}
            borderColor={borderColor}
            h="60%"
            w="30%"
          />
        </Div>
      </Div>
    );
  }

  render() {
    return (
      <>
        <ModalHeader
          left="Назад"
          onPressLeft={() => this.props.navigation.goBack()}
          right="Вспышка"
          onPressRight={() => {
            switch (this.state.flash) {
              case 'auto':
                this.setState({flash: 'on'});
                break;
              case 'on':
                this.setState({flash: 'off'});
                break;
              case 'off':
                this.setState({flash: 'on'});
                break;
            }
          }}
          title="Сканирование QR"
        />
        <QRCodeScanner
          fadeIn={false}
          showMarker
          markerStyle={{
            height: '100%',
            width: '100%',
            borderWidth: 1,
            borderColor: 'green',
          }}
          customMarker={
            <Div h="100%" w="100%">
              <MaskedView
                style={{flex: 1, flexDirection: 'row', height: '100%'}}
                maskElement={
                  <Div w="100%" h="100%">
                    <Div flex={1} w="100%" bg="black" />
                    <Div row>
                      <Div flex={1} h={this.markerSize} row bg="black" />
                      <Div
                        h={this.markerSize}
                        w={this.markerSize}
                        rounded={25}
                      />
                      {/* {this.marker} */}
                      <Div flex={1} h={this.markerSize} row bg="black" />
                    </Div>
                    <Div flex={1} w="100%" bg="black" />
                  </Div>
                  // <Div w={12.5} h={12.5} overflow="hidden">
                  //   <Div
                  //     position="absolute"
                  //     bg="black"
                  //     h={25}
                  //     w={25}
                  //     rounded={25}
                  //   />
                  // </Div>
                }>
                <BlurView
                  style={{height: '100%', width: '100%'}}
                  blurType="dark"
                  blurAmount={3}
                  reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.4)"
                />
              </MaskedView>
              <Div
                position="absolute"
                w="100%"
                h="100%"
                justifyContent="center"
                alignItems="center">
                {this.marker}
              </Div>
              <Div
                position="absolute"
                w="100%"
                h="100%"
                justifyContent="space-around"
                alignItems="center">
                <Div />
                <Div />
                <Text
                  textAlign="center"
                  color="#F9F9FA"
                  fontFamily={MarkelovTheme.fontFamily.SemiBold600}
                  fontSize="XL">
                  Наведите камеру на QR код для сканирования
                </Text>
              </Div>
            </Div>
          }
          // cameraContainerStyle={{borderWidth: 1, borderColor: 'red'}}
          // containerStyle={{
          //   height: '100%',
          // }}
          cameraStyle={{
            height: '100%',
          }}
          onRead={(e: E) => this.onSuccess(e)}
          flashMode={
            this.state.flash == 'auto'
              ? RNCamera.Constants.FlashMode.auto
              : this.state.flash == 'on'
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off
          }
        />
      </>
    );
  }
}
