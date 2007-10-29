/**
 * TinyMCE Adapter for S5Creator
 */
function Editor(editor_id,options)
{
	tinyMCE.execCommand("mceAddControl", true, editor_id);
	this._mce = tinyMCE.getInstanceById(editor_id);
	this._id = editor_id;
	this._options = $.extend(options,{
		auto_notify:true,
		notity_interval:5000
	});
	this.init();
}

Editor.prototype.init = function()
{
	var editor = this;

	//注册主题改变事件
	S5Creator.singleton().register(
		"theme_change",
		this.setContentCss.bind(this)
	);

	//注册幻灯片改变事件 (也就是编辑另一个幻灯片)
	S5Creator.singleton().register(
		"slide_change",
		this.changeSlide.bind(this)
	)

	//如果启用自动通知更新
	if(this._options["auto_notify"])
	{
		setInterval(this.notifyUpdate.bind(this),
			this._options["notity_interval"]
		);
	}
}

/**
 * 检查编辑器内容是否已经更改, 如果已经更改, 进行通知
 */
Editor.prototype.notifyUpdate = function()
{
	var slide = this.get();
	if(this._slide && this._slide.content != slide.content)	// dirty now
	{
		S5Creator.singleton().notify("editor_dirty",slide)
		this._slide = slide;
	}
}

/**
 * 改变编辑的幻灯片
 * @param {Slide} slide
 */
Editor.prototype.changeSlide = function(slide)
{
	this.notifyUpdate();

	if(slide)
	{
		this._slide = slide;
		this._mce.setHTML(slide.content);
	}
	else	// 没有slide ,置空 (可能是删除了正在编辑的那张幻灯片)
	{
		this._slide = null;
		this._mce.setHTML("");
	}
}

/**
 * @return {Slide}
 */
Editor.prototype.get = function()
{
	return new Slide(this._mce.getHTML());
}


/**
 * @param {Slide} slide
 */
/*
Editor.prototype.set = function(slide)
{
	this._slide = slide;
	this._mce.setHTML(slide.content);
}
*/

/**
 * 改变编辑器的内容CSS (改变主题)
 * @param {String} css_file_path
 */
Editor.prototype.setContentCss = function(css_file_path)
{
	console.log(css_file_path);
	var doc = this._mce.getDoc();
	var csses = $(doc).find("head").find("link[@rel=stylesheet]");
	console.log(csses);
	for (var i = 0 ; i < csses.length; i++ )
	{
		if ($(csses[i]).attr('href').indexOf("tiny_mce") == -1)
		{
			$(csses[i]).remove();
		}
	}

	$(doc).find("head").append(
		"<link rel='stylesheet' href='"
		+ css_file_path
		+ "'/>"
	);
}
