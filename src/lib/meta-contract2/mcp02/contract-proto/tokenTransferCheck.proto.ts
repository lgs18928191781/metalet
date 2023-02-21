import * as BN from '../../bn.js';
import * as mvc from '../../mvc';
import * as TokenUtil from '../../common/tokenUtil';
const NFT_ID_LEN = 20;
const NFT_CODE_HASH_LEN = 20;
const DATA_VERSION_LEN = 5;
const NFT_ID_OFFSET = DATA_VERSION_LEN + NFT_ID_LEN;
const NFT_CODE_HASH_OFFSET = NFT_ID_OFFSET + NFT_CODE_HASH_LEN;
//opreturn nSenders(4 bytes) + receiverTokenAmountArray + receiverArray + nReceivers(4 bytes) + tokenCodeHash + tokenID

export type FormatedDataPart = {
  nSenders?: number;
  receiverTokenAmountArray?: BN[];
  receiverArray?: mvc.Address[];
  nReceivers?: number;
  tokenCodeHash?: string;
  tokenID?: string;
};

export function newDataPart(dataPart: FormatedDataPart): Buffer {
  let nSendersBuf = TokenUtil.getUInt32Buf(dataPart.nSenders);
  let receiverTokenAmountArrayBuf = Buffer.alloc(0);
  dataPart.receiverTokenAmountArray.forEach((tokenAmount) => {
    receiverTokenAmountArrayBuf = Buffer.concat([
      receiverTokenAmountArrayBuf,
      tokenAmount.toBuffer({ endian: 'little', size: 8 }),
    ]);
  });
  let recervierArrayBuf = Buffer.alloc(0);
  dataPart.receiverArray.map((address) => {
    recervierArrayBuf = Buffer.concat([recervierArrayBuf, address.hashBuffer]);
  });
  let nReceiversBuf = TokenUtil.getUInt32Buf(dataPart.nReceivers);
  let tokenCodeHashBuf = Buffer.from(dataPart.tokenCodeHash, 'hex');
  let tokenIDBuf = Buffer.from(dataPart.tokenID, 'hex');
  const buf = Buffer.concat([
    nSendersBuf,
    receiverTokenAmountArrayBuf,
    recervierArrayBuf,
    nReceiversBuf,
    tokenCodeHashBuf,
    tokenIDBuf,
  ]);

  return TokenUtil.buildScriptData(buf);
}
