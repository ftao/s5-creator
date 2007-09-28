/**
 * TinyMCE Adapter for S5Creator
 */


function Editor(editor_id,options)
{
	tinyMCE.execCommand("mceAddControl", true, editor_id);
	this._mce = tinyMCE.getInstanceById(editor_id);
	this._id = editor_id;
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
Editor.prototype.set = function(slide)
{
	this._mce.setHTML(slide.content);
}

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
