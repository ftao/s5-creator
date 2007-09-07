/*
 * thumbView.js
 * 缩略图视图
 * 显示缩略图
 * 新建/编辑/删除 某张幻灯片
 * 同时这个区域也作为存储区域.
 * licensed under GPL licenses.
 */

$j.fn.thumbView = function(options){
	return new ThumbView(this,options);
};

/**
 * ThumbView 需要暴露给外部的接口
 *  1. 设置/获得当前编辑的幻灯片 (内容, 可能有其他信息, 封装成Slide 对象)
 *  2. 统计信息?　（幻灯片数目？)
 * @param {Object} box
 * @param {Object} options
 */
function ThumbView(box,options)
{
	this._options = $j.extend({
		toolbarSelector:	 	".slide_toolbar",
		toolbarItemSelector: 	".slide_toolbar span",
		actionNameAttr: 		"action",
		thumbSelector:	 		".thumb",
		slideSelector:			".slide",
		newClass: 				"new",
		editingClass: 			"editing",
		selectedClass:			"selected",
		slideTemplate: 	"<div class=\"slide \">\n"
				  	  + "{SLIDE_CONTENT}"
				      + "</div>\n"
	},options);
	this._box = box;
	this.init();
}

/**
 * TODO:关于单击/双击事件 以后增加的slide 如何增加这些事件
 */
ThumbView.prototype.init = function()
{
	var tv  = this;
	$j(this._box).find(this._options.thumbSelector).click(
		function(event){
			var target = event.target;
			if (!$j(target).is(tv._options.slideSelector))
				target = $j(target).parents(tv._options.slideSelector);
			tv.select(target);
		}
	)

	$j(this._box).find(this._options.thumbSelector).dblclick(
		function(event){
			var target = event.target;
			if (!$j(target).is(tv._options.slideSelector))
				target = $j(target).parents(tv._options.slideSelector);
			tv.editSlide(target);
		}
	)
	$j(this._box).find(this._options.toolbarItemSelector).click(
		function(event){
			var action = $j(this).attr('action');
			console.log(action);
			switch(action)
			{
			case 'add_slide': //show layout chooser
				var lv = S5Creator.singleton().getComponent("Layout");
				lv.show();
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
		return $j(this._box).find("." + this._options.selectedClass);
	}
	else
	{
		console.log("select " + slide);
		$j(slide).toggleClass(this._options.selectedClass);
	}
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
 * 我们将自动更新现在编辑的幻灯片 (编辑器->缩略图)
 * @param Element slide
 */
ThumbView.prototype.editSlide = function(slide){
	console.log("edit slide " + slide);
	var slide = slide || this.select();
	if(!slide || $j(slide).length != 1)	// no select or more than one selected
	{
		console.log("will not edit " + $j(slide));
		return false;
	}
	if($j(slide).is("." + this._options.editingClass))//已经在编辑状态
	{
		console.log("already editing this slide");
		return false;
	}
	//更新现有编辑内容
	var editor = S5Creator.singleton().getComponent("Editor")
	this.set(editor.get());

	$j(this._box)
		.find("." + this._options.editingClass)
		.removeClass(this._options.editingClass);

	$j(slide).addClass(this._options.editingClass);	//应该产生一些效果

	//更新编辑器
	console.log(this.get());
	editor.set(this.get());
};

/**
 * delete the slides
 * 这个对多选的情况完全支持
 * @param Element slide
 */
ThumbView.prototype.deleteSlide = function(slide){
	console.log("delete slide " + slide);
	var slide = slide || this.select();
	if(!slide)
	{
		console.log("nothig to delete");
		return false;
	}
	if($j(slide).is("." + this._options.editingClass))
	{
		S5Creator.singleton().getComponent("Editor").set(new Slide(""));
	}
	$j(slide).remove();
};

/****************************************************************
 *  下面是公共接口, 其他代码只应该使用这些函数
 ****************************************************************/

/**
 * get current editing slide content
 * @return {Slide}
 */
ThumbView.prototype.get = function()
{
	return new Slide($j(this._box).find("." + this._options.editingClass).html());
}

/**
 * set current editing slide content
 * @param {Slide} slide
 */
ThumbView.prototype.set = function(slide)
{
	return $j(this._box).find("." + this._options.editingClass).html(slide.content);
}

ThumbView.prototype.add = function(slide)
{
	this.addSlide(slide.content);
}

ThumbView.prototype.getAll = function()
{
	return $j(this._box).find(this._options.thumbSelector).html();
}

ThumbView.prototype.setAll = function(html)
{
	return $j(this._box).find(this._options.thumbSelector).html(html);
}