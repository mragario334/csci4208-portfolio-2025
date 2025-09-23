class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
      super(scene, 300, 200, 'player');
      this.depth = 2;
      this.speed = 200;
      this.last_fired = 0;
      this.bulletScale = 1;
  
      // IMPORTANT: use the Scene's projectile list (array), per spec Step 5
      this.projectiles = scene.player_projectiles;
  
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setCollideWorldBounds(true);
      this.body.setSize(this.width - 16, this.height - 16);
      this.buttons = scene.input.keyboard.addKeys('up,down,left,right,space');
  
      // (optional in spec) play anim if defined
      if (scene.anims.exists('player-move')) this.anims.play('player-move', true);
    }
  
    move() {
      this.body.setVelocity(0);
      if (this.buttons.left.isDown)  this.body.setVelocityX(-this.speed);
      if (this.buttons.right.isDown) this.body.setVelocityX(this.speed);
      if (this.buttons.up.isDown)    this.body.setVelocityY(-this.speed);
      if (this.buttons.down.isDown)  this.body.setVelocityY(this.speed);
    }
  
    attack(time) {
      if (this.buttons.space.isDown && time - this.last_fired > 400) {
        const position = { x: this.x, y: this.y };
        const velocity = { x: 300, y: 0 };
        const bullet = new Projectile(this.scene, position, velocity);
  
        // POWERUP: scale + update hitbox (per spec)
        bullet.setScale(this.bulletScale);
        bullet.body.setSize(bullet.displayWidth, bullet.displayHeight, true);
  
        this.projectiles.push(bullet);   // push into scene array
        this.last_fired = time;
      }
      if (this.buttons.space.isUp) {
        this.last_fired = 0; // rapid-tap behavior (Milestone 4)
      }
    }
  }
  