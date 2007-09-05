<?php
FLEA::loadClass('FLEA_Db_TableDataGateway');
class Presentations extends FLEA_Db_TableDataGateway
{
	var $tableName = 'presentations';
    var $primaryKey = 'presentation_id';
}


class Controller_S5CBackend
{
    function actionIndex()
    {
        echo "do nothing";
    }

    function actionLoad()
    {
    	$pid = $_GET['presentation_id'];
		$modelPres =& new Presentations();
		$row = $modlePres->findByField("presentation_id",$pid);
		print_r($row);
		//echo json_encode($row);
    }

    function actionSave()
    {
    	$data = json_decode($_POST['data']);
		$modelPres =& new Presentations();
		$modelPres->save($data);
    }

    function actionNew()
    {
    	$data = array("name"=>"noname","content"=>"");
    	$modelPres =& new Presentations();
		$data["presentation_id"] = $modelPres->create($data);
		echo json_encode($data);
    }
}
?>
<?php

/**
 * backend
 * 提供的服务
 * 1.文档列表 list_pre
 * 2.载入某一个文档 load_pre
 * 3.保存某一个文档 save_pre
 * 4.新建一个文档
 * 5.删除一个文档
 * 6.版本?
 * 存储格式:普通文件
 */

class S5CBackend {

	function list_pre()
	{

	}

	function load_pre($pid)
	{
		$content =  <<<EOT
		<div class="slide">
			<h1>Presentation Name</h1>
			<h3>Your Name</h3>
			<h4>Your comapny</h4>
		</div>
		<div class="slide">
			<h1>Presentation</h1>
			<p>
			Mehdi Achour
			Friedhelm Betz
			Antony Dovgal
			Nuno Lopes
			Philip Olson
			Georg Richter
			Damien Seguy
			Jakub Vrana
			</p>
		</div>
EOT;
		$value = array(
			pid => $pid,
			content => $content
		);
		echo json_encode($value);
	}

	function save_pre($data)
	{
		print $data;
		$obj = json_decode($data);
		echo "is error ";
		var_dump($obj);
	}

	function handle()
	{
		$action = $_REQUEST['action'];

		switch ($action)
		{
		case 'load':
			$this->send($_GET['pid']);
			break;
		case 'save':
			$this->recv($_POST['data']);
			break;
		}
	}
};

//$backend = new S5CBackend();
//$backend->handle();
?>