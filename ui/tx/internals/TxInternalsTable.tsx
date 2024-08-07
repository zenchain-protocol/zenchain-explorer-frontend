import { Table, Tbody, Tr, Th, Link } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { currencyUnits } from 'lib/units';
import IconSvg from 'ui/shared/IconSvg';
import { default as Thead } from 'ui/shared/TheadSticky';
import TxInternalsTableItem from 'ui/tx/internals/TxInternalsTableItem';
import type { Sort, SortField } from 'ui/tx/internals/utils';

interface Props {
  data: Array<InternalTransaction>;
  sort: Sort | undefined;
  onSortToggle: (field: SortField) => () => void;
  top: number;
  isLoading?: boolean;
}

const TxInternalsTable = ({ data, sort, onSortToggle, top, isLoading }: Props) => {
  const { t } = useTranslation('common');

  const sortIconTransform = sort?.includes('asc') ? 'rotate(-90deg)' : 'rotate(90deg)';

  return (
    <AddressHighlightProvider>
      <Table variant="simple" size="sm">
        <Thead top={ top }>
          <Tr>
            <Th width="28%">{ t('Type') }</Th>
            <Th width="40%">{ t('From_To') }</Th>
            <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('value') } columnGap={ 1 }>
                { sort?.includes('value') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
                { t('Value') } { currencyUnits.ether }
              </Link>
            </Th>
            <Th width="16%" isNumeric>
              <Link display="flex" alignItems="center" justifyContent="flex-end" onClick={ onSortToggle('gas-limit') } columnGap={ 1 }>
                { sort?.includes('gas-limit') && <IconSvg name="arrows/east" boxSize={ 4 } transform={ sortIconTransform }/> }
                { t('Gas limit') } { currencyUnits.ether }
              </Link>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          { data.map((item, index) => (
            <TxInternalsTableItem key={ item.transaction_hash + (isLoading ? index : '') } { ...item } isLoading={ isLoading }/>
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default TxInternalsTable;
