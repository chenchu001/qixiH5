window.onload = init;
//配置项
function init(){
    var container = $("#content");
    var swipe = new Swipe(container);
    //屏幕的宽度
    var visualWidth = container.width();
    //屏幕的高度
    var visualHeight = container.height();
    var snow = new Snow();
    //封装页面随小男孩滚动而滚动
    function scrollTo(time,proprotionX){
        var distX = container.width() * proprotionX;
        //调用公用的swipe方法
        swipe.scrollTo(distX, time);
    }
    //音乐配置
    var audioConfig = {
        enable: true, // 是否开启音乐
        playURL: 'static/music/happy.wav', // 正常播放地址
        cycleURL: 'static/music/1111.mp3' // 正常循环播放地址
    }
    //背景音乐
    var audio;
    function Html5Audio(url,isloop){
        audio = new Audio(url);
        audio.autoPlay = true;
        audio.loop = isloop || false;
        audio.play();
        return {
            end: function(callback) {
                audio.addEventListener('ended', function() {
                    callback();
                }, false);
            }
        };
    }
    var audio1 = Html5Audio(audioConfig.playURL);
    audio1.end(function(){
            Html5Audio(audioConfig.cycleURL, true);
    })
    //控制音乐播放和暂停
    $('.music').click(function(){
        if(audio.paused){
            audio.play();
            $(this).css({'animationPlayState':'running','loop':'true'});
            $(this).css({'webkitAnimationPlayState':'running','loop':'true'});
        }else{
            audio.pause();
            $(this).css('animationPlayState','paused');
            $(this).css('webkitAnimationPlayState','paused');
        }
    });
    //太阳公转
    $("#sun").addClass('rotation');
    //飘云
    $(".cloud:first").addClass('cloud1Anim');
    $(".cloud:last").addClass('cloud2Anim');
    //先将页面定位到第二屏
    // scrollTo(0,2);
    var boy = BoyWalk();
    //右边飞鸟
    var bird = {
        elem: $(".bird"),
        fly: function() {
            this.elem.addClass('birdFly')
            this.elem.transition({
                right: container.width()
            }, 15000, 'linear');
        }
    };
    //logo动画
    var logo = {
        elem:$('.logo'),
        run:function(){
            this.elem.addClass('logolightSpeedIn').on('webkitAnimationEnd',function(){
                $(this).addClass('logoshake');
            })
        }
    }
    //封装开门和关门函数
    function doorAction(left,right,time){
        var $door = $('.door');
        var doorLeft = $('.door-left');
        var doorRight = $('.door-right');
        var defer = $.Deferred();
        var count = 2;//用来记录左边门开和右边门开的动作
        //等待开门完成
        var complete = function(){
            //左边门开先执行一遍，然后右边门开在执行一遍
            if(count == 1){
                defer.resolve();//动画完成
                return
            }
            count--;
        };
        doorLeft.transition({
            'left': left
        }, time, complete);
        
        doorRight.transition({
            'left': right
        }, time, complete);
        return defer;
    };
    //灯动画
    var lamp = {
        elem : $('.b_background'),
        bright: function() {
            this.elem.addClass('lamp-bright')
        },
        dark: function() {
            this.elem.removeClass('lamp-bright')
        }
    }
    //开门
    function openDoor(){
        return doorAction('-50%','100%', 2000);
    };
    openDoor().then(function(){
        lamp.bright();
    });
    function closeDoor(){
        return doorAction('0%','50%', 2000);
    };
    closeDoor().then(function(){
        lamp.dark();
    })
    //通过then调用
    boy.walkTo(2000,0.5).then(function(){
        //第一次走结束
        scrollTo(5000,1);
        bird.fly();
    }).then(function(){
        //第二次行走
        return boy.walkTo(5000,0.5);
    }).then(function(){
        //停止行走
        boy.stopWalk();
    }).then(function(){
        //开门
        return openDoor();
    }).then(function(){
        //开灯
        lamp.bright();
    }).then(function(){
        //进商店
        return boy.toShop(2000)
    }).then(function(){
        //拿花
        return boy.talkFlower();
    }).then(function() {
        //出商店
        return boy.outShop(2000);
    }).then(function(){
        //关门
        return closeDoor();
    }).then(function() {
        //灯暗
        lamp.dark();  
    }).then(function(){
        scrollTo(5000, 2);//滑动的x的距离，滑动时间，其实小男孩本身没有移动，移动的是背景 
    }).then(function(){
        //男孩开始在第三P行走
        return boy.walkTo(5000,0.1);
    }).then(function(){
        //小男孩的纵坐标比例为小女孩的纵坐标/总高度
        return boy.walkTo(3000,0.25,(boy.girl.getOffset().top ) / visualHeight);
    }).then(function(){
        return boy.walkTo(2500,(boy.girl.getOffset().left-boy.getWidth())/visualWidth);
    })
    // .then(function(){
    //     boy.resetOriginal();
    // })
    .then(function(){
        //转身动作这里继续用异步等待的方式传回调
        var d =  $.Deferred();  
        boy.girl.rotate();
        // boy.rotate(); 
        setTimeout(function() {
            boy.rotate(function() {//写一个回调函数
                // 开始logo动画
                logo.run();
                snow();
                d.resolve();
            });
        }, 100);
        return d;
    })
}

