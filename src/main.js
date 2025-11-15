import * as PIXI from 'pixi.js';
import { Game } from "./game.js";

const app = new PIXI.Application(); // Tạo ứng dụng PIXI

// Thiết lập kích thước và màu nền
await app.init ({
    width: 600,
    height: 600,
    backgroundColor: 0x1099bb, // Màu nền xanh dương
});

document.body.appendChild(app.canvas); // Thêm canvas vào body

const game = new Game(app); // Tạo đối tượng game
game.start(); // Bắt đầu game