<?php
echo "<h2>Shell Unzip Attempt</h2>";
$output = [];
$return_var = 0;
// Try unzip command
exec('unzip -o dist.zip 2>&1', $output, $return_var);

if ($return_var === 0) {
    echo "✅ Unzip successful!<br>";
    echo "<pre>" . implode("\n", array_slice($output, 0, 20)) . "... (output truncated)</pre>";
} else {
    echo "❌ Unzip failed with code $return_var<br>";
    echo "<pre>" . implode("\n", $output) . "</pre>";
    
    // Try 7z if unzip fails? usually unzip is standard.
}
?>
