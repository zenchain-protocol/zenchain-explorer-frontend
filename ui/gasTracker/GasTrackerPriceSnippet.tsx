/* eslint-disable eqeqeq */
import { Box, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { GasPriceInfo, GasPrices } from 'types/api/stats';

import { SECOND } from 'lib/consts';
import { asymp } from 'lib/html-entities';
import GasPrice from 'ui/shared/gas/GasPrice';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  type: keyof GasPrices;
  data: GasPriceInfo;
  isLoading: boolean;
}

const ICONS: Record<keyof GasPrices, IconName> = {
  fast: 'rocket_xl',
  average: 'gas_xl',
  slow: 'gas_xl',
};

const GasTrackerPriceSnippet = ({ data, type, isLoading }: Props) => {
  const { t } = useTranslation('common');

  const bgColors = {
    fast: 'transparent',
    average: useColorModeValue('gray.50', 'whiteAlpha.200'),
    slow: useColorModeValue('gray.50', 'whiteAlpha.200'),
  };

  let processedTitle = '';

  if (type == 'fast') {
    processedTitle = t(`gas_related.Fast`);
  } else if (type == 'average') {
    processedTitle = t(`gas_related.Normal`);
  } else {
    processedTitle = t(`gas_related.Slow`);
  }

  return (
    <Box
      as="li"
      listStyleType="none"
      px={ 9 }
      py={ 6 }
      w={{ lg: 'calc(100% / 3)' }}
      bgColor={ bgColors[type] }
    >
      <Skeleton textStyle="h3" isLoaded={ !isLoading } w="fit-content">{ processedTitle }</Skeleton>
      <Flex columnGap={ 3 } alignItems="center" mt={ 3 }>
        <IconSvg name={ ICONS[type] } boxSize={{ base: '30px', xl: 10 }} isLoading={ isLoading } flexShrink={ 0 }/>
        <Skeleton isLoaded={ !isLoading }>
          <GasPrice data={ data } fontSize={{ base: '36px', xl: '48px' }} lineHeight="48px" fontWeight={ 600 } letterSpacing="-1px" fontFamily="heading"/>
        </Skeleton>
      </Flex>
      <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" mt={ 3 } w="fit-content">
        { data.price && data.fiat_price && <GasPrice data={ data } prefix={ `${ asymp } ` } unitMode="secondary"/> }
        <span> { t('gas_related.per_transaction') }</span>
        { data.time && <span> / { (data.time / SECOND).toLocaleString(undefined, { maximumFractionDigits: 1 }) }s</span> }
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } fontSize="sm" color="text_secondary" mt={ 2 } w="fit-content" whiteSpace="pre">
        { data.base_fee && <span>{ t('gas_related.Base') } { data.base_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }</span> }
        { data.base_fee && data.priority_fee && <span> / </span> }
        { data.priority_fee && <span>{ t('gas_related.Priority') } { data.priority_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }</span> }
      </Skeleton>
    </Box>
  );
};

export default React.memo(GasTrackerPriceSnippet);
