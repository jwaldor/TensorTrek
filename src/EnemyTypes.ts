import Phaser from 'phaser';
export type DamageType = 'fire' | 'ice' | 'earth' | 'air' | 'lightning' | 'poison' | 'railgun' | 'normal';

export interface Enemy {
    // Basic properties
    name: string;
    speed: number;
    size: number;
    sprite: string;
    projectileSpeed: number; //min is 1, max is 20
    damage: number; //min is 1, max is 20
    health: number; //min is 1, max is 20

    // Personality and story
    personality: string;
    originStory: string;

    // Movement behavior
    movementBehavior: 'linear' | 'zigzag' | 'circular' | 'chase';

    // Additional properties
    attackRange: number;
    attackCooldown: number;
    experienceValue: number;
    // lootTable: string[];
    weaknesses: DamageType[];
    strengths: DamageType[];
    canFly: boolean;
    canJump: boolean;
    canTeleport: boolean;

    initX: number;
    initY: number;
    scene: Phaser.Scene;
    renderObj: Phaser.Physics.Arcade.Sprite;
    // Methods
    move(): void;
    attack(): void;
    takeDamage(amount: number): void;
    die(): void;
}

class BaseEnemy implements Enemy {
    // Basic properties
    name: string;
    speed: number;
    size: number;
    projectileSpeed: number; //min is 1, max is 20
    damage: number; //min is 1, max is 20
    health: number; //min is 1, max is 20
    sprite: string; // Add this line
    // Personality and story
    personality: string;
    originStory: string;

    // Movement behavior
    movementBehavior: 'linear' | 'zigzag' | 'circular' | 'chase';

    // Additional properties
    attackRange: number;
    attackCooldown: number;
    experienceValue: number;
    // lootTable: string[];
    weaknesses: DamageType[];
    strengths: DamageType[];
    canFly: boolean;
    canJump: boolean;
    canTeleport: boolean;

    initX: number;
    initY: number;
    scene: Phaser.Scene;
    renderObj: Phaser.Physics.Arcade.Sprite;
    constructor({
        initX,
        initY,
        sprite,
        ...enemyProps
    }: Enemy) {
        Object.assign(this, enemyProps);
        console.log("this.scene",this.scene);
        this.renderObj = this.scene.physics.add.sprite(initX, initY, sprite);
    }
    // constructor(scene: Phaser.Scene, x: number, y: number) {
    //     this.sprite = scene.physics.add.sprite(x, y, texture);
    //     // Initialize other properties here
    // }

    move(player?: Phaser.GameObjects.Sprite) {
        switch (this.movementBehavior) {
            case 'chase':
                if (player) {
                    this.moveTowardsPlayer(player);
                }
                break;
            case 'linear':
                this.moveLinear();
                break;
            case 'zigzag':
                this.moveZigzag();
                break;
            case 'circular':
                this.moveCircular();
                break;
        }
    }

    private moveTowardsPlayer(player: Phaser.GameObjects.Sprite) {
        const angle = Phaser.Math.Angle.Between(
            this.renderObj.x,
            this.renderObj.y,
            player.x,
            player.y
        );

        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;

        this.renderObj.setVelocityX(velocityX);
        this.renderObj.setVelocityY(velocityY);
    }

    private moveLinear() {
        // Implement linear movement
    }

    private moveZigzag() {
        // Implement zigzag movement
    }

    private moveCircular() {
        // Implement circular movement
    }

    attack() {
        // Implement attack logic
    }

    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Implement death logic
    }
}

export default BaseEnemy;