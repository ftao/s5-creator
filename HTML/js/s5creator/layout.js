$j.fn.layoutChooser = function(options){
	return new Layout(this,options);
};

function Layout(box,options)
{
	var options = $j.extend({
		layoutSelector:".slide",
		selectedClass:"selected",
		okSelector:"button.ok",
		cancelSelector:"button.cancel",
		closeClass:'close',
		trigger:".chooseLayoutTrigger"
	}, options);
	this._options = options;
	this._box = box;
	console.log(this._options);
	this.init();
}

Layout.prototype.init  = function()
{
	var layout = this;
	console.log(layout._options.trigger);
	$j(this._box).jqm({
		modal:true,
		trigger:layout._options.trigger,
		closeClass:layout._options.closeClass,
		toTop: true
	});
	$j(this._box).find(this._options.layoutSelector).click(
		function()
		{
			layout.select(this);
		}
	);
	$j(this._box).find(this._options.okSelector).click(
		function()
		{
			console.log("ok clicked");
			var selected = layout.select();
			if (selected.length != 1)
				return ;
			var tv = S5Creator.singleton().getComponent("ThumbView");
			tv.add(new Slide(selected.html()));
			selected.removeClass(layout._options.selectedClass);
			$j(layout._box).jqmHide();
		}
	);
}

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


/****************************************************************
 *  下面是公共接口, 其他代码只应该使用这些函数
 ****************************************************************/

/**
 * @return {Slide}
 */
Layout.prototype.get = function()
{
	return 	new Slide(this.select().html());
}
