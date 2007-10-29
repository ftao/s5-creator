Function.prototype.bind = function(obj)
{
	var func = this;
	return function(){
		func.apply(obj,arguments);
	}
}

Array.prototype.each = function(func)
{
	var len = this.length;
	for(var i = 0; i < len ; i++)
	{
		func(this[i]);
	}
}

//copy from jquery.wymeditor.js

String.prototype.replaceAll = function(old, rep) {
  var rExp = new RegExp(old, "g");
  return(this.replace(rExp, rep));
};

// Returns the Parents or the node itself
// jqexpr = a jQuery expression
jQuery.fn.parentsOrSelf = function(jqexpr) {
  var n = this;

  if (n[0].nodeType == 3)
    n = n.parents().slice(0,1);

//  if (n.is(jqexpr)) // XXX should work, but doesn't (probably a jQuery bug)
  if (n.filter(jqexpr).size() == 1)
    return n;
  else
    return n.parents(jqexpr).slice(0,1);
};

jQuery.fn.thumbView = function(options){
	return new ThumbView(this,options);
};