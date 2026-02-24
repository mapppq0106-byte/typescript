export var AppMemoryGame;
(function (AppMemoryGame) {
    /**
     * [CLASS] GameView chịu trách nhiệm quản lý hiển thị và tương tác DOM
     */
    class GameView {
        constructor() {
            // Truy vấn các phần tử giao diện cần thiết
            this.wrapper = document.querySelector('.pokemonWrapper');
            this.scoreEl = document.querySelector('#score');
        }
        /**
         * [GENERIC] Render danh sách thẻ bài
         * <T extends M.IPokemonDetail> đảm bảo dữ liệu truyền vào có ít nhất các thuộc tính của Pokemon
         */
        renderCards(data, handleFlip) {
            if (!this.wrapper)
                return;
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
                card.addEventListener('click', () => handleFlip(card));
            });
        }
        updateScore(score) {
            if (this.scoreEl) {
                this.scoreEl.textContent = score.toString();
            }
        }
        /**
         * [GENERIC] Hiển thị thông báo linh hoạt
         * <T> cho phép truyền vào bất kỳ kiểu dữ liệu nào có thể chuyển thành chuỗi
         */
        showAlert(message) {
            // Sử dụng setTimeout để đảm bảo hiệu ứng lật thẻ hoàn tất
            setTimeout(() => alert(String(message)), 500);
        }
    }
    AppMemoryGame.GameView = GameView;
})(AppMemoryGame || (AppMemoryGame = {}));
