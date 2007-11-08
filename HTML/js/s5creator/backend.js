/**
 * backend.js
 * 定义后端的接口
 * 这个完全被动,自己主动不影响任何东西.(UI等)
 * 一般由PresentationTool 来操作.
 * licensed under GPL license.
 */


/**
 * @name PHPBackend
 * @description PHPBackend Class , deal with communicatation with server
 * @param {Hash} options
 */
function PHPBackend(options)
{
	this._options = $.extend({
		storageSelector: ".thumb",
		url:"../backend/php/index.php",
		idName:"presentation_id",
		dataParamName:"data"
	},options);

}


/**
 * @name buildURL
 * @description help function, build the url based on action
 * @param {String} action  action to perfermance
 */
PHPBackend.prototype.buildURL = function(action)
{
	return this._options.url + "?action=" + action;
}

/**
 * @name laod
 * @description load a presentation from server by id
 * @param {String} pid
 */
PHPBackend.prototype.load = function(pid,callback)
{
	var backend = this;
	var param = {};
	param[this._options.idName] = pid;
	$.getJSON(
		this.buildURL("load"),
		param,
		function(data)
		{
			if (typeof callback == "function")
				callback(data);
		}
	);
}

/**
 * @name save
 * @description save a presentation to server
 * @param {Presentation}  Presentation to save
 * @param {Function} callback
 */
PHPBackend.prototype.save = function(presentation,callback)
{

	var backend = this;
	var param = {};
	param[this._options.dataParamName] = $.toJSON(presentation);
	$.post(
		this.buildURL("save"),
		param,
		function(data){
			console.log(data);
			if (typeof callback == "function")
				callback(data);
		}
	);
}

/**
 * @name create
 * @descriptioncreate a new presentation , get the new presentaion from server
 * @param {String} name the name of the presentation
 * @param {Function} callback
 */
PHPBackend.prototype.create = function(name,callback)
{

	var backend = this;
	var param = {};
	param[this._options.dataParamName]=$.toJSON({"name":name});

	$.getJSON(
		this.buildURL("create"),
		param,
		function(data)
		{
			console.log(data);
			backend._lastloaded = data;
			if (typeof callback == "function")
				callback(data);
		}
	);
}

/**
 * @name list
 * @description get presentation list from server
 * @param {Object} callback
 */
PHPBackend.prototype.list = function(callback)
{
	var backend = this;
	$.getJSON(
		this.buildURL("list"),
		{},
		function(data)
		{
			console.log(data);
			//backend._lastloaded = data;
			if (typeof callback == "function")
				callback(data);
		}
	);
}
/**
 * @name remove
 * @description delete  presentation  with pid from server
 * @param {Function} callback
 */
PHPBackend.prototype.remove = function(pid,callback)
{
	var backend = this;
	var param = {};
	param[this._options.idName] = pid;
	$.get(
		this.buildURL("remove"),
		param,
		function(data)
		{
			if (typeof callback == "function")
				callback(data);
		}
	);
}

PHPBackend.prototype.preview = function(pid)
{
	var url = this.buildURL("preview");
	url += "&presentation_id=" + pid;
	window.open(url);
	return true;
}