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
		toolbarItemSelector: ".toolbar ul li",
		infobarItemSelector: ".info span",
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
			case 'create_pres':
				//create every time ?
				//or create on time and reuse it
				//if(!this._inputNameDlg)
				//{
				var input = $("<input type=\"text\" class=\"input\" value=\""
				+ '新建演示文稿' + "\"/>");
				input.appendTo("body").addClass("flora").dialog({
					buttons: {
						'确定':function(){
							var value = input.val();
							if(value == "")
 								return;
							pt.create(value);
							input.dialogClose();
						}
					},
					height:100,
					'title':'输入文件名称',
					position:"center",
					resize:false
				});
				input[0].select();
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

}

// should move to some other place
/**
 * create a new presentation with name
 * @param {String} name
 */
PresentationTool.prototype.create  = function(name)
{
	var pt = this;
	var backend = S5Creator.singleton().getComponent("Backend");
	backend.create(
		name,
		function(data)
		{
			//S5Creator.singleton().presentaion = data;
			$(pt._box).find(pt._options.messageSelector).html(
				"文件已加载"
			);
			$(pt._box).find(pt._options.nameSelector).html(
				data.name
			);
			//$.Observer.notify("presentation_loaded",data);
			S5Creator.singleton().getComponent("ThumbView").setAll(data.content);
		}
	);

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
	var backend = S5Creator.singleton().getComponent("Backend");
	backend.preview();
}
