//@charset "utf-8";

define(function(require, exports, module) {
	
	var Dialog = require('./Dialog/Dialog');

	/**
	 * [Postlist 列表一系列操作]
	 * @param {[Object]} $container [包含列表的jQ节点]
	 * @param {[Object]} options    [description]
	 */
	function Postlist($container, options){
		this.funcActionArr = [];
		var arrLen = 0;
		for(var i in options){
			this.funcActionArr[arrLen++ ] = i;
		}

		this.init($container, options);

	}
	Postlist.prototype.init = function($container, options){
		var self = this;
		$container.on('click', function(e){
			var $target = $(e.target);
			if(self.isFunAction($target)){
				var userid = SNS.Cookies.get('userid');
				if(!userid){
					var showLoginBox = require('./loginbox');
					showLoginBox(function(){
						window.location.reload();
					});
					return false;
				}
				for(var i in options){
					if(self.$target.attr('func-action') === i){
						var ajaxOptions = {};
						ajaxOptions['url'] = options[i]['url'];
						var $target = self.$target;

						ajaxOptions['data'] = self.segmenteStr($target.attr("data-action"));
						options[i]['callback']($target, ajaxOptions);
						return true;
					}
				}
			}

		});
	}
	/**
	 * [ 是否包含funs-data]
	 * @param  {[type]} type [节点的func-action属性]
	 * @return {[type]}      [description]
	 */
	Postlist.prototype.isContainsType = function(type){
		var funcActionArr = this.funcActionArr;
		for(var i = 0, len = funcActionArr.length; i < len; i++ ){
			if( funcActionArr[i] ===  type){
				return true
			}
		}
		return  false;
	}
	/**
	 * [ 判读是否是要操作的节点]
	 * @param  {[type]} $target [description]
	 * @return {[type]}         [description]
	 */
	Postlist.prototype.isFunAction = function($target){
		var funAction = $target.attr('func-action');
		if(!this.isContainsType(funAction)){
			$target = $target.parent();
			funAction = $target.attr('func-action');

			if(this.isContainsType(funAction)){
				this.$target = $target;
				return true;
			}
		} else {
			this.$target = $target;
			return true;
		}
		return false;
	}
	/**
	 * [ 将data-action转化为字符串]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	Postlist.prototype.segmenteStr = function(data){
    	var args = {};
    	if( typeof data == 'undefined' ){
    		return args;
    	}
    	var pairs = data.split("&");
    	for(var i = 0, len = pairs.length; i < len; i++){
    		var pos = pairs[i].indexOf('=');
    		var argsName = pairs[i].substring(0, pos);
    		var value = pairs[i].substring(pos + 1);
    		args[argsName] = value;
    	}
    	return args;
    };

	/**
	 * [alphaAddOna 支持赞同的数字加1前端渲染]
	 * @return {[type]}      [返回字符串的数字+1]
	 */
	String.prototype.alphaAddOne = function(){
		var _this = this;
		if( $.trim(_this) === ''){
			_this = '(0)';
		}
		if( $.trim(_this) === "+1" ){
			_this = '0';
		}
		return _this.replace(/\d+/, function(matchs){
			if(typeof matchs == 'undefined'){
				matchs = '';
			}
			return parseInt(matchs) + 1; 
		});
	}
	// 根据url判断是否是单篇页
	function fnIsAticlePage(){
		var sHref = location.href;
		if( $('.article-main').length ){
			return true
		} else {
			return false;
		}
	}
	/**
	 * [addAgreeCallBack 添加赞]
	 * @param {[type]} $target     [原始节点]
	 * @param {[type]} ajaxOptions [description]
	 */
	function addAgreeCallBack($target, ajaxOptions){
		var protocolOptions = ajaxOptions;
		protocolOptions.$target = $target;
		if( $target.find('.icon-praise-dis').length ){
			return ;
		}
		protocolOptions.successCallback = function(result, options){
			var $target = options.$target;
			var data = options.data;
			var $targetNum = $target.find('span');
			var numText = $targetNum.text();
			$targetNum.text(numText.alphaAddOne());
			$target.attr('func-action', "");
			$target.attr('title', '已赞过');
			$target.find('.icon16').removeClass('icon-praise').addClass('icon-praise-dis');
			// 如果是单篇页面，数字修改和模拟添加头像
			if( fnIsAticlePage() ){
				var $articleAgreeNum = $target.find('b');
				var sNum = $articleAgreeNum.text();
				$articleAgreeNum.text( sNum.alphaAddOne() ); 
				var $imgList = $('#J_AgreeImgslist');
				if( $imgList.find('.article-agree-item').length == 0 || $imgList.find('.article-agree-item').length <= 14 ){
					//SNS.getUserAvator('', function(imgDom){
						//console.log( imgDom )
						//var $imgList = $target.parents('.article-agree-wrap').find('.article-agree-imgslist');
						if( $imgList.find('.article-agree-item').length == 14 ){
							$imgList.find('.article-agree-item').eq(12).hide();
						} 
						if( $imgList.find('.article-agree-item').length == 0 ){
							$('<div class="article-agree-imgs clearfix"><i class="arrow-up article-arrow-out"></i><i class="arrow-up article-arrow-in"></i></div>').appendTo($imgList);
							
						}

						$imgList.find('.article-agree-imgs').prepend( $('<a href="javascript:;" class="article-agree-item"></a>').append( $('.header-user-avater').clone().removeClass('header-user-avater') ) );
						//$target.parents('.article-agree-wrap').find('.article-agree-imgs').slideDown();
					//});
				}
			}
		}
		SNS.Protocol(protocolOptions);
	}

	/**
	 * [wooOneWooCallBack 踩一踩的接口]
	 * @param {[type]} $target     [原始节点]
	 * @param {[type]} ajaxOptions [description]
	 */
	function wooOneWooCallBack($target, ajaxOptions){
		var protocolOptions = ajaxOptions;
		protocolOptions.$target = $target;
		if( $target.find('.icon-woo-dis').length ){
			return ;
		}
		protocolOptions.successCallback = function(result, options){
			var $target = options.$target;
			var data = options.data;
			var $targetNum = $target.find('b');
			var numText = $targetNum.text();
			$targetNum.text(numText.alphaAddOne());
			$target.attr('func-action', "");
			$target.attr('title', '已踩过');
			$target.find('.icon16').removeClass('icon-woo').addClass('icon-woo-dis');
		}
		SNS.Protocol(protocolOptions);
	}
	/**
	 * [editPostConfirm 帖子操作弹出的对话框]
	 * @return {[type]} [description]
	 */
	function editPostConfirm(ensureCallback, protocolOptions){
		var $J_PostListConfirm = $('#J_PostListConfirm');
		if( $J_PostListConfirm.length){
			$J_PostListConfirm.show();
			$J_PostListConfirm.find('#J_isRemindAuthor').attr("checked", false);
			// 导致第2次请求参数为第一次的
			// return false
		} else {
			var postListConfirmTpl = require('../tpl/postListConfirm.tpl');
			$('body').append( postListConfirmTpl );
			$J_PostListConfirm = $('#J_PostListConfirm');
		}

		SNS.setMask();
		SNS.setVerticalCenter($J_PostListConfirm);
		var $target = protocolOptions.$target;
		var text = $target.text();

		$J_PostListConfirm.find('.postlist-dialog-text').text('您确定要对帖子' + text + "操作");
		var $J_isRemindAuthor = $J_PostListConfirm.find('#J_isRemindAuthor');
		$J_isRemindAuthor.attr("checked", false);

		
		$J_PostListConfirm.delegate('.ui-dialog-close', 'click', function(){
			$J_PostListConfirm.hide();
			SNS.hideMask();
		});

		$J_PostListConfirm.delegate('#J_PostlistBtnCancle', 'click', function(){
			$J_PostListConfirm.find('.ui-dialog-close').trigger('click');
		});

		// $J_PostListConfirm.delegate('#J_PostlistBtnEnsure', 'click', function(e){

		// 	if(!$J_isRemindAuthor.attr("checked")){
		// 		protocolOptions.data.author = "";	
		// 	}
		// 	protocolOptions.$J_PostListConfirm = $J_PostListConfirm;
		// 	$.isFunction(ensureCallback) && ensureCallback(protocolOptions);
		// });
		// 事件重复绑定导致多次发请求的bug by ykq
		$J_PostListConfirm.find('#J_PostlistBtnEnsure').off('click').on('click', function(){
			if(!$J_isRemindAuthor.attr("checked")){
				protocolOptions.data.author = "";	
			}
			protocolOptions.$J_PostListConfirm = $J_PostListConfirm;
			$.isFunction(ensureCallback) && ensureCallback(protocolOptions);
			SNS.hideMask();
		});
	}

	/**
	 * [editPostCallback 帖子的一系列操作]
	 * @param  {[type]} $target     [description]
	 * @param  {[type]} ajaxOptions [description]
	 * @return {[type]}             [description]
	 */
	function editPostCallback($target, ajaxOptions){
		var protocolOptions = ajaxOptions;
		protocolOptions.$target = $target;
	
		var ensureCallback = function(options){
			options.successCallback = function(result, options){
				var $J_PostListConfirm = options.$J_PostListConfirm;
				$J_PostListConfirm.hide();
				var $target = options.$target;
				var iconsPost = {
					"3": "icon-npl-top", 
					"2": "icon-npl-recommend", 
					"1": "icon-npl-perfect"
				};
				var iconsPostHtml = {
					"3": '<i class="icon-npl icon-npl-top" title="置顶">置顶</i>',
					"2": '<i class="icon-npl icon-npl-recommend" title="荐">荐</i>',
					"1": '<i class="icon-npl icon-npl-perfect" title="精">精</i>'
				};
				var data = options.data;
				var $iconPost = $target.parents('.postlist').find('.icon-post');
				var dataAction = $target.attr('data-action');
				var text = $target.text();
				var bIsAticle = fnIsAticlePage();
				if( !bIsAticle && data.pos == '3' ) {
					window.location.reload();
				}
				var $title = bIsAticle ? $target.parents('.article-item-head').find('.article-item-title'): $target.parents('.npl').find('.npl-head')
				// 删除
				if(data.val == "-1"){
					if( bIsAticle ){
						// 链接跳转
						location.href = $('.article-more').attr('href');
					} else {
						$target.parents('.npl').slideUp();
					}
					
				} else {
					if(data.val == 0){
						// XX操作改为取消XX
						//$iconPost.addClass(iconsPost[data.pos]);
						$title.append( iconsPostHtml[data.pos] );
						$target.text("取消" + text);	
						$target.attr('data-action', dataAction.replace('val=0', 'val=1'));
					} else {
						// 取消XX操作改为XX
						//$iconPost.removeClass(iconsPost[data.pos]);
						$title.find('.' + iconsPost[data.pos]).remove();
						$target.text(text.replace('取消',''));
						$target.attr('data-action', dataAction.replace('val=1', 'val=0'));
					}
					
				}
				
				SNS.alertBox({
					"tipContent": "操作成功"
				});
			}
			options.failCallback = function(result, options){
				var $J_PostListConfirm = options.$J_PostListConfirm;
				$J_PostListConfirm.hide();
				SNS.alertBox({
					"iconType": "error",
					"tipContent": result.errormsg
				});
			}
			SNS.Protocol(options);
		}
		editPostConfirm(ensureCallback, protocolOptions);
	}

	/**
	 * [showPostlistSettings 显示隐藏帖子操作]
	 * @param  {[type]} $J_PostList [description]
	 * @return {[type]}             [description]
	 */
	function showPostlistSettings($J_PostList){
		$J_PostList.delegate(".npl-operate", "mouseover", function(){
			var $this = $(this);
			var $setAction = $this.next('.postlist-set-action');
			// var $parentsPostlistSet = $this.parents(".postlist-set");
			// $parentsPostlistSet.css({
			// 	"z-index": 99
			// });
			$setAction.show();
			$setAction.mouseover(function(){
				$setAction.show();
				// $parentsPostlistSet.css({
				// 	"z-index": 99
				// });
				//$this.addClass('postlist-set-name-hover');
			});
			$setAction.mouseout(function(){
				$setAction.hide();
				// $parentsPostlistSet.css({
				// 	"z-index": 10
				// });
				//$this.removeClass('postlist-set-name-hover');;
			});
		});

		$J_PostList.delegate(".npl-operate", "mouseout", function(){
			var $this = $(this);
			$this.next('.postlist-set-action').hide();
			// $this.parents(".postlist-set").css({
			// 	"z-index": 10
			// });
			
		});
	};

	/**
	 * [articleCommentCallback 单篇文章页评论]
	 * @param  {[type]} $target     [description]
	 * @param  {[type]} ajaxOptions [description]
	 * @return {[type]}             [description]
	 */
	function articleCommentCallback($target, ajaxOptions){
		var protocolOptions = ajaxOptions;
		protocolOptions.$target = $target;
		protocolOptions.data.content = $target.parents('.editor-small').find('textarea').val() || $target.parents('.wb_comment').find('textarea').val() || "";
		protocolOptions.successCallback = function(result, options){
			var $target = options.$target;
			$target.parents('.comments-editor-box').hide().find('textarea').val('');
			$target.parents('.wb_comment').hide().find('textarea').val('');
			var $commentsList = $target.parents('.comments-box').find('.comments-list');
			if( !$commentsList.length ){
				commentsList = '<div class="comments-list"></div>';
				var $commentsList = $(commentsList).prependTo( $target.parents('.comments-box') );
			}
			$commentsList.prepend( result.result.html );
			SNS.alertBox({
				"tipContent": "发布成功"
			});

		}
		protocolOptions.failCallback = function(result, options){
			if( result.errorcode == -2 ){
	        	var dialog = new Dialog({
	        		'data':{
	        			'tipTpl':'<i class="ui-texttip ui-texttip-question-m"></i><span class="ui-dialog-text">当前您没加入该圈，无法评论。确定加入圈子吗？</span>'
	        			,'showAction': true
	        			,'ftTpl': '<div class="ui-dialog-ft"><div class="ui-dialog-tip"><div class="ui-dialog-dib"> <a class="ui-dialog-btn ui-dialog-btn-ok J_PostlistBtnEnsure" href="javascript:void(0);">加入圈子</a> <a class="ui-dialog-btn ui-dialog-btn-cancle J_PostlistBtnCancle" href="javascript:void(0);">取消</a> </div></div></div>'
	        		}
	        		,'afershowCallback': function($Dialog){
	        			$Dialog.on('click', '.J_PostlistBtnEnsure', function(){
	        				$Dialog.find('.ui-dialog-close').trigger('click');
	        				$('#J_SideJoinBtn').length && $('#J_SideJoinBtn').trigger('click');
	        			});
	        			$Dialog.on('click', '.J_PostlistBtnCancle', function(){
	        				$Dialog.find('.ui-dialog-close').trigger('click');
	        			});		        			
	        		}
	        	});
			} else {
				SNS.alertBox({
					"iconType": "error",
					"tipContent": result.errormsg
				});
			}

		}
		SNS.Protocol(protocolOptions);
	}

	/**
	 * [commentReplyCallback 回复的下拉评论]
	 * @param  {[type]} $target     [description]
	 * @param  {[type]} ajaxOptions [description]
	 * @return {[type]}             [description]
	 */
	function commentReplyCallback($target, ajaxOptions){
		var data = ajaxOptions.data;
		var pid = data['rid'];
		var $feedListComment = $("#feedListComment_" + pid);
		if( $feedListComment.length > 0){
			if($feedListComment.css("display") == "none"){
				$feedListComment.show();
			} else {
				$feedListComment.hide();
			}
			return false;
		}
		var commentDropDomArr = [];
		commentDropDomArr.push(
			'<div id="feedListComment_' + pid +'" class="wb_comment">',
				'<div class="wb_arrow">',
					'<em class="wa_em">&#9670;</em>',
					'<span class="wa_span">&#9670;</span>',
				'</div>',
				'<div class="wb_textarea_box">',
					'<textarea id="comment_' + pid +'" node-type="comment_' + pid +'_input" submit-btn="postComment_' + pid +'" class="wb_textarea"></textarea>',
				'</div>',
				'<div class="wb_action clearfix">',
					'<div class="wb_kind">',
						'<a href="javascript:void(0)" title="表情" node-type="face_btn"  input-id="comment_' + pid +'"><img class="ico_face" src="http://i.thsi.cn/images/ucenter/transparent.gif">表情</a>',
					'</div>',

					'<div class="btn_post_box">',
						'<a id="postComment_' + pid +'" func-action="articleComment" data-action="' + $target.attr('data-action') + '" class="btn_post disable" href="javascript:void(0)"><span>发布</span></a>',
					'</div>',
				'</div>',
				'<div class="wb_comment_line"></div>',
			'</div>'
		);
		if( $target.parents('.comments-action').length > 0){
			$target.parents('.comments-action').after(commentDropDomArr.join(''));
		} else {
			$target.parents('.mymsg-item').find('.mymsg-detail').append(commentDropDomArr.join(''));
		}
		
		var $comment = $('#comment_' + pid);
		$comment.attr('placeholder', '回复 ' + data.nickname + ": ");

		initEditBox($comment);
		$comment.focus();
	}


    /**
     * 对页面上的文本框使用ctrl+enter功能，激活文本框必须有submit-btn属性对应发布按钮的id，方法有局限性
     * 
     * @method initCtrlEnter
     * @return {[type]}
     */
    var initCtrlEnter = function(){
        $("body").keydown(function(e){
            if(e.keyCode == 13 && e.ctrlKey){
                var $activeElement = $(document.activeElement);
                if($activeElement.attr("submit-btn")){
                    $("#" + $activeElement.attr("submit-btn")).trigger("click");
                }
            }
        });
    };
    /**
     * [checkCommentBtn 检测评论框是否有内容，如果有内容的话讲发布按钮变为可以点击]
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    function checkCommentBtn(selector){
		$(selector).on('keyup focus', function(e){
			var $target = $(e.target);
			if($target.is("textarea")){
				$target.on('keyup focus', function(){
					var areaFullText = $.trim($(this).val());
					var btnID = $target.attr("submit-btn");
					if(areaFullText.length > 0){
						$("#"+btnID).removeClass("disable");
					}else{
						$("#"+btnID).addClass("disable");
					}
				})
			}
		});
    }

    /**
     * [postLightenCallback 时间轴帖子的点亮]
     * @param  {[type]} $target     [description]
     * @param  {[type]} ajaxOptions [description]
     * @return {[type]}             [description]
     */
	function postLightenCallback($target, ajaxOptions){
		var protocolOptions = ajaxOptions;
		protocolOptions.$target = $target;
		protocolOptions.successCallback = function(result, options){
			var $target = options.$target;
			$target.text("已点亮");
			$target.removeAttr('func-action');
			SNS.alertBox({
				"tipContent": "点亮成功"
			});

		}
		protocolOptions.failCallback = function(result, options){
			SNS.alertBox({
				"iconType": "error",
				"tipContent": "点亮失败"
			});
		}
		SNS.Protocol(protocolOptions);
	}

	/**
	 * [joinCircleCallback 没有浏览权限的时候加入圈子按钮的点击]
	 * @param  {[type]} $target [description]
	 * @return {[type]}         [description]
	 */
	function joinCircleCallback($target){
		$('#J_SideJoinBtn').trigger('click');
	}

	var ImgZoom = require('../lib/artZoom');
	
	/**
	 * [initEditBox textarea的jQ]
	 * @param  {[type]} $container [description]
	 * @return {[type]}            [description]
	 */
	function initEditBox($container){
		var face = require('../postbox/Face');
		var faceView = new face.FaceView();
		require('../lib/autoTextarea');
		$container.autoTextarea({maxHeight:100 ,minHeight:18 });
        $container.bind("heightchange", function(){
            faceView.rePosiSuggestNode();
        });
		$container.on('keyup focus', function(){
			var areaFullText = $.trim($(this).val());
			var btnID = $container.attr("submit-btn");
			if(areaFullText.length > 0){
				$("#"+btnID).removeClass("disable");
			}else{
				$("#"+btnID).addClass("disable");
			}
		})
	}
			
	exports.init = function(selector){
		var imgzoom = new ImgZoom($(selector));	
		
		showPostlistSettings($(selector));
		initCtrlEnter();
		var postlist = new Postlist($(selector), {
			"addAgree": {
				"url": "post/addAgree",
				"callback": addAgreeCallBack
			},
			"wooOneWoo": {
				"url": "post/addAgree",
				"callback": wooOneWooCallBack
			},
			"editPost": {
				"url": "post/editPost",
				"callback": editPostCallback
			},
			"articleComment": {
				"url": "comment/addComment/",
				"callback": articleCommentCallback
			},
			"commentReply": {
				"url": "",
				"callback": commentReplyCallback
			},
			"postLighten": {
				"url": "post/lighten/",
				"callback": postLightenCallback
			},
			"joinCircle": {
				"url":"",
				"callback": joinCircleCallback
			}
		});	
		checkCommentBtn(selector);
		if($('#ArticleComent').length){
			initEditBox($('#ArticleComent'));
		}
	}
});