import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs} from 'react-native-svg';

export const cross = (props: SvgProps) => (
  <Svg
    width={9}
    height={9}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M1.3.1a.398.398 0 0 0-.283.117l-.8.8a.4.4 0 0 0 0 .566L3.134 4.5.217 7.417a.4.4 0 0 0 0 .566l.8.8a.4.4 0 0 0 .566 0L4.5 5.866l2.917 2.917a.4.4 0 0 0 .566 0l.8-.8a.4.4 0 0 0 0-.566L5.865 4.5l2.918-2.917a.4.4 0 0 0 0-.566l-.8-.8a.4.4 0 0 0-.566 0L4.5 3.135 1.583.217A.399.399 0 0 0 1.3.1Z"
      fill="#ED4949"
    />
  </Svg>
);
