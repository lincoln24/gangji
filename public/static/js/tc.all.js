/***
 * 小鸟弹出层插件，由漫画Jquery弹出层插件改编而来
 * QQ:9169775
 * 编写时间：2013年3月21号
 * version:1.0
***/
function popWin(obj){

	var _z=1000;//新对象的z-index
	var _mv=false;//移动标记
	var _x,_y;//鼠标离控件左上角的相对位置		
	var _obj= $("#"+obj);
	var _wid= _obj.width();
	var _hei= _obj.height();
	var _tit= _obj.find(".tit");
	var _cls =_obj.find(".close");
	var _cls_1 =_obj.find(".close1");
	var _cls_2 =_obj.find(".close2");
	var docE =document.documentElement;
	var left=(docE.clientWidth-_obj.width())/2;
	var top =(docE.clientHeight-_obj.height())/2;
	_obj.css({	"left":left,"top":top,"display":"block","z-index":_z-(-1)});


	_tit.mousedown(function(e){
		_mv=true;
		_x=e.pageX-parseInt(_obj.css("left"));//获得左边位置
		_y=e.pageY-parseInt(_obj.css("top"));//获得上边位置
		_obj.css({	"z-index":_z-(-1)}).fadeTo(50,.5);//点击后开始拖动并透明显示
		$("body").bind("mouseup",function(event){
			_mv=false;
			_obj.fadeTo("fast",1);//松开鼠标后停止移动并恢复成不透明
			$(this).unbind(event);
		});
	});
	/*_tit.mouseup(function(e){
		_mv=false;
		_obj.fadeTo("fast",1);//松开鼠标后停止移动并恢复成不透明
	});*/
	
	$(document).mousemove(function(e){
		if(_mv){
			var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
			if(x<=0){x=0};
			x=Math.min(docE.clientWidth-_wid,x)-5;
			var y=e.pageY-_y;
			if(y<=0){y=0};
			y=Math.min(docE.clientHeight-_hei,y)-5;
			_obj.css({
				top:y,left:x
			});//控件新位置
		}
	});

			_cls.click(function(){
			  _obj.hide();
		     $("#maskLayer").remove();
	});
			_cls_1.click(function(){
			 /* _obj.remove();
		     $("#maskLayer").remove();*/
	});
	        _cls_2.click(function(){
		      	_obj.hide();
				$("#maskLayer").remove();
			});
	$('<div id="maskLayer"></div>').appendTo("body").css({
		"background":"#000","opacity":".4","top":0,"left":0,"position":"absolute","zIndex":"999"
	});
	reModel();
	$(window).bind("resize",function(){reModel();});
	$(document).keydown(function(event) {
		if (event.keyCode == 27) {
			$("#maskLayer").remove();
			_obj.hide();
		}
	});
	function reModel(){
		var b = docE? docE : document.body,
		height = b.scrollHeight > b.clientHeight ? b.scrollHeight : b.clientHeight,
		width = b.scrollWidth > b.clientWidth ? b.scrollWidth : b.clientWidth;
		$("#maskLayer").css({
			"height": height,"width": width
		});
	}
}