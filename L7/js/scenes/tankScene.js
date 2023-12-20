/**
 * Scene of tank game
 */
class TankScene extends Phaser.Scene {
    ball;
    tiles;
    map;
    layerMap = new Map();
    flagKeyDown = false;
    soundEffect;
    bgMusic;

    audioSprite = [
        ["se_phaser","assets/audio/se/se_phaser/se_phaser.json",["assets/audio/se/se_phaser/se_phaser.mp3","assets/audio/se/se_phaser/se_phaser.ac3","assets/audio/se/se_phaser/se_phaser.ogg","assets/audio/se/se_phaser/se_phaser.m4a"]],
        ["bg_phaser","assets/audio/bg/bg_phaser/bg_phaser.json",["assets/audio/bg/bg_phaser/bg_phaser.mp3","assets/audio/bg/bg_phaser/bg_phaser.ac3","assets/audio/bg/bg_phaser/bg_phaser.ogg","assets/audio/bg/bg_phaser/bg_phaser.m4a"]]
    ];

    constructor() {
        super({key:"tankScene"});
    }

    preload () {
        this._loadSpriteImage();
        this._loadTileSetImage();
        this._loadTileMap();
        this._initInput();
        this._loadAudio();
    }

    create () {
        // this._createBall();
        this._createMap();
        this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        this._createCameras();
        this._createAudio();
    }

    update () {
        if(this.keys.space.isDown) {
            this.flagKeyDown = true;
        }
        if(this.keys.space.isUp && this.flagKeyDown){
            this.flagKeyDown = false;
            // fire ball
            console.log("space key pressed");
            this._createBall();
            // play sound
            // v1. still, using h5 sound playH5xxxx
            // v2. using phaser
            // this.sound.play("se_ding"); // done
            // v3. using created audio
            // this.soundEffect.play();
            // v3.x 设置不同的音量？
            // v4. 使用 audioSprite
            // v5.
            this.soundEffect.play("ejection");  // key?
        }
    }

    _loadSpriteImage(){
        this.load.image('ball','./assets/sprites/ball.png');
    }
    _loadTileSetImage(){
        this.load.image('tank_tile_set_image','./assets/map/tank_ts-extrud.png');
    }
    _loadTileMap(){
        this.load.tilemapTiledJSON('tank','./assets/map/tank-map.json');
    }
    _initInput(){
        this.keys = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
    }
    _loadAudio(){
        // this.load.audio("se_ding",'./assets/audio/se/ding.mp3');
        // this.load.audio("bg_music",'./assets/audio/bg/theme_forest.mp3');
        this.audioSprite.forEach(function (value,index){
            this.load.audioSprite(value[0],value[1],value[2]);
        },this);
    }
    _createAudio(){
        // this.soundEffect = this.sound.add("se_ding",{loop:false});   // loop done
        // // use for background music - loop forever
        // this.bgMusic = this.sound.add("bg_music",{loop:true});
        // // start bg music automatically
        // this.bgMusic.play();

        // v4 -  为音效 与 背景音乐 设置不同音量
        let seVol = 0.9;    // or 从游戏设置中读取；
        let bgVol = 0.64;    // or 从游戏设置中读取；
        // this.soundEffect = this.sound.addAudioSprite("se_ding",{volume:seVol});
        //
        // this.bgMusic = this.sound.addAudioSprite("bg_music",{volume:bgVol});
        // v5 -  多个背景音乐 / 多个音效带来的问题
        // 5.1 -  使用 mapSoundEffect , mapBGMusic -- 不推荐
        // 5.2 - 使用 audiosprite
        // https://github.com/tonistiigi/audiosprite
        this.bgMusic = this.sound.addAudioSprite("bg_phaser",{volume:bgVol});
        this.soundEffect = this.sound.addAudioSprite("se_phaser",{volume:seVol});
    }
    _createMap(){
        this.map = this.make.tilemap({key:'tank'});
        this.tiles = this.map.addTilesetImage("tank_ts","tank_tile_set_image",32,32,2,4);
        this.layerMap.set('layer-land',this.map.createLayer('land',this.tiles,0,0));
        this.layerMap.set('layer-decoration',this.map.createLayer('decoration',this.tiles,0,0));
        this.layerMap.set('layer-screen',this.map.createLayer('screen',this.tiles,0,0));
    }
    _createBall(){
        this.ball = this.physics.add.sprite(this.cameras.main.width/2,this.cameras.main.height,'ball');
        this.ball.setCircle(96);
        this.ball.setScale(0.25);
        this.ball.body.setBounce(1,1);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.setGravity(100);
        this.ball.setVelocity(Math.random() * 1000 - 500,-1000);
        this.ball.setAngularVelocity(100);
        this.ball.setDepth(5);
    }
    _createCameras(){
        this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        // this.cameras.main.startFollow(this.ball);
    }

}