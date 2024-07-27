import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from '@koa/bodyparser';
import { Enemy } from './EnemyTypes';
import * as fs from "fs";
import path from 'path';

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
    } else {
        await next();
    }
});

router.get('/enemies', async (ctx) => {
    const { count, setting } = ctx.query;
    ctx.set('Content-Type', 'application/json');
    if (typeof count === 'string' && typeof setting === 'string') {
        const enemies = await generateEnemies(parseInt(count), setting);
        ctx.body = JSON.stringify({ enemies });
        ctx.status = 200;
    } else {
        ctx.status = 400;
        ctx.body = JSON.stringify({ error: 'Invalid query parameters' });
    }
});

router.get("/enemy/:name", async (ctx, _next) => {
    const filePath = path.join(process.cwd(), `./public/ai-gen/${ctx.params.name}`);
    if (!fs.existsSync(filePath)) {
        ctx.status = 404;
        ctx.body = 'PNG file not found';
        return;
    }
    ctx.set('Content-Type', 'image/png');
    ctx.type = 'image/png';
    ctx.body = fs.createReadStream(filePath);
});



app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

async function generateEnemies(count: number, setting: string): Promise<Enemy[]> {
    const enemies: Enemy[] = [];
    const sprites = ["enemy-dog", "enemy-cat", "enemy-monkey"];
    for (let i = 0; i < count; i++) {
        // create enemy from TS schema and setting
        // call layer.ai
        // dl into ai-gen directory
        // populate url field
        enemies.push({
            id: `enemy${i}`,
            name: `Enemy ${i}`,
            speed: Math.floor(Math.random() * 20),
            size: Math.floor(Math.random() * 20),
            spriteUrl: `http://localhost:3000/enemy/${sprites[i% (sprites.length)]}.png`,
            sprite: '',
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
            // move: () => {},
            // attack: () => {},
            // takeDamage: (_) => {},
            // die: () => {}
        });
    }
    return enemies;
}

