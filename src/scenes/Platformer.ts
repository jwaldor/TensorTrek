import BaseEnemy, {Enemy,DamageType} from '../EnemyTypes';
import { levels } from './LoadingScene';

let timer: any;
class Platformer extends Phaser.Scene
{
    scoreText: any;
    score = 0;
    cursors: any;
    platforms: any;
    stars: any;
    player: any;
    enemies: BaseEnemy[] = [];
    alreadyRendered: boolean = false; // Declare as a class property
    constructor () {
        super('Platformer' );
    }
    platformSpeed = 150; // Speed of the platforms
    worldWidth = 3200;  // New property for world width
    worldHeight = 1300;  // New property for world height
    
   

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create ()
    {
        // Set the world bounds
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        // Create a larger sky background
        const sky = this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'sky');
        sky.setOrigin(0, 0);
        // sky.setDisplaySize(this.sys.game.config.width as number, this.sys.game.config.height as number);

        // ... existing player creation ...


        // const sky = this.add.image(0, 0, 'sky');
        // sky.setOrigin(0, 0);


        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // this.platforms.create(600, 400, 'ground');
        // this.platforms.create(50, 250, 'ground');
        // this.platforms.create(750, 220, 'ground');
        function symmRand(range:number) {
            return Phaser.Math.Between(-range, range);
        }
        // Add more platforms across the wider world
        // let lastCoords = {x:0, y:0};
        for (let i = 0; i < this.worldWidth; i += 600) {
            this.platforms.create(i+symmRand(150), 50+symmRand(25), 'ground');
            this.platforms.create(i+symmRand(150), 150+symmRand(50), 'ground');
            this.platforms.create(i+symmRand(150), 400, 'ground');
            // this.platforms.create(i+symmRand(150), 700+symmRand(50), 'ground');
            this.platforms.create(i, 1200+symmRand(100), 'ground');

        }
        

        this.player = this.physics.add.sprite(50, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);


        // Set camera to follow the player and set world bounds
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });


        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        this.spawnEnemies();
        timer = this.time.addEvent({
            delay: 400+Math.random()*500,
            loop: true,
            callback: () => {
                console.log(`JUMP!!`)
                const randomIndex = Math.floor(Math.random() * this.enemies.length);
                if (this.enemies[randomIndex]) {
                    this.enemies[randomIndex].renderObj.setVelocityY(5000);
                }
            }
        });
    }

    spawnEnemies() {
        const enemiesToSpawn = 4;
        let currentLevel = levels.at(-1);
        const placeholderEnemy: Enemy = {
        // Basic properties
        id: 'bomb',
        name: "Shadow Stalker",
        speed: 100,
        size: 2,
        sprite: "bomb",
        spriteUrl: "baz",
        projectileSpeed: 15,
        damage: 8,
        health: 50,
    
        // Personality and story
        personality: "Stealthy and cunning",
        originStory: "Born from the shadows of a forgotten realm, the Shadow Stalker seeks to consume all light.",
    
        // Movement behavior
        movementBehavior: "chase" as 'linear' | 'zigzag' | 'circular' | 'chase',
    
        // Additional properties
        attackRange: 100,
        attackCooldown: 2,
        experienceValue: 50,
        weaknesses: ["light", "fire"] as DamageType[],
        strengths: ["darkness", "poison"] as DamageType[],
        canFly: false,
        canJump: true,
        canTeleport: true,
    };
        if(!currentLevel) {
            currentLevel = {enemies: [placeholderEnemy], backgroundUrl: "placeholderbg.png"};
        }
        currentLevel.enemies.forEach((enemy: Enemy) => {
            for (let i = 0; i < enemiesToSpawn; i++) {
                const xOffset = Phaser.Math.Between(-100, 100);
                const yOffset = Phaser.Math.Between(-100, 100);
                // const xOffset = 100;
                // const yOffset = 100;
                const newEnemy = new BaseEnemy({
                    initX: this.player.x + xOffset,
                    initY: this.player.y + yOffset,
                    scene: this,
                    enemyType: enemy,
                });
                console.log(`Scene is ${this}`);
                console.log(`Creating enemy ${enemy.name} at ${xOffset}, ${yOffset}`);
                this.enemies.push(newEnemy);
            }
        });
    }

    update ()
    {
        if (this.cursors.left.isDown)
        {   
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-400);
        }

        this.enemies.forEach((e: BaseEnemy) => e.move(this.player));
    }

    collectStar (_player: any, star: any)
    {
        star.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}

export { Platformer };

// aggressive, maintain distance, run away
// bullet class
// enemy will create bullets
//make it big and then have the camera zoom in
//keep centering the camera on the dude
//make the level big enough in the init function