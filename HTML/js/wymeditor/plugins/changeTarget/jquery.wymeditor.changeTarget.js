Wymeditor.prototype.hide = function(){
	$j(this._box).hide();
	$j(this._element).show();
}
Wymeditor.prototype.show = function(){
	$j(this._box).show();
	$j(this._element).hide();
}

//Extend WYMeditor
Wymeditor.prototype.changeTarget = function(newTarget) {
	var wym = this;
	wym.update();
	var oldTarget = wym._element;
	wym._element = newTarget;
	wym._html = $j(newTarget).html();
	//alert($j(newTarget).get().innerHTML);
	$j(wym._doc.body).html(wym._html);


}