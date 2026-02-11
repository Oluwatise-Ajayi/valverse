'use client';

import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';

export default function PhaserGame() {
  const gameRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!gameRef.current || typeof window === 'undefined') return;

    class MainScene extends Phaser.Scene {
      private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
      private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
      private scoreText: Phaser.GameObjects.Text | undefined;
      private score = 0;

      constructor() {
        super('MainScene');
      }

      preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('red', 'assets/particles/red.png');
      }

      create() {
        this.add.image(400, 300, 'sky');
        
        // Player (just a box for now as we lack assets)
        const player = this.add.rectangle(400, 550, 40, 40, 0x00ff00) as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        this.physics.add.existing(player);
        player.body.setCollideWorldBounds(true);
        this.player = player;

        // Cursors
        if (this.input.keyboard) {
           this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Hearts (Particles)
        const particles = this.add.particles(0, 0, 'red', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        const emitter = particles.createEmitter({
            x: { min: 0, max: 800 },
            y: 0,
            lifespan: 2000,
            speedY: { min: 100, max: 200 },
            quantity: 2,
            frequency: 1000,
        });
        
        // Interactive "Heart" logic simulated by falling objects would need actual sprites
        // simulating simple text score update
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#fff' });
        
        // Timer to auto-score for demo
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.score += 10;
                this.scoreText?.setText('Score: ' + this.score);
                setScore(this.score); // Sync React state (careful with perf)
            },
            loop: true
        });
      }

      update() {
        if (!this.cursors || !this.player) return;

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(160);
        } else {
            this.player.body.setVelocityX(0);
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 300 },
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
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-xl font-bold mb-4">Score: {score}</div>
      <div ref={gameRef} className="rounded-xl overflow-hidden shadow-2xl" />
      <div className="mt-4 text-sm text-gray-500">
        Use Arrow Keys to Move (Demo Mode: Auto-score)
      </div>
    </div>
  );
}
