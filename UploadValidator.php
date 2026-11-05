<?php
/**
 * Valida archivos subidos (SRP)
 */
class UploadValidator {
    /** @var int */
    private $maxBytes;
    /** @var array */
    private $allowedMimeTypes;

    public function __construct($maxBytes, array $allowedMimeTypes) {
        $this->maxBytes = $maxBytes;
        $this->allowedMimeTypes = $allowedMimeTypes;
    }

    public function validate($file) {
        if (!$file || !isset($file['error'])) return ['ok' => true];
        if ($file['error'] === UPLOAD_ERR_NO_FILE) return ['ok' => true];
        if ($file['error'] !== UPLOAD_ERR_OK) return ['ok' => false, 'error' => 'upload_error'];
        if ($file['size'] > $this->maxBytes) return ['ok' => false, 'error' => 'file_too_large'];

        $mime = $this->detectMime($file['tmp_name']);
        if ($mime && !in_array($mime, $this->allowedMimeTypes)) {
            return ['ok' => false, 'error' => 'file_type_not_allowed'];
        }
        return ['ok' => true];
    }

    private function detectMime($path) {
        if (function_exists('mime_content_type')) {
            return @mime_content_type($path) ?: null;
        }
        return null; // Fallback simple; se podría extender por extensión
    }
}


