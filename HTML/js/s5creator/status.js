/**
 *
 * @param {Object} box
 * @param {Object} options
 */
function StatusBar(box,options)
{
	this._options = $.extend({
	},options);
	this._box = box;
	this.init();
}

StatusBar.prototype.init = function()
{
	var sb = this;

	//注册主题改变事件
	$.Observer.register(
		"theme_change",
		function(){sb.setStatus("主题已经改变");}
	);

	//注册文件加载事件
	$.Observer.register(
		"file_loaded",
		function(data){
			sb.setStatus("文件 " + data.name + " 已加载");
		}
	);

	//注册文件保存改变事件
	$.Observer.register(
		"file_saving",
		function(){sb.setStatus("文件正在保存....");}
	);

	//注册文件保存改变事件
	$.Observer.register(
		"file_saved",
		function(success){
			sb.setStatus("文件保存" + (success?"成功":"失败"));
		}
	);

}

StatusBar.prototype.setStatus = function(msg)
{
	$(this._box).empty().append(msg);
}
