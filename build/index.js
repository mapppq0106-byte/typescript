/**
 * [IMPORT] Nhập các Namespace từ các file thành phần Model, View, Controller.
 * Sử dụng bí danh (M, V, C) để truy cập các Class bên trong Namespace một cách ngắn gọn.
 */
import { AppMemoryGame as M } from "./model/GameModel.js";
import { AppMemoryGame as V } from "./views/GameView.js";
import { AppMemoryGame as C } from "./controllers/GameController.js";
/**
 * KHỞI TẠO CÁC THÀNH PHẦN THEO MÔ HÌNH MVC
 * Toàn bộ logic khởi tạo được thực hiện tại đây.
 */
// 1. [CLASS] Khởi tạo thực thể (Instance) từ lớp GameModel
// Lớp này quản lý dữ liệu Pokemon và logic tính điểm.
const model = new M.GameModel();
// 2. [CLASS] Khởi tạo thực thể (Instance) từ lớp GameView
// Lớp này quản lý việc render giao diện và hiển thị thông báo.
const view = new V.GameView();
/**
 * 3. [CLASS] Khởi tạo thực thể từ lớp GameController
 * [ROUTER] Controller đóng vai trò điều hướng chính.
 * Nó nhận vào Model và View để thiết lập mối quan hệ giữa dữ liệu và giao diện.
 */
const controller = new C.GameController(model, view);
/**
 * [GENERIC] Mặc dù trong file này không trực tiếp định nghĩa Generic,
 * nhưng các Instance trên sẽ sử dụng các phương thức Generic đã định nghĩa
 * bên trong các file thành phần khi trò chơi vận hành (ví dụ: fetchData<T>, getElement<T>).
 */
console.log("MVC Pokemon Game với Namespace, Extends và Generic đã sẵn sàng!");
