export const pokemonImageMap = {
  "39": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/jigglypuff.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/039.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png"
  ],
  "54": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/psyduck.png", 
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/054.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png"
  ],
  "104": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/cubone.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/104.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png"
  ],
  "113": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/chansey.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/113.png", 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png"
  ],
  "131": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/lapras.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/131.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png"
  ],
  "132": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/ditto.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/132.png", 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png"
  ],
  "133": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/eevee.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/133.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png"
  ],
  "144": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/articuno.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/144.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png"
  ],
  "145": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/zapdos.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/145.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png"
  ],
  "146": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/moltres.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/146.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png"
  ],
  "150": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/mewtwo.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/150.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png"
  ],
  "151": [
    "https://img.pokemondb.net/sprites/ruby-sapphire/normal/mew.png",
    "https://assets.pokemon.com/assets/cms2/img/pokedx/detail/151.png", 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png"
  ]
}

export function getSpecificPokemonImage(id) {
  const specificUrls = pokemonImageMap[id.toString()]
  if (specificUrls && specificUrls.length > 0) {
    return specificUrls[0]
  }
  
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export function getAlternativeUrls(id) {
  const specificUrls = pokemonImageMap[id.toString()]
  if (specificUrls) {
    return specificUrls
  }
  
  return [
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    `https://assets.pokemon.com/assets/cms2/img/pokedx/detail/${id.toString().padStart(3, '0')}.png`,
    `https://pokeres.bastionbot.org/images/pokemon/${id}.png`
  ]
}