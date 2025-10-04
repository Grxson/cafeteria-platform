<?php
// Test simple para verificar qué datos están llegando
echo "POST data received:\n";
var_dump($_POST);
echo "\nFILES data received:\n";
var_dump($_FILES);
echo "\nRAW input:\n";
echo file_get_contents('php://input');
?>