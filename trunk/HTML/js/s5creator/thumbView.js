/*
 * thumbView.js
 * 缩略图视图
 * 显示缩略图
 * 新建/编辑/删除 某张幻灯片
 * 同时这个区域也作为存储区域.
 * licensed under GPL licenses.
 */

function ThumbView(box,options)
{
	this._options = $j.extend({
		toolbarSelector:	 	".slide_toolbar",
		toolbarItemSelector: 	".slide_toolbar span",
		actionNameAttr: 		"action",
		thumbSelector:	 		".thumb",
		slideSelector:			".thumb .slide",
		newClass: 				"new",
		editingClass: 			"editing",
		selectedClass:			"selected",
		slideTemplate: 	"<div class=\"slide "+ this.newSlideClass + "\">\n"
				  	  + "{$SLIDE_CONTENT}"
				      + "</div>\n"
	},options);
	this._box = box;
}
ThumbView.prototype.init = function()
{
	var tv  = this;
	$j(this._box).find(this._options.slideSelector).click(
		function(){
			tv.select(this);
		}
	)
	$j(this._box).find(this._options.toolbarItemSelector).click(
		function(){
			var action = $j(this).attr('action');
			console.log(action);
			switch(action)
			{
			case 'add_slide':
				tv.addSlide("",tv.select());
				break;
			case 'edit_slide':
				tv.editSlide(tv.select());
				break;
			case 'delete_slide':
				break;
			}
		}
	)
}
ThumbView.prototype.select = function(slide)
{
	if(!slide)
	{
		var selector = this._options.thumbSelector + " ." + this._options.selectedClass;
		return $j(this._box).find(selector);
	}
	else
	{
		console.log("select " + slide);
		$j(slide).addClass(this._options.selectedClass);
	}
	//return $j(this._box).find(slideSelector + " ." + )

}

ThumbView.prototype.slide = function(index)
{

}
/**
 * update editing slide
 * @param {Object} slide
 */
ThumbView.prototype.update = function(slide)
{
	var selector = this._options.thumbSelector + " ." + this._options.editingClass;
	var editing = $j(this._box).find(selector);
	editing.html(slide.content);
	editing.attr("layout",slide.layout);
}

ThumbView.prototype.addSlide = function(content,after)
{
	var after = after || this.selected() || this.slide("last");
	var content = content || "";
	var newSlide = $j(this._options.slideTemplate.replaceAll("{$SLIDE_CONTENT}",content));
	if(after)
	{
		$j(after).after(newSlide);
	}
	else
	{
		$j(this._box).find(this._options.thumbSelector).append(newSlide);
	}
	newSlide.removeClass(this._options.newClass);
	this.editSlide(newSlide);
}

ThumbView.prototype.editSlide = function(slide){
	console.log("edit slide " + slide);
	var slide = slide || this.selected();
	if(!slide)
		return false;
	$j(slide).addClass(this._options.editingClass);	//应该产生一些效果
	//wym
	var wym = WYM_INSTANCES[0];
	wym.initWithSlide(new Slide($j(slide).attr("layout"),$j(slide).html()));
};