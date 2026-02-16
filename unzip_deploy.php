<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>Starting Deployment Unzip</h2>";

$file = 'dist.zip';
if (!file_exists($file)) {
    die("❌ Error: $file not found.");
}

$zip = new ZipArchive;
$res = $zip->open($file);

if ($res === TRUE) {
    // Extract to current folder
    $zip->extractTo(__DIR__);
    $zip->close();
    echo "✅ <strong>SUCCESS!</strong> Extracted dist.zip.<br>";
    
    // Cleanup
    if (unlink($file)) echo "Deleted $file.<br>";
    if (unlink(__FILE__)) echo "Deleted script.<br>";
} else {
    echo "❌ Error: Failed to open zip (Code: $res).";
}
?>
