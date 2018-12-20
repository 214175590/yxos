/**
 * ==============================================
 * 
 * ==============================================
 */

+ function($, win){
	var DIRNAME_RE = /[^?#]*\//;
	
	function dirname(path) {
        return path.match(DIRNAME_RE)[0];
    }
	
	var doc = document;
    var cwd = (!location.href || location.href.indexOf('about:') === 0) ? '' : dirname(location.href);
    var scripts = doc.scripts;
    var root = (function(){
    	var urls = cwd.substring(cwd.indexOf("//") + 2),
    		one = urls.indexOf("/");
    	if(one != -1){
    		urls = urls.substring(one, urls.indexOf('/', one + 1) + 1);
    		if(urls){
    			return urls;
    		}
    	}
    	return "/";
    })();
    
    var yxosScript = doc.getElementById("yxosnode") || scripts[scripts.length - 1];
    
    var yxosDir = dirname(getScriptAbsoluteSrc(yxosScript) || cwd);
	
	function getScriptAbsoluteSrc(node) {
        return node.hasAttribute ? node.src : node.getAttribute("src", 4);
    }
	
	win.YXOs = {
		name: "YXOs",
		version: "1.0",
		
		base: cwd,
		
		root: root,
		
		path: yxosDir,
		
		script: yxosScript,
		
		globalConfig : {
						
			theme: 'default',
			
			desktopIconWidth: 90,
			
			desktopIconHeight: 90
			
			
		},
		
		screenWidth: function(){
			return $(this.desktop.body).width();
		},
		
		screenHeight: function(){
			return $(this.desktop.body).height();
		},
		
		clientHeight: function(){
			return $(this.desktop.body).height() - $(this.desktop.taskbar.body).height();
		},
		
		utils: {
			
			is: function(value, type){
				return Object.prototype.toString.call(value) === "[object " + type + "]";
			},
			
			format: function(){
				var res = arguments[0],
					l = arguments.length;
				if(res && l > 1){
					for(var i = 1; i < l; i++){
						res = res.replace('{' + (i - 1) + '}', arguments[i]);
					}
				}
				return res;
			},
			
			formatByJson: function(str, json){
		    	if(this.is(json, 'Object')){
		    		for(var key in json){
		    			str = str.replace("{" + key + "}", json[key]);
		    		}
		    	}
		    	return str;
		   },
			
			/**
			 * 创建UUID
			 * @param Number l 长度
			 * @param Number r
			 */
			UUID: function(l, r) {
				var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
						.split('');
				var createUUID = function(len, radix) {
					var chars = CHARS, uuid = [], i;
					radix = radix || chars.length;
					if (len) {
						// Compact form
						for (i = 0; i < len; i++)
							uuid[i] = chars[0 | Math.random() * radix];
					} else {
						// rfc4122, version 4 form
						var r;
						// rfc4122 requires these characters
						uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
						uuid[14] = '4';
						// Fill in random data. At i==19 set the high bits of clock sequence
						// as
						// per rfc4122, sec. 4.1.5
						for (i = 0; i < 36; i++) {
							if (!uuid[i]) {
								r = 0 | Math.random() * 16;
								uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
							}
						}
					}
					return uuid.join('');
				};
				return createUUID(l, r);
			},
			
			/**
			 * 获取参数值，若没有则给定默认值
			 * @param {JSON} ops
			 * @param {String} field
			 * @param {Object} val
			 * @param {String} type 类型：Object、Function、String、Number、Date、Array、Boolean、Window
			 */
			getOptionValue: function(ops, field, val, type) {
				ops = ops == undefined || ops == null ? {} : ops;
				if (type) {
					if (ops[field] != undefined && Object.prototype.toString.call(ops[field]) !== ('[object ' + type + ']')) {
						throw new Error('无效参数');
					} else {
						val = ops[field] == undefined ? val : ops[field];
					}
				} else {
					val = ops[field] == undefined ? val : ops[field];
				}
				return val;
			},
			
			stopEvent: function(e){
				try{
					if(e){
						e.stopPropagation();
						e.preventDefault();
					}
				}catch(ex){}				
			},
			
			// 根据对象属性排序
			objSort: function(name){
				return function(o, p){
				  	var a, b;
				   	if (typeof o === "object" && typeof p === "object" && o && p) {
				     	a = o[name];
				     	b = p[name];
				     	if (a === b) {
				       		return 0;
				     	}
				     	if (typeof a === typeof b) {
				       		return a < b ? -1 : 1;
				     	}
				     	return typeof a < typeof b ? -1 : 1;
				   	} else {
				     	throw ("error");
				   	}
				}
			},
			
			requestFullScreen: function (element) {
			    // 判断各种浏览器，找到正确的方法
			    var requestMethod = element.requestFullScreen || //W3C
			    element.webkitRequestFullScreen ||    //Chrome等
			    element.mozRequestFullScreen || //FireFox
			    element.msRequestFullScreen; //IE11
			    if (requestMethod) {
			        requestMethod.call(element);
			    }
			    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
			        var wscript = new ActiveXObject("WScript.Shell");
			        if (wscript !== null) {
			            wscript.SendKeys("{F11}");
			        }
			    }
			}, 

			//退出全屏 判断浏览器种类
			exitFull: function() {
			    // 判断各种浏览器，找到正确的方法
			    var exitMethod = document.exitFullscreen || //W3C
			    document.mozCancelFullScreen ||    //Chrome等
			    document.webkitExitFullscreen || //FireFox
			    document.webkitExitFullscreen; //IE11
			    if (exitMethod) {
			        exitMethod.call(document);
			    }
			    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
			        var wscript = new ActiveXObject("WScript.Shell");
			        if (wscript !== null) {
			            wscript.SendKeys("{F11}");
			        }
			    }
			}
			
			
			//
			
		},
		
		/**
		 * 控制器
		 * 桌面图标控制器、任务栏控制器、桌面控制器...
		 */
		control: {			
			
			// 桌面图标层级
			dtIconZIndex: {
				value: 10,
				next: function(){
					return this.value ++;
				}
			},
			
			dtIconReset: function(dtIconId, flag){
				var DIcon = null,
					flag = flag == undefined ? true : flag,
					DIconSet = YXOs.desktop.DesktopIconMap.valueSet();
				for(var index in DIconSet){					
					DIcon = DIconSet[index];
					if(DIcon){
						if(dtIconId){
							if(flag){
								if(dtIconId === DIcon.id){
									DIcon.reset();
									break;
								}
							} else if(dtIconId !== DIcon.id){
								DIcon.reset();
							}														
						} else {
							DIcon.reset();
						}
					}		
				}
			},
			
			
			// 窗口层级
			windowZIndex: {
				value: 10000,
				next: function(){
					return this.value ++;
				}
			},
			
			// 窗口失去焦点
			windowBlur: function(windowId, flag){
				var YXWin = null,
					flag = flag == undefined ? true : flag,
					YXWinSet = YXOs.desktop.WindowMap.valueSet();
				for(var index in YXWinSet){					
					YXWin = YXWinSet[index];
					if(YXWin){
						if(windowId){
							if(flag){
								if(windowId === YXWin.id){
									YXWin.blur();
									break;
								}
							} else if(windowId !== YXWin.id){
								YXWin.blur();
							}														
						} else {
							YXWin.blur();
						}
					}		
				}
			},
			
			// 获得新窗口坐标
			getWindowPosition: function(winW, winH) {
				var screenWidth = YXOs.screenWidth(),
					screenHeight = YXOs.screenHeight();
					
				var winX = (screenWidth - winW)/2,
					winY = (screenHeight - winH)/2,
					taskbarHeight = YXOs.desktop.taskbar.getHeight(),
					tempX = winX,
					tempY = winY - taskbarHeight,
					
					has = false,
					tempLeft = winX,
					tempTop = winY, 
					minleft = 30, 
					mintop = 20,
					winobj = null;
								
				var objset = YXOs.desktop.WindowMap.valueSet(),
					size = objset.length;
				for(var i = 0; i < 15; i++){
					tempX = tempX + minleft;
					tempY = tempY + mintop;
					has = false;
					if(size){
						if(tempX + winW > screenWidth - minleft){
							tempX = minleft;
						}
						if(tempY + winH > screenHeight - taskbarHeight){
							tempY = mintop;
						}
						for ( var j = 0; j < size; j++) {
							winobj = objset[j];
							if(Math.abs(tempX - winobj.left) <= minleft/2 && Math.abs(tempY - winobj.top) <= mintop/2){
								has = true;
								if(Math.abs(tempX - winobj.left) <= minleft/2 ){
									tempLeft = tempX + minleft;
								}
								if(Math.abs(tempY - winobj.top) <= mintop/2 ){
									tempTop = tempY + mintop;
								}
								break;
							}
						}
						if(!has){
							tempLeft = tempX;
							tempTop = tempY;
							break;
						}
					} else {
						tempLeft = tempX;
						tempTop = tempY;
						break;
					}
				}
				return {
					left : tempLeft,
					top : tempTop
				};
			},
			
			// 获取上一个窗口
			getPreviousWindow: function(wid){
				var yxwin = null,
					winSet = YXOs.desktop.WindowMap.valueSet();
				if(winSet.length){
					var winArr = [], win;
					for(var i = 0, k = winSet.length; i < k; i++){
						win = winSet[i];
						if(win && win.id != wid && win.status != 'Minimize'){
							winArr.push(win);	
						}						
					}
					winArr.sort(YXOs.utils.objSort('index'));
					yxwin = winArr[winArr.length - 1];
				}
				return yxwin;
			},
			
			// 右键菜单层级
			contextMenuZIndex: {
				value: 30000,
				next: function(){
					return this.value ++;
				}
			},
			
			// 窗口句柄失效
			windowHandleBlur: function(winHandId, flag){
				var winHand = null,
					flag = flag == undefined ? true : flag,
					winHandSet = YXOs.desktop.taskbar.WindowHandleMap.valueSet();
				for(var index in winHandSet){					
					winHand = winHandSet[index];
					if(winHand){
						if(winHandId){
							if(flag){
								if(winHandId === winHand.id){
									winHand.blur();
									break;
								}
							} else if(winHandId !== winHand.id){
								winHand.blur();
							}														
						} else {
							winHand.blur();
						}
					}		
				}
			}
			
			
			
		}
		
	};
	
	/**
	 * 自定义List对象，模仿java中的ArrayList
	 */
	win.YList = function() {
		(function(yl) {
			var array = new Array();
			// 0：表示最新状态， 非0 表示有更改状态
			yl.status = 0;
			// 添加一项
			yl.add = function(obj) {
				if (obj != undefined) {
					array.push(obj);
					yl.status++;
				} else {
					throw new Error('无效参数');
				}
				return yl;
			};
			// 刷新List,去除undefined和null
			yl.fush = function() {
				var len = array.length;
				var temp = null;
				for ( var i = 0; i < len; i++) {
					for ( var j = i + 1; j < len; j++) {
						if (array[i] == undefined || array[i] == null) {
							temp = array[i];
							array[i] = array[j];
							array[j] = temp;
						}
					}
					;
				}
				;
				for ( var i = 0; i < len; i++) {
					if (array[i] == undefined || array[i] == null) {
						array.length = i;
						break;
					}
				}
				yl.status = 0;
				return yl;
			};
			// 获取总数量
			yl.size = function() {
				if (yl.status > 0) {
					yl.fush();
					yl.status = 0;
				}
				return array.length;
			};
			// 获取某一项值
			yl.get = function(index) {
				if (typeof (index) != 'number') {
					throw new Error('无效参数');
				} else if (index < 0 || index >= array.length) {
					throw new Error('索引值超出范围');
				} else {
					return array[index];
				}
			};
			// 移出某一项
			yl.remove = function(index) {
				if (typeof (index) != 'number') {
					throw new Error('无效参数');
				} else if (index < 0 || index >= array.length) {
					throw new Error('索引值超出范围');
				} else {
					array[index] = undefined;
					yl.status++;
				}
				return yl;
			};
			// 清空List
			yl.clear = function() {
				array.length = 0;
				yl.status = 0;
				return yl;
			};
		})(this);
	}

	/**
	 * 自定义Map对象，模仿java中的 HashMap
	 */
	win.YMap = function() {
		(function(ym) {
			var map = function(k, v) {
				this.key = k;
				this.value = v;
			};
	
			ym.list = new YList();
			// 获取总数量
			ym.size = function() {
				return ym.list.size();
			};
			// 往容器中填充对象
			ym.put = function(k, v) {
				if (k != undefined && k != null) {
					var mp = new map(k, v);
					ym.list.add(mp);
				} else {
					throw new Error('无效参数');
				}
				return ym;
			};
	
			// 移出某项
			ym.remove = function(k) {
				if (k != undefined && k != null) {
					for ( var i = 0; i < ym.list.size(); i++) {
						var mp = ym.list.get(i);
						if (mp != null && mp.key == k) {
							ym.list.remove(i);
							ym.list.fush();
						}
						;
					}
					;
				} else {
					throw new Error('无效参数');
				}
				return ym;
			};
	
			// 根据key值获取对象
			ym.get = function(k) {
				var result = null;
				if (k != undefined && k != null) {
					for ( var i = 0; i < ym.size(); i++) {
						var mp = ym.list.get(i);
						if (mp != null && mp.key == k) {
							result = mp.value;
							break;
						}
						;
					}
					;
				} else {
					throw new Error('无效参数');
				}
				return result;
			};
			// 移出所有项
			ym.removeAll = function() {
				ym.list.clear();
				return ym;
			};
			// 判断是否存在K项
			ym.contant = function(k) {
				var result = false;
				if (k != undefined && k != null) {
					for ( var i = 0; i < ym.size(); i++) {
						var mp = ym.list.get(i);
						if (mp != null && mp.key == k) {
							result = true;
							break;
						}
					}
				} else {
					throw new Error('无效参数');
				}
				return result;
			};
			// 获取到所有Key集合
			ym.keySet = function() {
				var arry = new Array();
				for ( var i = 0; i < ym.size(); i++) {
					var mp = ym.list.get(i);
					if (mp != undefined && mp != null) {
						arry.push(mp.key);
					}
				}
				return arry;
			};
			// 获取到所有value集合
			ym.valueSet = function() {
				var arry = new Array();
				for ( var i = 0; i < ym.size(); i++) {
					var mp = ym.list.get(i);
					if (mp != undefined && mp != null) {
						arry.push(mp.value);
					}
				}
				return arry;
			};
		})(this);
	}
	
	
	/**
	 * 拖动元素方法
	 */
	win.YXOs.dragDom = function(ops){
		var $handle = ops.handle,
			$target = ops.target,
			clicked = "Nope.",
	        mausx = "0",
	        mausy = "0",
	        winx = "0",
	        winy = "0",
	        difx = mausx - winx,
	        dify = mausy - winy,
	        newx = 0, newy = 0,
	        timeoutHandle = -1;

        $("html").mousemove(function (event) {        	
            mausx = event.pageX;
            mausy = event.pageY;
            winx = $target.offset().left;
            winy = $target.offset().top;
            
            if (clicked == "Nope.") {
                difx = mausx - winx;
                dify = mausy - winy;
			}
            
            newx = event.pageX - difx - $target.css("marginLeft").replace('px', '');
            newy = event.pageY - dify - $target.css("marginTop").replace('px', '');
            $target.css({ top: newy, left: newx });           	
        });

        $handle.mousedown(function (event) {
        	timeoutHandle = setTimeout(function(){
        		clicked = "Yeah.";
        	}, 30);
        });

        $handle.mouseup(function (event) {
            clicked = "Nope.";
            if(timeoutHandle != -1){
            	clearTimeout(timeoutHandle);
            	timeoutHandle = -1;
            }
        });
		
	};
	
}(jQuery, window);
