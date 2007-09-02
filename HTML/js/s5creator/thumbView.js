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
		slideTemplate: 	"<div class=\"slide \">\n"
				  	  + "{SLIDE_CONTENT}"
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
	$j(this._box).find(this._options.slideSelector).dblclick(
		function(){
			tv.editSlide(this);
		}
	)
	$j(this._box).find(this._options.toolbarItemSelector).click(
		function(){
			var action = $j(this).attr('action');
			console.log(action);
			switch(action)
			{
			case 'add_slide':
				//tv.addSlide("",tv.select());
				break;
			case 'edit_slide':
				tv.editSlide(tv.select());
				break;
			case 'delete_slide':
				tv.deleteSlide(tv.select());
				break;
			}
		}
	)
}
/**
 * 返回当前选择的幻灯片
 * 或选择/取消选择一个幻灯片
 * 支持多选
 * @param {Object} slide
 */
ThumbView.prototype.select = function(slide)
{
	if(!slide)
	{
		return $j(this._box).find(this._options.slideSelector);
	}
	else
	{
		console.log("select " + slide);
		$j(slide).toggleClass(this._options.selectedClass);
	}
}
/**
 * NOT USED
 * ERROR
 * @param {Object} index
 */
ThumbView.prototype.slide = function(index)
{
	if(index == "last")
		return $j(this._box).find(this._options.thumbSelector).append(newSlide);
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
	var after = after || this.select();

	//choose layout here
	console.log(content);
	var content = content || "";
	var newSlide = $j(this._options.slideTemplate.replaceAll("{SLIDE_CONTENT}",content));
	console.log(newSlide);
	if(after && after.length == 1)
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
/**
 * edit slide
 * 如果有多选的,不做任何动作
 * @param Element slide
 */
ThumbView.prototype.editSlide = function(slide){
	console.log("edit slide " + slide);
	var slide = slide || this.selected();
	if(!slide || $j(slide).length != 1)	// no select or more than one selected
		return false;
	if($j(slide).is("." + this._options.editingClass))//已经在编辑状态
	{
		console.log("already editing this slide");
		return false;
	}
	$j(this._box)
		.find(this._options.thumbSelector + " ." + this._options.editingClass)
		.removeClass(this._options.editingClass);

	$j(slide).addClass(this._options.editingClass);	//应该产生一些效果

	//wym
	var wym = WYM_INSTANCES[0];
	wym.initWithSlide(new Slide($j(slide).attr("layout"),$j(slide).html()));
};

/**
 * delete the slides
 * 这个对多选的情况完全支持
 * @param Element slide
 */
ThumbView.prototype.deleteSlide = function(slide){
	console.log("delete slide " + slide);
	var slide = slide || this.selected();
	if(!slide)
	{
		console.log("nothig to delete");
		return false;
	}
	if($j(slide).is("." + this._options.editingClass))
	{
		var wym = WYM_INSTANCES[0];
		wym.clean();
	}
	$j(slide).remove();
};