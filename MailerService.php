<?php
/**
 * @file
 * Defines the MailerService class for handling email sending.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Required PHPMailer class files.
require_once __DIR__ . '/Exception.php';
require_once __DIR__ . '/PHPMailer.php';
require_once __DIR__ . '/SMTP.php';

/**
 * MailerService class.
 *
 * This service class abstracts the email sending functionality using PHPMailer.
 * It loads SMTP configurations from an external file and dynamically
 * configures the mailer based on the email's context (asunto).
 */
class MailerService {
    
    /**
     * The PHPMailer instance.
     * @var PHPMailer
     */
    private $mail;

    /**
     * Stores all mail configurations loaded from the mail.php config file.
     * @var array
     */
    private $configProvider; // MailConfigProviderInterface

    /**
     * MailerService constructor.
     */
    public function __construct($configProvider = null, $mailer = null) {
        $this->mail = $mailer ?: new PHPMailer(true);
        if ($configProvider) {
            $this->configProvider = $configProvider;
        } else {
            require_once __DIR__ . '/FileMailConfigProvider.php';
            $this->configProvider = new FileMailConfigProvider(__DIR__ . '/mail.php');
        }
    }

    /**
     * Configures the PHPMailer instance based on a specific 'motivo' (reason).
     *
     * @param string $motivo The reason key (e.g., 'administracion', 'formacion') to select the configuration.
     * @throws Exception If no configuration is found for the given motivo and no default exists.
     */
    private function configure($motivo) {
        // ... (Code remains the same)
        $currentConfig = $this->configProvider->getByKey($motivo) ?? $this->configProvider->getDefault();

        if (empty($currentConfig)) {
            throw new Exception("Mail configuration not found for reason: " . htmlspecialchars($motivo));
        }

        $this->mail->isSMTP();
        $this->mail->Host       = $currentConfig['host'];
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = $currentConfig['username'];
        $this->mail->Password   = $currentConfig['password'];
        $this->mail->SMTPSecure = $currentConfig['encryption'];
        $this->mail->Port       = $currentConfig['port'];
        $this->mail->CharSet    = 'UTF-8';

        $this->mail->setFrom($currentConfig['from_address'], $currentConfig['from_name']);
        $this->mail->addAddress($currentConfig['to_address'], $currentConfig['to_name']);
    }

    /**
     * Sends the contact email.
     *
     * @param string $nombre The sender's name.
     * @param string $email The sender's email address.
     * @param string $asunto The email's subject key.
     * @param string $mensaje The message content.
     * @param array|null $adjunto The uploaded file details from $_FILES, or null.
     * @return bool Returns true on success, false on failure.
     */
    public function sendContactEmail($nombre, $email, $asunto, $mensaje, $adjunto) {
        // ... (Code remains the same)
        try {
            $this->configure($asunto);

            $this->mail->addReplyTo($email, $nombre);

            if ($adjunto && $adjunto['error'] == UPLOAD_ERR_OK) {
                $this->mail->addAttachment($adjunto['tmp_name'], $adjunto['name']);
            }

            $this->mail->isHTML(true);
            $this->mail->Subject = 'Nuevo Contacto Web: ' . htmlspecialchars($this->getSubjectByAsunto($asunto));
            $this->mail->Body    = $this->createEmailBody($asunto, $nombre, $email, $mensaje);
            $this->mail->AltBody = "Motivo: " . htmlspecialchars($asunto) . "\nNombre: " . htmlspecialchars($nombre) . "\nEmail: " . htmlspecialchars($email) . "\nMensaje: " . htmlspecialchars($mensaje);

            $this->mail->send();
            return true;

        } catch (Exception $e) {
            $errorLog = date('Y-m-d H:i:s') . " - Mailer Error: " . $e->getMessage() . " | PHPMailer Error: " . $this->mail->ErrorInfo . "\n";
            file_put_contents(__DIR__ . '/mailer_errors.log', $errorLog, FILE_APPEND);
            return false;
        }
    }

    /**
     * Creates the HTML body for the email.
     *
     * @param string $asunto The email's subject key.
     * @param string $nombre The sender's name.
     * @param string $email The sender's email address.
     * @param string $mensaje The message content.
     * @return string The generated HTML email body.
     */
    private function createEmailBody($asunto, $nombre, $email, $mensaje) {
        // ... (Code remains the same)
        $asuntoTexto = htmlspecialchars($this->getSubjectByAsunto($asunto));
        $nombre = htmlspecialchars($nombre);
        $email = htmlspecialchars($email);
        $mensaje = nl2br(htmlspecialchars($mensaje));
        
        return "<html><body>
                    <h2>Nuevo Mensaje desde la Página Web</h2>
                    <p><strong>Motivo:</strong> {$asuntoTexto}</p>
                    <p><strong>Nombre:</strong> {$nombre}</p>
                    <p><strong>Email:</strong> {$email}</p>
                    <p><strong>Mensaje:</strong></p>
                    <p>{$mensaje}</p>
                </body></html>";
    }

    /**
     * Maps an internal subject key to a user-friendly subject string.
     *
     * @param string $asuntoKey The internal key (e.g., 'administracion').
     * @return string The display-friendly subject text.
     */
    private function getSubjectByAsunto($asuntoKey) {
        $subjects = [
            'administracion' => 'Contacto con Administración',
            'formacion' => 'Contacto por Formación',
            'equipo' => 'Interesado en ser parte del equipo',
            'productos_servicios' => 'Interés en Productos y Servicios'
        ];
        return $subjects[$asuntoKey] ?? 'Contacto General';
    }
}