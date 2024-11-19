<?php
header("Content-Type: application/json");
require_once "db.php";

// Ambil method request
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Fungsi respon JSON
function response($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data);
    exit;
}

// Route berdasarkan method
switch ($method) {
    case 'GET':
        // Ambil semua data atau data spesifik
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "SELECT * FROM items WHERE id = $id";
        } else {
            $sql = "SELECT * FROM items";
        }

        $result = $conn->query($sql);
        $data = $result->fetch_all(MYSQLI_ASSOC);
        response($data);
        break;

    case 'POST':
        // Tambah data baru
        if (!isset($input['name']) || !isset($input['description'])) {
            response(['error' => 'Invalid input'], 400);
        }
        $name = $conn->real_escape_string($input['name']);
        $description = $conn->real_escape_string($input['description']);
        $sql = "INSERT INTO items (name, description) VALUES ('$name', '$description')";
        if ($conn->query($sql)) {
            response(['message' => 'Data created'], 201);
        } else {
            response(['error' => $conn->error], 500);
        }
        break;

    case 'PUT':
        // Update data
        if (!isset($_GET['id']) || !isset($input['name']) || !isset($input['description'])) {
            response(['error' => 'Invalid input'], 400);
        }
        $id = intval($_GET['id']);
        $name = $conn->real_escape_string($input['name']);
        $description = $conn->real_escape_string($input['description']);
        $sql = "UPDATE items SET name = '$name', description = '$description' WHERE id = $id";
        if ($conn->query($sql)) {
            response(['message' => 'Data updated']);
        } else {
            response(['error' => $conn->error], 500);
        }
        break;

    case 'DELETE':
        // Hapus data
        if (!isset($_GET['id'])) {
            response(['error' => 'Invalid input'], 400);
        }
        $id = intval($_GET['id']);
        $sql = "DELETE FROM items WHERE id = $id";
        if ($conn->query($sql)) {
            response(['message' => 'Data deleted']);
        } else {
            response(['error' => $conn->error], 500);
        }
        break;

    default:
        response(['error' => 'Method not allowed'], 405);
        break;
}
?>
