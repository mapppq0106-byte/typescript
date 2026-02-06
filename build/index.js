"use strict";
var PokemonGame;
(function (PokemonGame) {
    /**
     * (CÂU 2): ABSTRACT CLASS
     * Được dịch thành class thường vì JS không có khái niệm abstract.
     */
    class BaseGame {
    }
    /**
     * (CÂU 2, 3): CLASS & INHERITANCE
     * Toàn bộ Generic <T> và Intersection Type đã bị loại bỏ.
     */
    class MemoryGame extends BaseGame {
        constructor() {
            super();
            this.flippedCards = [];
            this.matchedCount = 0;
            this.score = 0;
            this.apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10';
            this.totalPairs = 10;
            // Type Guard & fetchData đã được lược bỏ các định nghĩa kiểu của TS
            this.isPokemonDetail = (data) => {
                return data && 'id' in data && 'sprites' in data;
            };
            this.fetchData = async (url) => {
                const res = await fetch(url);
                if (!res.ok)
                    throw new Error("Lỗi kết nối API");
                return await res.json();
            };
            this.validateName = (name) => {
                const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                if (!name.trim())
                    return "Tên không được để trống.";
                if (name.trim().length <= 1)
                    return "Tên không được dùng 1 ký tự.";
                if (specialChars.test(name))
                    return "Tên không chứa ký tự đặc biệt.";
                return null;
            };
            this.updateScoreDisplay = () => {
                const scoreEl = document.querySelector('#score');
                if (scoreEl)
                    scoreEl.textContent = this.score.toString();
            };
            this.shuffle = async () => {
                this.matchedCount = 0;
                this.flippedCards = [];
                this.score = 0;
                this.updateScoreDisplay();
                try {
                    const data = await this.fetchData(this.apiUrl);
                    const doubleData = [...data.results, ...data.results];
                    const promises = doubleData.map(p => this.fetchData(`https://pokeapi.co/api/v2/pokemon/${p.name}`));
                    const pokemonArr = await Promise.all(promises);
                    const randomPokemon = pokemonArr.sort(() => Math.random() - 0.5);
                    this.renderCards(randomPokemon);
                }
                catch (error) {
                    console.error("Lỗi game:", error);
                }
            };
            this.renderCards = (data) => {
                const wrapper = document.querySelector('.pokemonWrapper');
                if (!wrapper)
                    return;
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
                        this.score += 100;
                        this.updateScoreDisplay();
                        this.flippedCards = [];
                        if (this.matchedCount === this.totalPairs) {
                            setTimeout(() => alert(`Chúc mừng! Bạn thắng với ${this.score} điểm!`), 500);
                        }
                    }
                    else {
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
                var _a, _b, _c;
                (_a = document.querySelector('#start-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                    const nameInput = document.querySelector('#username');
                    const errorEl = document.querySelector('#error-message');
                    const err = this.validateName(nameInput.value);
                    if (err) {
                        errorEl.innerText = err;
                    }
                    else {
                        const currentPlayerEl = document.querySelector('#current-player');
                        if (currentPlayerEl)
                            currentPlayerEl.textContent = nameInput.value;
                        document.querySelector('#login-screen').style.display = 'none';
                        document.querySelector('#game-container').style.display = 'block';
                        this.shuffle();
                    }
                });
                (_b = document.querySelector('#cancel-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
                    document.querySelector('#login-screen').style.display = 'flex';
                    document.querySelector('#game-container').style.display = 'none';
                    document.querySelector('#username').value = "";
                });
                (_c = document.querySelector('#reset-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.shuffle());
            };
            this.initEvents();
        }
        /**
         * (CÂU 6): EXPRESS ROUTE
         */
        setupRoutes(app) {
            app.get('/api/score', (req, res) => {
                res.json({ currentScore: this.score });
            });
        }
    }
    // Gán class vào namespace để có thể truy cập từ bên ngoài
    PokemonGame.MemoryGame = MemoryGame;
})(PokemonGame || (PokemonGame = {}));

// Khởi tạo game
new PokemonGame.MemoryGame();