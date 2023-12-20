
class BootScene extends Phaser.Scene{
    constructor() {
        super({key:"boot"});
    }
    preload(){
        // 载入资源：preloadScene的资源
        // 这里的目的，载入必要资源，快速显示画面
        this.load.json("assets","assets/json/assets.json");
        this.load.image('ball','./assets/sprites/ball.png');
    }
    create(){
        // 创建的时候，启动 preloadScene
        this.scene.start("preload");
    }
}

class PreloadScene extends Phaser.Scene{
    constructor() {
        super({key:"preload"});
    }
    preload(){
        // 载入游戏资源
        // 显示加载进度条
        this.loadAssets(this.cache.json.get('assets'));
        this.add.image(this.getBallX(),this.getBallY(),'ball');
        // add progressbar
        this._showProgressbar(this.getBallX(),this.getProgressY());
        // show tooltips
        this._showTooltips();
    }
    create(){
        // 这里什么都不需要做
        // 空场景。preload完毕之后，直接跳转到游戏Scene
        // this.scene.start("tankScene");
    }

    loadAssets(json){
        this._loadImage(json);
        this._loadAudio(json);
    }
    _loadImage(json){
        json.images.forEach(function(value,index){
            this.load.image(value[0],value[1]);
        },this);
    }
    _loadAudio(json){
        json.audioSprite.forEach(function(value,index){
            this.load.audioSprite(value[0],value[1],value[2]);
        },this);
    }
    _showTooltips(){
        this.add.text(this.getBallX(),this.getTooltipY(),"载入中，请稍候...",{
            fontSize:"40px",
            fontFamily:"Microsoft YaHei",
            color: "#F0F0F0",
            align:"center",
            boundsAlignH:"center",
            boundsAlignV:"middle"
        }).setOrigin(0.5,0.5).setScale(0.5);
    }

    /**
     * 在 x y 位置展示进度条，并更新进度
     * @param x
     * @param y
     * @private
     */
    _showProgressbar(x,y){
        // 绘制进度条
        let width = 400;    // 进度条宽度 像素
        let height = 20;    // 进度条高度 像素
        let xStart = x - width / 2 ; // 进度条开始位置，需要中心位置 x - 宽度 /2
        let yStart = y - height / 2;    // 进度条开始位置
        // 载入中，持续更新进度条的进度

        // 美化 - 给进度条加边框
        let borderOffset = 1;
        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset, yStart-borderOffset, width + borderOffset*2,height+borderOffset*2
        );
        let border = this.add.graphics({lineStyle:{width:0},color:0xEEEEEE});
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();
        let updateProgressBar = function (percentage) {
            progressbar.clear();
            progressbar.fillStyle(0xFFFFFF,1);
            progressbar.fillRect(xStart,yStart,percentage * width,height);
        }
        this.load.on("progress",updateProgressBar);
        // 载入完毕之后，开始游戏
        this.load.once("complete",function(){
            this.load.off("progress",updateProgressBar);
            this.scene.start("tankScene");
        },this);
    }
    getBallX(){ return document.body.offsetWidth / 2;}
    getBallY(){ return document.body.offsetHeight / 2;}
    getTooltipY(){ return document.body.offsetHeight - 60;}
    getProgressY(){ return document.body.offsetHeight - 120;}
}