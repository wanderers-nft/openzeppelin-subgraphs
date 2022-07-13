import {
	DelegationApproval as DelegationApprovalEvent
} from '../../generated/delegation/Delegation'
import { fetchAccount } from '../fetch/account'
import { fetchERC721Delegator } from '../fetch/delegation';
import { fetchERC721 } from '../fetch/erc721'

export function handleDelegationApproval(event: DelegationApprovalEvent): void {
	let contract = fetchERC721(event.address);
	if (contract != null) {
		let owner = fetchAccount(event.params.owner);
		let operator = fetchAccount(event.params.operator);
		let delegation = fetchERC721Delegator(contract, owner, operator);

		delegation.approved = event.params.approved
		delegation.save()
	}
}
