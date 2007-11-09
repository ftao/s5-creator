
function FileManager(options,backend){
	this._options = $.extend(options,{
		toolbarItemSelector:".toolbar button",
		fileListSelector:".file_list tbody",
		checkboxSelector:".p_checkbox",
		selectButtonSelector:".select_action",
		newFileInputSelector:"#new_file_name"
	});
	this._backend = backend;
	this.init();
}

FileManager.prototype.init = function()
{
	var fm = this;
	//工具条
	$(this._options.toolbarItemSelector).click(
		function(e){
			var action = $(this).attr("action");
			switch(action)
			{
				case 'create':
				var input = $(fm._options.newFileInputSelector);
				if(input.length <= 0 ){
					input = $(fm.buildCreateForm("新建演示文稿"));
					input.appendTo("body").addClass("flora").dialog({
						buttons: {
							'确定':function(){
								var value = input.val();
								if(value == "")
	 								return;
								fm.create(value);
								input.dialogClose();
							}
						},
						height:100,
						'title':'输入文件名称',
						position:"center",
						resize:false
					});
					input[0].select();
				}
				else
				{
					input.val("新建演示文稿");
					input.dialogOpen();
					input[0].select();
				}

				break;
				case 'delete':
				var to_delete = [];
				$(fm._options.checkboxSelector + "[checked]").each(
					function(i){
						to_delete.push($(this).attr("id"));
					}
				);
				if(to_delete.length <= 0 )
					return ;
				fm._backend.remove(
					to_delete,
					function(data)
					{
						var pids = data[0];
						var ret = data[1];
						for(var i = 0; i < pids.length; i++)
						{
							if(ret[i] == 1)
							{
								$(fm._options.checkboxSelector + "#" + pids[i]).parents('tr').remove();
							}
						}
						$(fm._options.fileListSelector).parents("table").trigger("update");
						setTimeout(function(){

						},500);
					}
				);
				//似乎浏览器需要时间去移除元素, 这里放一个半秒钟的延时.
				//否则update 不会有效果.
				//这个郁闷了我好久啊...
				//我错了, 应该AJAX 的延时

				break;
			}
		}
	);
	//选择按钮
	$(this._options.selectButtonSelector).click(
		function(e){
			var which = $(this).attr("which");
			switch(which)
			{
				case 'none':
					$(".p_checkbox").removeAttr("checked");
					break;
				case 'all':
					$(".p_checkbox").attr("checked","checked");
					break;
				case 'reverse':
					$(".p_checkbox").each(function(i){
						if($(this).attr('checked'))
							$(this).removeAttr('checked');
						else
							$(this).attr("checked","checked");
					});
					break;
			}
		}
	);
}


FileManager.prototype.loadList = function()
{
	var fm = this;
	this._backend.list(function(data){
		$(fm._options.fileListSelector).empty();
		$.each(data,
			function(i,obj)
			{
				console.log(obj);
				$(fm._options.fileListSelector).append(fm.buildTr(obj));
			}
		);
		$(fm._options.fileListSelector).parent().tablesorter(
			{headers:{0:{sorter: false}},sortList:[], widgets: ['zebra']}
		);
	});
}

FileManager.prototype.create = function(name)
{
	var fm = this;
	this._backend.create(
		name,
		function(data)
		{
			$(fm._options.fileListSelector).append(fm.buildTr(data));
			$(fm._options.fileListSelector).parents("table").trigger("update");
		}
	);
}

FileManager.prototype.buildTr = function(obj)
{
	return "<tr>"
	+ "<td><input class='p_checkbox' type='checkbox' id='"
	+ obj.presentation_id + "'/></td>"
	+ "<td><a target='_blank' href='editor.htm?pid="
	+ obj.presentation_id + "'>"
	+ obj.name + "</a></td><td>"
	+ (obj.author || "未知") + "</td><td>"
	+ (new Date(obj.updated * 1000)).toLocaleString()
	+ "</tr>";
}

FileManager.prototype.buildCreateForm = function(defaultName)
{
	var input = $('<input id="new_file_name" input type="text" class="input" value="'
				+ defaultName + '"/>');
	return input;
}
