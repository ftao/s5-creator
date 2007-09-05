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
		url:"../backend/phpbackend.php",
		idName:"pid",
		saveParamName:"data"
	},options);

}

/**
 * load a presentation
 * @param {String} pid
 */
PHPBackend.prototype.load = function(pid,callback)
{
	var backend = this;
	var param = {}
	param[this._options.idName] = pid;
	$j.getJSON(
		this._options.url,
		param,
		function(data)
		{
			backend._lastloaded = data;
			callback(data)
		}
	);
	this._options.storageSelector
}

/**
 * save a presentation
 * @param {Object} content
 */
PHPBackend.prototype.save = function(content)
{
	var backend = this;
	this._lastloaded.content =content ;//S5Creator.singleton().getComponent("ThumbView").getAll();
	var param = {}
	param[this._options.saveParamName] = $j.toJSON(this._lastloaded);
	$j(this._options.storageSelector).post(
		urlPrefix,param,function(data){console.log(data);}
	);
}