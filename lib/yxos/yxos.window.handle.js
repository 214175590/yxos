/**
 * ==============================================
 * YSOs DesktopIcon.js
 * ==============================================
 */

+ function($, win, os){
	
	os.YXWindowHandle = function(options){
		this.body = $('<div id="" class="yxos-window-handle active"></div>');
		
		// 窗口句柄ID
		this.id = "window-handle-" + os.utils.UUID(20);
		
		this.body.attr('id', this.id);
		
		this.body.data('id', options.id || '');
		
		this.title = os.utils.getOptionValue(options, 'title', '应用程序', 'String');
		
		this.types = os.utils.getOptionValue(options, 'types', 'program', 'String');
		
		this.icon = os.utils.getOptionValue(options, 'icon', os.base + 'img/i01.png', 'String');
		// 状态
		this.status = os.utils.getOptionValue(options, 'status', 0, 'Number');
		// 桌面图标级别 0：所有，1：个人，2：系统
		this.levels = os.utils.getOptionValue(options, 'levels', 0, 'Number');
		// 是否为获得焦点状态
		this.isfocus = os.utils.getOptionValue(options, 'isfocus', true, 'Boolean');		
		// 打开窗口
		this.window = null;
		// 右键菜单
		this.contextMenu = null;
		
		this.init();
		
	};
	
	os.YXWindowHandle.prototype = {
		
		init: function(){
			var self = this;
			
			os.desktop.taskbar.addWindowHandle(self);
			
			var boxHtml = '<div class="box"></div>',
				iconHtml = '<img src="{0}" width="24" height="24" />',
				titleHtml = '<div class="title blur">{0}</div>';
			
			self.body.append(os.utils.format(iconHtml, this.icon));
			self.body.append(os.utils.format(titleHtml, this.title));
			
			// 其他窗口句柄都失去焦点
			os.control.windowHandleBlur(self.id, false);
			
			self.bindEvent();
		},
		
		bindEvent: function(){
			var self = this;
			
			self.body.on('mousedown', function(e){
				os.utils.stopEvent(e);
			}).on('mouseup', function(e){
				if(e.button == 2){ // 右键
					os.control.windowBlur(); // 使得所有窗口失去焦点
					self.showContextMenu(e.clientX, e.clientY);
				} else if(e.button == 1){ // 左键
					// 其他窗口句柄都失去焦点
					os.control.windowHandleBlur(self.id, false);
					// 激活当前窗口
					if(self.window.isMin()){
						self.window.nomal();
						self.window.show();
					} else {
						self.window.focus();
					}
				}
				
				os.utils.stopEvent(e);
			});
			
		},
		
		openWindow: function(){
			var self = this;
			self.window.show();
		},
		
		focus: function(){
			var self = this;			
			self.body.addClass('active');
			self.isfocus = true;
		},
		
		blur: function(){
			var self = this;
			self.isfocus = false;
			self.body.removeClass('active');
			self.window.blur();
		},
		
		blurHand: function(){
			var self = this;
			self.isfocus = false;
			self.body.removeClass('active');
		},
		
		focusHand: function(){
			var self = this;
			os.desktop.body.find('.yxos-window-handle').removeClass('active');
			
			self.body.addClass('active');
			self.isfocus = true;
		},
		
		initContextMenu: function(x, y){
			var self = this;
			self.contextMenu = new os.YXContextMenu({
				cssClass: 'window-context-menu'
			});
			
			self.contextMenu.addItem([
				{
					icon: 'icon-eye-open',
					cssClass: 'open',
					title: '显示',
					click: function(){
						self.openWindow();
					}
				},
				{
					icon: 'icon-undo',
					cssClass: 'nomal',
					title: '还原',
					click: function(){
						if(self.window){
							if(self.window.isMin()){
								self.window.show();									
							} 
							self.window.nomal();
						}
					}
				},
				{
					icon: 'icon-expand-full',
					cssClass: 'max',
					title: '最大化',
					click: function(){
						if(self.window){
							if(self.window.isMin()){
								self.window.show();								
							}
							self.window.maximize();
						}
					}
				},
				{
					icon: 'icon-minus',
					cssClass: 'min',
					title: '最小化',
					click: function(){
						self.window && self.window.minimize();
					}
				},
				{
					icon: 'icon-times',
					cssClass: 'close',
					title: '关闭',
					click: function(){
						self.window && self.window.close();
						self.window = null;
					}
				}
			]);
			self.contextMenu.disableItem('open', true);
			self.contextMenu.disableItem('nomal', true);
			
			self.contextMenu.show(x, y);
		},
		
		showContextMenu: function(x, y){
			var self = this;
			
			if(self.contextMenu == null){
				self.initContextMenu(x, y);
			} else {
				self.contextMenu.show(x, y);
				if(self.window){
					self.contextMenu.disableItem('open', true);
					self.contextMenu.disableItem('close', false);
					if(self.window.status === 'Nomal'){
						self.contextMenu.disableItem('nomal', true);
						self.contextMenu.disableItem('max', false);
						self.contextMenu.disableItem('min', false);
					} else if(self.window.status === 'Minimize'){
						self.contextMenu.disableItem('open', false);
						self.contextMenu.disableItem('nomal', false);
						self.contextMenu.disableItem('max', false);
						self.contextMenu.disableItem('min', true);
					} else if(self.window.status === 'Maximize'){
						self.contextMenu.disableItem('nomal', false);
						self.contextMenu.disableItem('max', true);
						self.contextMenu.disableItem('min', false);
					}
				} else {
					self.contextMenu.disableItem('open', false);
					self.contextMenu.disableItem('nomal', true);
					self.contextMenu.disableItem('max', true);
					self.contextMenu.disableItem('min', true);
					self.contextMenu.disableItem('close', true);
				}
			}
		},
		
		hideContextMenu: function(){
			var self = this;
			if(self.contextMenu){
				self.contextMenu.hide();
			}
		}
		
	};
}(jQuery, window, YXOs);
