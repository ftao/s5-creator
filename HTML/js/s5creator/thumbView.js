/*
 * thumbView.js
 * 缩略图视图
 * 显示缩略图
 * 新建/编辑/删除 某张幻灯片
 * 同时这个区域也作为存储区域.
 * licensed under GPL licenses.
 */

function ThumbView(options,box)
{
	this._options = $j.extend({
		toolbarSelector:	 	"#slide_toolbar",
		toolbarItemSelector: 	"#slide_toolbar span[action]",
		actionNameAttr: 		"action",
		thumbSelector:	 		".thumb",
		newClass: 				"new",
		editingClass: 			"editing",
		slideTemplate: 	"<div class=\"slide "+ this._options.newSlideClass + "\">\n"
				  	  + "{$SLIDE_CONTENT}"
				      + "</div>\n"
	},options);
	this._box = box;
}

ThumbView.prototype.select = function()
{

}

ThumbView.prototype.slide = function(index)
{

}

ThumbView.prototype.addSlide = function(content,after)
{
	var after = after || this.selected() || this.slide(last);
	var newSlide = this._options.slideTemplate.replaceAll("{$SLIDE_CONTENT}",content);
	if(after)
	{
		$j(after).after(newSlide);
	}
	else
	{
		$j(this._box).find(this._options.thumbSelector).append(newSlide);
	}
	var newSlideSelector = this._options.thumbSelector + " ." + newClass;

	this.editSlide($j(this._box).find(newSlideSelector).removeClass(newClass));
}

ThumbView.editSlide = function(slide){
	var slide = slide || this.selected();
	if(!slide)
		return false;
	$j(slide).addClass(this._options.editingClass);	//应该产生一些效果

}