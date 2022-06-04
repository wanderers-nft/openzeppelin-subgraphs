import {
	Approval       as ApprovalEvent,
	ApprovalForAll as ApprovalForAllEvent,
	Transfer       as TransferEvent,
} from '../../generated/erc721/IERC721'

import {
	DataLock as DataLockEvent,
	DataUnlock as DataUnlockEvent,
	DefaultStateUpdate as DefaultStateUpdateEvent,
	OverrideStateUpdate as OverrideStateUpdateEvent,
	SetData as SetDataEvent,
	Planet as PlanetContract,
} from '../../generated/planet/Planet'

import {
	fetchERC721,
	fetchERC721Token,
} from '../fetch/erc721'

import { handleApproval, handleTransfer } from './erc721'
import { fetchPlanet } from '../fetch/planet'
import { BigInt } from '@graphprotocol/graph-ts'
import { ERC721Token, Planet } from '../../generated/schema'

export function handlePlanetTransfer(event: TransferEvent): void {
	// call erc721's handletransfer in case we fire first
	handleTransfer(event)

	let contract = fetchERC721(event.address)
	if (contract == null) {
		return;
	}

	let token = fetchERC721Token(contract, event.params.tokenId)
	if (token == null) {
		return;
	}

	let planet = fetchPlanet(token)
	planet.save()
}

export function handlePlanetApproval(event: ApprovalEvent): void {
	handleApproval(event)

	let contract = fetchERC721(event.address)
	if (contract == null) {
		return;
	}

	let token = fetchERC721Token(contract, event.params.tokenId)
	if (token == null) {
		return;
	}

	let planet = fetchPlanet(token)
	planet.save()
}

export function handlePlanetDataLock(event: DataLockEvent): void {
	let contract = fetchERC721(event.address)
	if (contract == null) {
		return;
	}

	let token = fetchERC721Token(contract, event.params.id)
	if (token == null) {
		return;
	}

	let planet = fetchPlanet(token);
	planet.locked = true;
	planet.save();
}

export function handlePlanetDataUnlock(event: DataUnlockEvent): void {
	let contract = fetchERC721(event.address)
	if (contract == null) {
		return;
	}

	let token = fetchERC721Token(contract, event.params.id)
	if (token == null) {
		return;
	}

	let planet = fetchPlanet(token);
	planet.locked = false;
	planet.save();
	
}

export function handlePlanetDefaultStateUpdate(event: DefaultStateUpdateEvent): void {
	let planetContract = PlanetContract.bind(event.address);
	let defaultState = planetContract.defaultState();
  
	let contract = fetchERC721(event.address)
	if (contract == null) {
		return;
	}

	// Fetch every planet in the contract
	let tokens = contract.tokens;

	for (let i = 0; i < tokens.length; i++) {
		// Load token, fetch planet
		let token = ERC721Token.load(tokens[i]);
		if (!token) {
			continue;
		}
		let planet = fetchPlanet(token);

		// If planet does not have override enabled, update the state
		if (!planet.enabled) {
			planet.state = defaultState;
			planet.save();
		}
	}
}

export function handlePlanetOverrideStateUpdate(event: OverrideStateUpdateEvent): void {
	let contract = fetchERC721(event.address)
	if (contract == null) {
		return;
	}

	let token = fetchERC721Token(contract, event.params.tokenId)
	if (token == null) {
		return;
	}

	let planet = fetchPlanet(token);
	planet.enabled = event.params.enabled;
	
	if (planet.enabled) {
		planet.state = event.params.state;
	}

	planet.save();
	
}

export function handlePlanetSetData(event: SetDataEvent): void {
	let contract = fetchERC721(event.address)
	if (contract == null) {
		return;
	}

	let token = fetchERC721Token(contract, event.params.id)
	if (token == null) {
		return;
	}

	let planet = fetchPlanet(token);
	planet.name = event.params.name;
	planet.description = event.params.description;
	planet.save();
}