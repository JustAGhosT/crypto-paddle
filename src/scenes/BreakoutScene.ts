import Phaser from 'phaser';

class BreakoutScene extends Phaser.Scene {
  private paddle!: Phaser.Physics.Arcade.Sprite;
  private ball!: Phaser.Physics.Arcade.Sprite;
  private bricks!: Phaser.Physics.Arcade.StaticGroup;
  private score: number = 0;
  private lives: number = 3;
  private marketSim!: MarketSim;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'Breakout', active: true });
  }

  preload() {
    this.load.setBaseURL('/assets/games/breakout/');
    this.load.image('ball', 'ball.png');
    this.load.image('paddle', 'paddle.png');
    this.load.image('brick', 'brick.png');
  }

  create() {
    // Initialize physics
    this.physics.world.setBoundsCollision(true, true, true, false);
    
    // Create bricks using simulated market data
    this.marketSim = new MarketSim();
    this.createBricks(this.marketSim.getInitialSignals());
    
    // Set up game objects
    this.ball = this.physics.add.sprite(400, 500, 'ball')
      .setCollideWorldBounds(true)
      .setBounce(1);
    
    this.paddle = this.physics.add.sprite(400, 550, 'paddle')
      .setImmovable(true);
    
    // Collision setup
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    
    // Input handling
    this.input.keyboard?.createCursorKeys();
    
    // Performance monitoring
    this.game.events.on('poststep', () => {
      PerformanceMonitor.trackFPS(this.game.loop.actualFps);
    });

    // Score display
    this.scoreText = this.add.text(20, 20, 'Score: 0', { 
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);

    // Lives display
    this.livesText = this.add.text(this.scale.width - 160, 20, 'Lives: 3', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial' 
    }).setScrollFactor(0);
  }

  update() {
    // Paddle movement
    if (this.input.keyboard?.addKey('LEFT').isDown) {
      this.paddle.setVelocityX(-300);
    } else if (this.input.keyboard?.addKey('RIGHT').isDown) {
      this.paddle.setVelocityX(300);
    } else {
      this.paddle.setVelocityX(0);
    }
    
    // Ball reset logic
    if (this.ball.y > 600) {
      this.lives--;
      this.livesText.setText(`Lives: ${this.lives}`);
      
      if(this.lives <= 0) {
        this.gameOver();
      } else {
        this.resetBall();
      }
    }
  }

  private createBricks(signals: MarketSignal[]) {
    this.bricks = this.physics.add.staticGroup({
      key: 'brick',
      frameQuantity: 10,
      gridAlign: {
        width: 10,
        height: 6,
        cellWidth: 64,
        cellHeight: 32,
        x: 112,
        y: 100
      }
    });
    
    signals.forEach(signal => {
      this.bricks.children.entries[signal.position].setData('signal', signal);
    });
  }

  private hitBrick(ball: Phaser.GameObjects.GameObject, brick: Phaser.GameObjects.GameObject) {
    const signal = brick.getData('signal');
    this.score += signal?.value || 100;
    this.scoreText.setText(`Score: ${this.score}`);
    
    // Optional: Different points per brick type
    const brickType = brick.getData('type');
    if(brickType === 'special') this.score += 200;
    
    brick.destroy();

    // Add particle effects for better UX
    this.add.particles(brick.x, brick.y, 'star', {
      speed: 100,
      scale: { start: 1, end: 0 },
      lifespan: 500
    });
    
    this.cameras.main.shake(50, 0.01);
  }

  private hitPaddle() {
    // Add paddle hit physics logic
  }

  private resetBall() {
    this.ball.setPosition(400, 500);
    this.ball.setVelocity(0);
  }

  private gameOver() {
    this.scene.pause();
    this.add.text(this.scale.width/2, this.scale.height/2, 'GAME OVER', {
      fontSize: '48px',
      color: '#FF0000'
    }).setOrigin(0.5);
  }
}

// Simulated market data class
class MarketSim {
  getInitialSignals(): MarketSignal[] {
    // Stub for real data integration
    return Array(60).fill(null).map((_,i) => ({
      position: i,
      value: Phaser.Math.Between(50, 200),
      type: ['liquidity', 'price', 'volume'][i%3]
    }));
  }
}
