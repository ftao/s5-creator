/**
 * Presentation tool
 * 主要是新建/加载/保存/另存为 演示文稿
 * 其他附加功能可能有 作者信息/时间日期/其他信息
 * 问题是和backend部分如何联系?
 */

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
			case 'load_pres':
				pt.list();
				break;
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
			case 'remove_pres':
				pt.remove();
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
			$(pt._box).find(pt._options.messageSelector).html(
				"文件已加载"
			);
			$(pt._box).find(pt._options.nameSelector).html(
				data.name
			);
			var tv = S5Creator.singleton().getComponent("ThumbView");
			tv.setAll(data.content);
			tv.focus(0);
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
	var pt = this;
	var tv = S5Creator.singleton().getComponent("ThumbView");
	//不需要做清理, 保持所有状态.
	//tv.clean();
	var content = tv.getAll();
	var backend = S5Creator.singleton().getComponent("Backend");
	backend.save(content,function(){});
}

/**
 * list the files
 * 列出文件(名称)
 */
PresentationTool.prototype.list = function()
{

	var pt = this;
	var dlg = $("<div >正在获取文件列表...</div>").appendTo("body").addClass("flora").dialog({
			'title':"",
			position:"center",
			resize:false
	});


	var backend = S5Creator.singleton().getComponent("Backend");
	backend.list(
		function(data)
		{
			var html = "<ol style='cursor: default;text-align:left'>";
			for(var i = 0 ; i < data.length; i++)
			{
				html += "<li pid='" + data[i].presentation_id + "'>"
				html += data[i].name;
				html += "</li>";
			}
			html += "</ol>";
			var list = $(html);
			$(list).find("li").click(
				function(event){
					dlg.dialogClose();
					var pid = $(this).attr("pid");
					pt.load(pid);
				}
			);

			dlg.empty().append(list);
			dlg.parents(".ui-dialog").height(50 + list.height());
		}
	);
}

/**
 * remove current file
 * 删除当前文件
 */
PresentationTool.prototype.remove = function()
{
	var pt = this;
	var backend = S5Creator.singleton().getComponent("Backend");
	backend.remove(
		function(data)
		{
			var msg = (data == '1'?"文件已删除":"文件删除失败");
			$(pt._box).find(pt._options.messageSelector).html(msg);
			if(data == "1")
			{
				var tv = S5Creator.singleton().getComponent("ThumbView").setAll("");
			}
		}
	);
}

PresentationTool.prototype.preview = function()
{
	var pt = this;
	var backend = S5Creator.singleton().getComponent("Backend");
	backend.preview();
}
