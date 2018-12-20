/**
 * ==============================================
 * YSOs Desktop.js
 * ==============================================
 */

+ function($, w, os){
	
	var YXDesktop = function(){
		this.body = $('<div id="yxos-desktop" class="yxos-desktop"></div>');
		this.loading = $('<div id="yxos-desktop-loading" class="yxos-desktop-loading"><div class="spinner"></div></div>');
		
		this.wallpaperStore = [
			"skin/wallpaper/w001.jpg",
			"skin/wallpaper/w002.jpg",
			"skin/wallpaper/w003.jpg",
			"skin/wallpaper/w004.jpg",
			"skin/wallpaper/w005.jpg",
			"skin/wallpaper/w006.jpg",
			"skin/wallpaper/w007.jpg",
			"skin/wallpaper/w008.jpg",
			"skin/wallpaper/w009.jpg",
			"skin/wallpaper/w010.jpg",
			"skin/wallpaper/w011.jpg",
			"skin/wallpaper/w012.jpg",
			"skin/wallpaper/w013.jpg",
			"skin/wallpaper/w014.jpg",
			"skin/wallpaper/w015.jpg",
			"skin/wallpaper/w016.jpg",
			"skin/wallpaper/w017.jpg",
			"skin/wallpaper/w018.jpg",
			"skin/wallpaper/w019.jpg",
			"skin/wallpaper/w020.jpg",
			"skin/wallpaper/w021.jpg",
			"skin/wallpaper/w022.jpg",
			"skin/wallpaper/w023.jpg",
			"skin/wallpaper/w024.jpg",
			"skin/wallpaper/w025.jpg",
			"skin/wallpaper/w026.jpg",
			"skin/wallpaper/w027.jpg",
			"skin/wallpaper/w028.jpg",
			"skin/wallpaper/w029.jpg",
			"skin/wallpaper/w030.jpg",
			"skin/wallpaper/w031.jpg",
			"skin/wallpaper/w032.jpg",
			"skin/wallpaper/w033.jpg",
			"skin/wallpaper/w034.jpg",
			"skin/wallpaper/w035.jpg",
			"skin/wallpaper/w036.jpg",
			"skin/wallpaper/w037.jpg",
			"skin/wallpaper/w038.jpg",
			"skin/wallpaper/w039.jpg",
			"skin/wallpaper/w040.jpg",
			"skin/wallpaper/w041.jpg",
			"skin/wallpaper/w042.jpg",
			"skin/wallpaper/w043.jpg",
			"skin/wallpaper/w044.jpg",
			"skin/wallpaper/w045.jpg",
			"skin/wallpaper/w046.jpg",
			"skin/wallpaper/w047.jpg",
			"skin/wallpaper/w048.jpg",
			"skin/wallpaper/w049.jpg",
			"skin/wallpaper/w050.jpg",
			"skin/wallpaper/w051.jpg",
			"skin/wallpaper/w052.jpg",
			"skin/wallpaper/w053.jpg",
			"skin/wallpaper/w054.jpg",
			"skin/wallpaper/w055.jpg",
			"skin/wallpaper/w056.jpg",
			"skin/wallpaper/w057.jpg",
			"skin/wallpaper/w058.jpg",
			"skin/wallpaper/w059.jpg",
			"skin/wallpaper/w060.jpg",
			"skin/wallpaper/w061.jpg",
			"skin/wallpaper/w062.jpg",
			"skin/wallpaper/w063.jpg",
			"skin/wallpaper/w064.jpg",
			"skin/wallpaper/w065.jpg",
			"skin/wallpaper/w066.jpg",
			"skin/wallpaper/w067.jpg"
		],
		
		this.DesktopIconMap = new YMap();
		
		this.WindowMap = new YMap();
		
		this.taskbar = null;
		
		this.contextMenu = null;
		
		this.contextMenuStore = {};
	};
	
	YXDesktop.prototype = {
		
		init: function(){
			this.taskbar = new YXOs.YXTaskBar();
			this.body.append(this.taskbar.body);
			
			this.loading.find('.spinner').css({
				"margin-top": os.clientHeight()/2 - 30
			});
			
			return this;
		},
		
		open: function(){
			var self = this;
			setTimeout(function(){
				self.loading.hide();
			}, 200);
		},
		
		setWallpaper: function(paper){
			var self = this;
			self.body.css({
				"background-image": YXOs.utils.format("url('{0}')", 
				(paper || (YXOs.path + self.wallpaperStore[32]) ) )
			});
			return this;
		},
		
		changeWallpager: function(){
			var self = this;
			var index = parseInt(Math.random() * self.wallpaperStore.length);
			var wallpaper = YXOs.path + self.wallpaperStore[index];
			var img = new Image();
			img.src = wallpaper;
			img.onload = function(e){
				self.setWallpaper(wallpaper);
			};
		},
		
		bindEvent: function(){
			var self = this;
			self.body.on('mouseup', function(e){
				var buttons = e.button;
				os.control.windowBlur(); // 使得所有窗口失去焦点
				if(buttons == 2){ // 右键菜单
					if(self.contextMenu == null){
						self.initContextMenu(e.clientX, e.clientY);
					} else {
						self.showContextMenu(e.clientX, e.clientY);
					}					
				}
			});
			// 桌面被左键点击时
			self.body.on('click', function(e){
				os.control.dtIconReset(); // 重置桌面图标
				self.hideOtherContextMenu(); // 隐藏桌面菜单
				os.control.windowBlur(); // 使得所有窗口失去焦点
				
				os.utils.stopEvent(e);
			});
			
			self.body.on('blur', function(e){
				
			});
			
			return self;
		},
		
		addWindow: function(yxwin){
			this.WindowMap.put(yxwin.id, yxwin);		
			this.body.append(yxwin.body);
			
		},
		
		delWindow: function(yxwin){
			var self = this;
			// 将窗口从容器中移除
			self.WindowMap.remove(yxwin.id);
			// 将桌面图标绑定的窗口解除
			var desktopIcon = self.DesktopIconMap.get(yxwin.desktopIconId);
			if(desktopIcon){
				desktopIcon.window = null;
			}
			// 移除任务栏的窗口句柄
			self.taskbar.delWindowHandle(yxwin);
			// 将窗口彻底移除
			yxwin.body.remove();
		},
		
		addDesktopIcon: function(yxDIcon){
			this.DesktopIconMap.put(yxDIcon.id, yxDIcon);
			this.body.append(yxDIcon.body);
			
		},
		
		initContextMenu: function(x, y){
			var self = this;
			self.contextMenu = new os.YXContextMenu({
				cssClass: 'desktop-context-menu'
			});
			
			self.contextMenu.addItem([
				{
					icon: 'icon-refresh',
					title: '重新加载',
					click: function(){
						document.location.reload();
					}
				},
				{
					icon: 'icon-chrome',
					title: '应用中心',
					click: function(){
						
					}
				},
				{
					icon: 'icon-expand-full',
					title: '全屏显示',
					click: function(){
						os.utils.requestFullScreen(self.body[0]);
					}
				},
				{
					icon: 'icon-picture',
					title: '更换壁纸',
					click: function(){
						self.changeWallpager();
					}
				}
			]);
			
			self.contextMenu.show(x, y);
		},
		
		addContextMenu: function(cmenu){
			var self = this;
			if(!cmenu.parent){
				self.contextMenuStore[cmenu.id] = cmenu;
				self.body.append(cmenu.body);
			}
		},
		
		showContextMenu: function(x, y){
			var self = this;
			if(self.contextMenu){
				self.contextMenu.show(x, y);
			} else {
				self.initContextMenu(x, y);
			}
		},
		
		hideContextMenu: function(){
			var self = this;
			if(self.contextMenu){
				self.contextMenu.hide();
			}
		},
		
		hideOtherContextMenu: function(cid){
			var self = this;
			for(var id in self.contextMenuStore){
				if(id != cid){
					self.contextMenuStore[id].hide();
				}
			}
		},
		
		getDesktopIcon: function(did){
			return this.DesktopIconMap.get(did);
		}
		
	};
	
	os.desktop = new YXDesktop();
	
	$(document).ready(function(e){
		var $body = $('body');
		$body.append(os.desktop.body);
		$body.append(os.desktop.loading);
		
		// 禁止浏览器右键菜单
		$(document).on('contextmenu', function(){
			return false;
		}).on("selectstart", function(){
			return false;
		});
		
		os.desktop.init().setWallpaper().bindEvent();
	});
	
}(jQuery, window, YXOs);
