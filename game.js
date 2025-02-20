class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 480;
        this.canvas.height = 320;

        // ゲーム要素の初期化
        this.paddleWidth = 75;
        this.paddleHeight = 10;
        this.ballRadius = 5;
        this.blockWidth = 50;
        this.blockHeight = 20;
        this.blockRows = 5;
        this.blockCols = 8;
        this.blockPadding = 10;
        this.blockOffsetTop = 30;
        this.blockOffsetLeft = 25;

        this.score = 0;
        this.gameStarted = false;
        this.gameOver = false;

        // イベントリスナーの設定
        document.addEventListener('mousemove', this.movePaddle.bind(this));
        document.getElementById('startButton').addEventListener('click', this.startGame.bind(this));

        // ゲーム要素の初期位置設定
        this.resetGame();
        this.createBlocks();
        this.draw();
    }

    resetGame() {
        this.paddle = {
            x: (this.canvas.width - this.paddleWidth) / 2,
            y: this.canvas.height - this.paddleHeight - 10
        };

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 30,
            dx: 3,
            dy: -3
        };

        this.score = 0;
        document.getElementById('scoreValue').textContent = this.score;
        this.gameOver = false;
    }

    createBlocks() {
        this.blocks = [];
        for (let row = 0; row < this.blockRows; row++) {
            this.blocks[row] = [];
            for (let col = 0; col < this.blockCols; col++) {
                this.blocks[row][col] = { 
                    x: col * (this.blockWidth + this.blockPadding) + this.blockOffsetLeft,
                    y: row * (this.blockHeight + this.blockPadding) + this.blockOffsetTop,
                    status: 1 
                };
            }
        }
    }

    movePaddle(e) {
        if (!this.gameStarted) return;
        
        const relativeX = e.clientX - this.canvas.offsetLeft;
        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.paddle.x = relativeX - this.paddleWidth / 2;
            
            // パドルが画面外に出ないように制限
            if (this.paddle.x < 0) {
                this.paddle.x = 0;
            }
            if (this.paddle.x + this.paddleWidth > this.canvas.width) {
                this.paddle.x = this.canvas.width - this.paddleWidth;
            }
        }
    }

    collisionDetection() {
        // ブロックとの衝突判定
        for (let row = 0; row < this.blockRows; row++) {
            for (let col = 0; col < this.blockCols; col++) {
                const block = this.blocks[row][col];
                if (block.status === 1) {
                    if (this.ball.x > block.x && 
                        this.ball.x < block.x + this.blockWidth &&
                        this.ball.y > block.y && 
                        this.ball.y < block.y + this.blockHeight) {
                        this.ball.dy = -this.ball.dy;
                        block.status = 0;
                        this.score++;
                        document.getElementById('scoreValue').textContent = this.score;

                        // 全ブロックを破壊したかチェック
                        if (this.score === this.blockRows * this.blockCols) {
                            alert('おめでとうございます！クリアしました！');
                            this.gameStarted = false;
                            this.gameOver = true;
                        }
                    }
                }
            }
        }

        // パドルとの衝突判定
        if (this.ball.y + this.ball.dy > this.canvas.height - this.ballRadius - this.paddleHeight) {
            if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddleWidth) {
                this.ball.dy = -this.ball.dy;
            }
        }

        // 壁との衝突判定
        if (this.ball.x + this.ball.dx > this.canvas.width - this.ballRadius || 
            this.ball.x + this.ball.dx < this.ballRadius) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y + this.ball.dy < this.ballRadius) {
            this.ball.dy = -this.ball.dy;
        }

        // 下の壁との衝突（ゲームオーバー）
        if (this.ball.y + this.ball.dy > this.canvas.height - this.ballRadius) {
            alert('ゲームオーバー');
            this.gameStarted = false;
            this.gameOver = true;
        }
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#0095DD';
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawPaddle() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddle.x, this.paddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = '#0095DD';
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBlocks() {
        for (let row = 0; row < this.blockRows; row++) {
            for (let col = 0; col < this.blockCols; col++) {
                if (this.blocks[row][col].status === 1) {
                    this.ctx.beginPath();
                    this.ctx.rect(
                        this.blocks[row][col].x,
                        this.blocks[row][col].y,
                        this.blockWidth,
                        this.blockHeight
                    );
                    this.ctx.fillStyle = '#0095DD';
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    draw() {
        // キャンバスのクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBlocks();
        this.drawBall();
        this.drawPaddle();

        if (this.gameStarted && !this.gameOver) {
            this.collisionDetection();

            // ボールの移動
            this.ball.x += this.ball.dx;
            this.ball.y += this.ball.dy;
        }

        requestAnimationFrame(this.draw.bind(this));
    }

    startGame() {
        if (this.gameOver) {
            this.resetGame();
            this.createBlocks();
        }
        this.gameStarted = true;
    }
}

// ゲームの初期化
window.onload = () => {
    new Game();
};
