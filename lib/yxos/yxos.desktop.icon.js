/**
 * ==============================================
 * YSOs DesktopIcon.js
 * ==============================================
 */

+ function($, win, os){
	
	os.YXDesktopIcon = function(options){
		this.body = $('<div id="" class="yxos-tasktop-icon"><div class="body"></div></div>');
		
		// 桌面图标ID
		this.id = "tasktop-icon-" + os.utils.UUID(20);
		
		this.body.attr('id', this.id);
		
		this.body.data('id', options.id || '');
		// 桌面图标名称
		this.name = os.utils.getOptionValue(options, 'name', '应用', 'String');
		
		this.title = os.utils.getOptionValue(options, 'title', '应用程序', 'String');
		
		this.types = os.utils.getOptionValue(options, 'types', 'program', 'String');
		
		this.width = os.utils.getOptionValue(options, 'width', os.globalConfig.desktopIconWidth, 'Number');
		
		this.minHeight = os.utils.getOptionValue(options, 'height', os.globalConfig.desktopIconHeight, 'Number');
		
		this.windowWidth = os.utils.getOptionValue(options, 'windowWidth', 800, 'Number');
		
		this.windowHeight = os.utils.getOptionValue(options, 'windowHeight', 500, 'Number');
		
		this.hosts = os.utils.getOptionValue(options, 'hosts', 1, 'Number');
		
		this.location = os.utils.getOptionValue(options, 'location', 'void 0', 'String');
		
		this.X = os.utils.getOptionValue(options, 'X', 10, 'Number');
		
		this.Y = os.utils.getOptionValue(options, 'Y', 10, 'Number');
		
		this.index = os.control.dtIconZIndex.next();
		
		this.isDrag = os.utils.getOptionValue(options, 'isDrag', true, 'Boolean');
		
		this.isShow = os.utils.getOptionValue(options, 'isShow', true, 'Boolean');
		
		this.needClose = os.utils.getOptionValue(options, 'needClose', true, 'Boolean');
		
		this.needMinimize = os.utils.getOptionValue(options, 'needMinimize', true, 'Boolean');
		
		this.needMaximize = os.utils.getOptionValue(options, 'needMaximize', true, 'Boolean');

		this.icon = os.utils.getOptionValue(options, 'icon', os.base + 'img/i01.png', 'String');
		// 桌面图标状态 0:失去焦点，1：鼠标进入，2：获得焦点
		this.status = os.utils.getOptionValue(options, 'status', 0, 'Number');
		// 桌面图标级别 0：所有，1：个人，2：系统
		this.levels = os.utils.getOptionValue(options, 'levels', 0, 'Number');
		// 是否为获得焦点状态
		this.isfocus = os.utils.getOptionValue(options, 'isfocus', true, 'Boolean');
		// 桌面图标UI对象
		this.dticonUI = null;
		// 打开窗口
		this.window = null;
		// 属性窗口
		this.attrWindow = null;
		// 右键菜单
		this.contextMenu = null;
		
		this.init();
		
	};
	
	os.YXDesktopIcon.prototype = {
		
		init: function(){
			
			this.body.css({
				"width": this.width,
				"min-height": this.minHeight,
				"left": this.X,
				"top": this.Y,
				"z-index": this.index
			});
			
			var $body = this.body.find('.body');
			
			var boxHtml = '<div class="box"></div>',
				iconHtml = '<img src="{0}" width="64" height="64" />',
				titleHtml = '<div class="title blur">{0}</div>';
			
			$body.append(os.utils.format(iconHtml, this.icon));
			$body.append(os.utils.format(titleHtml, this.title));
			
			this.bindEvent();
		},
		
		bindEvent: function(){
			var self = this,
				self_title = self.body.find('.title');
			self.body.on('mousedown', function(e){
				self.body.addClass('press');
				
				self.index = os.control.dtIconZIndex.next();
				self.body.css({
					"z-index": self.index
				});
				
				e.stopPropagation();
				e.preventDefault();
			});
			
			self.body.on('mouseup', function(e){
				self.body.removeClass('press');
				
				os.control.dtIconReset(self.id, false);
				
				os.utils.stopEvent(e);
			});
			
			self.body.on('click', function(e){
				self.body.addClass('active');
				self_title.removeClass('blur');
				os.utils.stopEvent(e);
			});
			
			// 桌面图标双击打开窗口
			self.body.on('dblclick', function(e){
				// 打开窗口
				if(os.desktop.WindowMap.size() < 15){
					self.openWindow();					
				} else {
					alert("打开窗口过多，请先关闭部分窗口");	
				}
				
				os.utils.stopEvent(e);
			})
			
			.on('mouseup', function(e){
				if(e.button == 2){ // 右键点击
					os.control.windowBlur(); // 使得所有窗口失去焦点
					self.showContextMenu(e.clientX, e.clientY);
				}
				os.utils.stopEvent(e);
			});
			
			os.dragDom({
				handle: self.body,
				target: self.body
			});
		},
		
		reset: function(){
			var self = this,
				self_title = self.body.find('.title');;
			self.body.removeClass('active');
			self_title.addClass('blur');
		},
		
		openWindow: function(){
			var self = this;
			if(self.window === null){
				self.window = new YXOs.YXWindow({
					title: self.title,
					types: self.types,
					url: self.location,
					width: self.windowWidth,
					height: self.windowHeight,
					desktopIconId: self.id,
					icon: self.icon
				});
				
				var winHand = new YXOs.YXWindowHandle(self);
				winHand.window = self.window;
				self.window.winHandId = winHand.id;
			}
			
			self.window.open();
		},
		
		getWindowPosition: function(){
			
		},
		
		initContextMenu: function(x, y){
			var self = this;
			self.contextMenu = new os.YXContextMenu({
				cssClass: 'window-context-menu'
			});
			
			self.contextMenu.addItem([
				{
					icon: 'icon-ok',
					cssClass: 'open',
					title: '打开',
					click: function(){
						self.openWindow();
					}
				},
				{
					icon: 'icon-ok',
					cssClass: 'nomal',
					title: '还原',
					click: function(){
						if(self.window){
							if(self.window.isMin()){
								self.window.show();
								self.window.nomal();
							} else {
								self.window.focus();	
							}							
						}
					}
				},
				{
					icon: 'icon-refresh',
					cssClass: 'max',
					title: '最大化',
					click: function(){
						if(self.window){
							if(self.window.isMin()){
								self.window.show();
								self.window.maximize();
							} else {
								self.window.focus();	
							}
						}
					}
				},
				{
					icon: 'icon-file-o',
					cssClass: 'min',
					title: '最小化',
					click: function(){
						self.window && self.window.minimize();
					}
				},
				{
					icon: 'icon-file-o',
					cssClass: 'close',
					title: '关闭',
					click: function(){
						self.window && self.window.close();
						self.window = null;
					}
				},
				{
					icon: '',
					cssClass: '',
					title: '---------------'
				}
			]);
			self.contextMenu.disableItem('nomal', true);
			self.contextMenu.disableItem('max', true);
			self.contextMenu.disableItem('min', true);
			self.contextMenu.disableItem('close', true);
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
