var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var AppMemoryGame;
(function (AppMemoryGame) {
    /**
     * [CLASS] & [ABSTRACT] Lớp cơ sở định nghĩa các quy tắc chung
     */
    class BaseController {
        /**
         * [GENERIC] Hàm hỗ trợ lấy DOM Element một cách an toàn
         * <T extends HTMLElement> đảm bảo kiểu dữ liệu trả về là một Element hợp lệ
         */
        getElement(selector) {
            const element = document.querySelector(selector);
            if (!element)
                throw new Error(`Không tìm thấy phần tử: ${selector}`);
            return element;
        }
        validatePlayerName(name) {
            if (!name || name.trim() === '') {
                throw new Error("Tên người chơi không được để trống.");
            }
        }
    }
    /**
     * [CLASS] & [EXTENDS] GameController kế thừa từ BaseController
     */
    class GameController extends BaseController {
        constructor(model, view) {
            super();
            this.model = model;
            this.view = view;
            this.flippedCards = [];
            this.initEvents();
        }
        initEvents() {
            var _a, _b, _c;
            // [ROUTER - Giả lập] Các sự kiện Click điều hướng trạng thái ứng dụng
            (_a = document.querySelector('#start-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => this.startGame());
            (_b = document.querySelector('#reset-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.startGame());
            (_c = document.querySelector('#cancel-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
                // Sử dụng hàm [GENERIC] getElement để lấy phần tử
                const loginScreen = this.getElement('#login-screen');
                const nameInput = this.getElement('#username');
                const playerNameDisplay = this.getElement('#current-player');
                const pokemonWrapper = this.getElement('.pokemonWrapper');
                loginScreen.style.display = 'flex';
                nameInput.value = '';
                playerNameDisplay.textContent = '---';
                pokemonWrapper.innerHTML = '';
                this.model.resetState();
                this.view.updateScore(0);
                this.flippedCards = [];
            });
        }
        startGame() {
            return __awaiter(this, void 0, void 0, function* () {
                const nameInput = this.getElement('#username');
                const playerNameDisplay = this.getElement('#current-player');
                const errorMessage = this.getElement('#error-message');
                try {
                    const playerName = nameInput.value.trim();
                    this.validatePlayerName(playerName);
                    playerNameDisplay.textContent = playerName;
                    errorMessage.textContent = "";
                    this.model.resetState();
                    this.view.updateScore(0);
                    const pokemons = yield this.model.fetchPokemons();
                    if (pokemons.length > 0) {
                        this.view.renderCards(pokemons, (card) => this.handleFlip(card));
                        this.getElement('#login-screen').style.display = 'none';
                    }
                }
                catch (e) {
                    errorMessage.textContent = e.message;
                }
            });
        }
        handleFlip(card) {
            if (card.classList.contains('flipped') || this.flippedCards.length === 2)
                return;
            card.classList.add('flipped');
            this.flippedCards.push(card);
            if (this.flippedCards.length === 2) {
                this.checkMatch();
            }
        }
        checkMatch() {
            const [c1, c2] = this.flippedCards;
            if (c1.dataset.id === c2.dataset.id) {
                c1.classList.add('matched');
                c2.classList.add('matched');
                this.model.matchedCount++;
                this.model.updateScore(100);
                this.view.updateScore(this.model.score);
                this.flippedCards = [];
                if (this.model.matchedCount === this.model.totalPairs) {
                    this.view.showAlert(`Chúc mừng! Bạn thắng với ${this.model.score} điểm!`);
                }
            }
            else {
                setTimeout(() => {
                    c1.classList.remove('flipped');
                    c2.classList.remove('flipped');
                    this.flippedCards = [];
                }, 1000);
            }
        }
    }
    AppMemoryGame.GameController = GameController;
})(AppMemoryGame || (AppMemoryGame = {}));
