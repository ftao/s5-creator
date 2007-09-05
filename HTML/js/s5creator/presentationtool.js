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
		toolbarItemSelector: "span"
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
				pt.load(0);
				break;
			}
		}
	)
}

PresentationTool.prototype.load = function(pid)
{
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