/**
 * ==============================================
 * YSOs Window.js
 * ==============================================
 */

+ function($, win, os){
	
	os.YXWindow = function(ops){
		this.body = $('<div class="yxos-window dialog-can-resize hidden"><div class="window aui_outer"></div></div>');
		this.window = this.body.find('.window');
		this.id = "window-" + YXOs.utils.UUID(20);
		this.body.attr('id', this.id);
		
		this.width = ops.width || 900;
		this.height = ops.height || 550;
		this.index = os.control.windowZIndex.next();
		
		var pos = os.control.getWindowPosition(this.width, this.height);
		
		this.left = ops.left || pos.left;
		this.top = ops.top || pos.top;
		this.title = ops.title;
		this.url = ops.url;
		this.html = ops.html;
		this.types = ops.types;
		
		this.icon = ops.icon;
		
		// 是否为获得焦点状态
		this.isfocus = os.utils.getOptionValue(ops, 'isfocus', true, 'Boolean');
		// 窗口的窗口图标ID
		this.desktopIconId = ops.desktopIconId;
		// 窗口的任务栏句柄ID
		this.winHandId = "";
		// 窗口状态 'Minimize', 'Maximize', 'Nomal'
		this.status = 'Nomal';
		this.tempStatus = '';
		
		this.headHeight = 31;
		this.footerHeight = ops.hasFooter ? 32 : 0;
		this.bodyHeight = this.height - this.headHeight - this.footerHeight;
		
		this.titlebar = null;
		this.contextMenu = null;
				
		this.init(ops);
	};
	
	os.YXWindow.prototype = {
		
		init: function(ops){
			var self = this,
				html = '<div class="aui_mark load"><div class="spinner"></div></div>';
			html += '<table class="aui_border">';
			html += '  <tr>';
			html += '    <td class="aui_nw"></td>';
			html += '    <td class="aui_n"></td>';
			html += '    <td class="aui_ne"></td>';
			html += '  </tr>';
			html += '  <tr>';
			html += '    <td class="aui_w"></td>';
			html += '    <td class="aui_c">';
			html += '      <div class="aui_inner">';
			html += '	<table class="aui_dialog">';
			html += '	  <tr>';
			html += '	    <td colspan="2" class="aui_header">';
			html += '	      <div class="aui_titleBar dialog_menu">';
			html += '		    <div class="aui_title" style="cursor: move;">';
			html += '		      {0}<span class="title_name">{1}</span>';
			html += '		    </div>';
			html += '		    <a class="aui_min"></a>';
			html += '		    <a class="aui_max"></a>';
			html += '		    <a class="aui_close"></a>';
			html += '	      </div>';
			html += '	    </td>';
			html += '	  </tr>';
			html += '	  <tr>';
			html += '	    <td colspan="2" class="aui_main">';
			html += '	      <div class="aui_content aui_state_full" style="display: block;">';
			html += '		    <iframe src="{2}" id="frame-{3}" name="frame-{3}" frameborder="0" allowtransparency="true" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="width: 100%; height: 100%; border: 0px none;"></iframe>';
			html += '	      </div>';
			html += '	    </td>';
			html += '	  </tr>';
			html += '	  <tr>';
			html += '	    <td colspan="2" class="aui_footer">';
			html += '	      <div class="aui_buttons" style="display: none;"></div>';
			html += '	    </td>';
			html += '	  </tr>';
			html += '	</table>';
			html += '      </div>';
			html += '    </td>';
			html += '    <td class="aui_e"></td>';
			html += '  </tr>';
			html += '  <tr>';
			html += '    <td class="aui_sw"></td>';
			html += '    <td class="aui_s"></td>';
			html += '    <td class="aui_se"></td>';
			html += '  </tr>';
			html += '</table>';
			html += '<div class="resize-handle resize-top" resize="top"></div>';
			html += '<div class="resize-handle resize-right" resize="right"></div>';
			html += '<div class="resize-handle resize-bottom" resize="bottom"></div>';
			html += '<div class="resize-handle resize-left" resize="left"></div>';
			html += '<div class="resize-handle resize-top-right" resize="top-right"></div>';
			html += '<div class="resize-handle resize-bottom-right" resize="bottom-right"></div>';
			html += '<div class="resize-handle resize-bottom-left" resize="bottom-left"></div>';
			html += '<div class="resize-handle resize-top-left" resize="top-left"></div>';
			
			var icon = os.utils.format('<img class="win-icon" src="{0}" />', self.icon);
			self.window.html(os.utils.format(html, icon, self.title, self.url, self.id));
			
			self.iframe = self.body.find('#frame-' + self.id);
			
			self.body.css({
				"width": self.width,
				"height": self.height,
				"left": self.left,
				"top": self.top,
				"z-index": self.index
			});
			
			self.body.find('.aui_main').css({
				"width": self.width,
				"height": self.bodyHeight
			});
			
			self.body.find('.aui_mark .spinner').css({
				"margin-top": self.bodyHeight/2 - 40
			});
			
			self.titlebar = self.window.find('.aui_titleBar');
			
			os.desktop.addWindow(self);
			
			self.focus();
			
			self.bindEvent();
		},
		
		bindEvent: function(){
			var self = this,
				iframe = self.body.find('#frame-' + self.id),
				mark = self.body.find('.aui_mark'),
				min = self.body.find('.aui_min'),
				max = self.body.find('.aui_max'),
				close = self.body.find('.aui_close'),
				
				resizeTop = self.body.find('.resize-handle.resize-top'),
				resizeRight = self.body.find('.resize-handle.resize-right'),
				resizeBottom = self.body.find('.resize-handle.resize-bottom'),
				resizeLeft = self.body.find('.resize-handle.resize-left'),
				resizeTopRight = self.body.find('.resize-handle.resize-top-right'),
				resizeBottomRight = self.body.find('.resize-handle.resize-bottom-right'),
				resizeBottomLeft = self.body.find('.resize-handle.resize-bottom-left'),
				resizeTopLeft = self.body.find('.resize-handle.resize-top-left');
				
			self.minBtn = min;
			self.maxBtn = max;
			self.closeBtn = close;
				
			var mausx, mausy, winx, winy, difw, difh, way, clicked = 'Nope.', timeoutHandle = -1;
			
			// 窗口右键弹起事件
			self.window.on('mouseup', function(e){
				// 显示菜单
				if(e.button == 2){ // 右键点击
					self.showContextMenu(e.clientX, e.clientY);
				}
				
				os.utils.stopEvent(e);
			});
			
			// 窗口标题栏鼠标事件
			self.titlebar.on('mousedown', function(e){
				self.index = os.control.windowZIndex.next();
				self.body.css({
					"z-index": self.index
				});
				os.control.windowBlur();
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				self.index = os.control.windowZIndex.next();
				self.body.css({
					"z-index": self.index
				});
				self.focus();
				
				if(self.status === 'Nomal'){
					self.left = self.body.offset().left;
					self.top = self.body.offset().top;
				}
				
				// 显示菜单
				if(e.button == 2){ // 右键点击
					self.showContextMenu(e.clientX, e.clientY);
				}
				
				os.utils.stopEvent(e);
			}).on('dblclick', function(e){ // 窗口标题栏双击事件
				if(self.status === 'Nomal'){
					self.maximize();
				} else {
					self.nomal();
				}
				
				os.utils.stopEvent(e);
			});
			
			// 窗口遮罩层点击事件
			mark.on('mousedown', function(e){
				self.focus(); // 本窗口获得焦点
				os.desktop.hideOtherContextMenu(); // 隐藏桌面菜单
				os.utils.stopEvent(e);
			});
			
			// 窗口页面加载完成
			iframe.on('load', function(e){
				mark.removeClass('load').addClass('hidden');
				mark.find('.spinner').addClass('hidden');
			});
			
			// 最小化按钮点击
			min.on('mousedown', function(e){
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				if(e.button == 0){ // 0左键点击、1中键、2右键
					self.minimize();
				}
				os.utils.stopEvent(e);
			});
			
			// 最大化按钮点击
			max.on('mousedown', function(e){
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				if(e.button == 0){ // 左键点击
					if(self.status === 'Nomal'){
						self.maximize();
					} else {
						self.nomal();
					}
				}
				
				os.utils.stopEvent(e);
			});
			
			// 关闭按钮点击
			close.on('mousedown', function(e){
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				if(e.button == 0){ // 左键点击
					self.close();
				}
				os.utils.stopEvent(e);
			});
			
			// 左 拉伸
			resizeLeft.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "left";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			// 右 拉伸
			resizeRight.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "right";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			// 上 拉伸
			resizeTop.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "top";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			// 下 拉伸
			resizeBottom.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "bottom";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			
			// 右下角 拉伸
			resizeBottomRight.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "bottom-right";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			// 左下角 拉伸
			resizeBottomLeft.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "bottom-left";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			// 左上角 拉伸
			resizeTopLeft.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "top-left";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			// 右上角 拉伸
			resizeTopRight.on('mousedown', function(e){
				timeoutHandle = setTimeout(function(){
	        		clicked = "Yeah.";
	        	}, 30);
				way = "top-right";
				self.blur();
				
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				clicked = "Nope.";
				if(timeoutHandle != -1){
	            	clearTimeout(timeoutHandle);
	            	timeoutHandle = -1;
	            }
				self.focus();
				
				os.utils.stopEvent(e);
			});
			
			$("html").mousemove(function (event) {        	
	            mausx = event.pageX;
	            mausy = event.pageY;
	            if (clicked == "Yeah.") {
	                if(way === "bottom-right"){ // 右下角
	                	difw = mausx - self.left;
	                	difh = mausy - self.top;
		            	self.body.css({ width: difw, height: difh });
		            	self.width = difw;
		            	self.height = difh;
		            } else if(way === "bottom-left"){ // 左下角
		            	difw = self.left - mausx + self.width;
	                	difh = mausy - self.top;
		            	self.body.css({left: mausx, width: difw, height: difh });
		            	self.left = mausx;
		            	self.width = difw;
		            	self.height = difh;
		            } else if(way === "top-left"){ // 左上角
		            	difw = self.left - mausx + self.width;
	                	difh = self.top - mausy + self.height;
		            	self.body.css({left: mausx, top: mausy, width: difw, height: difh });
		            	self.left = mausx;
		            	self.top = mausy;
		            	self.width = difw;
		            	self.height = difh;
		            } else if(way === "top-right"){ // 右上角
		            	difw = mausx - self.left;
	                	difh = self.top - mausy + self.height;
		            	self.body.css({top: mausy, width: difw, height: difh });
		            	self.top = mausy;
		            	self.width = difw;
		            	self.height = difh;
		            } else if(way === "top"){ // 上
	                	difh = self.top - mausy + self.height;
		            	self.body.css({top: mausy, height: difh });
		            	self.top = mausy;
		            	self.height = difh;
		            } else if(way === "bottom"){ // 下
	                	difh = mausy - self.top;
		            	self.body.css({height: difh });
		            	self.height = difh;
		            } else if(way === "left"){ // 左
	                	difw = self.left - mausx + self.width;
		            	self.body.css({left: mausx, width: difw });
		            	self.left = mausx;
		            	self.width = difw;
		            } else if(way === "right"){ // 右
	                	difw = mausx - self.left;
		            	self.body.css({width: difw });
		            	self.width = difw;
		            }
		            self.resize();
				}
	        });
			
			os.dragDom({
				handle: self.titlebar,
				target: self.body
			});
		},
		
		open: function() {
			var self = this;
			self.body.animate(
				{
					width: self.width,
					height: self.height,
					top: self.top,
					left: self.left,
					opacity: 1
				}, 100, function(){
					
			});
			self.body.removeClass('hidden');
			self.status = 'Nomal';
			self.focus();
		},
		
		show: function() {
			var self = this;
			if(self.tempStatus){
				if(self.tempStatus == 'Maximize'){
					self.maximize();
				} else if(self.tempStatus == 'Nomal'){
					self.nomal();
				}
				self.tempStatus = "";
			}
			self.body.removeClass('hidden');
			self.focus();
		},
		
		hide: function() {
			this.body.addClass('hidden');
		},
		
		blur: function(){
			var self = this,
				mark = self.body.find('.aui_mark');
			self.isfocus = false;
			mark.removeClass('hidden').addClass('cover');
			// 失去焦点时隐藏菜单
			self.hideContextMenu();
		},
		
		focus: function(){
			var self = this,
				mark = self.body.find('.aui_mark');
			self.isfocus = true;
			self.index = os.control.windowZIndex.next();
			self.body.css({
				"z-index": self.index
			});
			if(!mark.hasClass('load') && mark.hasClass('cover')){
				mark.addClass('hidden').removeClass('cover');
			}
			os.control.windowBlur(self.id, false);			
			
			os.desktop.taskbar.setWinHandFocus(self.winHandId);
		},
		
		minimize: function(){
			var self = this;
			self.body.animate(
			{
				width: 0,
				height: 0,
				top: os.screenHeight(),
				opacity: 0
			}, 100, function(){
				self.tempStatus = self.status;
				self.status = 'Minimize';					
				self.hide();
				
				// 获得下一个窗口
				var yxwin = os.control.getPreviousWindow(self.id);
				if(yxwin){
					yxwin.focus();
				} else {
					var winHand = os.desktop.taskbar.WindowHandleMap.get(self.winHandId);
					if(winHand){
						winHand.blurHand();
					}
				}
			});
		},
		
		maximize: function(){
			var self = this,
				newHeight = os.clientHeight() - 2;
			self.body.animate(
			{
				width: os.screenWidth(),
				height: newHeight,
				left: 0,
				top: 0,
				opacity: 1
			}, 100, function(){
				self.status = 'Maximize';
			});
			self.bodyHeight = newHeight - self.headHeight - self.footerHeight;
			
			if(self.contextMenu){
				self.contextMenu.disableItem('nomal', false);
				self.contextMenu.disableItem('max', true);
			}			
			
			self.body.find('.aui_main').css({
				"width": os.screenWidth(),
				"height": self.bodyHeight
			});
			
			self.body.find('.aui_mark .spinner').css({
				"margin-top": self.bodyHeight/2 - 40
			});
		},
		
		nomal: function(){
			var self = this;
			self.body.animate(
				{
					width: self.width,
					height: self.height,
					left: self.left,
					top: self.top,
					opacity: 1
				}, 100, function(){
					self.status = 'Nomal';
			});
			self.bodyHeight = self.height - self.headHeight - self.footerHeight;
			if(self.contextMenu){
				self.contextMenu.disableItem('nomal', true);
				self.contextMenu.disableItem('max', false);
			}
			
			self.body.find('.aui_main').css({
				"width": self.width,
				"height": self.bodyHeight
			});
			
			self.body.find('.aui_mark .spinner').css({
				"margin-top": self.bodyHeight/2 - 40
			});
		},
		
		close: function(){
			var self = this;
			self.body.animate(
			{
				width: 0,
				height: 0,
				top: os.screenHeight(),
				opacity: 0
			}, 100, function(){
				// 从桌面图标中移除
				os.desktop.delWindow(self); // 从窗口中移除
				
				// 获得下一个窗口
				var yxwin = os.control.getPreviousWindow();
				if(yxwin){
					yxwin.focus();
				}				
			});
		},
		
		resize: function(){
			var self = this;
			
			self.bodyHeight = self.height - self.headHeight - self.footerHeight;
			self.body.find('.aui_main').css({
				"width": self.width,
				"height": self.bodyHeight
			});
			
			self.body.find('.aui_mark .spinner').css({
				"margin-top": self.bodyHeight/2 - 40
			});
		},
		
		initContextMenu: function(x, y){
			var self = this;
			self.contextMenu = new os.YXContextMenu({
				cssClass: 'window-context-menu'
			});
			
			self.contextMenu.addItem([
				{
					icon: 'icon-undo',
					cssClass: 'nomal',
					title: '还原',
					click: function(){
						self.nomal();
					}
				},
				{
					icon: 'icon-expand-full',
					cssClass: 'max',
					title: '最大化',
					click: function(){
						self.maximize();
					}
				},
				{
					icon: 'icon-minus',
					cssClass: 'min',
					title: '最小化',
					click: function(){
						self.minimize();
					}
				},
				{
					icon: 'icon-expand-full',
					cssClass: 'fullscreen',
					title: '全屏显示',
					click: function(){
						os.utils.requestFullScreen(self.body[0]);
					}
				},
				{
					icon: 'icon-refresh',
					cssClass: 'min',
					title: '重新加载',
					click: function(){
						self.iframe.attr('src', self.iframe.attr('src'));
					}
				},
				{
					icon: 'icon-times',
					cssClass: 'close',
					title: '关闭',
					click: function(){
						self.close();
					}
				}
			]);
			self.contextMenu.disableItem('nomal', true);
			self.contextMenu.show(x, y);
		},
		
		showContextMenu: function(x, y){
			var self = this;
			
			if(self.contextMenu == null){
				self.initContextMenu(x, y);
			} else {
				self.contextMenu.show(x, y);
			}
		},
		
		hideContextMenu: function(){
			var self = this;
			if(self.contextMenu){
				self.contextMenu.hide();
			}
		},
		
		isMax: function(){
			return this.status === 'Maximize';
		},
		
		isMin: function(){
			return this.status === 'Minimize';
		},
		
		isNomal: function(){
			return this.status === 'Nomal';
		}
		
	};
}(jQuery, window, YXOs);
