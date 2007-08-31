jQuery.extend({
	in_array :function(ele,arr)
	{
		for(var i = 0; i < arr.length; i++)
		{
			if (arr [i] == ele)
				return true;
		}
		return false;
	}
});

/*
 * @name defineEditPart
 * @description define a edit part
 * @param {string} name the name of the ediat-able part
 * @param {jqexp/function} filter jquery expression/filter function used to define the area
 * @option {string} defaultHtml
 */
Wymeditor.prototype.defineEditPart = function (name,filter,defaultHtml)
{
	if(!this._editParts)
	{
		this._editParts = {};
		this._editParts.maxOrder = 0;
	}
	this._editParts[name] = {
		"filter":filter,
		"order":++this._editParts.maxOrder,
		"defaultHtml" : defaultHtml,
		//content: $j(this._doc.body).find(aExp),
		remvoed:false
	}

}

/**
 * TODO
 * @param {string} name
 */
Wymeditor.prototype.editPart = function(exp)
{
	if(this._editParts[exp])
		return this._editParts[exp]
	else
		return null;
}

Wymeditor.prototype.updateEditPart = function(name)
{
		this._editParts[name].content =
			$j(this._doc.body).children().filter(this._editParts[name].filter);
}

Wymeditor.prototype.removeEditPart = function(name)
{
	if(!this._editParts[name].removed)
	{
		this._editParts[name].content =
			$j(this._doc.body).children().filter(this._editParts[name].filter);
		console.log(this._editParts[name].content);
		this._editParts[name].content.remove();
		this._editParts[name].removed = true;
	}
}

Wymeditor.prototype.unRemoveEditPart = function(name)
{

	if (!this._editParts[name].removed)
		return ;

	//find a place to re-insert the element
	//for all edit parts , find the un-deleted element with maxOrder (less than name's order)

	var nearest_order = -1;
	var nearest_name = "";
	for( n in this._editParts)
	{
		if (this._editParts.hasOwnProperty(n) && n != "maxOrder")
		{
			if (this._editParts[n].removed)
				continue;
			else
			{
				this._editParts[n].content =
					$j(this._doc.body).children().filter(this._editParts[n].filter);
				if(this._editParts[n].content.length <=0)
					continue;
			}

			console.log(this._editParts[n].order  + ">=" + this._editParts[name].order);
			if (this._editParts[n].order >= this._editParts[name].order)
				continue;
			if(this._editParts[n].order > nearest_order)
			{
				nearest_order = this._editParts[n].order;
				nearest_name = n;
				console.log("nearest_name" + nearest_name);
			}
		}
	}

	var content = this._editParts[name].defaultHtml;
	if(this._editParts[name].content.length > 0 )
		content = this._editParts[name].content;

	if(nearest_order < 0)
	{
		//console.log(nearest_order);
		$j(this._doc.body).prepend(content)
	}
	else
		$j(this._editParts[nearest_name].content).after(content);
	this._editParts[name].removed = false;
}


//layout
Wymeditor.prototype.layout = function(options)
{
	var layout = new Layout(options, this);
	this._layout = layout;
	return(layout);
};

function Layout(options, wym)
{
	var options = $j.extend({
		switchLayoutSelector:"#layout_switch .layout",
		parts: ["st","sc"],
		layouts:{
			"Title-Only":["st"],
			"Title-Content":["st","sc"],
			"Content-Only":["sc"]
		}
	}, options);
	this._options = options;
	if (wym._options.layout){
		this._options.currentLayout = wym._options.layout;
	}
	this._wym = wym;
}

Layout.prototype.init  = function()
{
	var layout = this;
	$j(layout._options.switchLayoutSelector).click(
		function()
		{
			layout.switchTo($j(this).attr("layout"));
		}
	)
}

Layout.prototype.layout = function(){
	return this._options.currentLayout;
}

Layout.prototype.switchTo = function(layout)
{
	console.log(layout);
	var options = this._options;
	var wym = this._wym;
	if(options.layouts[layout])
	{
		console.log(this._options.parts);
		for(var i = 0 ; i < this._options.parts.length; i++)
		{
			var part = this._options.parts[i];
			if ($j.in_array(part,this._options.layouts[layout]))
			{
				wym.unRemoveEditPart(part);
			}
			else
			{
				wym.removeEditPart(part);
			}
		}
		this._options.currentLayout = layout;	//save current layout
		wym.update();
	}
}

/**
 * init the wymeditor with slide
 * @param Slide slide
 *
 */

Wymeditor.prototype.initWithSlide = function(slide)
{
	$j(this._doc.body).html(slide.content);
	this._layout.switchTo(slide.layout);
}
