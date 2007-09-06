var $j = jQuery.noConflict();
$j(function() {

    var wymOptions = {

      //options
      //classes panel
      classesItems: [
        {'name': 'date', 'title': 'PARA: Date', 'expr': 'p'},
        {'name': 'hidden-note', 'title': 'PARA: Hidden note',
         'expr': 'p[@class!="important"]'},
        {'name': 'important', 'title': 'PARA: Important',
         'expr': 'p[@class!="hidden-note"]'},
        {'name': 'border', 'title': 'IMG: Border', 'expr': 'img'},
        {'name': 'special', 'title': 'LIST: Special', 'expr': 'ul, ol'}
      ],

      //editor css values for visual feedback
      editorStyles: [
        {'name': '.hidden-note',
         'css': 'color: #999; border: 2px solid #ccc;'},
        {'name': '.border', 'css': 'border: 4px solid #ccc;'},
        {'name': '.date',
         'css': 'background-color: #ff9; border: 2px solid #ee9;'},
        {'name': '.important',
         'css': 'color: red; font-weight: bold; border: 2px solid red;'},
        {'name': '.special',
         'css': 'background-color: #fc9; border: 2px solid red;'}
      ],

      //dialogs css values
      dialogStyles: [
        {'name': '.hidden-note',
         'css': 'display: none;'},
        {'name': '.border', 'css': 'border: 1px solid #ccc;'},
        {'name': '.date',
         'css': 'color: #ccf;'},
        {'name': '.important',
         'css': 'color: red; font-weight: bold;'},
        {'name': '.special',
         'css': 'color: green;'}
      ],

      //function called when WYMeditor instance is ready
      //wym is the WYMeditor instance
      postInit: function(wym) {
        //set the status bar value
        wym.status('&nbsp;');
      },

      //function called when dialog is ready
      //wym is the WYMeditor instance
      //wdw is the dialog's window
      postInitDialog: function(wym,wdw) {

        var body = wdw.document.body;

        //add a select box populated with predefined values to the dialog

        var sSelectLink = "<div class='row row-indent'>"
        + "<select class='wym_select_link'>"
        + "<option selected value='WYMeditor http://www.wymeditor.org/'>"
        + "WYMeditor<\/option>"
        + "<option value='SourceForge http://www.sourceforge.net/'>"
        + "SourceForge<\/option>"
        + "<option value='GNU http://www.gnu.org/'>"
        + "GNU<\/option>"
        + "<\/select>"
        + "<input class='wym_choose' type='button'"
        + " value='{Choose}' />"
        + "<\/div>";

        $j(body)
          .filter('.wym_dialog_link').find('fieldset').eq(0)
          .prepend(wym.replaceStrings(sSelectLink));

        $j(body)
          .find('.wym_choose')
          .click(function() {

            var sVal = $j(body).find('.wym_select_link').val();

            $j(body)
              .find('.wym_href')
              .val(sVal.substring(sVal.lastIndexOf(' ') + 1));
            $j(body)
              .find('.wym_title')
              .val(sVal.substr(0, sVal.lastIndexOf(' ')));
          });
      }
    }//end wym editor options

	S5Creator.singleton({
			thumbViewSelector:	"#left",
			editorSelector:		"#wymeditor",
			layoutSelector:		"#layout_switch",
			presentationToolSelector: ".presentation_tools",
			editorOptions: wymOptions,
			backend:PHPBackend
	});

	$j('.wymsubmit').click(
		function(event)
		{
			console.log("submit");
			var wym = S5Creator.singleton().getComponent("Editor");
			wym.update();
			var tv = S5Creator.singleton().getComponent("ThumbView");
			tv.update(new Slide(wym.html()));
			return false;
    	}
	);

});
