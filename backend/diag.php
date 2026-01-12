<?php
// Script de diagnostic Sunvizors
header('Content-Type: text/plain');

echo "--- Diagnostic Système ---\\n";
echo "Version PHP : " . phpversion() . "\\n";

include_once 'db.php';

if (isset($conn)) {
    echo "Connexion DB : OK\\n";
    try {
        $stmt = $conn->query("SELECT COUNT(*) FROM votes");
        echo "Nombre de votes en base : " . $stmt->fetchColumn() . "\\n";
    } catch(Exception $e) {
        echo "Erreur lecture table : " . $e->getMessage() . "\\n";
    }
} else {
    echo "Connexion DB : ÉCHEC\\n";
}

