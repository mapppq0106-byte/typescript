export namespace AppMemoryGame {

    abstract class BaseModel {
        public score: number = 0;

        public abstract resetState(): void;

        public updateScore(points: number): void {
            this.score += points;
        }
    }

    export interface IPokemonDetail {
        id: number;
        name: string;
        sprites: { front_default: string };
    }

    interface ApiResponse<T> {
        results: T[];
    }

    export class GameModel extends BaseModel {
        public matchedCount: number = 0;
        public readonly totalPairs: number = 10;
        private apiUrl: string = 'https://pokeapi.co/api/v2/pokemon?limit=10';

        private async fetchData<T>(url: string): Promise<T> {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Lỗi kết nối API");
            return await res.json() as T;
        }

        public async fetchPokemons(): Promise<IPokemonDetail[]> {
            try {
                // Sử dụng [GENERIC] để lấy danh sách Pokemon cơ bản
                const data = await this.fetchData<ApiResponse<{ name: string }>>(this.apiUrl);
                
                // Nhân đôi danh sách để tạo cặp
                const doubleData = [...data.results, ...data.results];
                
                // Sử dụng [GENERIC] để lấy chi tiết hình ảnh cho từng Pokemon
                const promises = doubleData.map(p => 
                    this.fetchData<IPokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
                );
                
                const pokemonArr = await Promise.all(promises);
                
                // Trộn ngẫu nhiên
                return pokemonArr.sort(() => Math.random() - 0.5);
            } catch (error) {
                console.error("Lỗi lấy dữ liệu từ API:", error);
                return [];
            }
        }

        public resetState(): void {
            this.score = 0; // Thuộc tính [EXTENDS] từ BaseModel
            this.matchedCount = 0;
        }
    }
}