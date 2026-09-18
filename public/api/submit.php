<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function sendTelegram(string $token, string $chatId, string $text): bool
{
    $ch = curl_init("https://api.telegram.org/bot{$token}/sendMessage");
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => ['chat_id' => $chatId, 'text' => $text],
        CURLOPT_TIMEOUT => 30,
    ]);

    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $response !== false && $status >= 200 && $status < 300;
}

function sendPlainEmail(string $to, string $from, string $replyTo, string $subject, string $text): bool
{
    $headers = [
        'From: ' . $from,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];

    if ($replyTo !== '') {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    return mail(
        $to,
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $text,
        implode("\r\n", $headers)
    );
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed');
}

function loadLeadConfig(): array
{
    $jsonPath = __DIR__ . '/config.json';
    if (is_file($jsonPath)) {
        $decoded = json_decode((string) file_get_contents($jsonPath), true);
        if (!is_array($decoded)) {
            fail(500, 'Неверный public/api/config.json');
        }
        return $decoded;
    }

    $phpPath = __DIR__ . '/config.php';
    if (is_file($phpPath)) {
        $config = require $phpPath;
        return is_array($config) ? $config : [];
    }

    fail(500, 'Создайте public/api/config.json по образцу config.example.json');
}

$config = loadLeadConfig();

$phpLegacyPath = __DIR__ . '/config.php';
if (is_file($phpLegacyPath)) {
    $legacy = require $phpLegacyPath;
    if (is_array($legacy)) {
        foreach (['email_to', 'email_from', 'telegram_bot_token', 'telegram_chat_id'] as $key) {
            $current = trim((string) ($config[$key] ?? ''));
            $fromPhp = trim((string) ($legacy[$key] ?? ''));
            if ($current === '' && $fromPhp !== '') {
                $config[$key] = $fromPhp;
            }
        }
    }
}

$token = trim((string) ($config['telegram_bot_token'] ?? ''));
$chatId = trim((string) ($config['telegram_chat_id'] ?? ''));
$emailTo = trim((string) ($config['email_to'] ?? 'info@romedov.by'));
$emailFrom = trim((string) ($config['email_from'] ?? 'noreply@romedov.by'));

if ($emailTo === '') {
    fail(500, 'Укажите email_to в public/api/config.json');
}

if ($token === '' || $chatId === '') {
    fail(500, 'Укажите telegram_bot_token и telegram_chat_id в public/api/config.json');
}

$kind = ($_POST['kind'] ?? 'order') === 'request' ? 'request' : 'order';

$name = trim((string) ($_POST['name'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$company = trim((string) ($_POST['company'] ?? ''));

if (mb_strlen($name) < 2) {
    fail(400, 'Укажите имя (минимум 2 символа)');
}

$phoneDigits = preg_replace('/\D+/', '', $phone) ?? '';
if (strlen($phoneDigits) < 9) {
    fail(400, 'Укажите корректный номер телефона');
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(400, 'Проверьте адрес электронной почты');
}

$orderNumber = '';

if ($kind === 'request') {
    // --- Заявка без корзины (форма на странице контактов) --------------------
    $message = trim((string) ($_POST['message'] ?? ''));
    $source = trim((string) ($_POST['source'] ?? ''));

    $lines = [
        'Новая заявка с shop.romedov.by',
        '',
        'Имя: ' . $name,
        'Телефон: ' . $phone,
    ];

    if ($company !== '') {
        $lines[] = 'Компания: ' . $company;
    }

    if ($source !== '') {
        $lines[] = 'Страница: ' . $source;
    }

    if ($message !== '') {
        $lines[] = '';
        $lines[] = 'Задача:';
        $lines[] = $message;
    }

    $text = implode("\n", $lines);
    $subject = 'Заявка с сайта: ' . $name;
} else {
    // --- Заказ из корзины ---------------------------------------------------
    $unp = trim((string) ($_POST['unp'] ?? ''));
    $customerType = ($_POST['customerType'] ?? 'person') === 'company' ? 'company' : 'person';
    $delivery = ($_POST['delivery'] ?? 'pickup') === 'delivery' ? 'delivery' : 'pickup';
    $address = trim((string) ($_POST['address'] ?? ''));
    $comment = trim((string) ($_POST['comment'] ?? ''));
    $totalPrice = (float) ($_POST['totalPrice'] ?? 0);
    $totalWeightKg = (float) ($_POST['totalWeightKg'] ?? 0);

    $items = json_decode((string) ($_POST['items'] ?? '[]'), true);
    if (!is_array($items) || count($items) === 0) {
        fail(400, 'Корзина пуста');
    }

    if ($customerType === 'company' && mb_strlen($company) < 2) {
        fail(400, 'Укажите название организации');
    }

    if ($delivery === 'delivery' && mb_strlen($address) < 5) {
        fail(400, 'Укажите адрес доставки');
    }

    $orderNumber = date('ymd') . '-' . date('Hi');

    $deliveryLabels = [
        'pickup' => 'Самовывоз со склада (Борисов)',
        'delivery' => 'Доставка нашим транспортом',
    ];

    $customerTypeLabels = [
        'person' => 'Физическое лицо',
        'company' => 'Организация / ИП',
    ];

    $lines = [
        'Новый заказ №' . $orderNumber . ' — shop.romedov.by',
        '',
        'Покупатель: ' . $name,
        'Телефон: ' . $phone,
    ];

    if ($email !== '') {
        $lines[] = 'E-mail: ' . $email;
    }

    $lines[] = 'Тип: ' . $customerTypeLabels[$customerType];

    if ($company !== '') {
        $lines[] = 'Организация: ' . $company;
    }

    if ($unp !== '') {
        $lines[] = 'УНП: ' . $unp;
    }

    $lines[] = 'Получение: ' . $deliveryLabels[$delivery];

    if ($address !== '') {
        $lines[] = 'Адрес: ' . $address;
    }

    $lines[] = '';
    $lines[] = 'Состав заказа:';

    $index = 1;
    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }

        $itemName = trim((string) ($item['name'] ?? ''));
        if ($itemName === '') {
            continue;
        }

        $quantity = (float) ($item['quantity'] ?? 0);
        $quantityText = $quantity == floor($quantity)
            ? (string) (int) $quantity
            : number_format($quantity, 1, '.', '');

        $lines[] = sprintf(
            '%d. %s — %s %s · %s кг · %s р.',
            $index,
            $itemName,
            $quantityText,
            (string) ($item['unit'] ?? 'шт'),
            number_format((float) ($item['weightKg'] ?? 0), 1, '.', ''),
            number_format((float) ($item['total'] ?? 0), 2, '.', ' ')
        );
        $index++;
    }

    $lines[] = '';
    $lines[] = 'Итого: ' . number_format($totalPrice, 2, '.', ' ') . ' р.';
    $lines[] = 'Общий вес: ' . number_format($totalWeightKg / 1000, 3, '.', '') . ' т';

    if ($comment !== '') {
        $lines[] = '';
        $lines[] = 'Комментарий:';
        $lines[] = $comment;
    }

    $text = implode("\n", $lines);
    $subject = 'Заказ №' . $orderNumber . ' — ' . $name;
}

// 1. Сначала почта — без неё заявка не считается принятой
if (!sendPlainEmail($emailTo, $emailFrom, $email, $subject, $text)) {
    fail(502, 'Не удалось отправить на почту. Позвоните нам, пожалуйста.');
}

// 2. Дублируем в Telegram (ошибка бота не отменяет принятую заявку)
sendTelegram($token, $chatId, $text);

echo json_encode(['ok' => true, 'orderNumber' => $orderNumber], JSON_UNESCAPED_UNICODE);
