//======封装公共函数========//
// var animationEnd = (function() {
//         var explorer = navigator.userAgent;
//         if (~explorer.indexOf('WebKit')) {
//             return 'webkitAnimationEnd';
//         }
//         return 'animationend';
//     })();
//获取元素的高度和Y坐标
function getValue(className){
    var elem = $(''+className+'');
    //走路的路线坐标
    return {
        height:elem.height(),
        top:elem.position().top
    };
}
//封装小男孩走路过程
function BoyWalk(){
    var container = $('#content');
    var swipe = Swipe(container);
    //屏幕的宽度
    var visualWidth = container.width();
    //屏幕的高度
    var visualHeight = container.height();
    //路的Y轴坐标
    var pathY = function(){
        var data = getValue('.a_background_middle');
        return data.top + data.height/2;
    }();
    //纠正小男孩的坐标
    var $boy = $('#boy');
    var boyHeight = $boy.height();
    var boyWidth = $boy.width();
    $boy.css({
        top:pathY - boyHeight+25,
    });
    //桥的Y轴
    var bridgeY = function(){
        var data = getValue('.c_background_middle');
        return data.top;
    }();
    //纠正女孩的坐标
    var girl = {
        elem:$('.girl'),
        //获得小女孩的高度
        getHeight:function(){
            return this.elem.height();
        },
        //设定小女孩的坐标
        setOffset:function(){
            this.elem.css({
                left:visualWidth/2,
                //桥的y轴坐标-小女孩的高度就是小女孩的y轴坐标
                top:bridgeY - this.getHeight()
            })
        },
        //获取小女孩的坐标集合
        getOffset:function(){
            return this.elem.offset();
        },
        getWidth:function(){
            return this.elem.width();
        },
        //转身效果
        rotate:function(){
            this.elem.addClass('girl-rotate');
        }
    }
    girl.setOffset();
    //CSS3控制小男孩走路
    function slowWalk(){
        $boy.addClass('slowWalk');
    };
    slowWalk();
    //小男孩暂停走路
    function pauseWalk(){
        $boy.addClass('pauseWalk');
    };
    //小男孩回复走路
    function restoreWalk(){
        $boy.removeClass('pauseWalk');
    };
    //小男孩移动
    function startRun(options,runTime){
        var dfdPlay = $.Deferred();//创建异步等待
        //恢复走路
        restoreWalk();
        //运动的属性
        $boy.transition(
            options,
            runTime,
            'linear',
            function(){
                dfdPlay.resolve();//动画完成
            }
        );       
        return dfdPlay;//返回成功的接口，通过then来调用
    };
    //小男孩开始走路
    function walkRun(time,distX,distY){
        time = time || 3000;
        //脚动作
        slowWalk();
        //开始位移调用移动函数
        var d1 = startRun({
            left:distX + 'px',
            top:distY ? distY+'px' : undefined
        },time);
        return d1;
    };
    //计算移动的距离
    function calculateDist(direction,proprotion){//方向和比例
        //方向为x轴就用屏幕的长度*百分比为y轴就用屏幕的高度*百分比
        return (direction == "x" ? visualWidth:visualHeight)*proprotion;
    };
    //计算小男孩走路到商店的距离
    function walkToShop(runTime){
        var defer = $.Deferred();
        var doorObj = $('.door');
        //门的坐标
        var offsetDoor = doorObj.offset();
        var doorOffsetLeft = offsetDoor.left;
        //小男孩的坐标
        var offsetBoy = $boy.offset();
        var boyOffetLeft = offsetBoy.left;
        //当前需要移动的距离
        var instanceX = (doorOffsetLeft + doorObj.width() / 2)- (boyOffetLeft + $boy.width() / 2);
        //开始走路
        var walkPlay = startRun({
            transform: 'translateX(' + instanceX + 'px),scale(0.3,0.3)',
            opacity: 0.1
        },2000);
        //走路完成之后
        walkPlay.done(function() {
            $boy.css({
                opacity : 0,
            })
            defer.resolve();
        });
        return defer;
    };
    //小男孩走出商店还原
    function walkOutShop(runTime){
        var defer = $.Deferred();
        restoreWalk();
        var walkPlay = startRun({
            transform: 'scale(1,1)',
            opacity: 1
            }, runTime);
        //走路完毕
        walkPlay.done(function() {
            defer.resolve();
        });
        return defer; 
    };
    //拿花
    function talkFlower(){
        //增加延时等待效果
        var defer = $.Deferred();
        setTimeout(function(){
            //取花
            $boy.addClass('slowFlowerWalk');
            defer.resolve();
        },1000);
        return defer;
    }
    // function 
    //返回留个外部调用的接口
    return{
        //开始走路
        walkTo:function(time,proprotionX,proprotionY){
            //X轴的位移距离
            var distX = calculateDist('x',proprotionX);
            //Y轴的位移距离
            var distY = calculateDist('y',proprotionY);
            //返回开始走路的函数
            return walkRun(time,distX,distY);
        },
        //走进商店
        toShop:function(){
            return walkToShop.apply(null, arguments);
        },
        //走出商店
        outShop:function(){
            return walkOutShop.apply(null, arguments);
        },
        //停止走路
        stopWalk:function(){
            pauseWalk();
        },
        //取花
        talkFlower:function(){
            return talkFlower();
        },
        //获取男孩的宽度
        getWidth:function(){
            return $boy.width();
        },
        //小男孩复位及舍弃花的样式准备转身
        resetOriginal:function(){
            this.stopWalk();
            // 恢复图片(舍弃走路及带花的样式)
            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },
        //小男孩添加转身动作
        rotate:function(callback){
            restoreWalk();
            $boy.addClass('boy-rotate');
            if(callback){
                $boy.on('webkitAnimationEnd', function() {
                    callback();
                    $(this).off();
                })
            }
        },
        girl:girl
    }
};