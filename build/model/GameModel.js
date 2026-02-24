var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * [EXPORT] Xuất Namespace để các thành phần khác có thể sử dụng
 */
export var AppMemoryGame;
(function (AppMemoryGame) {
    /**
     * [ABSTRACT] & [CLASS] Lớp cơ sở quản lý các thuộc tính chung
     */
    class BaseModel {
        constructor() {
            this.score = 0;
        }
        updateScore(points) {
            this.score += points;
        }
    }
    /**
     * [CLASS] & [EXTENDS] GameModel kế thừa logic từ BaseModel
     */
    class GameModel extends BaseModel {
        constructor() {
            super(...arguments);
            this.matchedCount = 0;
            this.totalPairs = 10;
            this.apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10';
        }
        /**
         * [GENERIC] Hàm fetch dữ liệu dùng chung
         * <T> giúp hàm này có thể trả về đúng kiểu dữ liệu mong muốn khi gọi
         */
        fetchData(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(url);
                if (!res.ok)
                    throw new Error("Lỗi kết nối API");
                return yield res.json();
            });
        }
        fetchPokemons() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Sử dụng [GENERIC] để lấy danh sách Pokemon cơ bản
                    const data = yield this.fetchData(this.apiUrl);
                    // Nhân đôi danh sách để tạo cặp
                    const doubleData = [...data.results, ...data.results];
                    // Sử dụng [GENERIC] để lấy chi tiết hình ảnh cho từng Pokemon
                    const promises = doubleData.map(p => this.fetchData(`https://pokeapi.co/api/v2/pokemon/${p.name}`));
                    const pokemonArr = yield Promise.all(promises);
                    // Trộn ngẫu nhiên
                    return pokemonArr.sort(() => Math.random() - 0.5);
                }
                catch (error) {
                    console.error("Lỗi lấy dữ liệu từ API:", error);
                    return [];
                }
            });
        }
        resetState() {
            this.score = 0; // Thuộc tính [EXTENDS] từ BaseModel
            this.matchedCount = 0;
        }
    }
    AppMemoryGame.GameModel = GameModel;
})(AppMemoryGame || (AppMemoryGame = {}));
