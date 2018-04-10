/*点击开始游戏 startPage消失  游戏开始  随机出现食物，出现三节蛇开始运动
* 上下左右移动    判断吃到食物 使用坐标判断 食物消失蛇加一节     判断游戏结束，弹出GameOver*/

var loserScore = document.getElementById('loserScore');
var lose = document.getElementById('lose');
var scoreBox = document.getElementById('score');
var content = document.getElementById('content');
var close = document.getElementById('close');
var startPage = document.getElementById('startPage');
var startP = document.getElementById('startP');
var startBtn = document.getElementById('startBtn');
var startGameBool = true;//是否开始游戏
var startPauseBool = true;//是否暂停了
var snakeMove; //设置定时器用
var speed = 270; //蛇移动速度


init();//初始化

function init() {
    //地图
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    this.mapDiv = content;
    //食物
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    //蛇
    this.snakeW = 20;
    this.snakeH = 20;
    //蛇身 三节用三个数组表示 数组中三参数 前两个是X Y位置 最后一个区分头身
    this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];
    //游戏属性
    this.direct = 'right';//初始方向
    this.left = false; // 当前向右则不能往左改变
    this.right = false; // 当前向右则不能往右改变
    this.up = true;
    this.down = true;
    this.score = 0;
    bindEvent();
}

function startGame() {
    startPage.style.display = 'none';
    startP.style.display = 'block';
    food();
    snake();
    // bindEvent();
}

function food() { //随机位置生成食物
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = 'absolute';
    this.foodX = Math.floor(Math.random() * (this.mapW/20));//X轴一单位的宽度
    this.foodY = Math.floor(Math.random() * (this.mapH/20)); //Y轴一单位的宽度
    food.style.left = this.foodX * 20 + 'px';
    food.style.top = this.foodY * 20 + 'px';
    this.mapDiv.appendChild(food).setAttribute('class','food'); //用class 增加样式
}

function snake() {
    for(var i = 0; i < this.snakeBody.length; i ++){
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * 20 + 'px';//把X Y位置取到放在地图上
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';
        snake.classList.add(this.snakeBody[i][2]);//添加 头 或 蛇身的样式
        this.mapDiv.appendChild(snake).classList.add('snake');
        switch (this.direct){
            case 'right':
                break;
            case 'up':
                snake.style.transform = 'rotate(270deg)';
                break;
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
            default:
                break;
        }
    }
}

function move() {
    for(var i = this.snakeBody.length - 1; i > 0; i --){ //蛇身的移动
        this.snakeBody[i][0] = this.snakeBody[i-1][0];//移动其实就是下一节等于前面的X位置
        this.snakeBody[i][1] = this.snakeBody[i-1][1];//移动其实就是下一节等于前面的Y位置
    }
    switch (this.direct){ //判断蛇头的移动
        case 'right':
            this.snakeBody[0][0] += 1;//X方向+1
            break;
        case 'up':
            this.snakeBody[0][1] -= 1;//Y方向+1
            break;
        case 'left':
            this.snakeBody[0][0] -= 1;//X方向+1
            break;
        case 'down':
            this.snakeBody[0][1] += 1;//Y方向+1
            break;
        default:
            break;
    }
    removeClass('snake');//把之前的蛇清除
    snake();//重新渲染

    if(this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY){ //判断蛇头和食物是否相等
        var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0]; //蛇尾X
        var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1]; //蛇尾Y
        switch (this.direct){   //根据方向添加长度
            case 'right':
                this.snakeBody.push([snakeEndX + 1,snakeEndY,'body']);
                break;
            case 'up':
                this.snakeBody.push([snakeEndX,snakeEndY - 1,'body']);
                break;
            case 'left':
                this.snakeBody.push([snakeEndX - 1,snakeEndY,'body']);
                break;
            case 'down':
                this.snakeBody.push([snakeEndX,snakeEndY + 1,'body']);
                break;
            default:
                break;
        }

        this.score += 1;
        scoreBox.innerHTML = this.score; // 分数写进去
        removeClass('food');//食物被吃就要消失
        food();//重新随机生成食物
    }

    if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW/20){   //判断是否碰到左右边界
        reloadGame();
    }
    if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH/20){   //判断是否碰到上下边界
        reloadGame();
    }
    var snakeHX = this.snakeBody[0][0];
    var snakeHY = this.snakeBody[0][1];
    for(var i = 1; i < this.snakeBody.length; i ++){
        if(snakeHX == snakeBody[i][0] && snakeHY == snakeBody[i][1]){ //碰到自己的身体 即蛇头位置和某一蛇身位置相等
            reloadGame();
        }
    }
}

function reloadGame() { // 重新加载
    removeClass('snake');
    removeClass('food');
    clearInterval(snakeMove);
    this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];
    this.direct = 'right';//初始方向
    this.left = false; // 当前向右则不能往左改变
    this.right = false; // 当前向右则不能往右改变
    this.up = true;
    this.down = true;
    lose.style.display = 'block';
    loserScore.innerHTML = this.score;
    this.score = 0;
    scoreBox.innerHTML = this.score;
    startPauseBool = true;
    startGameBool = true;
    startP.setAttribute('src','./image/start.png');
}

function removeClass(className) { //移除类名
    var ele = document.getElementsByClassName(className);
    while (ele.length > 0){
        ele[0].parentNode.removeChild(ele[0]);//找到爸爸 然后爸爸不要我了~
    }
}

function setDirect(code) { //改变方向
    switch (code){
        case 37:
            if(this.left){ //判断方向可不可以改变
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 38:
            if(this.up){ //判断方向可不可以改变
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        case 39:
            if(this.right){ //判断方向可不可以改变
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.up = true;
                this.down = true;
            }
            break;
        case 40:
            if(this.down){ //判断方向可不可以改变
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.up = false;
                this.down = false;
            }
            break;
        default:
            break;
    }
}

function bindEvent() {  // 绑定各种点击事件

    close.onclick = function () {
        lose.style.display = 'none';
    }

    startBtn.onclick = function () {
        startAndPause();
    }

    startP.onclick = function () {
        startAndPause();
    }
}

function startAndPause() {  // 控制开始和暂停逻辑
    if(startPauseBool){
        if(startGameBool){
            startGame();
            startGameBool = false;//开始游戏后不能再开
        }
        startP.setAttribute('src','./image/pause.png');
        document.onkeydown = function (e) {
            var code = e.keyCode;
            setDirect(code);
        }
        snakeMove = setInterval(function () {   //开始移动
            move();
        },speed);
        startPauseBool = false;
    }else{
        startP.setAttribute('src','./image/start.png');
        clearInterval(snakeMove); //清除并且暂停
        document.onkeydown = function (e) {
            e.returnValue = false;
            return false;
        }
        startPauseBool = true;
    }
}

