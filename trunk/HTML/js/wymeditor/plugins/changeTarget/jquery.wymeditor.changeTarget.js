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
/*
 * @name defineEditPart
 * @description define a edit part
 * @param name the name of the ediat-able part
 * @param exp jquery expression used to define the area
 * @option order optional param the order in the dom tree (>0 Integer)
 */
Wymeditor.prototype.defineEditPart = function (name,exp,order)
{
	if(!this._editParts)
	{
		this._editParts = {};
		this._editParts.maxOrder = 0;
	}
	this._editParts[name] = $j(this._doc).find(exp);
	this._editParts.maxOrder = order || this._editParts.maxOrder + 1;
	this._editParts[name].order = this._editParts.maxOrder;

}

Wymeditor.prototype.editPart = function(name)
{
	if(this._editParts[name])
		return this._editParts[name]
	else
		return null;
}

Wymeditor.prototype.removeEditPart = function(name)
{
	if(!this._editParts[name]._removed)
	{
		this._editParts[name].remove();
		this._editParts[name]._removed = true;
	}
}

Wymeditor.prototype.unRemoveEditPart = function(name)
{
	var all = $j(this._doc.body).find("*");
	if (!this._editParts[name]._removed)
	{
		if (all.index(this._editParts[name][0]) == -1)
			this._editParts[name]._removed = true;
	}
	if(!this._editParts[name]._removed)	//not remvoed , do nothing
		return;

	//find a place to re-insert the element
	//for all edit parts , find the un-deleted element with maxOrder (less than name's order)

	var nearest_order = -1;
	var nearest_name = "";
	for( n in this._editParts)
	{
		if (this._editParts.hasOwnProperty(n) && n != "maxOrder")
		{
			if (!this._editParts[n]._removed)
			{
				console.log(n + " is not removed");
				if (all.index(this._editParts[n][0]) == -1)
				{
					this._editParts[n]._removed = true;
					console.log(n + " is deleted");
				}
			}
			console.log(this._editParts[n].order  + ">=" + this._editParts[name].order);
			if (this._editParts[n].order >= this._editParts[name].order)
				continue;
			if (!this._editParts[n]._removed
			 && this._editParts[n].order > nearest_order)
			{
				nearest_order = this._editParts[n].order;
				nearest_name = n;
				console.log("nearest_name" + nearest_name);
			}
		}
	}
	if(nearest_order < 0)
	{
		//console.log(nearest_order);
		$j(this._doc.body).prepend(this._editParts[name])
	}
	else
		$j(this._editParts[nearest_name]).after(this._editParts[name]);
	this._editParts[name]._removed = false;
}
