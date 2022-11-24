import {Address, BigInt, Bytes, ethereum} from '@graphprotocol/graph-ts';
import {createMockedFunction, newMockEvent} from 'matchstick-as';

import {
  VoteSettingsUpdated,
  VoteCast,
  ProposalCreated,
  ProposalExecuted
} from '../../generated/templates/ERC20Voting/ERC20Voting';
import {ERC20VotingProposal} from '../../generated/schema';
import {
  ADDRESS_ONE,
  DAO_ADDRESS,
  PROPOSAL_ENTITY_ID,
  PROPOSAL_ID,
  VOTING_ADDRESS,
  CREATED_AT,
  END_DATE,
  MIN_SUPPORT,
  MIN_TURNOUT,
  SNAPSHOT_BLOCK,
  START_DATE,
  VOTING_POWER
} from '../constants';

// events

export function createNewProposalCreatedEvent(
  proposalId: string,
  creator: string,
  description: string,
  contractAddress: string
): ProposalCreated {
  let createProposalCreatedEvent = changetype<ProposalCreated>(newMockEvent());

  createProposalCreatedEvent.address = Address.fromString(contractAddress);
  createProposalCreatedEvent.parameters = [];

  let proposalIdParam = new ethereum.EventParam(
    'proposalId',
    ethereum.Value.fromSignedBigInt(BigInt.fromString(proposalId))
  );
  let creatorParam = new ethereum.EventParam(
    'creator',
    ethereum.Value.fromAddress(Address.fromString(creator))
  );
  let descriptionParam = new ethereum.EventParam(
    'description',
    ethereum.Value.fromBytes(Bytes.fromUTF8(description))
  );

  createProposalCreatedEvent.parameters.push(proposalIdParam);
  createProposalCreatedEvent.parameters.push(creatorParam);
  createProposalCreatedEvent.parameters.push(descriptionParam);

  return createProposalCreatedEvent;
}

export function createNewVoteCastEvent(
  proposalId: string,
  voter: string,
  choice: string,
  votingPower: string,
  contractAddress: string
): VoteCast {
  let createProposalCastEvent = changetype<VoteCast>(newMockEvent());

  createProposalCastEvent.address = Address.fromString(contractAddress);
  createProposalCastEvent.parameters = [];

  let proposalIdParam = new ethereum.EventParam(
    'proposalId',
    ethereum.Value.fromSignedBigInt(BigInt.fromString(proposalId))
  );
  let voterParam = new ethereum.EventParam(
    'voter',
    ethereum.Value.fromAddress(Address.fromString(voter))
  );
  let choiceParam = new ethereum.EventParam(
    'choice',
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(choice))
  );
  let stakeParam = new ethereum.EventParam(
    'votingPower',
    ethereum.Value.fromSignedBigInt(BigInt.fromString(votingPower))
  );

  createProposalCastEvent.parameters.push(proposalIdParam);
  createProposalCastEvent.parameters.push(voterParam);
  createProposalCastEvent.parameters.push(choiceParam);
  createProposalCastEvent.parameters.push(stakeParam);

  return createProposalCastEvent;
}

export function createNewProposalExecutedEvent(
  proposalId: string,
  contractAddress: string
): ProposalExecuted {
  let createProposalExecutedEvent = changetype<ProposalExecuted>(
    newMockEvent()
  );

  createProposalExecutedEvent.address = Address.fromString(contractAddress);
  createProposalExecutedEvent.parameters = [];

  let proposalIdParam = new ethereum.EventParam(
    'proposalId',
    ethereum.Value.fromSignedBigInt(BigInt.fromString(proposalId))
  );
  let execResultsParam = new ethereum.EventParam(
    'execResults',
    ethereum.Value.fromBytesArray([Bytes.fromUTF8('')])
  );

  createProposalExecutedEvent.parameters.push(proposalIdParam);
  createProposalExecutedEvent.parameters.push(execResultsParam);

  return createProposalExecutedEvent;
}

