$j.fn.layoutChooser = function(options){
	return new Layout(this,options);
};

/**
 * @name Layout
 * @description Layout class
 */
function Layout(box,options)
{
	var options = $j.extend({
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

	this._dlg = new Dialog(this._box,{
		title:"选择幻灯片布局模板",
		buttons:"accept,cancel",
		ondialogaccept:function()
		{
			layout.onaccept();
		},
		ondialogcancel:function()
		{
			layout.oncancel();
		}
	});
	$j(this._box).find(this._options.layoutSelector).click(
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
		$j(this._box).find(this._options.layoutSelector).removeClass(this._options.selectedClass);
		$j(layout).addClass(this._options.selectedClass);
	}
	else
	{
		return $j(this._box).find("." + this._options.selectedClass);
	}
}

/**
 * @name onaccept
 * @description this function will be called when the ok button is clicked
 */
Layout.prototype.onaccept = function()
{
	var selected = this.select();
	if (selected.length != 1)
		return ;
	var tv = S5Creator.singleton().getComponent("ThumbView");
	tv.add(new Slide(selected.html()));
	selected.removeClass(this._options.selectedClass);
}

/**
 * @name oncacnel
 * @description this function will be called when the cancel button is clicked
 */
Layout.prototype.oncancel = function()
{
	this.select().removeClass(this._options.selectedClass);
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
	this._dlg.show();
}
