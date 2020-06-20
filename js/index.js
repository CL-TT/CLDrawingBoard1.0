/*
 * @Author: CL
 * @Date: 2020-06-20 23:46:04 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-21 01:23:59
 * 分析{
 *   1. 运用到的知识
 *     es6 + jquery + canvas
 *   2. 面向对象的编程方式
 * } 
 */

class Drawing {
  constructor() {
    this.flag = false; //定义一个锁
    this.array = [];
  }

  //获得工具
  getUtils() {
    //获得画板这个对象
    this.canvas = $('.canvas');
    //获得画笔
    this.context = this.canvas.get(0).getContext('2d');
    //获取到颜色板这个元素
    this.colorBoard = $('.color');
    //获取到画笔粗细元素
    this.lineW = $('.lineWeight');

    this.box = $('.box');
  }

  //初始化一些画笔上的参数
  initCanvas() {
    //线条两边的样子，以圆滑的方式
    this.context.lineCap = 'round';
    //线条的起始和结尾以圆滑的方式进行
    this.context.lineJoin = 'round';
    //画布的宽度和高度
    this.canvas_w = this.canvas[0].width;
    this.canvas_h = this.canvas[0].height;
  }

  //这是在画板上绘画的方法
  draw() {
    const CANVAS = this.canvas;
    const CONTEXT = this.context;

    //这个画布元素原本就有的left和top值
    let offset_left = CANVAS.offset().left,
      offset_top = CANVAS.offset().top;

    //监听画布的点击事件
    CANVAS.on('mousedown', (e) => {
      e = e || window.event;
      //鼠标放下时画笔才可以移动
      this.flag = true;
      let begin_X = e.pageX - offset_left;
      let begin_Y = e.pageY - offset_top;
      //开始绘制
      CONTEXT.beginPath();
      //起始点
      CONTEXT.moveTo(begin_X, begin_Y);

      //监听画布的移动事件
      CANVAS.on('mousemove', (e) => {
        e = e || window.event;
        if (this.flag) {
          //进行点和点的连线
          CONTEXT.lineTo(e.pageX - offset_left, e.pageY - offset_top);
          //以线性的方式画线
          CONTEXT.stroke();
        }
      })

      //监听画布的鼠标抬起事件
      CANVAS.on('mouseup', (e) => {
        this.closePath(e);
      })

      //监听鼠标离开画板上上的函数
      CANVAS.on('mouseleave', (e) => {
        this.closePath(e);
      })

      //每画一笔都要记录，为了撤销的操作
      let imgaeData = this.context.getImageData(0, 0, this.canvas_w, this.canvas_h);
      //保存到数组中
      this.array.push(imgaeData);
    })
  }

  //监听三个按钮的方法
  btnListener() {
    this.box.on('click', (e) => {
      e = e || window.event;
      switch (e.target.id) {
        //抓取事件源
        case 'clear':
          //清屏
          this.context.clearRect(0, 0, this.canvas_w, this.canvas_h);
          break;
        case 'eraser':
          //橡皮擦
          this.context.strokeStyle = 'white';
          break;
        case 'cancel':
          //撤销
          this.context.putImageData(this.array.pop(), 0, 0);
          break;
      }
    })

    //画笔颜色的监听函数
    this.colorBoard.on('change', () => {
      this.context.strokeStyle = this.colorBoard.val();
    })

    //画笔线条的监听函数
    this.lineW.on('change', () => {
      this.context.lineWidth = this.lineW.val();
    })
  }

  //结束绘制的方法
  closePath(e) {
    e = e || window.event;
    //离开画板也要终止绘画
    this.context.closePath();
    this.flag = false;
  }

  //初始化函数
  init() {
    this.getUtils();
    this.initCanvas();
    this.draw();
    this.btnListener();
  }
}

const DRAWING = new Drawing();

DRAWING.init();