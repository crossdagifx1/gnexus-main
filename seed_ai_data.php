<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$creds = [
    'host' => 'localhost',
    'db'   => 'gnexusqa_chat',
    'user' => 'gnexusqa_user',
    'pass' => 'B0&^0Y6oh.ZuxY}e'
];

echo "<h2>Seeding AI Data</h2>";

try {
    $dsn = "mysql:host={$creds['host']};dbname={$creds['db']};charset=utf8mb4";
    $pdo = new PDO($dsn, $creds['user'], $creds['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // 1. Insert OpenRouter Provider
    $providerId = 'prov_openrouter';
    $stmt = $pdo->prepare("INSERT IGNORE INTO ai_providers (id, name, slug, api_key, api_endpoint, is_enabled) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $providerId, 
        'OpenRouter', 
        'openrouter', 
        'sk-or-v1-YOUR-KEY-HERE', // User needs to update this!
        'https://openrouter.ai/api/v1/chat/completions',
        1
    ]);
    echo "✅ Provider OpenRouter inserted/ignored.<br>";

    // 2. Insert Models
    $models = [
        [
            'id' => 'mod_deepseek_r1',
            'pid' => $providerId,
            'name' => 'DeepSeek R1',
            'mid' => 'deepseek/deepseek-r1',
            'cat' => 'reasoning',
            'cw' => 128000,
            'vis' => 0
        ],
        [
            'id' => 'mod_claude_35_sonnet',
            'pid' => $providerId,
            'name' => 'Claude 3.5 Sonnet',
            'mid' => 'anthropic/claude-3.5-sonnet',
            'cat' => 'analysis',
            'cw' => 200000,
            'vis' => 1
        ],
        [
            'id' => 'mod_gpt_4o',
            'pid' => $providerId,
            'name' => 'GPT-4o',
            'mid' => 'openai/gpt-4o',
            'cat' => 'general',
            'cw' => 128000,
            'vis' => 1
        ]
    ];

    $stmt = $pdo->prepare("INSERT IGNORE INTO ai_models (id, provider_id, name, model_id, display_name, category, context_window, supports_vision, is_enabled) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($models as $m) {
        $stmt->execute([
            $m['id'], $m['pid'], $m['name'], $m['mid'], $m['name'], $m['cat'], $m['cw'], $m['vis'], 1
        ]);
        echo "✅ Model {$m['name']} inserted/ignored.<br>";
    }

} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage();
}
?>
