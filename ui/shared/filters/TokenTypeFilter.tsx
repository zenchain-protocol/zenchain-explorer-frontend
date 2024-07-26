import { CheckboxGroup, Checkbox, Text, Flex, Link, useCheckboxGroup } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { NFTTokenType, TokenType } from 'types/api/token';

import { NFT_TOKEN_TYPES, TOKEN_TYPES } from 'lib/token/tokenTypes';

type Props<T extends TokenType | NFTTokenType> = {
  onChange: (nextValue: Array<T>) => void;
  defaultValue?: Array<T>;
  nftOnly: T extends NFTTokenType ? true : false;
}
const TokenTypeFilter = <T extends TokenType | NFTTokenType>({ nftOnly, onChange, defaultValue }: Props<T>) => {
  const { t } = useTranslation('common');

  const { value, setValue } = useCheckboxGroup({ defaultValue });

  const handleReset = React.useCallback(() => {
    if (value.length === 0) {
      return;
    }
    setValue([]);
    onChange([]);
  }, [ onChange, setValue, value.length ]);

  const handleChange = React.useCallback((nextValue: Array<T>) => {
    setValue(nextValue);
    onChange(nextValue);
  }, [ onChange, setValue ]);

  return (
    <>
      <Flex justifyContent="space-between" fontSize="sm">
        <Text fontWeight={ 600 } variant="secondary">{ t('Type') }</Text>
        <Link
          onClick={ handleReset }
          cursor={ value.length > 0 ? 'pointer' : 'unset' }
          color={ value.length > 0 ? 'link' : 'text_secondary' }
          _hover={{
            color: value.length > 0 ? 'link_hovered' : 'text_secondary',
          }}
        >
          { t('Reset') }
        </Link>
      </Flex>
      <CheckboxGroup size="lg" onChange={ handleChange } value={ value }>
        { (nftOnly ? NFT_TOKEN_TYPES : TOKEN_TYPES).map(({ title, id }) => (
          <Checkbox key={ id } value={ id }>
            <Text fontSize="md">{ title }</Text>
          </Checkbox>
        )) }
      </CheckboxGroup>
    </>
  );
};

export default TokenTypeFilter;
