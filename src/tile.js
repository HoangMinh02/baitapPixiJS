import * as PIXI from 'pixi.js';

export class Tile extends PIXI.Container {
    constructor(x, y, size, onGameOver) {
        super(); 
        this.x = x; // Vị trí x là tọa độ cột
        this.y = y; // Vi trí y là tọa độ hàng
        this.size = size; // Kích thước của ô

        this.hasMine = false; // Có mìn hay không
        this.flagged = false; // Đánh dấu cờ
        this.revealed = false; // Trang thái đã lật
        this.adjacentMines = 0; // Số mìn xung quanh 
        this.onGameOver = onGameOver;
        this.interactive = true; 

        // Tạo container để chứa các thành phần của ô
        this.sprite = new PIXI.Container();
        this.addChild(this.sprite);

        // Tạo nền cho ô
        this.bg = new PIXI.Graphics();
        this.drawHidden();
        this.sprite.addChild(this.bg);

        // Tạo văn bản hiển thị số mìn xung quanh
        this.text = new PIXI.Text({
            text: '',
            style: {
                fontSize: size * 0.6,
                fill: 0x000000,
                align: 'center',
            },
        });
        this.text.anchor.set(0.5); // Giữa văn bản
        this.text.x = size / 2; // Đặt vị trí x
        this.text.y = size / 2; // Đặt vị trí y
        this.sprite.addChild(this.text); // Thêm văn bản vào sprite

        // Sự kiện click chuột
        this.interactive = true; // Kích hoạt tương tác
        this.on('pointerdown', () => this.reveal()); // Gán sự kiện lật ô khi click
    }

    // Vẽ ô ở trạng thái ẩn
    drawHidden() {
        this.bg.clear(); // Xóa nội dung cũ
        this.bg.rect(0, 0, this.size, this.size) // Vẽ hình chữ nhật
            .fill({color: 0xeeeeee}) // Màu nền ô ẩn
            .stroke({color: 0x999999, width: 1}); // Màu viền ô
    }

    // Vẽ ô ở trạng thái đã hiện thị
    drawRevealed() {
        this.bg.clear(); // Xóa nội dung cũ
        this.bg.rect(0, 0, this.size, this.size) // Vẽ hình chữ nhật
            .fill({color: 0xeeeeee}) // Màu nền ô an toàn
            .stroke({color: 0x999999, width: 1}); // Màu viền ô
    }

    // Hiển thị mìn
    showMine() {
        this.drawRevealed(); // Vẽ ô đã hiện thị
        this.text.text = 'M'; // Hiển thị biểu tượng mìn
        this.text.style.fill = 0xff0000; // Màu đỏ cho biểu tượng mìn
    }

    // Hiển thị số mìn xung quanh
    showNumber(n) {
        this.drawRevealed(); // Vẽ ô đã hiện thị 
        this.text.text = n > 0 ? n.toString() : 'K'; // Hiển thị số mìn nếu có
        const colors = [0x0000ff, 0x008200, 0xfa0001, 0x000084, 0x840000, 0x008284, 0x840084, 0x000000];
        this.text.style.fill = colors[n - 1] || 0x000000; // Màu sắc theo số mìn
    }

    // Mở ô
    reveal() {
        if (this.revealed) return; // Nếu đã mở thì không làm gì
        this.revealed = true; // Đánh dấu là đã mở
        
        
        if (this.hasMine) {
            this.showMine(); // Hiển thị mìn nếu có
            
            setTimeout(() => {
                alert("Game Over!");
                this.onGameOver();
            }, 50);
            return;
     
        } else {
            this.showNumber(this.adjacentMines); // Hiển thị số mìn xung quanh
        }
    }
}