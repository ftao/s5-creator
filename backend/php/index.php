<?php
require_once('FLEA/FLEA.php');
FLEA::import(dirname(__FILE__) . '/APP');
FLEA::loadAppInf('APP/Config/s5cbackend_config.php');
FLEA::runMVC();

?>