import { Center, SegmentedControl } from '@mantine/core';
import type { TApiType } from '../../types';
import type { FC } from 'react';
import { PageRoute } from '../PageRoute';
import { PapiLogo } from './PapiLogo';
import { PolkadotJsLogo } from './PolkadotJsLogo';

type Props = {
  value: TApiType;
  onChange: (apiType: TApiType) => void;
  apiTypeInitialized: boolean;
};

export const ApiTypeSelector: FC<Props> = ({
  value,
  onChange,
  apiTypeInitialized,
}) => {
  const onChangeInternal = (value: string) => {
    onChange(value as TApiType);
  };

  const fullyDisabled = location.pathname === PageRoute.XCM_ANALYSER;

  const data = [
    {
      value: 'PAPI',
      disabled:
        fullyDisabled ||
        location.pathname === PageRoute.XCM_ROUTER.toString() ||
        !apiTypeInitialized,
      label: (
        <Center style={{ gap: 8 }}>
          <PapiLogo />
          <span>PAPI</span>
        </Center>
      ),
    },
    {
      value: 'PJS',
      disabled: fullyDisabled,
      label: (
        <Center style={{ gap: 8 }}>
          <PolkadotJsLogo />
          <span>PJS</span>
        </Center>
      ),
    },
  ];

  return (
    <SegmentedControl
      value={value}
      onChange={onChangeInternal}
      disabled={!apiTypeInitialized}
      data={data}
    />
  );
};