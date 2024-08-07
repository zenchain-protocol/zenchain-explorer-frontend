import { Flex, Grid, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import type { ResourceError } from 'lib/api/resources';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';
import ResetIconButton from 'ui/shared/ResetIconButton';

import TokenInventoryItem from './TokenInventoryItem';

type Props = {
  inventoryQuery: QueryWithPagesResult<'token_inventory'>;
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  ownerFilter?: string;
}

const TokenInventory = ({ inventoryQuery, tokenQuery, ownerFilter }: Props) => {
  const { t } = useTranslation('common');

  const isMobile = useIsMobile();

  const resetOwnerFilter = React.useCallback(() => {
    inventoryQuery.onFilterChange({});
  }, [ inventoryQuery ]);

  const isActionBarHidden = !ownerFilter && !inventoryQuery.data?.items.length;

  const ownerFilterComponent = ownerFilter && (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      mb={{ base: isActionBarHidden ? 3 : 6, lg: 3 }}
      mr={ 4 }
    >
      <Text whiteSpace="nowrap" mr={ 2 } py={ 1 }>{ t('Filtered_by_owner') }</Text>
      <Flex alignItems="center" py={ 1 }>
        <AddressEntity address={{ hash: ownerFilter }} truncation={ isMobile ? 'constant' : 'none' }/>
        <ResetIconButton onClick={ resetOwnerFilter }/>
      </Flex>
    </Flex>
  );

  const actionBar = !isActionBarHidden && (
    <>
      { ownerFilterComponent }
      <ActionBar mt={ -6 }>
        { isMobile && <Pagination ml="auto" { ...inventoryQuery.pagination }/> }
      </ActionBar>
    </>
  );

  const items = inventoryQuery.data?.items;
  const token = tokenQuery.data;

  const content = items && token ? (
    <AddressHighlightProvider>
      <Grid
        w="100%"
        columnGap={{ base: 3, lg: 6 }}
        rowGap={{ base: 3, lg: 6 }}
        gridTemplateColumns={{ base: 'repeat(2, calc((100% - 12px)/2))', lg: 'repeat(auto-fill, minmax(210px, 1fr))' }}
      >
        { items.map((item, index) => (
          <TokenInventoryItem
            key={ item.id + '_' + index + (inventoryQuery.isPlaceholderData ? '_' + 'placeholder' : '') }
            item={ item }
            isLoading={ inventoryQuery.isPlaceholderData || tokenQuery.isPlaceholderData }
            token={ token }
          />
        )) }
      </Grid>
    </AddressHighlightProvider>
  ) : null;

  return (
    <DataListDisplay
      isError={ inventoryQuery.isError }
      items={ items }
      emptyText={ t('There_are_no_tokens') }
      filterProps={{
        hasActiveFilters: Boolean(ownerFilter),
        emptyFilteredText: t('No_tokens_found_for_the_selected_owner'),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TokenInventory;
