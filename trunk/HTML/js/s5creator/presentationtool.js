/**
 * Presentation tool
 * 主要是加载/保存/另存为 演示文稿
 * 其他附加功能可能有 作者信息/时间日期/其他信息
 * 问题是和backend部分如何联系?
 *
 */
// 我在考虑简化成一个简单的工具栏, 使用jquery 已有的工具

jQuery.fn.presentationTool = function(options)
{
	return new PresentationTool(this,options);
}

/**
 *
 * @param {Object} box
 * @param {Object} options
 */
function PresentationTool(box,options)
{
	this._options = $.extend({
		toolbarItemSelector: ".toolbar button",
		infobarItemSelector: ".info span",
		lastSavedTimeSelector: ".info .date span",
		messageSelector: ".info .message",
		nameSelector: ".info .name"
	},options);
	this._box = box;
	this.init();
}

PresentationTool.prototype.init = function()
{
	var pt = this;

	$(this._box).find(this._options.toolbarItemSelector).click(
		function(event){
			var action = $(this).attr('action');
			console.log(action);
			switch(action)
			{
			case 'save_pres':
				pt.save();
				break;
			case 'preview_pres':
				pt.save();
				pt.preview();
				break;
			case 'select_theme_pres':
				S5Creator.singleton().getComponent("ThemeSelector").show();
				break;
			}
		}
	)
	$.Observer.register("file_saved",function(success){
		if(success)
		{
			$(pt._options.lastSavedTimeSelector).html((new Date()).toLocaleString())
		}
	});
	$.Observer.register("file_saved",function(success){
		$(pt._options.toolbarItemSelector + "[action=save_pres]").removeAttr("disabled");
	});
	$.Observer.register("file_loaded",function(data){
		$(pt._options.lastSavedTimeSelector).html((new Date(data.updated * 1000)).toLocaleString())
	});
	$.Observer.register("file_saving",function(data){
		$(pt._options.toolbarItemSelector + "[action=save_pres]").attr("disabled","disabled");
	});
}


/**
 * load a presentation by presentation id
 * @param {Object} pid
 */
PresentationTool.prototype.load = function(pid)
{
	console.log("loading " +pid);
	var pt = this;
	var backend = S5Creator.singleton().getComponent("Backend");
	backend.load(
		pid,
		function(data)
		{
			console.log(data);
			$(pt._box).find(pt._options.nameSelector).html(
				data.name
			);
			$.Observer.notify("file_loaded",data);
		}
	);
}

/**
 * save current document to server
 * 保存文档到服务器.
 *
 */
PresentationTool.prototype.save = function()
{
	console.log("saveing  ");
	$.Observer.notify("file_saving");
	var pt = this;
	var s5c = S5Creator.singleton();
	var backend = s5c.getComponent("Backend");
	backend.save(s5c.presentation,function(data){
		$.Observer.notify("file_saved",data == 1);
	});
}

PresentationTool.prototype.preview = function()
{
	var pt = this;
	var s5c = S5Creator.singleton();
	var backend = s5c.getComponent("Backend");
	backend.preview(s5c.presentation["presentation_id"]);
}
