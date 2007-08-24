//Extend WYMeditor
Wymeditor.prototype.changeTarget = function(newTarget) {
	this.update();
	var oldTarget = this._element;
	$j(oldTarget).show()
	this._element = newTarget;
	this._element_height = $j(newTarget).height();
	this._html = $j(newTarget).html();
	$j(newTarget).hide();
	$j(this._doc.body).html(this._html);
	$j(this._box).find(".wym_html").val(this._html);
	$j(newTarget).after($j(this._box).find(".wym_iframe").hide()).after($j(this._box).find(".wym_html"));
	$j(this._box).find(".wym_iframe").show();
	$j(this._box).find(".wym_iframe iframe").height(this._element_height);

}