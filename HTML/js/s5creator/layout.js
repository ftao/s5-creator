jQuery.fn.layoutChooser = function(options){
	return new Layout(this,options);
};

/**
 * @name Layout
 * @description Layout class
 */
function Layout(box,options)
{
	var options = $.extend({
		layoutSelector:".slide",
		selectedClass:"selected",
		okSelector:"button.ok",
		cancelSelector:"button.cancel"
	}, options);
	this._options = options;
	this._box = box;

	this.init();
}

/**
 * @name init
 * @description Initializes a Layout instance
 */
Layout.prototype.init  = function()
{
	var layout = this;

	$(this._box).find(this._options.layoutSelector).click(
		function()
		{
			layout.select(this);
		}
	);
}

/**
 * @name select
 * @description 选择 layout / 或者返回当前选择的layout
 * @param {Object} (optional) layout
 */
Layout.prototype.select = function(layout)
{
	if(layout)
	{
		var tv = S5Creator.singleton().getComponent("ThumbView");
		tv.add(new Slide($(layout).html()));
		$(this._box).dialogClose();
	}
}


/****************************************************************
 *  下面是公共接口, 其他代码只应该使用这些函数
 ****************************************************************/

/**
 * @name get
 * @description 返回选择的Layout
 * @return {Slide}
 */
Layout.prototype.get = function()
{
	return 	new Slide(this.select().html());
}

Layout.prototype.show = function()
{
	var layout = this;
	if(this._dlg_already_created)
	{
		$(this._box).dialogOpen();
	}
	else
	{
		$(this._box).addClass("flora").show().dialog({
			'title':"选择幻灯片布局模板",
			width:440,
			height:200,
			position:"center",
			resize:false
		});
		this._dlg_already_created = true;
	}
}

