(function($, win, os){
	
	function PageScript(){
		
	}
	
	PageScript.prototype = {
		
		init: function(){
			$(function(){							
				
				var deskIcon, w = 0, h = 0;
				for(var i = 0; i < 13; i++){					
					deskIcon = new YXOs.YXDesktopIcon({
						id: 'DI' + i,
						name : '系统程序',
						types : 'program',
						windowWidth: 800,
						windowHeight: 500,
						X: 20 + (w * (os.globalConfig.desktopIconWidth + 10)),
						Y: 20 + (h * (os.globalConfig.desktopIconHeight + 10)),
						icon : os.base + 'img/eizhi.png',
						title : '桌面图标管理' + i,
						hosts: 1,
						location: 'http://120.27.53.77:8180/tcs/',
						levels: 5,
						isDrag: true,
						isShow: false,
						needClose: true,
						needMinimize: true,
						needMaximize: true,
						closeFunction : {
							func : function(e, id) {
								
							},
							order : 'before'
						},
						minFunction : {
							func : function(e, id) {
								
							},
							order : 'before'
						},
						maxFunction : {
							func : function(e, id) {
								
							},
							order : 'before'
						},
						status: 1,
						createTime: '2012-08-05 15:02:33',
						belong: 'yisin'
					});
					
					os.desktop.addDesktopIcon(deskIcon);
					
					h++;
					if(h > 5){
						w++;
						h = 0;
					}
				}
				
			});
			
			// 打开桌面
			os.desktop.open();
		}
		
	};
	
	var page = new PageScript();
	page.init();
	
})(jQuery, window, YXOs);
