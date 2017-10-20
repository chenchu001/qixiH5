//封装移动函数
function Swipe(container){
    var container = $('#content');
    var element = container.find(":first");
    var slides = element.find("li");
    var width = container.width();
    var height = container.height();
    //设定窗口的高度宽度
    element.css({
        'width':(slides.length * width) + 'px',
        'height':height+'px'
    });
    //设定每一个li的高度和宽度
    $.each(slides,function(index){
        var slide = slides.eq(index);
        slide.css({
            width:width+'px',
            height:height+'px'
        });
    });
    //定义一个空对象swipe
    var swipe = {};
    //监控完成与移动
    swipe.scrollTo = function(x,speed){
        //执行动画移动
        element.css({
            'transition-timing-function' : 'linear',
            'transition-duration'         : speed + 'ms',
            'transform'                  : 'translate3d(-' + x + 'px,0px,0px)'
        });
        return this;
    }
    return swipe;
}