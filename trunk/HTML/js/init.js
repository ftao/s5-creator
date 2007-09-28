// tinyMCE will load extra script files. so we cant't put it in $()
tinyMCE.init({
	mode:"none",
	theme:"advanced",
	theme_advanced_toolbar_location : "top",
	theme_advanced_toolbar_align : "left",
	theme_advanced_path_location : "bottom",
	theme_advanced_buttons1 : "undo,redo,cut,copy,paste,separator,bold,italic,underline,separator,justifyleft,justifycenter,justifyright,justifyfull,separator,bullist,numlist,link,unlink,image,separator,formatselect",
	theme_advanced_buttons2 : "",
	theme_advanced_buttons3 : "",
	plugins :"table,advhr,advimage,advlink",
	width : "600",
	height: "350",
	content_css : "s5themes/ui/blank/editor.css"
});

jQuery(function() {

	S5Creator.singleton({
			thumbViewSelector:	"#left",
			editorClassname:	"s5ceditor",
			layoutSelector:		"#layout_switch",
			presentationToolSelector: ".presentation_tools",
			themeSelector:		"#theme_selector",
			backend:			PHPBackend
	});

});
