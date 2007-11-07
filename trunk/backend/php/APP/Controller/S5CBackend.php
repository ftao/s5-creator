<?php
/**
 * backend
 * 提供的服务
 * 1.文档列表 list
 * 2.载入某一个文档 load
 * 3.保存某一个文档 save
 * 4.新建一个文档  create
 * 5.删除一个文档 remove
 * 6.版本?
 */
?>
<?php
FLEA::loadClass('FLEA_Db_TableDataGateway');
class Presentations extends FLEA_Db_TableDataGateway
{
	var $tableName = 'presentations';
    var $primaryKey = 'presentation_id';
}


class Controller_S5CBackend extends FLEA_Controller_Action
{
    function actionIndex()
    {
        echo "do nothing";
        echo (int)false;
        echo (int)true;
    }

	function actionList()
	{
    	$modelPres =& new Presentations();
    	$sql = sprintf("SELECT `%s`,`%s` FROM `%s`",
    		$modelPres->primaryKey,"name",$modelPres->tableName);
		$all_pres = $modelPres->findBySql($sql);
		echo json_encode($all_pres);
	}

    function actionLoad()
    {
    	$pid = $_GET['presentation_id'];
		$modelPres =& new Presentations();
		$row = $modelPres->findByField("presentation_id",$pid);
		//print_r($row);
		echo json_encode($row);
    }

    function actionSave()
    {
    	$data = (array)json_decode($_POST['data']);
    	//print_r($data);
		$modelPres =& new Presentations();
		echo (int)$modelPres->save($data);
    }

    function actionCreate()
    {
    	//print $_GET['data'];
    	$data = (array)json_decode($_GET['data']);
    	$data["content"] = "<div class='slide'></div>";
    	$modelPres =& new Presentations();
		$data["presentation_id"] = $modelPres->create($data);
		echo json_encode($data);
    }

    function actionRemove()
    {
    	$pid = $_GET['presentation_id'];
    	$modelPres =& new Presentations();
    	echo (int)$modelPres->removeByPkv($pid);
    }

    function actionPreview()
    {
		//we should have save the document before export
		//so we only need presentation_id here to export
		$pid = $_GET['presentation_id'];
		$modelPres =& new Presentations();
		$row = $modelPres->findByField("presentation_id",$pid);
		//print_r($row);
        $smarty =& $this->_getView();
        /* @var $smarty Smarty */
        $smarty->assign('link_prefix', '../../s5-files/');
        $smarty->assign('presentation',$row);
        $smarty->display('preview.html');
    }

}
?>
