import {
	BigInt,
} from '@graphprotocol/graph-ts'

import {
	ERC721Token,
	Planet,
} from '../../generated/schema'

export function fetchPlanet(token: ERC721Token): Planet {
    let planet = Planet.load(token.id)

	if (planet != null) {
		return planet as Planet;
	}

	// Initialise parameters (just make them empty for now)
	planet = new Planet(token.id)
	planet.token = token.id

	planet.name = ""
	planet.description = ""
	planet.locked = false
	planet.enabled = false
	planet.state = new BigInt(0)

	// Make sure inverse mapping is set too
	token.asPlanet = planet.id;
	token.save()
	
    return planet as Planet;
}
