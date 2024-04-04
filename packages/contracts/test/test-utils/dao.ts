import {
  DAO,
  ActionExecute__factory,
  ERC721Mock__factory,
  GovernanceERC20__factory,
  ERC1155Mock__factory,
  DAO__factory,
} from '../../typechain';
import {deployWithProxy} from './proxy';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {BigNumber} from 'ethers';
import {ethers} from 'hardhat';

export const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
export const daoExampleURI = 'https://example.com';

export const TOKEN_INTERFACE_IDS = {
  erc721ReceivedId: '0x150b7a02',
  erc1155ReceivedId: '0xf23a6e61',
  erc1155BatchReceivedId: '0xbc197c81',
  erc721InterfaceId: '0x150b7a02',
  erc1155InterfaceId: '0x4e2312e0',
};

export async function deployNewDAO(signer: SignerWithAddress): Promise<DAO> {
  const packLibrary = await ethers.getContractFactory(
    '@novaknole20/zodiac-modifier-roles/contracts/packers/Packer.sol:Packer'
  );
  const packLibraryD = await packLibrary.deploy();

  const packLibrary1 = await ethers.getContractFactory(
    '@novaknole20/zodiac-modifier-roles/contracts/Integrity.sol:Integrity'
  );
  const packLibrary2 = await packLibrary1.deploy();

  const factory = await ethers.getContractFactory('src/core/dao/DAO.sol:DAO', {
    libraries: {
      '@novaknole20/zodiac-modifier-roles/contracts/packers/Packer.sol:Packer':
        packLibraryD.address,
      '@novaknole20/zodiac-modifier-roles/contracts/Integrity.sol:Integrity':
        packLibrary2.address,
    },
  });
  const dao = await deployWithProxy<DAO>(factory);

  await dao.initialize(
    '0x00',
    signer.address,
    ethers.constants.AddressZero,
    daoExampleURI
  );

  return dao;
}

export async function getActions() {
  const signers = await ethers.getSigners();
  const ActionExecuteFactory = new ActionExecute__factory(signers[0]);
  let ActionExecute = await ActionExecuteFactory.deploy();
  const iface = new ethers.utils.Interface(ActionExecute__factory.abi);

  const num = 20;
  return {
    failAction: {
      to: ActionExecute.address,
      data: iface.encodeFunctionData('fail'),
      value: 0,
    },
    succeedAction: {
      to: ActionExecute.address,
      data: iface.encodeFunctionData('setTest', [num]),
      value: 0,
    },
    failActionMessage: ethers.utils
      .hexlify(ethers.utils.toUtf8Bytes('ActionExecute:Revert'))
      .substring(2),
    successActionResult: ethers.utils.hexZeroPad(ethers.utils.hexlify(num), 32),
  };
}

export function getERC721TransferAction(
  tokenAddress: string,
  from: string,
  to: string,
  tokenId: number,
  issafe: boolean = true
) {
  const iface = new ethers.utils.Interface(ERC721Mock__factory.abi);

  const functionName = issafe
    ? 'safeTransferFrom(address, address, uint256)'
    : 'transferFrom(address, address, uint256)';

  const encodedData = iface.encodeFunctionData(functionName, [
    from,
    to,
    tokenId,
  ]);

  return {
    to: tokenAddress,
    value: 0,
    data: encodedData,
  };
}

export function getERC20TransferAction(
  tokenAddress: string,
  to: string,
  amount: number | BigNumber
) {
  const iface = new ethers.utils.Interface(GovernanceERC20__factory.abi);

  const encodedData = iface.encodeFunctionData('transfer', [to, amount]);
  return {
    to: tokenAddress,
    value: 0,
    data: encodedData,
  };
}

export function getERC1155TransferAction(
  tokenAddress: string,
  from: string,
  to: string,
  tokenId: number,
  amount: number | BigNumber
) {
  const iface = new ethers.utils.Interface(ERC1155Mock__factory.abi);

  const encodedData = iface.encodeFunctionData('safeTransferFrom', [
    from,
    to,
    tokenId,
    amount,
    '0x',
  ]);

  return {
    to: tokenAddress,
    value: 0,
    data: encodedData,
  };
}
