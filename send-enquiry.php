<?php
/*
 * Handles the contact form on contact.html and emails the enquiry.
 * Returns JSON when called by JavaScript (fetch); otherwise redirects back.
 */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/includes/PHPMailer/Exception.php';
require __DIR__ . '/includes/PHPMailer/PHPMailer.php';
require __DIR__ . '/includes/PHPMailer/SMTP.php';
$cfg = require __DIR__ . '/includes/mail-config.php';

$isAjax = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch';

function respond(bool $ok, string $msg, int $code = 200): void {
    global $isAjax;
    if ($isAjax) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode(['ok' => $ok, 'message' => $msg]);
    } else {
        header('Location: contact.html?' . ($ok ? 'sent=1' : 'error=1') . '#enquiry');
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request.', 405);
}

// Honeypot: real users never fill this hidden field
if (!empty($_POST['website'])) {
    respond(true, 'Thank you! Your enquiry has been sent.');
}

$clean = fn($k, $max = 200) => trim(mb_substr(strip_tags($_POST[$k] ?? ''), 0, $max));
$name    = $clean('name', 100);
$phone   = $clean('phone', 20);
$email   = $clean('email', 150);
$type    = $clean('type', 50);
$school  = $clean('school', 150);
$message = $clean('message', 2000);

if ($name === '' || !preg_match('/^[0-9+\-\s]{10,15}$/', $phone)) {
    respond(false, 'Please enter your name and a valid phone number.', 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}
if ($cfg['smtp_user'] === 'your-gmail@gmail.com') {
    respond(false, 'Email is not set up yet. Please call or WhatsApp us on +91 82862 82418.', 500);
}

$e = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$rows = [
    'Name'          => $name,
    'Phone'         => $phone,
    'Email'         => $email ?: '-',
    'Enquiry For'   => $type ?: '-',
    'School / Class'=> $school ?: '-',
    'Message'       => $message ?: '-',
];
$html = '<h2 style="color:#1b2a6b;font-family:Arial">New Website Enquiry</h2>'
      . '<table cellpadding="8" style="border-collapse:collapse;font-family:Arial;font-size:14px">';
$text = "New Website Enquiry\n\n";
foreach ($rows as $label => $val) {
    $html .= '<tr><td style="border:1px solid #ddd;background:#f5f8fc"><b>' . $label . '</b></td>'
           . '<td style="border:1px solid #ddd">' . nl2br($e($val)) . '</td></tr>';
    $text .= "$label: $val\n";
}
$html .= '</table><p style="font-family:Arial;color:#888;font-size:12px">Sent from the Shree Sawariya Ji website contact form on '
       . date('d M Y, h:i A') . '</p>';

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $cfg['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $cfg['smtp_user'];
    $mail->Password   = str_replace(' ', '', $cfg['smtp_pass']);
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = $cfg['smtp_port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($cfg['smtp_user'], $cfg['from_name']);
    $mail->addAddress($cfg['to_email'], $cfg['to_name']);
    if ($email !== '') {
        $mail->addReplyTo($email, $name);
    }

    $mail->isHTML(true);
    $mail->Subject = "New Enquiry: $type - $name";
    $mail->Body    = $html;
    $mail->AltBody = $text;
    $mail->send();

    respond(true, 'Thank you! Your enquiry has been sent. We will contact you soon.');
} catch (Exception $ex) {
    error_log('Enquiry mail failed: ' . $mail->ErrorInfo);
    respond(false, 'Sorry, the message could not be sent. Please call or WhatsApp us on +91 82862 82418.', 500);
}
