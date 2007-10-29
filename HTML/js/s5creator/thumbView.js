/*
 * thumbView.js
 * 缩略图视图
 * 显示缩略图
 * 新建/编辑/删除 某张幻灯片
 * 同时这个区域也作为存储区域.
 * licensed under GPL license.
 */

/**
 * ThumbView 需要暴露给外部的接口
 *  1. 设置/获得当前编辑的幻灯片 (内容, 可能有其他信息, 封装成Slide 对象)
 *  2. 统计信息?　（幻灯片数目？)
 * @param {Object} box
 * @param {Object} options
 */
function ThumbView(box,options)
{
	this._options = $.extend({
		toolbarSelector:	 	".slide_toolbar",
		toolbarItemSelector: 	".slide_toolbar ul li",
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
 *
 */
ThumbView.prototype.init = function()
{
	var tv  = this;
	//点击选择
	$(this._box).find(this._options.thumbSelector).click(
		function(event){
			var target = event.target;
			target = $(target).parentsOrSelf(tv._options.slideSelector);
			tv.select(target);
		}
	)

	//双击编辑
	$(this._box).find(this._options.thumbSelector).dblclick(
		function(event){
			var target = event.target;
			target = $(target).parentsOrSelf(tv._options.slideSelector);
			if ($(target).length == 1)
				tv.editSlide(target);
		}
	)


	$(this._box).find(this._options.toolbarItemSelector).click(
		function(event){
			var action = $(this).attr('action');
			console.log(action);
			switch(action)
			{
			case 'add_slide': //show layout chooser
				var lo = S5Creator.singleton().getComponent("Layout");
				lo.show();
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

	S5Creator.singleton().register(
		"editor_dirty",
		this.set.bind(this)
	);

}
/**
 * 返回当前选择的幻灯片
 * 或选择/取消选择一个幻灯片
 * 支持多选
 * @param {Object} slide
 */
ThumbView.prototype.select = function(slide)
{
	var tv = this;
	if(!slide)
	{
		return $(this._box).find("." + this._options.selectedClass);
	}
	else
	{
		console.log("select " + slide);
		$(slide).toggleClass(this._options.selectedClass);
	}

}


/**
 * update editing slide
 * @param {Object} slide
 */
ThumbView.prototype.update = function(slide)
{
	var selector = this._options.thumbSelector + " ." + this._options.editingClass;
	var editing = $(this._box).find(selector);
	editing.html(slide.content);
}

ThumbView.prototype.addSlide = function(content,after)
{
	var after = after || this.select();
	var content = content || "";
	var newSlide = $(this._options.slideTemplate.replaceAll("{SLIDE_CONTENT}",content));
	if(after && after.length == 1)
	{
		$(after).after(newSlide);
	}
	else
	{
		$(this._box).find(this._options.thumbSelector).append(newSlide);
	}
	this.editSlide(newSlide);
}

/**
 * edit slide
 * 如果有多选的,不做任何动作
 * 我们将自动更新现在编辑的幻灯片 (编辑器->缩略图)
 * @param Element slide
 */
ThumbView.prototype.editSlide = function(slide){

	console.log("edit slide " + $(slide).html());
	var slide = slide || this.select();
	if(!slide || $(slide).length != 1)	// no select or more than one selected
	{
		console.log("will not edit " + $(slide).get());
		return false;
	}
	if($(slide).is("." + this._options.editingClass))//已经在编辑状态
	{
		console.log("already editing this slide");
		return false;
	}
	//通知 "改变正在编辑的幻灯片"
	S5Creator.singleton().notify("slide_change",new Slide($(slide).html()));

	$(this._box)
		.find("." + this._options.editingClass)
		.removeClass(this._options.editingClass);

	$(slide).addClass(this._options.editingClass);	//应该产生一些效果

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
	if($(slide).is("." + this._options.editingClass))
	{
		// try to find a slide to edit
		// try next slide
		var siblings = $(slide).next(this._options.slideSelector);
		if(siblings.length == 0) // try previous slide
			siblings = $(slide).prev(this._options.slideSelector);
		if(siblings.length > 0 )
		{
			this.edit(siblings[0]);
		}
		else	// no slide
		{
			S5Creator.singleton().notify("slide_change",null);
		}

	}
	$(slide).remove();
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
	return new Slide($(this._box).find("." + this._options.editingClass).html());
}

/**
 * set current editing slide content
 * @param {Slide} slide
 */
ThumbView.prototype.set = function(slide)
{
	$(this._box).find("." + this._options.editingClass).html(slide.content);
}

ThumbView.prototype.add = function(slide)
{
	this.addSlide(slide.content);
}

/*
ThumbView.prototype.update = function()
{
	this.set(S5Creator.singleton().getComponent("Editor").get());
}
*/

ThumbView.prototype.getAll = function()
{
	this.set(S5Creator.singleton().getComponent("Editor").get());
	return $(this._box).find(this._options.thumbSelector).html();
}

ThumbView.prototype.setAll = function(html)
{
	$(this._box).find(this._options.thumbSelector).html(html);
	S5Creator.singleton().getComponent("Editor").set(new Slide(" "));
	this.editSlide();
}

/**
 * 编辑第index个幻灯片,同时会更新编辑区域
 * @param {int} index
 */
ThumbView.prototype.focus = function(index)
{
	var slides = $(this._box).find(this._options.slideSelector);
	if (index < 0)
		index = slides.length + index;
	if(index < 0 || index >= slides.length)
		return false;
	this.editSlide(slides[index]);
}

/**
 * 清理,清除编辑,选择等状态. 存储时不应包含这些状态(???)
 */
ThumbView.prototype.clean = function()
{
	var slides = $(this._box).find(this._options.slideSelector);
	slides.removeClass(this._options.selectedClass);
	slides.removeClass(this._options.editingClass);
}
