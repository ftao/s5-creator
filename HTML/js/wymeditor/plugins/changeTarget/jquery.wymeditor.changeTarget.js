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
	this.update();
	var oldTarget = this._element;
	//$j(this._box).find(".wym_iframe").hide("fast");

	$j(oldTarget).show()
	//$j(oldTarget)[0].focus();
	//console.log($j(oldTarget).css("display"));
	//$j(oldTarget).css("display","block");
	//console.log(
	//$j(oldTarget).get()[0].style.display = "block";
	console.log($j(oldTarget).css("display"));
	//return ;

	this._element = newTarget;
	this._element_height = $j(newTarget).height();
	this._html = $j(newTarget).html();
	$j(newTarget).hide();
	$j(this._doc.body).html(this._html);
	$j(this._box).find(".wym_html").val(this._html);
	$j(newTarget).after($j(this._box).find(".wym_iframe")).after($j(this._box).find(".wym_html"));
	$j(this._box).find(".wym_iframe").height(this._element_height);
	$j(this._box).find(".wym_iframe iframe").height(this._element_height);

}