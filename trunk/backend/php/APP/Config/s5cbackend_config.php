<?php
/*
 GRANT ALL PRIVILEGES ON s5cphp.* TO s5cphp@localhost IDENTIFIED BY "s5cphp";
 CREATE TABLE `presentations` (
  `presentation_id` int(11) NOT NULL auto_increment,
   `name` varchar(255) NOT NULL,
   `author` varchar(255) default NULL,
   `content` text NOT NULL,
   `theme_id` int(11) default NULL,
   `created` int(11) default NULL,
   `updated` int(11) default NULL,
   PRIMARY KEY  (`presentation_id`)
);
*/
return array(
    'defaultController' => 'S5CBackend',
    'responseCharset'	=> 'utf-8',
    'databaseCharset'   => 'utf8',
    'urlLowerChar'      => false,
    'dbDSN'     		=> array(
        'driver'        => 'mysql',
        'host'          => 'localhost',
        'login'         => 's5cphp',
        'password'      => 's5cphp',
        'database'      => 's5cphp',
    ),
    'view' => 'FLEA_View_Smarty',
    'viewConfig' => array(
        'smartyDir'         => './Smarty',
        'template_dir'      => './templates',
        'compile_dir'       => './templates_c',
        'left_delimiter'    => '{{',
        'right_delimiter'   => '}}',
        'force_compile'     => true,
    ),
);
?>