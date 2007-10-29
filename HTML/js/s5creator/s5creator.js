/*
 * s5creator.js
 * main file for s5editor
 * 这个文件主要其一个集中控制的作用
 * 不涉及UI问题
 * 比如你要新建一个幻灯片, 操作是在缩略图视图中进行的,更新完自己之后,调用s5creator的接口
 * 来操作其他内容编辑器,幻灯片布局切换器,其他信息输入等等.
 * 每一个组件负责自己的UI,s5creator 负责统一调度.
 */

/*
 * 包含  缩略图视图
 *      内容编辑器
 *      幻灯片布局切换器	也许这个和内容编辑器合并是合理的
 *      其他信息输入(作者,时间,地点....)
 *      预览器
 *      主题选择器
 *      ??IO处理接口 (配合不同的后端, 比如本地Javascript,PHP,Python)
 */

/**
 * do we really need box ? NO
 * @param {Hash} options
 */
function S5Creator(options)
{
	this._options = $.extend({
			thumbViewSelector:	".s5ThumbView",
			editorId:	"s5Editor",
			layoutSelector:		".s5Layout",
			previewSelector:	".s5Preview",
			themeSelector:		".s5Theme",
			presentationToolSelector :".s5PreTool",
			thumbViewOptions: {},
			editorOptions: {},
			layoutOptions: {},
			previewOptions: {},
			presentationToolOptions:{},
			themeOptions: {},
			backednOptions:{}
		},options);
	this.presentaion = null;	// 保存当前编辑的演示文稿
	this._topics = {};
	//this._box = box || document.body;
}

/**
 * singleton method
 * get S5Creator Instance
 * @param {Hash} options
 * @return {S5Creator}
 */
S5Creator.singleton = function(options)
{
	if(!S5Creator.instance)
	{
		S5Creator.instance = new S5Creator(options);
		S5Creator.instance.init();
	}
	return S5Creator.instance;
}


S5Creator.prototype.init = function()
{
	var s5c = this;
	//creat and init the components
	var tv =  $(s5c._options.thumbViewSelector).thumbView(
			s5c._options.thumbViewOptions
	);
	var layout = $(s5c._options.layoutSelector).layoutChooser(
			s5c._options.layoutOptions
	);
	var pt = $(s5c._options.presentationToolSelector).presentationTool(
			s5c._options.presentationToolOptions
	);
	var editor = new Editor (s5c._options.editorId,
			s5c._options.editorOptions
	);
	var ts = new ThemeSelector ($(s5c._options.themeSelector),
			s5c._options.themeOptions
	);
	this._components = {
		ThumbView: tv,
		Editor: editor,
		Layout : layout,
		Backend : new s5c._options.backend(s5c._options.backendOptions),
		PresentationTool:pt,
		ThemeSelector:ts
	}
}

/**
 * get component
 * @param {String}  name
 * @return {component} the components layout thumbview
 */
S5Creator.prototype.getComponent = function(name)
{
	return this._components[name];
}

/**
 *
 * @param {String} from
 * @param {String} to
 */
S5Creator.prototype.update = function(from,to)
{
	this.getComponent(to).set(this.getComponent(from).get());
}

S5Creator.prototype.register = function(topic,observer)
{
	if (!(this._topics[topic] instanceof Array))
		this._topics[topic] = [];
	this._topics[topic].push(observer);
}

S5Creator.prototype.notify = function(topic,data)
{
	console.log("notify " + topic);
	if (!(this._topics[topic] instanceof Array))
		return ;
	this._topics[topic].each(function(observer){
		observer.call(null,data);
	})
}



