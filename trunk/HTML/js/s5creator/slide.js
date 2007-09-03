/**
 * slide.js
 * 表示幻灯片
 */

function Slide(content)
{
	//this.id = id;
	//this.layout = layout;
	this.content = content;
	//this.status = "normal";
}

Slide.prototype.state = function(state)
{
	if (state)
		this.state =  state;
	else
		return this.state;
}

/**
 * 一个幻灯片,包含若干张环灯片
 * 主要作为数据容器,所有数据都可暴露
 * MVC中M,减少抽象层次,不提供方法.
 * 让控制器来操作数据
 */
function Presentation()
{
	this.slides = [];
	this.theme = "default";
	this.author = "";
	this.date = "";
	//TODO:
}
