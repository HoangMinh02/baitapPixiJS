import { Tile } from "./tile.js";
import * as PIXI from 'pixi.js';

export class Board {
    constructor(app, rows, cols, size, mineCount, onGameOver) {
        this.app = app; // Ứng dụng PIXI
        this.rows = rows; // Số hàng
        this.cols = cols; // Số cột
        this.size = size; // Kích thước mỗi ô
        this.mineCount = mineCount; // Số mìn trên bảng
        this.tiles = []; // Mảng chứa các ô

        this.container = new PIXI.Container(); // Tạo container cho bảng
        this.container.x = 20; // Vị trí x của bảng
        this.container.y = 20; // Vị trí y của bảng
        app.stage.addChild(this.container); // Thêm bảng vào stage
        this.onGameOver = onGameOver;

        this.container.x = (app.renderer.screen.width - cols * size) / 2; // Căn giữa bảng theo chiều ngang
        this.container.y = (app.renderer.screen.height - rows * size) / 2; // Căn giữa bảng theo chiều dọc
    }

    generate() {
        // Tạo lưới ô
        for (let row = 0; row < this.rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const tile = new Tile(row, col, this.size,
                    () => {if(this.onGameOver) this.onGameOver();}
                );
                tile.x = col * this.size; // Tính vị trí x
                tile.y = row * this.size; // Tính vị trí y

                tile.on("pointerdown", () => {
                    this.revealTile(row, col);
                });
                // this.onClick = () => this.revealTile(row, col); // Gán sự kiện click
                this.tiles[row][col] = tile; // Lưu ô vào mảng
                this.container.addChild(tile); // Thêm ô vào container
            }
        }

        // Đặt mìn ngẫu nhiên
        let minesPlaced = 0; // Đếm số mìn đã đặt
        while (minesPlaced < this.mineCount) {
            const row = Math.floor(Math.random() * this.rows); // Chọn hàng ngẫu nhiên
            const col = Math.floor(Math.random() * this.cols); // Chọn cột ngẫu nhiên
            if (!this.tiles[row][col].hasMine) {
                this.tiles[row][col].hasMine = true;
                minesPlaced++;
            }
        }

        // Đếm số mìn xung quanh cho mỗi ô
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(this.tiles[row][col].hasMine) continue; // Bỏ qua ô có mìn
                this.tiles[row][col].adjacentMines = this.countAdjacentMines(row, col); // Đếm mìn xung quanh
            }
        }
    }

    // Hàm đếm số mìn xung quanh một ô
    countAdjacentMines(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.rows && ny >= 0 && ny < this.cols) {
                    if (this.tiles[nx][ny].hasMine) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    // Hàm lật một ô
    revealTile(x, y) {
        const tile = this.tiles[x][y];
        if (tile.Revealed) return; // Nếu ô đã lật thì bỏ qua

        tile.reveal(); // Lật ô
        // if (tile.hasMine) {
        //     alert("Game Over! Bạn đã nhấn vào mìn."); // Thông báo thua cuộc
        //     return;
        // }

        // Nếu ô không có mìn và không có mìn xung quanh, lật các ô lân cận
        if (!tile.hasMine && tile.adjacentMines === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < this.rows && ny >= 0 && ny < this.cols) {
                        this.revealTile(nx, ny);
                    }
                }
            }
        }
    }
    

    // createTile(){
    //     for (let row = 0; row < this.rows; row++) {
    //         for (let col = 0; col < this.cols; col++) {
    //             const tile = new Tile(row, col, this.size, {
    //                 onRevealMine: () => this.onGameOver(),
    //             });
                
    //             this.container.addChild(tile);
    //         }
    //     }
    // }

}