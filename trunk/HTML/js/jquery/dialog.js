/*
 * Dialog : a modal dialog using jquery and blockUI
 * Copyright (C) 2007 Tao Fei  - http://filia.cn
 * Licensed under GPL 3 licenses.
 *
 * File Name:
 *        dialog.js
 *
 * File Authors:
 *        Tao Fei  (Filia.Tao@gmail.com)
 */

var $j = jQuery.noConflict();

/**
 * @name Dialog
 * @description Dialog Class , based on blockUI , learn something for xul-dialog
 * @param {Object} content the content to show in the dialog
 * @param {Hash} options
 */
function Dialog(content,options)
{
	this._content = content;
	this._options = $j.extend({
		buttons:"accept,cancel",
		buttonlabelcancel:"cancel",
		buttonlabelaccept:"OK",
		title:"Dialog",
		ondialogaccept:null,
		ondialogcancel:null,
		template: "<div class='dialog' style='display:none'>"
				+ "<div class='dlg_title'></div>"
				+ "<div class='dlg_content'></div>"
				+ "<div class='dlg_button'></div>"
				+ "</div>"
	},options);
	this._box = $j(this._options.template);
	this.init();
}

/**
 * @name init
 * @description Initializes a Dialog
 */
Dialog.prototype.init = function()
{
	var dlg = this;
	this._defaultAction = {
		accept: function(){dlg.hide()},
		cancel: function(){dlg.hide()}
	}
	$j(this._box).find(".dlg_title").html(this._options.title);
	$j(this._content).show();
	$j(this._box).find(".dlg_content").append(this._content);

	//build the buttons
	var buttons = this._options.buttons.split(',');
	for(var i=0; i < buttons.length; i++)
	{
		if(buttons[i] == "")
			continue;
		$j(this._box).find(".dlg_button").append(
			  "<button class='"
			+ buttons[i]
			+ "'>"
			+ this._options["buttonlabel"+buttons[i]]
			+ "</button>"
		);
	}
	//add event handler for buttons
	for(var j=0; j < buttons.length; j++)
	{
		if(buttons[i] == "")
			continue;
		//why? closure problem
		//@see http://www.cnblogs.com/zitiger/archive/2007/06/08/776777.html
		(function(){
			var button = buttons[j];
			$j(dlg._box).find("." + button).click(
				function(event){
					var callback =	dlg._options["ondialog"+button];
					var ret = true;
					if(callback)
					{
						ret = callback(event);
					}
					if (ret === false)
					{
						//prevent default
					}
					else
					{
						dlg._defaultAction[button](event);
					}
				}
			);
		})();
	}
}

/**
 * @name show
 * @description show  this dialog
 */
Dialog.prototype.show = function()
{
	$j.blockUI(this._box);
}

/**
 * @name hide
 * @description hide this dialog
 */
Dialog.prototype.hide = function()
{
	$j.unblockUI();
}

/**
 * @name content
 * @description set the content
 * @param {Object} content
 */
Dialog.prototype.content = function(content)
{
	$j(this._box).find(".dlg_content").empty().append(content);
}

/**
 * @name title
 * @description set the title
 * @param {Object} title
 */
Dialog.prototype.title = function(title)
{
	$j(this._box).find(".dlg_title").empty().append(title);
}


//convient ways
/**
 * @name alert
 * @description show a alert dialog with msg and callback
 * @param {Object} msg
 * @param {Function} callback
 */
Dialog.alert = function(msg,callback)
{
	var dlg = new Dialog(msg,{
		buttons:"accept",
		title:"",
		ondialogaccept: function(){
			if(typeof callback == "function")
				callback();
		}
	});
	dlg.show();
	return dlg;
}

/**
 * @name confirm
 * @description show a confirm dialog with msg and callback
 * @param {Object} msg
 * @param {Function} callback (should accept a bool arguemt)
 */
Dialog.confirm = function(msg,callback)
{
	var dlg = new Dialog(msg,{
		title:"",
		buttons:"accept,cancel",
		buttonlabelaccept:"Yes",
		buttonlabelcancel:"No",
		ondialogaccept: function(){
			if(typeof callback == "function")
				callback(true);
		},
		ondialogcancel: function(){
			if(typeof callback == "function")
				callback(false);
		}
	});
	dlg.show();
	return dlg;
}

/**
 * @name prompt
 * @description show a prompt dialog with msg and callback
 * @param {Object} msg The  HTML to be displayed in the dialog box.
 * It should ask the user to enter the information you want.
 * @param {String} defaultValue A string that is displayed as the default input in the dialog box.
 * @param {Function} callback should take a argumet
 */
Dialog.prompt = function(msg,defaultValue,callback)
{
	var content =$j("<input type=\"text\" class=\"input\" value=\""
				+ defaultValue + "\"/>");
	var dlg = new Dialog(content,{
		title:msg,
		buttons:"accept,cancel",
		buttonlabelaccept:"OK",
		buttonlabelcancel:"Cancel",
		ondialogaccept: function(){
			if(typeof callback == "function")
				callback($j(dlg).find(".input").val());
		},
		ondialogcancel: function(){
			if(typeof callback == "function")
				callback(null);
		}
	});
	dlg.show();
	content.select();
	return dlg;
}

/*
//some test code
Dialog.alert("alert test");
Dialog.confirm("Do you really want to go ?",
	function(b){
		alert (b?"true":"false");
	}
);

Dialog.prompt("input your name","taofei",
	function(m){
		alert( m!=null?m:"NULL");
	}
);
*/
