import Phaser from 'phaser';
type DamageType = 'fire' | 'ice' | 'earth' | 'air' | 'lightning' | 'poison' | 'railgun' | 'normal';

export interface Enemy {
    id: string;
    // Basic properties
    name: string;
    speed: number;
    size: number;
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
    
    // Methods
    move(): void;
    attack(): void;
    takeDamage(amount: number): void;
    die(): void;
}