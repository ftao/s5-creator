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


