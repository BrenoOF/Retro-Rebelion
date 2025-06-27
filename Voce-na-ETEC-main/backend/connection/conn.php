<?php
$hostname = "localhost";
$dbname = "jogo";
$username = "root";
$password = "";

try {
    $pdo = new PDO('mysql:host=' . $hostname . ';dbname=' . $dbname, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(array(
        'type' => 'error',
        'message' => 'Erro de conexão: ' . $e->getMessage()
    ));
    exit; 
}
?>
