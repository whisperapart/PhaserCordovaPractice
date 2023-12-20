// manager class
class GuiManager{
    eleId;
    static strMainMenu = "mainMenu";
    static strInGameMenu = "inGameMenu";
    static strModalTank = "modalTank";
    mapComponents = new Map();      // 管理的所有GUI components
    constructor(strId) {
        this.instance = null;
        this.eleId = "#"+strId;
        this._initMainMenu(GuiManager.strMainMenu);
        this._initInGameMenu(GuiManager.strInGameMenu);
    }

    static getInstance(strId){
        if(this.instance) return this.instance;
        return this.instance = new GuiManager(strId);
    }

    _initMainMenu(strId){
        console.log("init main menu = "+strId);
        let mainMenu = MenuMain.getInstance(strId);
        mainMenu.show();
        this.mapComponents.set(strId,mainMenu);
    }
    _initInGameMenu(strId){
        console.log("init in game menu");
        let inGameMenu = MenuInGame.getInstance(strId);
        inGameMenu.hide();
        this.mapComponents.set(strId,inGameMenu);

        this._initModalTank(GuiManager.strModalTank);
    }
    _initModalTank(strId){
        console.log("init modal tank");
        let modalTank = ModalTank.getInstance(strId);
        modalTank.hide();
        this.mapComponents.set(strId,modalTank);
    }

    mainMenu(strCmd){
        this._dispatcher(GuiManager.strMainMenu,strCmd);
    }
    inGameMenu(strCmd){
        this._dispatcher(GuiManager.strInGameMenu,strCmd);
    }
    tankModal(strCmd){
        if(strCmd === 'show'){
            this._dispatcher(GuiManager.strInGameMenu,strCmd);
        }
        this._dispatcher(GuiManager.strModalTank,strCmd);
    }

    _dispatcher(strId,strCmd){
        let uiComp = this.mapComponents.get(strId);
        if(!uiComp) return;
        switch (strCmd){
            case 'hide':
                uiComp.hide();
                break;
            case 'show':
                uiComp.show();
                break;
            default:
                break;
        }
    }
}


// base class
class GUIComponent{
    eleId;

    constructor(strId) {
        this.instance = null;
        this.eleId = "#"+strId;
    }
    // 虚方法
    static getInstance(strId){
    }
    // 是否显示了
    isShow(){
        return ($(this.eleId).css("display") === "block");
    }

    // 显示 - 可以自定义，或者直接使用bootstrap 或者其他 animate css 效果
    show(){
        if(!this.isShow()) $(this.eleId).show();
    }
    // 隐藏
    hide(){
        $(this.eleId).hide();
    }
    // 更多其他效果，例如晃动窗口等
    ani_shake(){
        // etc ...
    }

}


// 基本方法 构建单例 与 dom+css 关联(View)，进行数据(model . data )和控制(control)处理
class MenuMain extends GUIComponent{
    eleBtnStart = "#mm_btn_start";

    constructor(strId) {
        super(strId);
        this._bindEvents();
    }
    static getInstance(strId){
        if(this.instance) return this.instance;
        return this.instance = new MenuMain(strId);
    }

    _bindEvents(){
        this._bindEventBtnStart();
    }
    _bindEventBtnStart(){
        $(this.eleBtnStart).on("click",function(){
            gApp.startGame();
            playH5Sound("succ",100);
        });
    }
    // hide(){
    //     console.log("main menu - on hide event : "+this.eleId);
    //     $(this.eleId).hide();
    // }
}
// 游戏内菜单逻辑
class MenuInGame extends GUIComponent{
    eleBtnTank = "#igm_btn_tank";
    constructor(strId) {
        super(strId);
        this._bindEvents();
    }
    static getInstance(strId){
        if(this.instance) return this.instance;
        return this.instance = new MenuInGame(strId);
    }
    _bindEvents(){
        this._bindTankBtn();
    }
    _bindTankBtn(){
        $(this.eleBtnTank).on("click",function(){
            let gm = GuiManager.getInstance();
            gm.tankModal('show');
            playH5Sound("page",80);
        });
    }
}
class ModalTank extends GUIComponent{
    eleBtnClose = "#mt_btn_close";
    btModal;
    constructor(strId) {
        super(strId);
        this._bindEvents();
    }
    static getInstance(strId){
        if(this.instance) return this.instance;
        return this.instance = new ModalTank(strId);
    }
    _bindEvents(){
        this._bindBtnClose();
    }
    _bindBtnClose(){
        let that = this;
        $(this.eleBtnClose).bind("click",function(){
            that.hide();
            playH5Sound("page",80);
        });
    }
    show(){
        let strId = this.eleId.substr(1);
        this.btModal = new bootstrap.Modal(document.getElementById(strId));
        this.btModal.show();
    }
    hide(){
        // let strId = this.eleId.substr(1);
        // var myModal = new bootstrap.Modal(document.getElementById(strId));
        // myModal.hide();
        if(this.btModal){
            this.btModal.hide();
        }else{
            super.hide();
        }
    }
}

let gApp = new class{
    game;
    mm_handler;
    constructor() {
        // init menu
        this.gUI = GuiManager.getInstance("guiDiv");
    }

    startGame(){
        // game should be global.
        this.game = new Phaser.Game(config);
        this.gUI.mainMenu("hide");
        this.gUI.inGameMenu("show");
    }
}();

// version 1, using H5 audio - done
function playH5Sound(strName,intVolume){
    let fVolume = intVolume / 100.0;    // [0,1)
    let seObj;
    switch (strName){
        case 'succ': seObj = document.getElementById("se_ding"); break;
        case 'fail': seObj = document.getElementById("se_drum"); break;
        case 'page': seObj = document.getElementById("se_page"); break;
        case 'melee': seObj = document.getElementById("se_melee"); break;
        default: seObj = document.getElementById("se_click"); break;
    }
    if(seObj){
        seObj.volume = fVolume;
        seObj.play();
    }
}