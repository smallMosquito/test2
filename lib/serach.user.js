// ==UserScript==
// @name        serach
// @namespace   serach
// @description serach
// @include     http://*
// @include     https://*
// @version     1.0.2
// @run-at		document-start
// ==/UserScript==
if(!this.unsafeWindow) this.unsafeWindow = window;
(function(window, document){
	function search(){
		var t = this;
		t.search = {
			"google":{
				"icon":"http://www.google.com.hk/favicon.ico",
				"url":"http://www.google.com.hk/search?q=%s"
			},
			"baidu":{
				"icon":"http://www.baidu.com/favicon.ico",
				"url":"http://www.baidu.com/s?wd=%s&ie=utf-8"
			},
			"bing":{
				"icon":"http://cn.bing.com/favicon.ico",
				"url":"http://cn.bing.com/search?q=%s&go=&qs=bs&form=QBLH"
			},
			"youdao":{
				"icon":"http://www.youdao.com/favicon.ico",
				"url":"http://www.youdao.com/search?q=%s&ue=utf8"
			},
			"搜库":{
				"icon":"http://www.soku.com/favicon.ico",
				"url":"http://www.soku.com/v?keyword=%s"
			},
			"淘宝":{
				"icon":"http://s.taobao.com/favicon.ico",
				"url":"http://s.taobao.com/search?q=%s&commend=all&search_type=item"
			},
			"wiki百科":{
				"icon":"http://zh.wikipedia.org/favicon.ico",
				"url":"http://zh.wikipedia.org/wiki/%s"
			},
			"百度百科":{
				"icon":"http://baike.baidu.com/favicon.ico",
				"url":"http://baike.baidu.com/search/word?word=%s&pic=1&sug=1&enc=utf8"
			}
		};
		t.string = "";
	}
	search.prototype = {
		"show":function(x, y){
			var t = this;
			var nodes = t.node.querySelectorAll('a[search]');
			for(var i = 0; i<nodes.length; i++){
				if(nodes[i].className=="ujs_search_link_go") nodes[i].href = t.string;
				else nodes[i].href = nodes[i].getAttribute("search").replace("%s", window.encodeURIComponent(t.string));
			}
			t.node.style.display = "block";
			var w = t.node.offsetWidth;
			var h = t.node.offsetHeight;
			var wx = window.scrollX;
			var wy = window.scrollY;
			var ww = window.innerWidth;
			var wh = window.innerHeight;
			var xm = wx + ww - w;
			var ym = wy + wh - h;
			x = (x+10)>xm?xm:(x+10)<wx?wx:x+10;
			y = y>ym?ym:y<wy?wy:y;
			t.node.style.left = x + "px";
			t.node.style.top = y + "px";
		},
		"hide":function(){
			var t = this;
			t.node.style.left = "0px";
			t.node.style.top = "0px";
			t.node.style.display = "none";
		},
		"create":function(){
			var t = this;
			t.node = document.createElement("search");
			t.node.style.position = "absolute";
			t.node.style.border = "2px solid #6432C8";
			t.node.style.zIndex = "1048576";
			t.node.style.left = "0px";
			t.node.style.top = "0px";
			t.node.style.display = "none";
			t.node.style.background = "#FFFFFF";
			t.node.style.cursor = "pointer";
			t.node.style.color = "#000000";
			t.node.innerHTML += '<style type="text/css">\
				search>a{\
					display:block!important;\
					margin:0px!important;\
					border:0px!important;\
					padding:1px 4px!important;\
					font:14px/20px "宋体","Arail"!important;\
					height:20px!important;\
					background:#FFFFFF!important;\
					color:#000000!important;\
					text-decoration:none!important;\
				}\
				search>a>img{\
					margin:0px!important;\
					border:0px!important;\
					padding:1px 3px!important;\
					width:16px!important;\
					height:16px!important;\
					background:transparent!important;\
					vertical-align:middle!important;\
				}\
				search>a:visited{\
					color:#000000!important;\
					text-decoration:none!important;\
				}\
				search>a:hover{\
					color:#000000!important;\
					background:#C864C8!important;\
					text-decoration:none!important;\
				}\
			</style>\
			<a class="ujs_search_link_go" search="" target=\"_blank\"><img src="/favicon.ico"/>直接访问</a>';
			t.node.addEventListener("click",function(e){
				e.stopPropagation();
				t.hide();
			},false);
			for(var i in t.search){
				t.node.innerHTML += "<a class=\"ujs_search_link\" search=\""+t.search[i]["url"]+"\" target=\"_blank\"><img src=\""+t.search[i]["icon"]+"\"/>"+i+"</a>";
			}
			document.documentElement.appendChild(t.node);
		},
		"init":function(){
			var t = this;
			t.create();
			function getString(){
				var s = window.getSelection(), r, c
				if(s.rangeCount){
					r = s.getRangeAt(0);
					c = r.cloneContents();
					return c.textContent?c.textContent:"";
				}
				return "";
			}
			window.addEventListener("mouseup",function(e){
				var E = e.target, x = e.pageX, y = e.pageY;
				if(E.nodeName=="#document"){
					t.hide();
				}else if(E==t.node || E.className=="ujs_search_link"){
					e.stopPropagation();
					e.preventDefault();
				}else{
					t.string = getString();
					if(t.string!=="") t.show(x, y);
					else t.hide();
				}
			},false);
		}
	};
	var o = new search();
	o.init();
})(unsafeWindow, unsafeWindow.document);