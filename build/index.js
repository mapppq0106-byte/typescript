"use strict";
var PokemonGame;
(function (PokemonGame) {
    class MemoryGame {
        constructor() {
            this.flippedCards = [];
            this.matchedCount = 0;
            this.totalPairs = 10;
            this.apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10';
            
            // Arrow functions giúp giữ vững ngữ cảnh 'this'
            this.validateName = (name) => {
                const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (!name.trim()) return "Tên không được để trống.";
                if (name.trim().length <= 1) return "Tên không được dùng 1 ký tự.";
                if (specialChars.test(name)) return "Tên không chứa ký tự đặc biệt.";
                return null;
            };

            this.shuffle = async () => {
                this.matchedCount = 0;
                this.flippedCards = [];
                try {
                    const res = await fetch(this.apiUrl);
                    const data = await res.json();
                    const doubleData = [...data.results, ...data.results];
                    const promises = doubleData.map(async (p) => {
                        const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
                        return await r.json();
                    });
                    const pokemonArr = await Promise.all(promises);
                    const randomPokemon = pokemonArr.sort(() => Math.random() - 0.5);
                    this.renderCards(randomPokemon);
                } catch (error) {
                    console.error("Lỗi:", error);
                }
            };

            this.renderCards = (data) => {
                const wrapper = document.querySelector('.pokemonWrapper');
                if (!wrapper) return;
                wrapper.innerHTML = data.map((p) => `
                    <div class="pokemon" data-id="${p.id}">
                        <div class="pokemon-card"> 
                            <div class="card-face front"></div>
                            <div class="card-face back">
                                <img src="${p.sprites.front_default}" alt="${p.name}" />
                            </div>
                            <span class="id">#${p.id}</span>
                        </div>
                    </div>
                `).join('');
                document.querySelectorAll('.pokemon').forEach(card => {
                    card.addEventListener('click', () => this.handleFlip(card));
                });
            };

            this.handleFlip = (card) => {
                if (card.classList.contains('flipped') || card.classList.contains('matched') || this.flippedCards.length === 2)
                    return;
                card.classList.add('flipped');
                this.flippedCards.push(card);
                if (this.flippedCards.length === 2) {
                    const [c1, c2] = this.flippedCards;
                    if (c1.dataset.id === c2.dataset.id) {
                        c1.classList.add('matched');
                        c2.classList.add('matched');
                        this.matchedCount++;
                        this.flippedCards = [];
                        if (this.matchedCount === this.totalPairs) {
                            setTimeout(() => alert("Bạn đã thắng!"), 500);
                        }
                    } else {
                        c1.classList.add('unmatched');
                        c2.classList.add('unmatched');
                        setTimeout(() => {
                            c1.classList.remove('flipped', 'unmatched');
                            c2.classList.remove('flipped', 'unmatched');
                            this.flippedCards = [];
                        }, 1000);
                    }
                }
            };

            this.initEvents = () => {
                document.querySelector('#start-btn')?.addEventListener('click', () => {
                    const nameInput = document.querySelector('#username');
                    const errorEl = document.querySelector('#error-message');
                    const err = this.validateName(nameInput.value);
                    if (err) {
                        errorEl.innerText = err;
                    } else {
                        document.querySelector('#login-screen').style.display = 'none';
                        document.querySelector('#game-container').style.display = 'block';
                        this.shuffle();
                    }
                });
                document.querySelector('#cancel-btn')?.addEventListener('click', () => {
                    document.querySelector('#login-screen').style.display = 'flex';
                    document.querySelector('#game-container').style.display = 'none';
                    document.querySelector('#username').value = "";
                });
                document.querySelector('#reset-btn')?.addEventListener('click', () => this.shuffle());
            };

            this.initEvents();
        }
    }
    PokemonGame.MemoryGame = MemoryGame;
})(PokemonGame || (PokemonGame = {}));

// Khởi tạo ứng dụng
new PokemonGame.MemoryGame();