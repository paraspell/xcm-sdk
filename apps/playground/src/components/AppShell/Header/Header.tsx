import type { FC } from 'react';
import {
  Box,
  Burger,
  Button,
  Group,
  Image,
  useComputedColorScheme,
} from '@mantine/core';
import { useWallet } from '../../../hooks/useWallet';
import { FloatingTabs } from '../../FloatingTabs/FloatingTabs';
import { ApiTypeSelector } from '../../ApiTypeSelector/ApiTypeSelector';
import { NAVIGATION_ITEMS } from '../../../constants/constants';
import { getExtensionInfo } from '../../../utils/getExtensionInfo';
import type { TApiType } from '../../../types';

type Props = {
  onMenuClick: () => void;
  menuOpened: boolean;
  apiTypeInitialized: boolean;
  isLoadingExtensions: boolean;
  isPinned: boolean;
  onApiTypeChange: (apiType: TApiType) => void;
  onChangeAccountClick: () => void;
  onConnectWalletClick: () => void;
};

export const Header: FC<Props> = ({
  onMenuClick,
  menuOpened,
  apiTypeInitialized,
  isLoadingExtensions,
  isPinned,
  onApiTypeChange,
  onChangeAccountClick,
  onConnectWalletClick,
}) => {
  const { apiType, selectedAccount } = useWallet();

  const { icon } = getExtensionInfo(selectedAccount?.meta.source);

  const isSdkRoute = location.pathname.includes('/xcm-sdk/');

  const colorScheme = useComputedColorScheme();

  return (
    <>
      <Box
        w={20}
        h={20}
        pos="absolute"
        left={0}
        bottom={-20}
        bg={colorScheme === 'light' ? 'white' : 'dark.7'}
        style={{
          transition: 'all 150ms',
          opacity: isPinned ? 0 : 1,
          maskImage: 'linear-gradient(135deg, black 30%, transparent 65%)',
        }}
      >
        <Box
          pos="absolute"
          left={0}
          right={0}
          w={20}
          h={20}
          bg={colorScheme === 'light' ? 'gray.0' : 'dark.6'}
          style={{
            borderTopLeftRadius: 16,
            boxShadow:
              'inset 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.05), inset 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1)',
            zIndex: 5,
          }}
        />
        <Box
          pos="absolute"
          left={0}
          right={0}
          w={20}
          h={20}
          bg={colorScheme === 'light' ? 'gray.0' : 'dark.6'}
          style={{
            borderTopLeftRadius: 16,
            zIndex: 4,
          }}
        />
      </Box>
      <Group h="100%" justify="flex-end">
        <Burger
          opened={menuOpened}
          onClick={onMenuClick}
          hiddenFrom="sm"
          size="sm"
        />
        <Group gap="lg" flex={1} justify="flex-end">
          {isSdkRoute && <FloatingTabs data={NAVIGATION_ITEMS} />}
          <ApiTypeSelector
            value={apiType}
            onChange={onApiTypeChange}
            apiTypeInitialized={apiTypeInitialized}
          />
          {selectedAccount ? (
            <Button
              onClick={onChangeAccountClick}
              variant="outline"
              loading={!apiTypeInitialized}
              rightSection={
                <Image
                  ml={2}
                  src={icon}
                  w={16}
                  radius="sm"
                  alt={selectedAccount.meta.source}
                />
              }
            >{`${selectedAccount.meta.name}`}</Button>
          ) : (
            <Button
              onClick={onConnectWalletClick}
              data-testid="btn-connect-wallet"
              loading={!apiTypeInitialized || isLoadingExtensions}
            >
              Connect wallet
            </Button>
          )}
        </Group>
      </Group>
    </>
  );
};