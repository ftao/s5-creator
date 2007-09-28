
function ThemeSelector(box,options)
{
	this._options = $.extend({
		themePath: "s5themes/ui",
		thumbImgName: "thumb.png",
		editorCssName:"editor.css",
		themes:{
			"blank":"空白",
			"i18n":"国际化",
			"s5default":"S5默认"
		},
		themeSelector:".theme",
		selectedClass:"selected"
	},options);
	this._box = box;
	this.init();
}


ThemeSelector.prototype.init = function()
{
	var ts = this;
	$(this._box).find(this._options.themeSelector).click(
		function()
		{
			ts.select(this);
		}
	);
}


ThemeSelector.prototype.select = function(theme)
{
	if(theme)
	{
		var editor = S5Creator.singleton().getComponent("Editor");
		var path = this._options.themePath + '/'
			 + $(theme).attr('theme') + '/' + this._options.editorCssName;
		editor.setContentCss(path);
		$(this._box).dialogClose();
	}
}

ThemeSelector.prototype.loadThemes = function()
{

}

ThemeSelector.prototype.show = function()
{
	var ts = this;
	if(this._dlg_already_created)
	{
		$(this._box).dialogOpen();
	}
	else
	{
		$(this._box).addClass("flora").show().dialog({
			title:"改变主题",
			width:800,
			height:250,
			position:"center",
			resize:false
		});
		this._dlg_already_created = true;
	}
}

