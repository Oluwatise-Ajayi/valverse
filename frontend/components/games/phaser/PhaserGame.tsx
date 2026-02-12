'use client';

import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { Heart } from 'lucide-react';

export default function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameRef.current || typeof window === 'undefined') return;

    class MainScene extends Phaser.Scene {
      private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
      private hearts!: Phaser.Physics.Arcade.Group;
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      private scoreText!: Phaser.GameObjects.Text;
      private livesText!: Phaser.GameObjects.Text;
      private scoreValue = 0;
      private livesValue = 3;
      private spawnEvent!: Phaser.Time.TimerEvent;
      private isGameOver = false;
      private trees: Phaser.GameObjects.Image[] = [];
      private clouds: Phaser.GameObjects.Image[] = [];

      constructor() {
        super('MainScene');
      }

      preload() {
        this.load.svg('heart', '/assets/heart.svg', { width: 32, height: 32 });
        this.load.svg('basket', '/assets/basket.svg', { width: 80, height: 60 });
        this.load.svg('tree', '/assets/tree.svg', { width: 100, height: 150 });
        this.load.svg('cloud', '/assets/cloud.svg', { width: 120, height: 60 });
      }

      create() {
        this.isGameOver = false;
        this.scoreValue = 0;
        this.livesValue = 3;
        
        const { width, height } = this.scale;

        // Sky Background
        this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue

        // Add clouds
        this.createClouds();

        // Ground/Grass
        const ground = this.add.rectangle(width / 2, height - 30, width, 60, 0x7cb342);
        ground.setDepth(1);

        // Add trees in background
        this.createTrees();

        // Player (Basket)
        this.player = this.physics.add.sprite(width / 2, height - 80, 'basket');
        this.player.setCollideWorldBounds(true);
        this.player.setImmovable(true);
        this.player.setDepth(2);
        
        // Hearts Group
        this.hearts = this.physics.add.group();

        // Check Input
        if (this.input.keyboard) {
          this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Score Text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
          fontSize: '28px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4
        });
        this.scoreText.setDepth(10);

        // Lives Text
        this.livesText = this.add.text(16, 50, '❤️ ❤️ ❤️', {
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif'
        });
        this.livesText.setDepth(10);

        // Spawn Hearts Loop
        this.spawnEvent = this.time.addEvent({
          delay: 1200,
          callback: this.spawnHeart,
          callbackScope: this,
          loop: true
        });

        // Collision Handler
        this.physics.add.overlap(this.player, this.hearts, this.collectHeart, undefined, this);

        // Mobile Touch Input
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isGameOver) {
                this.scene.restart();
                setGameOver(false);
                setScore(0);
                setLives(3);
                return;
            }
            this.moveToPointer(pointer.x);
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown && !this.isGameOver) {
                this.moveToPointer(pointer.x);
            }
        });
        
        this.scale.on('resize', this.resize, this);
      }

      createClouds() {
        const { width } = this.scale;
        // Create 3-4 clouds
        for (let i = 0; i < 4; i++) {
          const cloud = this.add.image(
            Phaser.Math.Between(50, width - 50), 
            Phaser.Math.Between(40, 120), 
            'cloud'
          );
          cloud.setScale(0.8 + Math.random() * 0.4);
          cloud.setAlpha(0.7);
          cloud.setDepth(0);
          this.clouds.push(cloud);
        }
      }

      createTrees() {
        const { width, height } = this.scale;
        // Create trees at the bottom
        const treePositions = [
          { x: width * 0.15, scale: 0.6 },
          { x: width * 0.85, scale: 0.6 },
          { x: width * 0.05, scale: 0.5 },
          { x: width * 0.95, scale: 0.5 }
        ];

        treePositions.forEach(pos => {
          const tree = this.add.image(pos.x, height - 40, 'tree');
          tree.setScale(pos.scale);
          tree.setDepth(0);
          this.trees.push(tree);
        });
      }

      resize(gameSize: Phaser.Structs.Size) {
         const { width, height } = gameSize;
         if(this.player) {
             this.player.setPosition(this.player.x, height - 80);
         }
         if (this.cameras.main) {
             this.cameras.main.setViewport(0, 0, width, height);
         }
      }

      spawnHeart() {
        if (this.isGameOver) return;
        const x = Phaser.Math.Between(40, this.scale.width - 40);
        const heart = this.hearts.create(x, -20, 'heart') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        heart.setVelocityY(Phaser.Math.Between(180, 280));
        heart.setCollideWorldBounds(false);
        heart.setDepth(3);
        
        // Add slight rotation for effect
        heart.setAngularVelocity(Phaser.Math.Between(-50, 50));
      }

      collectHeart(player: any, heart: any) {
        const heartObj = heart as Phaser.GameObjects.GameObject;
        heartObj.destroy();
        this.scoreValue += 1;
        this.scoreText.setText('Score: ' + this.scoreValue);
        setScore(this.scoreValue);
        
        // Flash effect
        this.cameras.main.flash(100, 255, 192, 203, false);
      }

      loseLife() {
        this.livesValue -= 1;
        setLives(this.livesValue);
        
        // Update lives display
        const hearts = '❤️ '.repeat(this.livesValue) + '🖤 '.repeat(3 - this.livesValue);
        this.livesText.setText(hearts.trim());
        
        // Camera shake effect
        this.cameras.main.shake(200, 0.005);

        if (this.livesValue <= 0) {
          this.endGame();
        }
      }

      endGame() {
        this.isGameOver = true;
        setGameOver(true);
        
        // Stop spawning
        if (this.spawnEvent) {
          this.spawnEvent.remove();
        }

        // Destroy all existing hearts
        this.hearts.clear(true, true);

        // Show game over text
        const { width, height } = this.scale;
        const gameOverText = this.add.text(width / 2, height / 2 - 40, 'Game Over!', {
          fontSize: '64px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 6
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(11);

        const finalScoreText = this.add.text(width / 2, height / 2 + 20, `Final Score: ${this.scoreValue}`, {
          fontSize: '32px',
          color: '#ffeb3b',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4
        });
        finalScoreText.setOrigin(0.5);
        finalScoreText.setDepth(11);

        const restartText = this.add.text(width / 2, height / 2 + 70, 'Click to Restart', {
          fontSize: '24px',
          color: '#ffffff',
          fontFamily: 'Arial, sans-serif',
          stroke: '#000000',
          strokeThickness: 3
        });
        restartText.setOrigin(0.5);
        restartText.setDepth(11);
      }

      moveToPointer(x: number) {
          this.player.x = x;
          if(this.player.x < 40) this.player.x = 40;
          if(this.player.x > this.scale.width - 40) this.player.x = this.scale.width - 40;
      }

      update() {
        if (this.isGameOver) return;

        // Animate clouds slowly
        this.clouds.forEach(cloud => {
          cloud.x += 0.2;
          if (cloud.x > this.scale.width + 60) {
            cloud.x = -60;
          }
        });

        // Clean up hearts that fell off screen
        this.hearts.children.entries.forEach((child) => {
            const heart = child as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
            if (heart.y > this.scale.height + 50) {
                heart.destroy();
                // Lose a life when missing a heart
                this.loseLife();
            }
        });

        // Keyboard Movement
        if (this.cursors) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-400);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(400);
            } else {
                this.player.setVelocityX(0);
            }
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      transparent: false,
      backgroundColor: '#87CEEB',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
        min: {
          width: 320,
          height: 240
        },
        max: {
          width: 1600,
          height: 1200
        }
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: MainScene
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      {/* Constrained container for PC */}
      <div className="w-full max-w-4xl min-h-[500px] h-[600px] md:h-[600px] relative bg-gradient-to-b from-sky-300 to-sky-100 rounded-xl overflow-hidden shadow-2xl border-4 border-sky-200">
        
        {/* Lives Display - Top Left */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-white/90 px-3 py-2 rounded-full shadow-md flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              size={20} 
              className={i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-300'}
            />
          ))}
        </div>

        {/* Score Display - Top Right */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 bg-white/90 px-4 py-2 rounded-full shadow-md">
          <span className="text-pink-600 font-bold text-lg md:text-xl">Score: {score}</span>
        </div>
        
        {/* Game Container */}
        <div 
          ref={gameRef} 
          className="w-full h-full"
          style={{ touchAction: 'none' }}
        />
        
        {/* Instructions */}
        {!gameOver && (
          <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs md:text-sm opacity-80 pointer-events-none bg-black/30 px-4 py-2 rounded-full">
            {lives > 0 ? 'Catch hearts! Don\'t let them fall!' : 'Game Over - Click to restart'}
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4">
              <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>
              <p className="text-2xl font-semibold text-gray-700 mb-2">Final Score</p>
              <p className="text-5xl font-bold text-pink-600 mb-6">{score}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
