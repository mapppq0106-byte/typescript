interface Pokemons {
	name: string;
	url: string;
}

interface Pokemon {
	id: number;
	name: string;
	sprites: {
		front_default: string;
	};
}

async function shuffle() {
	let res: Response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
	let data: any = await res.json();

	let doubleData = [...data.results, ...data.results];

	let pokemonPromises = doubleData.map(async (pokemon: Pokemons) => {
		let res: Response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
		);
		let data: any = await res.json();
		return data;
	});

	let pokemonArr = await Promise.all(pokemonPromises);
	let randomPokemon = pokemonArr.sort(() => Math.random() - 0.3);
	generatorPokemon(randomPokemon);
}

function generatorPokemon(data: any[]) {
	const pokemonWapper = document.querySelector(
		'.pokemonWrapper'
	) as HTMLElement;
	const pokemon = data
		.map(
			(pokemon: Pokemon) => `	
			<div class="pokemon ">
					<div class="pokemon-card"> 
							<div class="card-face front"></div>
							<div class="card-face back">
								<img
								src="${pokemon.sprites.front_default}"
								alt=""
								class=""
							/>
							</div>
							<span class="id">#$${pokemon.id}</span>
					</div>
				</div>`
		)
		.join(' ');
	pokemonWapper.innerHTML = pokemon;
}

shuffle();
