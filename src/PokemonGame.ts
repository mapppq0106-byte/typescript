/**
 * 5) NAMESPACE & MODULE: 
 * - 'namespace PokemonGame': Nhóm các thành phần liên quan để tránh xung đột tên
 * - 'export': Cho phép các file khác import và sử dụng các thành phần này
 */
export namespace PokemonGame {

    /**
     * 3) GENERIC:
     * - 'ApiResponse<T>': Sử dụng tham số loại <T> để có thể đại diện cho bất kỳ kiểu dữ liệu nào 
     * trả về từ API, giúp tái sử dụng code linh hoạt.
     */
    type ApiResponse<T> = {
        results: T[];
    };

    /**
     * 2) INTERFACE:
     * - Định nghĩa cấu trúc (shape) của dữ liệu Pokemon, đóng vai trò như một bản thiết kế 
     * để các đối tượng khác tuân thủ theo
     */
    export interface IPokemonSummary {
        name: string;
        url: string;
    }

    export interface IPokemonDetail {
        id: number;
        name: string;
        sprites: { front_default: string };
    }

    /**
     * 3) INTERSECTION TYPE:
     * - Sử dụng toán tử '&' để kết hợp 'IPokemonDetail' với một thuộc tính mới.
     * - Đối tượng kiểu 'CapturedPokemon' phải có đầy đủ thuộc tính của cả hai.
     */
    export type CapturedPokemon = IPokemonDetail & { capturedDate: Date };

    /**
     * 2) ABSTRACT CLASS (Lớp trừu tượng):
     * - Đóng vai trò làm lớp cha (base class), định nghĩa các phương thức bắt buộc 
     * mà các lớp con phải triển khai (shuffle)
     */
    abstract class BaseGame {
        protected abstract readonly apiUrl: string; 
        public abstract shuffle(): Promise<void>;
    }

    /**
     * 2) CLASS & INHERITANCE (Kế thừa):
     * - 'MemoryGame' sử dụng 'extends' để kế thừa toàn bộ thuộc tính từ 'BaseGame'
     */
    export class MemoryGame extends BaseGame {
        private flippedCards: HTMLElement[] = []; 
        private matchedCount: number = 0; 
        private score: number = 0; 
        
        protected readonly apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10';
        private readonly totalPairs: number = 10; 

        constructor() {
            super(); // Gọi constructor của lớp cha
            this.initEvents();
        }

        /**
         * 6) ROUTE (Sử dụng Express):
         * - 'app.get': Định nghĩa một đường dẫn API (/api/score).
         * - Khi truy cập, server sẽ trả về điểm số hiện tại dưới dạng JSON.
         */
        public setupRoutes(app: any) {
            app.get('/api/score', (req: any, res: any) => {
                res.json({ currentScore: this.score });
            });
        }

        private validateName = (name: string): string | null => {
            const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (!name.trim()) return "Tên không được để trống.";
            if (name.trim().length <= 1) return "Tên không được dùng 1 ký tự.";
            if (specialChars.test(name)) return "Tên không chứa ký tự đặc biệt.";
            return null;
        };

        /**
         * 3) GENERIC trong Function:
         * - '<T>': Cho phép hàm 'fetchData' trả về bất kỳ kiểu dữ liệu nào được chỉ định khi gọi.
         */
        private fetchData = async <T>(url: string): Promise<T> => {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Lỗi kết nối API");
            return await res.json() as T; 
        };

        private updateScoreDisplay = (): void => {
            const scoreEl = document.querySelector('#score');
            if (scoreEl) scoreEl.textContent = this.score.toString();
        };

