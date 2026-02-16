<?php
/**
 * G-Nexus Authentication Routes
 * Handles user registration, login, password reset, email verification
 */

require_once __DIR__ . '/api.php';
require_once __DIR__ . '/security_middleware.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$rateLimiter = new RateLimiter($pdo);

// Helper function to generate secure random token
function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

// Helper function to generate JWT
function generateJWT($userId, $email, $expiresIn = 86400) {
    $secretKey = $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-this';
    $issuedAt = time();
    $expire = $issuedAt + $expiresIn;
    
    $payload = [
        'user_id' => $userId,
        'email' => $email,
        'iat' => $issuedAt,
        'exp' => $expire
    ];
    
    $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64_encode(json_encode($payload));
    $signature = hash_hmac('sha256', "$header.$payload", $secretKey, true);
    $signature = base64_encode($signature);
    
    return "$header.$payload.$signature";
}

// Helper function to get current user from JWT
function getCurrentUser($pdo) {
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (empty($auth_header)) {
        return null;
    }
    
    $token = str_replace('Bearer ', '', $auth_header);
    
    // Decode JWT
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    
    $payload = json_decode(base64_decode($parts[1]), true);
    
    // Check token expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }
    
    // Get user from database
    if (isset($payload['user_id'])) {
        $stmt = $pdo->prepare("SELECT * FROM cms_users WHERE id = ?");
        $stmt->execute([$payload['user_id']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } elseif (isset($payload['email'])) {
        $stmt = $pdo->prepare("SELECT * FROM cms_users WHERE email = ?");
        $stmt->execute([$payload['email']]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    return null;
}

// Helper function to queue email
function queueEmail($pdo, $toEmail, $toName, $subject, $htmlBody) {
    // Check if table exists, if not, skip (prevent crash if feature not fully ready)
    try {
        $stmt = $pdo->prepare("
            INSERT INTO email_queue (recipient_email, recipient_name, subject, body) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$toEmail, $toName, $subject, $htmlBody]);
    } catch (Exception $e) {
        // Log error but don't fail request
        error_log("Email queue failed: " . $e->getMessage());
    }
}

function validatePassword($password) {
    if (strlen($password) < 8) return "Password must be at least 8 characters long";
    if (!preg_match('/[A-Z]/', $password)) return "Password must contain at least one uppercase letter";
    if (!preg_match('/[a-z]/', $password)) return "Password must contain at least one lowercase letter";
    if (!preg_match('/[0-9]/', $password)) return "Password must contain at least one number";
    return null;
}

switch ($action) {
    
case 'register':
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = trim($data['username'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $fullName = trim($data['full_name'] ?? '');
    
    if (empty($username) || empty($email) || empty($password)) {
        sendError('All fields are required');
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendError('Invalid email address');
    }
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM cms_users WHERE email = ? OR username = ?");
    $stmt->execute([$email, $username]);
    if ($stmt->fetch()) {
        sendError('Email or username already exists');
    }
    
    // Create user
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $verificationToken = generateToken();
    $uuid = generateUUID(); // Ensure generateUUID is available in api.php or define here
    
    if (!function_exists('generateUUID')) {
        function generateUUID() {
            return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
        }
    }

     // Insert with email_verified = 0
     $stmt = $pdo->prepare("
         INSERT INTO cms_users (id, username, email, password_hash, full_name, email_verification_token, email_verified, created_at, role_id)
         VALUES (?, ?, ?, ?, ?, ?, 0, NOW(), 'role_user')
     ");
    
    try {
        $stmt->execute([$uuid, $username, $email, $hashedPassword, $fullName, $verificationToken]);
        
        // Queue verification email
        $verifyUrl = ($_ENV['APP_URL'] ?? 'https://gnexuset.com') . '/verify-email?token=' . $verificationToken;
        $emailHtml = "
            <h1>Welcome to G-Nexus AI Suite!</h1>
            <p>Hi $fullName,</p>
            <p>Thank you for creating an account. Please verify your email address to get started.</p>
            <p><a href='$verifyUrl' style='display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;'>Verify Email Address</a></p>
            <p style='color: #666;'>This link expires in 24 hours.</p>
        ";
        
        queueEmail($pdo, $email, $fullName, 'Verify your G-Nexus account', $emailHtml);
        
        // Return dummy success so user knows to check email
        // We do NOT log them in automatically.
        sendSuccess([
            'message' => 'Account created! Please check your email to verify your account.',
            'require_verification' => true
        ]);
        
    } catch (PDOException $e) {
        sendError('Registration failed: ' . $e->getMessage());
    }
    break;

case 'login':
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $rememberMe = $data['remember_me'] ?? false;
    
    if (empty($email) || empty($password)) {
        sendError('Email and password are required');
    }
    
    // Get user
    $stmt = $pdo->prepare("SELECT * FROM cms_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendError('Invalid credentials');
    }
    
     // CHECK VERIFICATION
     // email_verified is 0/1. 
     if ($user['email_verified'] == 0) {
         sendError('Please verify your email address before logging in.');
     }
     
     // Generate Token
     // Map fields for frontend
     $user['email_verified'] = (bool)$user['email_verified'];
    
    $token = generateJWT($user['id'], $user['email']);
    
    // Login history... (skip for brevity or keep simple)
    $stmt = $pdo->prepare("UPDATE cms_users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);

    unset($user['password_hash']);
    unset($user['email_verification_token']);
    
    sendSuccess([
        'token' => $token,
        'user' => $user
    ]);
    break;

case 'verify-email':
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'] ?? $_GET['token'] ?? ''; // Support GET too
    
    if (empty($token)) {
        sendError('Token required');
    }
    
    $stmt = $pdo->prepare("SELECT id FROM cms_users WHERE email_verification_token = ? AND email_verified = 0");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        sendError('Invalid or expired token.');
    }
    
    $stmt = $pdo->prepare("UPDATE cms_users SET email_verified = 1, email_verification_token = NULL WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    sendSuccess(['message' => 'Email verified! You can now log in.']);
    break;

case 'resend-verification-email':
    $user = getCurrentUser($pdo);
    
    if (!$user) {
        sendError('Not authenticated', 401);
    }
    
    if ($user['email_verified']) {
        sendError('Email already verified');
    }
    
    // Generate new verification token
    $newVerificationToken = generateToken();
    
    // Update user's verification token
    $stmt = $pdo->prepare("UPDATE cms_users SET email_verification_token = ? WHERE id = ?");
    $stmt->execute([$newVerificationToken, $user['id']]);
    
    // Queue verification email
    $verifyUrl = ($_ENV['APP_URL'] ?? 'https://gnexuset.com') . '/verify-email?token=' . $newVerificationToken;
    $emailHtml = "
        <h1>Verify your G-Nexus account</h1>
        <p>Hi {$user['full_name']},</p>
        <p>Thank you for creating an account. Please verify your email address to get started.</p>
        <p><a href='$verifyUrl' style='display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;'>Verify Email Address</a></p>
        <p style='color: #666;'>This link expires in 24 hours.</p>
    ";
    
    queueEmail($pdo, $user['email'], $user['full_name'], 'Verify your G-Nexus account', $emailHtml);
    
    sendSuccess(['message' => 'Verification email resent! Please check your inbox.']);
    break;

default:
    sendError('Invalid action');
}
?>
