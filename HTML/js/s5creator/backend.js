/**
 * backend.js
 * 定义后端的接口
 * 这个完全被动,自己主动不影响任何东西.(UI等)
 * 一般有PresentationTool 来操作.
 */

/**
 *
 * @param {Has} options
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

PHPBackend.prototype.buildURL = function(action)
{
	return this._options.url + "?action=" + action;
}

/**
 * load a presentation
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
			callback(data);
		}
	);
}

/**
 * save a presentation
 * @param {Object} content
 */
PHPBackend.prototype.save = function(content,callback)
{
	var backend = this;
	console.log("last loaded " + $j.toJSON(this._lastloaded));
	if(!this._lastloaded)
		this._lastloaded = {};
	this._lastloaded.content = content ;
	var param = {};
	param[this._options.dataParamName] = $j.toJSON(this._lastloaded);
	$j.post(
		this.buildURL("save"),
		param,
		function(data){
			console.log(data);
			callback(data);
		}
	);
}

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
			callback(data);
		}
	);
}

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
			callback(data);
		}
	);
}

PHPBackend.prototype.remove = function(pid,callback)
{
	var backend = this;
	var param = {};
	var pid = pid || this._lastloaded[this._options.idName];
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