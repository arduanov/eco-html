<?php

$file = $_SERVER['REQUEST_URI'] . 'index.html';
$file = ltrim($file, '/');
//var_dump($file);
//exit;

if (!is_file($file)) {
    header('HTTP/1.1 301 Moved Permanently');
    header('Location: /');
    exit;
}

define('_SAPE_USER', 'de6b0e7d66e8c5e1213be9ea1d776495');
require_once('s/sape.php');

$o['charset'] = 'UTF-8';

$sape = new SAPE_client($o);
$links = $sape->return_links();

$html = file_get_contents($file);
$html = str_replace('[[[seo]]]', $links, $html);

echo $html;