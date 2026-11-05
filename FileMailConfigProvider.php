<?php
require_once __DIR__ . '/MailConfigProviderInterface.php';

/**
 * Implementación basada en archivo mail.php
 */
class FileMailConfigProvider implements MailConfigProviderInterface {
    /** @var array */
    private $configs;

    public function __construct($configPath = null) {
        $path = $configPath ?: (__DIR__ . '/mail.php');
        $this->configs = require $path;
    }

    public function getByKey($key) {
        return $this->configs[$key] ?? null;
    }

    public function getDefault() {
        return $this->configs['default'];
    }
}


