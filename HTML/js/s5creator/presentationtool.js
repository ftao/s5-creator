/**
 * Presentation tool
 * 主要是新建/加载/保存/另存为 演示文稿
 * 其他附加功能可能有 作者信息/时间日期/其他信息
 * 问题是和backend部分如何联系?
 */

$j.fn.presentationTool = function(options)
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
	this._options = $j.extend({
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


	$j(this._box).find(this._options.toolbarItemSelector).click(
		function(event){
			var action = $j(this).attr('action');
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
					this._inputNameDlg = Dialog.prompt(
						'输入文件名称',
						'新建演示文稿',
						function(value)
						{
							if (value != null)
							{
								if(value == "")
 									value = "new presentation";
								pt.create(value);
							}
						}
					);
				//}
				//else
				//	this._inputNameDlg.show();
				break;
			case 'remove_pres':
				pt.remove();
				break;
			case 'preview_pres':
				pt.save();
				pt.preview();
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
			$j(pt._box).find(pt._options.messageSelector).html(
				"文件已加载"
			);
			$j(pt._box).find(pt._options.nameSelector).html(
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
			$j(pt._box).find(pt._options.messageSelector).html(
				"文件已加载"
			);
			$j(pt._box).find(pt._options.nameSelector).html(
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
	var dlg = new Dialog("正在获取文件列表...",{
		buttons:"cancel",
		title:"",
		ondialogcancle:function(){ dlg.hide();}
	});
	dlg.show();

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
			var list = $j(html);
			$j(list).find("li").click(
				function(event){
					dlg.hide();
					var pid = $j(this).attr("pid");
					pt.load(pid);
				}
			);
			dlg.title("请单击文件载入");
			dlg.content(list);
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
			$j(pt._box).find(pt._options.messageSelector).html(msg);
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