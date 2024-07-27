import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from '@koa/bodyparser';
import { Enemy } from './types';

const app = new Koa();
const router = new Router();

router.get('/enemies', async (ctx) => {
    const { count, setting } = ctx.query;
    if (typeof count === 'string' && typeof setting === 'string') {
        const enemies = await generateEnemies(parseInt(count), setting);
        ctx.body = { enemies };
        ctx.status = 200;
    } else {
        ctx.status = 400;
        ctx.body = { error: 'Invalid query parameters' };
    }
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

async function generateEnemies(count: number, setting: string): Promise<Enemy[]> {
    const enemies: Enemy[] = [];
    for (let i = 0; i < count; i++) {
        enemies.push({
            id: `enemy${i}`,
            name: `Enemy ${i}`,
            speed: Math.floor(Math.random() * 20),
            size: Math.floor(Math.random() * 20),
            spriteUrl: 'placeholder.png', // Placeholder for AI sprite gen
            projectileSpeed: Math.floor(Math.random() * 20) + 1,
            damage: Math.floor(Math.random() * 20) + 1,
            health: Math.floor(Math.random() * 20) + 1,
            personality: 'Aggressive',
            originStory: `Originated from ${setting}`,
            movementBehavior: 'zigzag',
            attackRange: Math.floor(Math.random() * 100),
            attackCooldown: Math.floor(Math.random() * 10) + 1,
            experienceValue: Math.floor(Math.random() * 100),
            weaknesses: ['fire'],
            strengths: ['ice'],
            canFly: false,
            canJump: true,
            canTeleport: false,
            move: () => {},
            attack: () => {},
            takeDamage: (_) => {},
            die: () => {}
        });
    }
    return enemies;
}

