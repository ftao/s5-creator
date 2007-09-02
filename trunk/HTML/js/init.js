/*
var slide_title_template =
  '<h1 class="slidetitle editable" style="height:50px">'
+ '[slide title]'
+ '</h1>';
var slide_content_template =
  '<div class="slidecontent editable" style="height:300px">'
+ '[slide content]'
+ '</div>';
*/

var $j = jQuery.noConflict();
$j(function() {

	var s5_st_filter = function(index){
		return (index == 0) && this.tagName.toLowerCase() == "h1";
	}
	var s5_sc_filter = function(index){
		return !s5_st_filter.call(this,index);
	}

    //$j('.slidecontent').wymeditor(
    var wymOptions = {

      //options
	  //stylesheet: 'css/editorStyle.css',
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

        //activate 'tidy' plugin
        //which cleans up the HTML
        /*
        var wymtidy = wym.tidy({

          sUrl:          "wymeditor/tags/0.3-b1/wymeditor/plugins/tidy/tidy.php",
          sButtonHtml:   "<li class='wym_tools_tidy'>"
                       + "<a name='CleanUp' href='#'"
                       + " style='background-image:"
                       + " url(wymeditor/tags/0.3-b1/wymeditor/plugins/tidy/wand.png)'>"
                       + "Clean up HTML"
                       + "<\/a><\/li>"
        });
        wymtidy.init();
        */

        //activate 'hovertools' plugin
        //which gives more feedback to the user
        //wym.hovertools();

		$j(wym.box()).find(".editable").click(
			function(){
				wym.changeTarget($j(this));
			}
		);

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

	$j("#wymeditor").wymeditor(
		$j.extend(wymOptions,
			{
				html:$j("#sample").html(),
				layout:"Title-Content"
			}
		)
	);

	$j("#sample").hide();
	var tv = new ThumbView(
		$j('#left')
	);
	tv.init();
    $j('.wymsubmit').click(
		function()
		{
			var wym = $j.wymeditors(0);
			wym.update();
			tv.update(new Slide(wym._layout.layout(),wym.html()));
			var current = $j('div.thumb div.editing');
			return false;
    	}
	);

	var lv = $("#layout_switch").layoutChooser({
		thumbView:tv
	});
	lv.init();
});
