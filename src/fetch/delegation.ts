import {
	Account,
	ERC721Contract,
	ERC721Delegator,
} from '../../generated/schema'

export function fetchERC721Delegator(contract: ERC721Contract, owner: Account, operator: Account): ERC721Delegator {
	let id = contract.id.toHex().concat('/').concat(owner.id.toHex()).concat('/').concat(operator.id.toHex())
	let op = ERC721Delegator.load(id)

	if (op == null) {
		op          = new ERC721Delegator(id)
		op.contract = contract.id
		op.owner    = owner.id
		op.deleagor = operator.id
	}

	return op as ERC721Delegator
}
