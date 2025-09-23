const config = new Object();

config.width = 640;
config.height = 480;
config.scene = [PlayScene];
config.physics = {default:'arcade'};

const game = new Phaser.Game(config);