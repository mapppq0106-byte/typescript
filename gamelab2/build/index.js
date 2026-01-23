"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function shuffle() {
    return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        let data = yield res.json();
        let doubleData = [...data.results, ...data.results];
        let pokemonPromises = doubleData.map((pokemon) => __awaiter(this, void 0, void 0, function* () {
            let res = yield fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            let data = yield res.json();
            return data;
        }));
        let pokemonArr = yield Promise.all(pokemonPromises);
        let randomPokemon = pokemonArr.sort(() => Math.random() - 0.3);
        generatorPokemon(randomPokemon);
    });
}
function generatorPokemon(data) {
    const pokemonWapper = document.querySelector('.pokemonWrapper');
    const pokemon = data
        .map((pokemon) => `	
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
				</div>`)
        .join(' ');
    pokemonWapper.innerHTML = pokemon;
}
shuffle();
