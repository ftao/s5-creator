var $j = jQuery.noConflict();

function ThemeSelector(box,options)
{
	this._options = $j.extend({
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

	this._dlg = new Dialog(this._box,{
		title:"改变主题",
		buttons:"accept,cancel",
		ondialogaccept:function()
		{
			return ts.onaccept();
		},
		ondialogcancel:function()
		{
			return ts.oncancel();
		}
	});
	$j(this._box).find(this._options.themeSelector).click(
		function()
		{
			ts.select(this);
		}
	);
}

ThemeSelector.prototype.onaccept = function()
{
	var selected = this.select();
	if (selected.length != 1)
	{
		return false;
	}
	var editor = S5Creator.singleton().getComponent("Editor");
	var path = this._options.themePath + '/'
			 + $j(selected).attr('theme') + '/' + this._options.editorCssName;
	editor.setContentCss(path);
	selected.removeClass(this._options.selectedClass);
}

ThemeSelector.prototype.oncancel = function()
{
	this.select().removeClass(this._options.selectedClass);
}

ThemeSelector.prototype.select = function(theme)
{
	if(theme)
	{
		$j(this._box).find(this._options.themeSelector).removeClass(this._options.selectedClass);
		$j(theme).addClass(this._options.selectedClass);
	}
	else
	{
		return $j(this._box).find("." + this._options.selectedClass);
	}
}

ThemeSelector.prototype.loadThemes = function()
{

}

ThemeSelector.prototype.show = function()
{
	this._dlg.show();
}