        // Hàm shuffle() thực hiện việc đưa các thông số về ban đầu và xáo trộn dữ liệu.
        public shuffle = async (): Promise<void> => {
            this.matchedCount = 0;      // Đặt lại số cặp đã tìm thấy về 0
            this.flippedCards = [];     // Xóa danh sách các thẻ đang lật dở
            this.score = 0;             // Đặt lại điểm số về 0
            this.updateScoreDisplay();  // Cập nhật điểm số 0 lên giao diện người dùng
            
            try {
                // Sử dụng Generic để ép kiểu dữ liệu trả về từ API
                const data = await this.fetchData<ApiResponse<IPokemonSummary>>(this.apiUrl);
                // Tạo mảng gấp đôi dữ liệu (vì mỗi Pokemon cần có 2 thẻ giống nhau để tạo thành 1 cặp)
                const doubleData = [...data.results, ...data.results];
                // Lấy chi tiết hình ảnh cho từng Pokemon
                const promises = doubleData.map(p => 
                    this.fetchData<IPokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
                );

                /**
                 * 3. LOGIC ĐẢO LỘN HÌNH (SHUFFLE):
                 * Sử dụng hàm sort() kết hợp với Math.random() - 0.5.
                 * Cách này sẽ sắp xếp mảng một cách ngẫu nhiên, làm cho vị trí các tấm hình thay đổi mỗi khi Reset.
                 */
                const pokemonArr = await Promise.all(promises);
                const randomPokemon = pokemonArr.sort(() => Math.random() - 0.5); 
                // 4. HIỂN THỊ: Vẽ lại các thẻ bài đã được xáo trộn lên màn hình
                this.renderCards(randomPokemon);
            } catch (error) {
                console.error("Lỗi game:", error);
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
            // Kiểm tra nếu thẻ đã lật, đã khớp hoặc đang lật dở 2 thẻ thì không làm gì cả
            if (card.classList.contains('flipped') || card.classList.contains('matched') || this.flippedCards.length === 2) return;
            
            card.classList.add('flipped');
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                const [c1, c2] = this.flippedCards;

                // So sánh ID của 2 thẻ vừa lật
                if (c1.dataset.id === c2.dataset.id) {
                    c1.classList.add('matched');
                    c2.classList.add('matched');
                    this.matchedCount++;

                    /**
                     * ĐOẠN CODE TÍNH ĐIỂM CHÍNH:
                     * 1. Cộng dồn: Mỗi khi tìm đúng 1 cặp (matched), thuộc tính 'score' sẽ tăng thêm 100 điểm.
                     * 2. Cập nhật: Gọi hàm 'updateScoreDisplay()' để hiển thị điểm số mới nhất lên màn hình (UI).
                     */
                    this.score += 100; 
                    this.updateScoreDisplay();

                    this.flippedCards = [];

                    // Kiểm tra nếu đã tìm đủ tất cả các cặp thẻ
                    if (this.matchedCount === this.totalPairs) {
                        setTimeout(() => alert(`Chúc mừng! Bạn thắng với ${this.score} điểm!`), 500);
                    }
                } else {
                    // Nếu không khớp thì lật ngược lại sau 1 giây
                    setTimeout(() => {
                        c1.classList.remove('flipped');
                        c2.classList.remove('flipped');
                        this.flippedCards = [];
                    }, 1000);
                }
            }
        };

        private initEvents = (): void => {
            document.querySelector('#start-btn')?.addEventListener('click', () => {
                const nameInput = document.querySelector('#username') as HTMLInputElement;
                const errorEl = document.querySelector('#error-message') as HTMLElement;
                const err = this.validateName(nameInput.value);

                if (err) {
                    errorEl.innerText = err;
                } else {
                    const currentPlayerEl = document.querySelector('#current-player');
                    if (currentPlayerEl) currentPlayerEl.textContent = nameInput.value;

                    (document.querySelector('#login-screen') as HTMLElement).style.display = 'none';
                    (document.querySelector('#game-container') as HTMLElement).style.display = 'block';
                    this.shuffle();
                }
            });
            //Khi người dùng nhấn vào nút có id là 'reset-btn', hàm shuffle() ở trên sẽ được gọi.
            document.querySelector('#reset-btn')?.addEventListener('click', () => this.shuffle());
        };
    }
}

// Khởi tạo đối tượng từ class đã định nghĩa trong Namespace
new PokemonGame.MemoryGame();