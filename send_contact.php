<?php
// Endpoint para procesar el formulario de contacto desde contact.html
// Responde en JSON para ser consumido vía fetch desde scripts.js

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit();
}

// Sanitizar accesos básicos
$tipo = isset($_POST['tipo']) ? trim($_POST['tipo']) : 'servicio'; // 'servicio' | 'empleo'
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';

// Campos específicos por tipo
$mensajeServicio = isset($_POST['mensajeServicio']) ? trim($_POST['mensajeServicio']) : '';
$puesto = isset($_POST['puesto']) ? trim($_POST['puesto']) : '';
$linkedin = isset($_POST['linkedin']) ? trim($_POST['linkedin']) : '';
$mensajeEmpleo = isset($_POST['mensajeEmpleo']) ? trim($_POST['mensajeEmpleo']) : '';

// Validaciones mínimas
if ($nombre === '' || $correo === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation', 'message' => 'Nombre/correo inválidos']);
    exit();
}

// Validaciones espejo del frontend
if (strlen($nombre) < 2 || strlen($nombre) > 60 || !preg_match('/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/', $nombre)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation', 'message' => 'Nombre inválido: solo letras, 2-60 caracteres']);
    exit();
}

if (strlen($correo) > 254 || !preg_match('/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,63}$/', $correo)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation', 'message' => 'Email inválido: dominio no válido o excede 254 caracteres']);
    exit();
}

if (!preg_match('/^\d{4,16}$/', $telefono)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation', 'message' => 'Teléfono inválido: solo dígitos, 4-16 caracteres']);
    exit();
}



// Determinar asunto y mensaje consolidado
$asuntoKey = ($tipo === 'empleo') ? 'equipo' : 'productos_servicios';

if ($tipo === 'empleo') {
    $partes = [];
    if ($puesto !== '') $partes[] = "Puesto/Área de interés: {$puesto}";
    if ($linkedin !== '') $partes[] = "LinkedIn: {$linkedin}";
    if ($telefono !== '') $partes[] = "Teléfono: {$telefono}";
    if ($mensajeEmpleo !== '') $partes[] = "Mensaje: {$mensajeEmpleo}";
    $mensaje = implode("\n", $partes);
    $adjunto = isset($_FILES['cv']) ? $_FILES['cv'] : null;
} else {
    $partes = [];
    if ($telefono !== '') $partes[] = "Teléfono: {$telefono}";
    if ($mensajeServicio !== '') $partes[] = "Mensaje: {$mensajeServicio}";
    $mensaje = implode("\n", $partes);
    $adjunto = null; // No adjunto en servicio
}

// Cargar servicio de correo desde la raíz del proyecto (Opción B)
$rootMailer = __DIR__ . '/MailerService.php';
if (file_exists($rootMailer)) {
    require_once $rootMailer;
    require_once __DIR__ . '/UploadValidator.php';
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mailer_not_found_root']);
    exit();
}

try {
    $mailer = new MailerService();
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'init_mailer', 'message' => $e->getMessage()]);
    exit();
}

// Validación de archivo (empleo) similar al controlador original
if ($adjunto && isset($adjunto['error'])) {
    $validator = new UploadValidator(10 * 1024 * 1024, [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);
    $res = $validator->validate($adjunto);
    if (!$res['ok']) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => $res['error']]);
        exit();
    }
}

$sent = $mailer->sendContactEmail($nombre, $correo, $asuntoKey, $mensaje, $adjunto);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}
exit();


