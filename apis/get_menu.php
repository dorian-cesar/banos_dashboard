<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Incluye los headers que usas
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Incluye los métodos que usas

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; // Termina la petición OPTIONS
}
session_start();
header("Content-Type: application/json");

include './conexion.php';

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión a la base de datos"]));
}

// Verificar si el usuario está logueado

if (!isset($_SESSION["role_id"])) {
    echo json_encode(["error" => "No autorizado"]);
    exit;
}

$role_id = intval($_SESSION["role_id"]);

// Obtener los ítems del navbar y sidebar según el rol
$sql = "SELECT items.nombre, items.tipo, items.url, items.external, items.icono
        FROM items 
        JOIN role_items ON items.id = role_items.item_id 
        WHERE role_items.role_id = $role_id
        ORDER BY items.tipo, items.id";

$result = $conn->query($sql);

$items = ["navbar" => [], "sidebar" => []];

while ($row = $result->fetch_assoc()) {
    $item = [
        "nombre" => htmlspecialchars($row["nombre"], ENT_QUOTES),
        "url" => $row["url"],
        "external" => (bool)$row["external"],
        "icono" => $row["icono"] ? htmlspecialchars($row["icono"]) : null
    ];
    $items[$row["tipo"]][] = $item;
}

echo json_encode($items);
?>
