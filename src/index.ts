// Sử dụng Namespace để quản lý module và tránh xung đột biến toàn cục
export namespace PokemonGame {
    
    // 2. Định nghĩa Interfaces
    export interface IPokemonSummary {
        name: string;
        url: string;
    }

    export interface IPokemonDetail {
        id: number;
        name: string;
        sprites: { front_default: string; };
    }

    // 2. Xây dựng class để quản lý chức năng (Logic game)
    export class MemoryGame {
        private flippedCards: HTMLElement[] = [];
        private matchedCount: number = 0;
        private readonly totalPairs: number = 10;
        private readonly apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10';

        constructor() {
            this.initEvents();
        }

        // Arrow function cho các phương thức để giữ đúng context 'this'
        private validateName = (name: string): string | null => {
            const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (!name.trim()) return "Tên không được để trống.";
            if (name.trim().length <= 1) return "Tên không được dùng 1 ký tự.";
            if (specialChars.test(name)) return "Tên không chứa ký tự đặc biệt.";
            return null;
        };

        public shuffle = async (): Promise<void> => {
            this.matchedCount = 0;
            this.flippedCards = [];
            
            try {
                const res = await fetch(this.apiUrl); // Gọi API để lấy danh sách 10 Pokemon đầu tiên
                const data = await res.json();
                // Nhân đôi dữ liệu để tạo thành các cặp bài giống nhau
                const doubleData = [...data.results, ...data.results];

                const promises = doubleData.map(async (p: IPokemonSummary) => {
                    // Gọi API chi tiết của từng con dựa trên tên để lấy link ảnh
                    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
                    return await r.json();
                });

                const pokemonArr: IPokemonDetail[] = await Promise.all(promises);
                //Thuật toán xáo trộn
                const randomPokemon = pokemonArr.sort(() => Math.random() - 0.5);
                this.renderCards(randomPokemon);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu Pokemon:", error);
            }
        };

        private renderCards = (data: IPokemonDetail[]): void => {
            const wrapper = document.querySelector('.pokemonWrapper') as HTMLElement;
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
                card.addEventListener('click', () => this.handleFlip(card as HTMLElement));
            });
        };

        private handleFlip = (card: HTMLElement): void => {
            if (card.classList.contains('flipped') || card.classList.contains('matched') || this.flippedCards.length === 2) return;
            // Trong phương thức handleFlip:
            card.classList.add('flipped'); // Thêm class 'flipped' để kích hoạt hiệu ứng lật (mở ảnh)
            this.flippedCards.push(card); // Đưa thẻ vừa lật vào mảng tạm để chờ so sánh

            if (this.flippedCards.length === 2) {
                const [c1, c2] = this.flippedCards;
                // Trong phương thức handleFlip, khi so sánh:
                if (c1.dataset.id === c2.dataset.id) {
                    c1.classList.add('matched');
                    c2.classList.add('matched');
                    this.matchedCount++;
                    this.flippedCards = [];
                    if (this.matchedCount === this.totalPairs) {
                        setTimeout(() => alert("Chúc mừng! Bạn đã thắng!"), 500);
                    }
                
                } else {
                    c1.classList.add('unmatched'); //Thêm hiệu ứng rung/lắc khi sai
                    c2.classList.add('unmatched');
                    setTimeout(() => {
                        // Xóa class 'flipped' để thẻ bài quay về trạng thái úp xuống ban đầu
                        c1.classList.remove('flipped', 'unmatched');
                        c2.classList.remove('flipped', 'unmatched');
                        this.flippedCards = []; // Reset mảng tạm để chọn lại
                    }, 1000); // đợi 1 giây
                }
            }
        };

        private initEvents = (): void => {
            // Sự kiện nút Bắt đầu
            document.querySelector('#start-btn')?.addEventListener('click', () => {
                const nameInput = document.querySelector('#username') as HTMLInputElement;
                const errorEl = document.querySelector('#error-message') as HTMLElement;
                const err = this.validateName(nameInput.value);

                if (err) {
                    errorEl.innerText = err;
                } else {
                    (document.querySelector('#login-screen') as HTMLElement).style.display = 'none';
                    (document.querySelector('#game-container') as HTMLElement).style.display = 'block';
                    this.shuffle();
                }
            });

            // Sự kiện nút Hủy
            document.querySelector('#cancel-btn')?.addEventListener('click', () => {
                (document.querySelector('#login-screen') as HTMLElement).style.display = 'flex';
                (document.querySelector('#game-container') as HTMLElement).style.display = 'none';
                (document.querySelector('#username') as HTMLInputElement).value = "";
            });

            // Sự kiện nút Reset
            document.querySelector('#reset-btn')?.addEventListener('click', () => this.shuffle());
        };
    }
}

// Khởi tạo game khi load trang
new PokemonGame.MemoryGame();