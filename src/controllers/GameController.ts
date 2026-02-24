import { AppMemoryGame as M } from "../model/GameModel.js";
import { AppMemoryGame as V } from "../views/GameView.js";

export namespace AppMemoryGame {
    abstract class BaseController {
        protected abstract initEvents(): void;
        protected getElement<T extends HTMLElement>(selector: string): T {
            const element = document.querySelector(selector);
            if (!element) throw new Error(`Không tìm thấy phần tử: ${selector}`);
            return element as T;
        }

        protected validatePlayerName(name: string): void {
            if (!name || name.trim() === '') {
                throw new Error("Tên người chơi không được để trống.");
            }
        }
    }

    export class GameController extends BaseController {
        private flippedCards: HTMLElement[] = [];

        constructor(private model: M.GameModel, private view: V.GameView) {
            super(); 
            this.initEvents();
        }

        protected initEvents(): void {
            // [ROUTER] Các sự kiện Click điều hướng trạng thái ứng dụng
            document.querySelector('#start-btn')?.addEventListener('click', () => this.startGame());
            document.querySelector('#reset-btn')?.addEventListener('click', () => this.startGame());

            document.querySelector('#cancel-btn')?.addEventListener('click', () => {
                // Sử dụng hàm [GENERIC] getElement để lấy phần tử
                const loginScreen = this.getElement<HTMLElement>('#login-screen');
                const nameInput = this.getElement<HTMLInputElement>('#username');
                const playerNameDisplay = this.getElement<HTMLElement>('#current-player');
                const pokemonWrapper = this.getElement<HTMLElement>('.pokemonWrapper');

                loginScreen.style.display = 'flex';
                nameInput.value = '';
                playerNameDisplay.textContent = '---';
                pokemonWrapper.innerHTML = '';

                this.model.resetState();
                this.view.updateScore(0);
                this.flippedCards = [];
            });
        }

        public async startGame(): Promise<void> {
            const nameInput = this.getElement<HTMLInputElement>('#username');
            const playerNameDisplay = this.getElement<HTMLElement>('#current-player');
            const errorMessage = this.getElement<HTMLElement>('#error-message');

            try {
                const playerName = nameInput.value.trim();
                this.validatePlayerName(playerName);

                playerNameDisplay.textContent = playerName;
                errorMessage.textContent = "";

                this.model.resetState();
                this.view.updateScore(0);

                const pokemons = await this.model.fetchPokemons();
                if (pokemons.length > 0) {
                    this.view.renderCards(pokemons, (card) => this.handleFlip(card));
                    this.getElement<HTMLElement>('#login-screen').style.display = 'none';
                }
            } catch (e: any) {
                errorMessage.textContent = e.message;
            }
        }

        private handleFlip(card: HTMLElement): void {
            if (card.classList.contains('flipped') || this.flippedCards.length === 2) return;
            card.classList.add('flipped');
            this.flippedCards.push(card);
            if (this.flippedCards.length === 2) {
                this.checkMatch();
            }
        }

        private checkMatch(): void {
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
            } else {
                setTimeout(() => {
                    c1.classList.remove('flipped');
                    c2.classList.remove('flipped');
                    this.flippedCards = [];
                }, 1000);
            }
        }
    }
}