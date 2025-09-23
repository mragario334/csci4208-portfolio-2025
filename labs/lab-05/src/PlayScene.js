class PlayScene extends Phaser.Scene {
    constructor() {
      super('play');
      this.top_score = 100;
      this.winner = 'Top Score:';
    }
  
    preload() {
      this.load.path = 'assets/';
      this.load.image('background', 'background.png');
      this.load.image('player', 'player.png');
      this.load.image('enemy', 'enemy.png');
      this.load.image('player-0', 'player-0.png');
      this.load.image('player-1', 'player-1.png');
      this.load.image('enemy-0', 'enemy-0.png');
      this.load.image('enemy-1', 'enemy-1.png');
      this.load.image('projectile', 'projectile.png');
      this.load.image('powerup-projectile', 'powerup-1.png');
      this.load.image('powerup-slay', 'powerup-2.png');
    }
  
    create() {
      this.create_map();
      this.create_animations();
      this.create_projectiles(); // arrays
      this.create_player();
      this.create_enemies();
      this.create_powerups();    // arrays
      this.create_collisions();
      this.create_hud();
    }
  
    update(time) {
      this.update_player(time);
      this.update_background();
      this.update_score();
      this.update_enemies(time);
    }
  
    // map
    create_map() {
      this.background = this.add.tileSprite(640/2, 480/2, 640, 480, 'background');
    }
    update_background() {
      this.background.tilePositionX += 3;
    }
  
    // player
    create_player() { this.player = new Player(this); }
    update_player(time) {
      this.player.move();
      this.player.attack(time);
    }
  
    // enemies
    create_enemies() {
      this.enemies = [];
      this.time.addEvent({
        delay: 200,
        callback: this.spawn_enemy,
        callbackScope: this,
        loop: true
      });
    }
    spawn_enemy() {
      const config = { x: 640 + 32, y: Phaser.Math.Between(0, 480) };
      const monster = new Enemy(this, config);
      this.enemies.push(monster);
      this.score += 1;
    }
    update_enemies(time) {
      this.enemies.forEach(e => e.attack(time));
    }
  
    // projectiles (arrays per spec)
    create_projectiles() {
      this.player_projectiles = [];
      this.enemy_projectiles  = [];
    }
  
    // powerups (arrays per spec; fix typos)
    create_powerups() {
      this.powerups_projectile = []; // (singular name in spec examples)
      this.powerups_slay = [];
  
      this.time.addEvent({
        delay: 3000,
        callback: this.spawn_powerup,
        callbackScope: this,
        loop: true
      });
    }
    spawn_powerup() {
      if (Phaser.Math.Between(0, 4) === 0) {
        const config = { x: 640 + 32, y: Phaser.Math.Between(0, 480), type: 'powerup-projectile' };
        const potion = new PowerUp(this, config);
        this.powerups_projectile.push(potion);
      } else if (Phaser.Math.Between(0, 4) === 0) {
        const config = { x: 640 + 32, y: Phaser.Math.Between(0, 480), type: 'powerup-slay' };
        const potion = new PowerUp(this, config);
        this.powerups_slay.push(potion);
      }
    }
  
    // collisions (arrays are OK in Phaser's overlap)
    create_collisions() {
      this.physics.add.overlap(this.player, this.enemies, this.game_over, null, this);
      this.physics.add.overlap(this.player_projectiles, this.enemies, this.slay_enemy, null, this);
      this.physics.add.overlap(this.enemy_projectiles, this.player, this.game_over, null, this);
      this.physics.add.overlap(this.player, this.powerups_slay, this.get_powerup_slay, null, this);
      this.physics.add.overlap(this.player, this.powerups_projectile, this.get_powerup_projectile, null, this);
    }
  
    slay_enemy(projectile, enemy) {
      enemy.destroy();
      projectile.destroy();
    }
  
    get_powerup_slay(player, powerup) {
      this.enemies.forEach(m => m.destroy());
      this.enemy_projectiles.forEach(b => b.destroy());
      powerup.destroy();
      this.cameras.main.flash();
    }
  
    get_powerup_projectile(player, powerup) {
      this.player.bulletScale = Math.min(this.player.bulletScale + 1, 3);
      powerup.destroy();
    }
  
    // HUD
    create_hud() {
      this.score = 0;
      this.score_text = this.add.text(32, 32, "").setDepth(3).setColor('rgb(255,255,255)');
      this.top_score_text = this.add.text(600, 32, "").setDepth(3).setOrigin(1, 0);
    }
    update_score() {
      this.score_text.setText("Score: " + this.score);
      this.top_score_text.setText(`${this.winner}: ${this.top_score}`);
    }
  
    // animations
    create_animations() {
      if (!this.anims.exists('player-move')) {
        this.anims.create({ key: 'player-move', frames: [{ key: 'player-0' }, { key: 'player-1' }], frameRate: 6, repeat: -1 });
      }
      if (!this.anims.exists('enemy-move')) {
        this.anims.create({ key: 'enemy-move', frames: [{ key: 'enemy-0' }, { key: 'enemy-1' }], frameRate: 6, repeat: -1 });
      }
    }
  
    // game over
    game_over() {
      if (this.score > this.top_score) {
        this.top_score = this.score;
        this.physics.pause();
        this.winner = prompt("Winner! Enter your name: ") ?? "Top Score";
        this.input.keyboard.keys = [];
      }
      this.cameras.main.flash();
      this.scene.restart();
    }
  }
  