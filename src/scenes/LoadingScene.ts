import { Scene } from "phaser";
import { Enemy, Level } from "../EnemyTypes";

const enemiesEndpoint = "http://localhost:3000/enemies";
const enemyEndpoint = "http://localhost:3000/enemy";

export const enemyDb: Record<string, Enemy> = {};
export const levels: Level[] = [];
const levelDescription = 'Desert planet full of lizards, spiders, and goblins';

const assetPath = "assets";

export class LoadingScene extends Scene {
    state: 'prompt' | 'loading' | 'done' = 'prompt';
    inputElement: Phaser.GameObjects.DOMElement;
    button: Phaser.GameObjects.DOMElement;
    constructor() {
        super('LoadingScene');
    }

    async loadEnemies(): Promise<Enemy[]> {
        console.log(`Fetching enemies`)
        const enemies: Enemy[] = await this.fetchEnemies();
        console.log(`Received enemies: ${JSON.stringify(enemies)}`)

        this.load.setBaseURL(enemyEndpoint);
        enemies.forEach((enemy) => {
            if (enemy.id in enemies) {
                console.log(`Duplicate enemy ${enemy.id}: ${enemy.name}`);
                return;
            }
            enemyDb[enemy.id] = enemy;
            this.load.image(enemy.id, enemy.spriteUrl);
            console.log(`Fetching enemy ${enemy.id} at url ${enemy.spriteUrl}`)
        });

        this.load.start();
        this.load.setBaseURL(assetPath);

        return new Promise((resolve) => {
            this.load.on('complete', () => {
                resolve(enemies);
            });
        });
    }

    private async fetchEnemies(): Promise<Enemy[]> {
        const params = {
            count: "3",
            setting: levelDescription
        };
        const url = new URL(enemiesEndpoint);
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url);
        try {
            return (await response.json()).enemies;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    private setupProgressBar() {
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    async init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        // this.add.text(512, 450, 'Loading...', { font: '16px Arial', color: '#ffffff' }).setOrigin(0.5);
        // const enemies = await this.loadEnemies();
        // levels.push({
        //     description: levelDescription,
        //     enemies,
        //     backgroundUrl: 'assets/background.png',
        //     background: null,
        // });
        // this.state = 'done';
        // const nextButton = this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        // nextButton.setInteractive();
        // nextButton.addListener('pointerdown', () => {
        //     this.scene.start('Platformer');
        // });
    }

    // In your scene's create function:
    async create() {
        this.inputElement = this.add.dom(400, 300, 'input', 'width: 600px; height: 120px; font-size: 14px;', 'Enter level description');
        this.button = this.add.dom(400, 500, 'button', 'width: 200px; height: 120px; font-size: 14px;', 'Generate');
        // Optional: Add an event listener
        this.inputElement.setInteractive();
        this.button.setInteractive();
        this.inputElement.addListener('keypress')
        this.inputElement.on('keypress', (evt: any) => {
            if (evt.key === 'Enter') {
                handleClick();
            }
        });
        this.inputElement.on('input', (event: any) => {
            console.log('Input changed:', event.target.value);
        });
        this.button.addListener('click');
        const handleClick = async () => {
            if(this.state === 'prompt' && this.inputElement.node.textContent) {
                this.state = 'loading';
                this.button.disableInteractive();
                this.button.setText('Loading...');
                this.setupProgressBar();
                const enemies = await this.loadEnemies();
                levels.push({
                    enemies,
                    backgroundUrl: 'assets/background.png',
                });
                this.state = 'done';
                this.button.setInteractive();
                this.button.setText('Begin!');
            }
            if (this.state === 'done') {
                this.scene.start('Platformer');
            }
        }
        this.button.on('click', handleClick);
        this.inputElement.on('submit', handleClick);
    }
}

