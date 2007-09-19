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
	this._options = $j.extend({
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
	$j.getJSON(
		this.buildURL("load"),
		param,
		function(data)
		{
			backend._lastloaded = data;
			if (typeof callback == "function")
				callback(data);
		}
	);
}

/**
 * @name save
 * @description save a presentation to server
 * @param {String} content the content to save
 * @param {Function} callback
 */
PHPBackend.prototype.save = function(content,callback)
{
	if(!this._lastloaded)		//we cant't save nothing
	{
		console.log("nothing to save");
		return false;
	}

	var backend = this;

	this._lastloaded.content = content ;
	var param = {};
	param[this._options.dataParamName] = $j.toJSON(this._lastloaded);
	$j.post(
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
	param[this._options.dataParamName]=$j.toJSON({"name":name});

	$j.getJSON(
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
	$j.getJSON(
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
 * @description delete current presentation from server
 * @param {Function} callback
 */
PHPBackend.prototype.remove = function(callback)
{
	var backend = this;
	var param = {};
	var pid = null;
	try{
		pid = this._lastloaded[this._options.idName];
	}
	catch(e){
		return false;
	}
	param[this._options.idName] = pid;
	$j.get(
		this.buildURL("remove"),
		param,
		function(data)
		{
			if(data == "1")
				backend._lastloaded = null;
			if (typeof callback == "function")
				callback(data);
		}
	);
}

PHPBackend.prototype.preview = function()
{
	if(!this._lastloaded)
		return false;
	var url = this.buildURL("preview");
	url += "&presentation_id=" + this._lastloaded.presentation_id;
	window.open(url);
	return true;
}