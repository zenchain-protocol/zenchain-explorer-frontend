import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import { default as Thead } from 'ui/shared/TheadSticky';
import TokenTransferTableItem from 'ui/shared/TokenTransfer/TokenTransferTableItem';

interface Props {
  data: Array<TokenTransfer>;
  baseAddress?: string;
  showTxInfo?: boolean;
  top: number;
  enableTimeIncrement?: boolean;
  showSocketInfo?: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  isLoading?: boolean;
}

const TokenTransferTable = ({
  data,
  baseAddress,
  showTxInfo,
  top,
  enableTimeIncrement,
  showSocketInfo,
  socketInfoAlert,
  socketInfoNum,
  isLoading,
}: Props) => {
  const { t } = useTranslation('common');

  return (
    <AddressHighlightProvider>
      <Table variant="simple" size="sm" minW="950px">
        <Thead top={ top }>
          <Tr>
            { showTxInfo && <Th width="44px"></Th> }
            <Th width="230px">{ t('tx_area.Token') }</Th>
            <Th width="160px">{ t('tx_area.Token_ID') }</Th>
            { showTxInfo && <Th width="200px">{ t('Txn_hash') }</Th> }
            <Th width="60%">{ t('From_To') }</Th>
            <Th width="40%" isNumeric>{ t('Value') }</Th>
          </Tr>
        </Thead>
        <Tbody>
          { showSocketInfo && (
            <SocketNewItemsNotice.Desktop
              url={ window.location.href }
              alert={ socketInfoAlert }
              num={ socketInfoNum }
              type="token_transfer"
              isLoading={ isLoading }
            />
          ) }
          { data.map((item, index) => (
            <TokenTransferTableItem
              key={ item.tx_hash + item.block_hash + item.log_index + (isLoading ? index : '') }
              { ...item }
              baseAddress={ baseAddress }
              showTxInfo={ showTxInfo }
              enableTimeIncrement={ enableTimeIncrement }
              isLoading={ isLoading }
            />
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );
};

export default React.memo(TokenTransferTable);
