/**
* S5 Creator plugin for wymeditor.
*/

Wymeditor.prototype.clean = function()
{
	$j(this._doc.body).html("");
	//this._layout.disable();
	this.update();
}

/****************************************************************
 *  下面是公共接口, 其他代码只应该使用这些函数
 ****************************************************************/

/**
 * @return {Slide}
 */
Wymeditor.prototype.get = function()
{
	return new Slide(this.html());
}

/**
 * @param {Slide} slide
 */
Wymeditor.prototype.set = function(slide)
{
	console.log(slide.content);
	this.html(" " + slide.content);
}