export function createNewVoteSettingsUpdatedEvent(
  relativeSupportThresholdPct: string,
  totalSupportThresholdPct: string,
  minDuration: string,
  contractAddress: string
): VoteSettingsUpdated {
  let newVoteSettingsUpdatedEvent = changetype<VoteSettingsUpdated>(
    newMockEvent()
  );

  newVoteSettingsUpdatedEvent.address = Address.fromString(contractAddress);
  newVoteSettingsUpdatedEvent.parameters = [];

  let totalSupportThresholdPctParam = new ethereum.EventParam(
    'totalSupportThresholdPct',
    ethereum.Value.fromSignedBigInt(BigInt.fromString(totalSupportThresholdPct))
  );
  let relativeSupportThresholdPctParam = new ethereum.EventParam(
    'relativeSupportThresholdPct',
    ethereum.Value.fromSignedBigInt(
      BigInt.fromString(relativeSupportThresholdPct)
    )
  );
  let minDurationParam = new ethereum.EventParam(
    'minDuration',
    ethereum.Value.fromSignedBigInt(BigInt.fromString(minDuration))
  );

  newVoteSettingsUpdatedEvent.parameters.push(totalSupportThresholdPctParam);
  newVoteSettingsUpdatedEvent.parameters.push(relativeSupportThresholdPctParam);
  newVoteSettingsUpdatedEvent.parameters.push(minDurationParam);

  return newVoteSettingsUpdatedEvent;
}

// calls

export function getProposalCountCall(
  contractAddress: string,
  returns: string
): void {
  createMockedFunction(
    Address.fromString(contractAddress),
    'proposalCount',
    'proposalCount():(uint256)'
  )
    .withArgs([])
    .returns([ethereum.Value.fromSignedBigInt(BigInt.fromString(returns))]);
}

// state

export function createERC20VotingProposalEntityState(
  entityID: string = PROPOSAL_ENTITY_ID,
  dao: string = DAO_ADDRESS,
  pkg: string = VOTING_ADDRESS,
  creator: string = ADDRESS_ONE,
  proposalId: string = PROPOSAL_ID,
  startDate: string = START_DATE,
  endDate: string = END_DATE,
  snapshotBlock: string = SNAPSHOT_BLOCK,
  relativeSupportThresholdPct: string = MIN_SUPPORT,
  totalSupportThresholdPct: string = MIN_TURNOUT,
  totalVotingPower: string = VOTING_POWER,
  createdAt: string = CREATED_AT,
  open: boolean = true,
  executable: boolean = false,
  executed: boolean = false
): ERC20VotingProposal {
  let erc20VotingProposal = new ERC20VotingProposal(entityID);
  erc20VotingProposal.dao = Address.fromString(dao).toHexString();
  erc20VotingProposal.plugin = Address.fromString(pkg).toHexString();
  erc20VotingProposal.proposalId = BigInt.fromString(proposalId);
  erc20VotingProposal.creator = Address.fromString(creator);

  erc20VotingProposal.startDate = BigInt.fromString(startDate);
  erc20VotingProposal.endDate = BigInt.fromString(endDate);
  erc20VotingProposal.snapshotBlock = BigInt.fromString(snapshotBlock);
  erc20VotingProposal.relativeSupportThresholdPct = BigInt.fromString(
    relativeSupportThresholdPct
  );
  erc20VotingProposal.totalSupportThresholdPct = BigInt.fromString(
    totalSupportThresholdPct
  );
  erc20VotingProposal.totalVotingPower = BigInt.fromString(totalVotingPower);
  erc20VotingProposal.open = open;
  erc20VotingProposal.executable = executable;
  erc20VotingProposal.executed = executed;
  erc20VotingProposal.createdAt = BigInt.fromString(createdAt);
  erc20VotingProposal.save();

  return erc20VotingProposal;
}
