import { AppMemoryGame as M } from "../model/GameModel.js";

export namespace AppMemoryGame {

    export class GameView {
        // Truy vấn các phần tử giao diện cần thiết
        private wrapper = document.querySelector('.pokemonWrapper') as HTMLElement;
        private scoreEl = document.querySelector('#score') as HTMLElement;

        public renderCards<T extends M.IPokemonDetail>(data: T[], handleFlip: (card: HTMLElement) => void): void {
            if (!this.wrapper) return;
            
            // [INTERFACE] Sử dụng thuộc tính id, name, sprites từ interface IPokemonDetail
            this.wrapper.innerHTML = data.map((p) => `
                <div class="pokemon" data-id="${p.id}">
                    <div class="pokemon-card"> 
                        <div class="card-face front"></div>
                        <div class="card-face back">
                            <img src="${p.sprites.front_default}" alt="${p.name}" />
                        </div>
                    </div>
                </div>
            `).join('');

            // Lắng nghe sự kiện click
            this.wrapper.querySelectorAll('.pokemon').forEach(card => {
                card.addEventListener('click', () => handleFlip(card as HTMLElement));
            });
        }

        public updateScore(score: number): void {
            if (this.scoreEl) {
                this.scoreEl.textContent = score.toString();
            }
        }

        public showAlert<T>(message: T): void {
            // Sử dụng setTimeout để đảm bảo hiệu ứng lật thẻ hoàn tất
            setTimeout(() => alert(String(message)), 500);
        }
    }
}