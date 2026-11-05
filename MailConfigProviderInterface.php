<?php
/**
 * Proveedor de configuraciones de correo (DIP/SRP)
 */
interface MailConfigProviderInterface {
    /**
     * Devuelve la configuración para una clave de motivo dada o null si no existe.
     * @param string $key
     * @return array|null
     */
    public function getByKey($key);

    /**
     * Devuelve la configuración por defecto.
     * @return array
     */
    public function getDefault();
}


