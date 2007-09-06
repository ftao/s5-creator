/**
 * Presentation tool
 * 主要是新建/加载/保存/另存为 演示文稿
 * 其他附加功能可能有 作者信息/时间日期/其他信息
 * 问题是和backend部分如何联系?
 */
/*
 * 发现的问题
 * 1. jqModal 可能将元素移动
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
		createPresSelector: "#create_pres_dialog",
		createPresOptions : {
			trigger :".createPresTrigger",
			closeClass : "close",
			okSelector : "button.ok",
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
				//pt.create();
				break;
			}
		}
	)
	console.log($j(this._box).find(this._options.createPresSelector));
	$j(this._box).find(this._options.createPresSelector).jqm(
			pt._options.createPresOptions
	);
	//jqModal 可能将元素移动了.
	$j(this._box)
		.find(this._options.createPresSelector)
		.find(this._options.createPresOptions.okSelector).click(
		function(event)
		{
			var name = $j(pt._options.createPresOptions.nameInputSelector).val();
			console.log(name);
			if (name != "")
			{
				pt.create(name);
			}
			$j(pt._options.createPresSelector).jqmHide();
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
			S5Creator.singleton().getComponent("ThumbView").setAll(data.content);
		}
	);
}

PresentationTool.prototype.save = function()
{
	console.log("saveing  ");
	var pt = this;
	var content = S5Creator.singleton().getComponent("ThumbView").getAll();
	var backend = S5Creator.singleton().getComponent("Backend");

	backend.save(content,function(){});
}

PresentationTool.prototype.list = function()
{
	var pt = this;
	$j.blockUI("<h1>获取文件列表.......</h1>" );

	var backend = S5Creator.singleton().getComponent("Backend");
	backend.list(
		function(data)
		{
			//$j.unblockUI();
			var html = "<ul style='cursor: default'>";
			for(var i = 0 ; i < data.length; i++)
			{
				html += "<li pid='" + data[i].presentation_id + "'>"
				html += data[i].name;
				html += "</li>";
			}
			var list = $j(html);
			$j(list).find("li").click(
				function(event){
					$j.unblockUI();
					var pid = $j(this).attr("pid");
					//$j.blockUI("<h1>加载文件" + $j(this).html() + "</h1>");
					pt.load(pid);
				}
			);

			$j.blockUI(list);
			//S5Creator.singleton().getComponent("ThumbView").setAll(data.content);
		}
	);
}