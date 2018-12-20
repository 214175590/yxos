/**
 * ==============================================
 * YSOs TaskBar.js
 * ==============================================
 */

+ function($, win, os){
	
	os.YXTaskBar = function(){
		this.body = $('<div id="yxos-taskbar" class="yxos-taskbar"><div class="taskbar-start"></div><div class="taskbar-tab"></div><div class="taskbar-func"></div></div>');
		
		this.taskbar_tabs = this.body.find('.taskbar-tab');
		this.taskbar_start = this.body.find('.taskbar-start');
		this.taskbar_func = this.body.find('.taskbar-func');
		
		this.WindowHandleMap = new YMap();
		
		this.contextMenu = null;
		
		this.init();
	};
	
	os.YXTaskBar.prototype = {
		
		init: function(){
			
			this.body.css({
				"background-image": os.utils.format("url('{0}skin/{1}/img/taskbarbg.png')",
				os.path, os.globalConfig.theme)
			});
			
			this.bindEvent();
		},
		
		bindEvent: function(){
			var self = this;
			
			// 窗口右键弹起事件
			self.body.on('mouseup', function(e){
				// 显示菜单
				if(e.button == 2){ // 右键点击
					
				}
				
				os.utils.stopEvent(e);
			});
		},
		
		addWindowHandle: function(winHand){
			var self = this;
			
			self.taskbar_tabs.append(winHand.body);
			
			self.WindowHandleMap.put(winHand.id, winHand);
		},
		
		delWindowHandle: function(yxwin){
			var self = this;
			
			var winHand = self.WindowHandleMap.get(yxwin.winHandId);
			if(winHand){
				self.WindowHandleMap.remove(winHand.id);
				winHand.body.remove();
			}
		},
		
		setWinHandFocus: function(handId){
			var self = this,
				winHand = self.WindowHandleMap.get(handId);
			if(winHand){
				winHand.focusHand();
			}
		},
				
		getHeight: function(){
			return this.body.height();
		}
		
		
	};
}(jQuery, window, YXOs);
