/**
 * ==============================================
 * YSOs ContextMenu.js
 * ==============================================
 */

+ function($, win, os){
	var ul_html = '<ul class="yxos-context-menu {cssClass}" id="{id}"></ul>',
		li_html = '<li class="yxos-context-menu-item {cssClass}"><i class="icon {icon}"></i> {title}</li>',
		li_line = '<li class="yxos-context-menu-line {cssClass}"><hr/></li>';
	
	os.YXContextMenu = function(ops){
		ops = $.extend({
			cssClass: '',
			id: "cmenu-" + YXOs.utils.UUID(20)
		}, ops);
		this.id = ops.id;
		this.parent = ops.parent;
		this.body = $(os.utils.formatByJson(ul_html, ops));
		this.cssClass = ops.cssClass;
		this.init();
	};
	
	os.YXContextMenu.prototype = {
		
		init: function(){
			var self = this;
			self.body.css({
				"z-index": os.control.contextMenuZIndex.next()
			});
			os.desktop.addContextMenu(self);
		},
		
		addItem: function(){
			var items = arg = arguments[0];
			var self = this;
			if(Object.prototype.toString.call(arg) === "[object Object]"){
				items = [arg];
			}
			var createItem = function(menu, item){
				var $li, subMenu, it;
				if(item.subItem && item.subItem.length){ // 有子集
					$li = $(os.utils.formatByJson(li_html, item));
					$li.addClass('yxos-has-submenu');
					subMenu = new os.YXContextMenu({
						cssClass: 'yxos-context-submenu',
						parent: menu
					});
					$li.append(subMenu.body);
					$li.on('click', function(e){
						if(!$li.hasClass('disabled')){
							item.click && item.click.call(self, e);
							self.hide();
						}
						os.utils.stopEvent(e);
					}).on('mousedown', function(e){
						if(!$li.hasClass('disabled')){
							item.mousedown && item.mousedown.call(self, e);
						}
						os.utils.stopEvent(e);
					}).on('mouseup', function(e){
						if(!$li.hasClass('disabled')){
							item.mouseup && item.mouseup.call(self, e);
							self.hide();
						}
						os.utils.stopEvent(e);
					});
					menu.body.append($li);
					
					subMenu.addItem(item.subItem);
				} else {
					$li = $(os.utils.formatByJson(li_html, item));
					$li.on('click', function(e){
						if(!$li.hasClass('disabled')){
							item.click && item.click.call(self, e);
							self.hide();
						}
						os.utils.stopEvent(e);
					}).on('mousedown', function(e){
						if(!$li.hasClass('disabled')){
							item.mousedown && item.mousedown.call(self, e);
						}
						os.utils.stopEvent(e);
					}).on('mouseup', function(e){
						if(!$li.hasClass('disabled')){
							item.mouseup && item.mouseup.call(self, e);
							self.hide();
						}
						os.utils.stopEvent(e);
					});
					menu.body.append($li);
				}
			};
			if(items){
				var item = null;
				for(var i = 0; i < items.length; i++){
					item = new os.YXContextMenu.ContextMenuItem(items[i]);
					createItem(self, item);
				}
			}
		},
		
		height: function(){
			var self = this;
			return self.body.height();
		},
		
		width: function(){
			var self = this;
			return self.body.width();
		},
		
		show: function(x, y){
			var self = this,
				screenWidth = YXOs.screenWidth(),
				screenHeight = YXOs.screenHeight(),
				height = self.height() + 15,
				width = self.width();
			if(x + width >= screenWidth){
				x = x - width;
			}
			if(y + height >= screenHeight){
				y = y - height;
			}
			self.body.css({
				left: x,
				top: y,
				display: 'inline-block'
			});
			/*if(os.desktop.contextMenu && self.cssClass !== os.desktop.contextMenu.cssClass){
				os.desktop.contextMenu.hide();
			} else if(os.desktop.contextMenu && self.cssClass === os.desktop.contextMenu.cssClass){
				
			}*/
			os.desktop.hideOtherContextMenu(self.id);
		},
		
		hide: function(){
			var self = this;
			if(self.parent){
				self.parent.hide();
			} else {
				self.body.css({
					display: 'none'
				});
			}			
		},
		
		disableItem: function(css, is){
			var self = this,
				$item = self.body.find('.yxos-context-menu-item.' + css);
			if($item.length){
				$item.attr('disabled', is === true);
				if(is === true){
					$item.addClass('disabled');
				} else {
					$item.removeClass('disabled');
				}
			}
		}
		
	};
	
	os.YXContextMenu.ContextMenuItem = function(ops){
		this.icon = os.utils.getOptionValue(ops, 'icon', 'icon-angle-right', 'String');
		this.title = os.utils.getOptionValue(ops, 'title', '', 'String');
		this.cssClass = os.utils.getOptionValue(ops, 'cssClass', '', 'String');
		this.click = os.utils.getOptionValue(ops, 'click', $.noop, 'Function');
		this.mousedown = os.utils.getOptionValue(ops, 'mousedown', $.noop, 'Function');
		this.mouseup = os.utils.getOptionValue(ops, 'mouseup', $.noop, 'Function');
		this.subItem = os.utils.getOptionValue(ops, 'subItem', [], 'Array');
		this.parent = null;
	};
	
	
}(jQuery, window, YXOs);
