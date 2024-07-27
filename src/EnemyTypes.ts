import Phaser from 'phaser';
export type DamageType = 'fire' | 'ice' | 'earth' | 'air' | 'lightning' | 'poison' | 'railgun' | 'normal';

export interface Enemy {
    id: string;
    // Basic properties
    name: string;
    speed: number;
    size: number;
    sprite: string;
    spriteUrl: string;
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

}

class BaseEnemy /*implements Enemy*/ {
    initX: number;
    initY: number;
    health: number = 100;
    scene: any;
    renderObj: Phaser.Physics.Arcade.Sprite;
    enemyType: Enemy;
    constructor({
        initX,
        initY,
        enemyType,
        scene,
    }: any) {
        this.enemyType = enemyType;
        this.initX = initX;
        this.initY = initY;
        this.scene = scene;
        console.log("this.scene",this.scene);
        this.renderObj = this.scene?.physics.add.sprite(initX, initY, enemyType.id) || null;
        const dim = 64 * (enemyType.size / 3);
        this.renderObj.displayWidth = dim;
        this.renderObj.displayHeight = dim;
        this.scene.physics.add.collider(this.scene.platforms, this.renderObj);
        this.scene.physics.add.collider(this.scene.player, this.renderObj);
    }

    move(player?: Phaser.GameObjects.Sprite) {
        console.log(`Moving!`);
        console.log(`Movement behavior: ${this.enemyType.movementBehavior}`);
        switch (this.enemyType.movementBehavior) {
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

        const velocityX = Math.cos(angle) * (this.enemyType.speed / 2);

        this.renderObj.setVelocityX(velocityX);
        console.log(`Setting self velocity to ${velocityX}`);
    }

    private moveLinear() {
        // Assuming a fixed direction for linear movement, e.g., along the x-axis
        this.renderObj.setVelocityX(this.enemyType.speed);
        this.renderObj.setVelocityY(0);
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

export interface Level {
    enemies: Enemy[];
    backgroundUrl: string;
}

export default BaseEnemy;
