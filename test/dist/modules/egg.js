//@charset "utf-8";
/**
 * 圈子敲金蛋的活动页面
 * 
 * @author yangkongqing@myhexin.com
 * @date 2014-03-12
 * Update Log  
 * v-1.0.0
 * 1. 初始化
 *  
 */
define(function(require, exports, module){
    var SuperSlide = require('SuperSlide');
    var userid = SNS.Cookies.get("userid");

    function Egg( selector ){
        this.$container = $( selector )
        this.StepOne();
        this.nextStep();
        this.clickEgg();
        this.triAgain();
        this.close();
        this.open();
    }

    Egg.prototype.nextStep = function(){
        var self = this;
        var $container = this.$container;
        $container.on('click', '.egg-step-btn', function(e){

            var $this = $(this);

            if( !userid ){
                $('#J_Login').trigger('click');
                return false;
            }
            if( $this.attr('data-step') == '3' ){
                $.ajax({
                    url: 'event/hasTimes/',
                    dataType: 'json',
                    success: function( result ){
                        if( result.errorcode == 0 && result.result == 0 ){
                            self.goStep( $('.egg-step7') );
                            return false;
                        } else {
                            var $next = $this.parents('.egg-step').next();
                            self.goStep($next);
                        }
                    }
                });
            } else {
                var $next = $this.parents('.egg-step').next();
                self.goStep($next);
            }
            e.preventDefault();
            //return false;
        });
    }


    Egg.prototype.triAgain = function(){
        var self = this;
        var $container = this.$container;
        $container.on('click', '.egg-step-try-btn', function(e){
            self.goStep( $('.egg-step1') );
            $container.find('.egg-step-hammer').attr('isClickEgg', '').hide();
            $container.find('.egg-step-egg').removeClass('egg-step-egg-broken');
            $container.find('.egg-step-award-name').html('');  
            $container.find('.egg-step-bind').html('').hide();
            $container.find('.egg-step-award-detail').html('').hide();
            e.preventDefault();
            // return false;
        });
    }

    Egg.prototype.close = function(){
        var $container = this.$container;
        $container.on('click', '.egg-close-btn', function(e){
            $container.slideUp(2000);
            e.preventDefault();
            // return false;
        });
    }

    Egg.prototype.open = function(){
        var self = this;
        var $container = this.$container;
        $container.on('openEggEvent', function(e){
            if( $container.is(":hidden") ){
                $container.slideDown(2000);
                self.triAgain();
            } else {
                window.scroll(0);
            }
            e.preventDefault();
            // return false;
        });
        
    }

    Egg.prototype.clickEgg = function(){
        var self = this;
        var $container = this.$container;
        $container.on('click', '.egg-step-area', function(e){
            var $hammer = $container.find('.egg-step-hammer');
            var $eggArea = $container.find('.egg-step-area');
            if( $hammer.attr('isClickEgg') == 'true' ){
                return ;
            }

            $.ajax({
                url: 'event/hitEgg/',
                dataType: 'json',
                success: function( result ){
                    var index = self.whichEggClick(e, $eggArea);
                    if(!index){
                        return ;
                    }
                    var pos = $hammer.position();
                    $hammer.css({
                        'top': pos['top'] - 50,
                        'left': pos['left'] + 90
                    });
                    $hammer.animate({
                        top: pos['top'] - 20,
                        left: pos['left'] - 20
                    }, 500, function(){
                        $container.find('.egg-step-egg').eq( index - 1 ).addClass('egg-step-egg-broken');
                        $hammer.hide();
                        self.clickCallback( result );
                    });
                    
                }
            });

            
        });
        $container.on('mousemove', '.egg-step-area', function(e){
            var x = e.pageX;
            var y = e.pageY;
            var $this = $(this);
            var pos = $this.offset();
            var $hammer = $container.find('.egg-step-hammer');
            var top = y - pos['top'] - $hammer.height() / 2;
            var left = x - pos['left'] - $hammer.width() / 2;
            var xr = $this.width() - $hammer.width();
            var yb = $this.height() - $hammer.height();
            if( top < -60 || left < 0 || top > yb || left > xr || $hammer.attr('isClickEgg') == 'true'　){
                return ;
            }
            $container.find('.egg-step-hammer').css({
                top: top,
                left: left
            }).show();
        });
    }

    Egg.prototype.whichEggClick = function(e, $eggArea){
        var x = e.pageX;
        var y = e.pageY;
        var pos = $eggArea.offset();
        var relTop = y - pos['top'];
        var relLeft = x - pos['left'];
        var $container = this.$container;
        var $hammer = $container.find('.egg-step-hammer');
        if( 0 <= relLeft && relLeft <= 260 ){
            $hammer.attr('isClickEgg', 'true');
            return 1
        } else if( 280 < relLeft && relLeft <= 520 ){
            $hammer.attr('isClickEgg', 'true');
            return 2;
        } else if ( 540 < relLeft && relLeft <= 780 ){
            $hammer.attr('isClickEgg', 'true');
            return 3;
        }
        return 0;
    }

    Egg.prototype.clickCallback = function( result ){
        var self = this;
        if( result.errorcode == 0 ){
            var $goStep;
            var type = parseInt(result.result.type);
            var msg = result.result.msg;
            var info = result.result.info;
            switch (type){
                case 0:
                    $goStep = $('.egg-step6');
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    $goStep = $('.egg-step5'); 
                    $goStep.find('.egg-step-award-name').html(msg);  
                    $goStep.find('.egg-step-bind').hide();
                    $goStep.find('.egg-step-award-detail').hide();
                    break
                case 6:
                case 7:
                    $goStep = $('.egg-step5'); 
                    $goStep = $('.egg-step5'); 
                    $goStep.find('.egg-step-award-name').html(msg);    
                    $goStep.find('.egg-step-award-detail').html(info).show();
                    if( !result.result.isbind ){
                        $goStep.find('.egg-step-bind').show();
                    } else {
                        $goStep.find('.egg-step-bind').hide();
                    }
                    break
                default:
                    break;
            }
        } else {
            $goStep = $('.egg-step7');
        }

        var clickEggTimer = setTimeout(function(){
            self.goStep( $goStep );
            clickEggTimer && clearTimeout(clickEggTimer);
        }, 800);
    }

    Egg.prototype.goStep = function( $next ){
        this.$container.find('.egg-step').hide();
        $next.show();
    }

    Egg.prototype.StepOne = function(){
        this.$container.slide({
            mainCell: '.J_SildeStep',
            effect: 'topLoop',
            scroll: 1,
            interTime: 2000,
            autoPlay: true,
            vis: 2,
            delayTime: 500
        });
    }

    module.exports = Egg;
});