<?php
include_once 'db.php';
if (!isset($_GET['pass']) || $_GET['pass'] !== 'sun') { 
    http_response_code(401);
    exit("Accès non autorisé"); 
}

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=sunvizors_votes_'.date('Y-m-d').'.csv');

$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF"); // BOM UTF-8 pour Excel

fputcsv($out, ['Email', 'Ville', 'Prenom', 'Nom', 'Tel', 'Salle Proposée', 'Souhaits', 'Message', 'Date Vote', 'Adresse IP']);

$query = "SELECT email, city, first_name, last_name, phone, venue_proposal, intentions, message, created_at, ip_address 
          FROM votes 
          ORDER BY created_at DESC";

$res = $conn->query($query);
while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
    // Protection contre l'injection CSV (Excel formula injection)
    foreach ($row as $key => $value) {
        if ($value && strpos($value, '=') === 0) {
            $row[$key] = "'" . $value;
        }
    }
    fputcsv($out, $row); 
}
fclose($out);