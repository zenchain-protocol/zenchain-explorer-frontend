import { Flex } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { ZERO } from 'lib/consts';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import { getTokensTotalInfo } from '../utils/tokenUtils';
import useFetchTokens from '../utils/useFetchTokens';
import TokenBalancesItem from './TokenBalancesItem';

const TokenBalances = () => {
  const { t } = useTranslation('common');

  const router = useRouter();

  const hash = router.query.hash?.toString();

  const addressQuery = useApiQuery('address', {
    pathParams: { hash },
    queryOptions: { enabled: Boolean(hash), refetchOnMount: false },
  });

  const tokenQuery = useFetchTokens({ hash });

  if (addressQuery.isError || tokenQuery.isError) {
    return <DataFetchAlert/>;
  }

  const addressData = addressQuery.data;
  const { valueStr: nativeValue, usdBn: nativeUsd } = getCurrencyValue({
    value: addressData?.coin_balance || '0',
    accuracy: 8,
    accuracyUsd: 2,
    exchangeRate: addressData?.exchange_rate,
    decimals: String(config.chain.currency.decimals),
  });

  const tokensInfo = getTokensTotalInfo(tokenQuery.data);
  const prefix = tokensInfo.isOverflow ? '>' : '';
  const totalUsd = nativeUsd.plus(tokensInfo.usd);
  const tokensNumText = tokensInfo.num > 0 ?
    ` | ${ prefix }${ tokensInfo.num } ${ tokensInfo.num > 1 ? t('tx_area.tokens') : t('tx_area.token') }` :
    '';

  return (
    <Flex columnGap={ 3 } rowGap={ 3 } mt={{ base: '6px', lg: 0 }} flexDirection={{ base: 'column', lg: 'row' }}>
      <TokenBalancesItem
        name={ t('address_area.Net_Worth') }
        value={ addressData?.exchange_rate ? `${ prefix }$${ totalUsd.toFormat(2) } USD` : 'N/A' }
        isLoading={ addressQuery.isPending || tokenQuery.isPending }
      />
      <TokenBalancesItem
        name={ `${ currencyUnits.ether } ${ t('Balance') }` }
        value={ (!nativeUsd.eq(ZERO) ? `$${ nativeUsd.toFormat(2) } USD | ` : '') + `${ nativeValue } ${ currencyUnits.ether }` }
        isLoading={ addressQuery.isPending || tokenQuery.isPending }
      />
      <TokenBalancesItem
        name={ t('tx_area.Tokens') }
        value={
          `${ prefix }$${ tokensInfo.usd.toFormat(2) } USD ` +
          tokensNumText
        }
        isLoading={ addressQuery.isPending || tokenQuery.isPending }
      />
    </Flex>
  );
};

export default TokenBalances;
