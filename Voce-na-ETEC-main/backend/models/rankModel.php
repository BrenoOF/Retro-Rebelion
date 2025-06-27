<?php
include('../connection/conn.php');

// Ler dados JSON do POST
$data = json_decode(file_get_contents("php://input"), true);

if ($data['operacao'] == 'create') {
    if (empty($data['nome'])) {
        $result = array(
            'type' => 'error',
            'message' => 'Existe(m) campo(s) obrigatório(s) não preenchido(s).'
        );
        echo json_encode($result);
    } else {
        try {
            $sql = "INSERT INTO ranking (pontuacao, nome) VALUES (?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $data['pontuacao'],
                $data['nome']
            ]);
            $result = array(
                'type' => 'success',
                'message' => 'Registro cadastrado com sucesso'
            );
            echo json_encode($result);
        } catch (PDOException $e) {
            $result = array(
                'type' => 'error',
                'message' => 'Erro: ' . $e->getMessage()
            );
            echo json_encode($result);
        }
    }
}

if ($data['operacao'] == 'read') {
    try {
        $sql = "SELECT * FROM ranking ORDER BY pontuacao DESC;";
        $resultado = $pdo->query($sql);
        $ranking = array();

        while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $ranking[] = $row;
        }

        echo json_encode($ranking);
    } catch (PDOException $e) {
        $result = array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        );
        echo json_encode($result);
    }
}
?>
