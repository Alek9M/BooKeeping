import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs} from 'react-native-svg';

export const info = (props: SvgProps) => (
  <Svg
    width={25}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M12.5 0C5.873 0 .5 5.373.5 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12Zm1 18h-2v-7h2v7Zm-1-9.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 12.5 8.5Z"
      fill="#7D8694"
    />
  </Svg>
);
