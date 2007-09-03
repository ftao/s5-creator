Wymeditor.prototype.clean = function()
{
	$j(this._doc.body).html("");
	//this._layout.disable();
	this.update();
}