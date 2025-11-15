import { Board } from "./board.js";
import * as PIXI from "pixi.js";

export class Game {
    constructor(app) {
        this.app = app; // Ứng dụng PIXI
        this.board = null; // Bảng trò chơi
        this.newGameBtn = null; // Nút New Game
    }

    start() {
        this.createBoard(); // Tạo bảng
        this.createNewGameButton(); // Tạo nút New Game
        this.board.onGameOver = () => this.restart();
    }

    createBoard() {
        if (this.board) {
            this.app.stage.removeChild(this.board.container); // Xóa bảng cũ khỏi stage
        }
        this.board = new Board(this.app, 9, 9, 30, 10, () => {
            this.restart();
        }); // Tạo bảng 9x9 với 15 mìn
        this.board.generate(); // Tạo bảng
   }

    createNewGameButton() {

        if (this.newGameBtn) return;

        this.newGameBtn = new PIXI.Container();
        this.app.stage.addChild(this.newGameBtn);

        const graphics = new PIXI.Graphics();
        graphics.rect(0, 0, 120, 40)
            .fill({color: 0x4285f4}) // Màu nền nút
            .stroke({color: 0x000000, width: 1}); // Màu viền nút
        this.newGameBtn.addChild(graphics);

        // Thêm text vào giữa nút
        const text = new PIXI.Text({
            text: "New Game",
            style: { 
                fontSize: 18, 
                fill: 0xFFF9C4, 
                // fontWeight: "bold" 
            }
        });
        text.anchor.set(0.5);
        text.x = 120 / 2;
        text.y = 40 / 2;
        this.newGameBtn.addChild(text);

        const boardWidth = this.board.cols * this.board.size;
        const boardHeight = this.board.rows * this.board.size;
        const centerX = this.app.renderer.width / 2;

        this.newGameBtn.x = centerX - 60; // Căn giữa nút theo chiều ngang
        this.newGameBtn.y = this.board.container.y + boardHeight + 70; // Đặt nút bên dưới bảng với khoảng cách 20px

        this.newGameBtn.interactive = true; // Kích hoạt tương tác
        this.newGameBtn.cursor = "pointer"; // Thay đổi con trỏ chuột khi hover

        this.newGameBtn.on("pointerdown", () => {
            this.restart();
        });

        this.app.stage.addChild(this.newGameBtn);
    }

    restart() {
        this.createBoard();
    }

}