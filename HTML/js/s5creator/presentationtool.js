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
		toolbarItemSelector: ".toolbar span",
		infobarItemSelector: ".info span",
		messageSelector: ".info .message",
		nameSelector: ".info .name",
		createPresSelector: "#create_pres_dialog",
		createPresOptions : {
			trigger :".createPresTrigger",
			closeClass : "close",
			okSelector : "button.ok",
			cacnelSelector:"button.cancel",
			nameInputSelector:"#create_pres_name",
			modal:true,
			toTop: true
		}
	},options);
	this._box = box;
	this.init();
}

PresentationTool.prototype.init = function()
{
	var pt = this;
	var inputName = $j(this._box).find(pt._options.createPresSelector);

	$j(this._box).find(this._options.toolbarItemSelector).click(
		function(event){
			var action = $j(this).attr('action');
			console.log(action);
			switch(action)
			{
			case 'load_pres':
				pt.list();
				//pt.load(0);
				break;
			case 'save_pres':
				pt.save();
				break;
			case 'create_pres':
				if(!this._inputNameDlg)
				{
					this._inputNameDlg = new Dialog(inputName,{
						title: '输入文件名称',
						ondialogaccept: function(event)
						{
							var name = $j(pt._options.createPresOptions.nameInputSelector).val();
							console.log(name);
							if (name != "")
							{
								pt.create(name);
							}
						}
					});
				}
				this._inputNameDlg.show();
				//$j.blockUI(
				//	inputName
				//);
				//pt.create();
				break;
			case 'remove_pres':
				pt.remove();
				break;
			}
		}
	)
	//console.log($j(this._box).find(this._options.createPresSelector));

	inputName.find(this._options.createPresOptions.okSelector).click(
		function(event)
		{
			var name = $j(pt._options.createPresOptions.nameInputSelector).val();
			if (name != "")
			{
				pt.create(name);
			}
			//$j.unblockUI();
		}
	);
	/*
	inputName.find(this._options.createPresOptions.cacnelSelector).click(
		function(event)
		{
			$j.unblockUI();
		}
	);
	*/

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
				"<string>文件已加载</string>"
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
				"<string>文件已加载</string>"
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
 */
PresentationTool.prototype.save = function()
{
	console.log("saveing  ");
	var pt = this;
	var content = S5Creator.singleton().getComponent("ThumbView").getAll();
	var backend = S5Creator.singleton().getComponent("Backend");

	backend.save(content,function(){});
}

/**
 * list the files
 */
PresentationTool.prototype.list = function()
{
	var pt = this;
	var dlg = new Dialog("<h1>获取文件列表.......</h1>",{
		buttons:"",
		title:""
	});
	dlg.show();
	//$j.blockUI("<h1>获取文件列表.......</h1>" );

	var backend = S5Creator.singleton().getComponent("Backend");
	backend.list(
		function(data)
		{
			//$j.unblockUI();
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
					//$j.unblockUI();
					//dlg.content("载入" + $j(this).html() + "....");
					var pid = $j(this).attr("pid");
					//$j.blockUI("<h1>加载文件" + $j(this).html() + "</h1>");
					pt.load(pid);
				}
			);

			//$j.blockUI(list);
			dlg.title("请单击文件载入");
			dlg.content(list);
			//S5Creator.singleton().getComponent("ThumbView").setAll(data.content);
		}
	);
}

/**
 * remove current file
 */
PresentationTool.prototype.remove = function()
{
	var backend = S5Creator.singleton().getComponent("Backend");
	backend.remove();
}

