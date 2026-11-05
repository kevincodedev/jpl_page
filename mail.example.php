<?php
/**
 * Mailer Configuration Template.
 *
 * Copia este archivo a mail.php y coloca tus credenciales reales:
 * cp mail.example.php mail.php
 */
return [
    'equipo' => [
        'host'         => 'mail.jpl-asociados.com',
        'port'         => 465,
        'encryption'   => 'ssl',
        'username'     => 'medios@jpl-asociados.com',
        'password'     => 'TU_PASSWORD_AQUI',
        'from_address' => 'medios@jpl-asociados.com',
        'from_name'    => 'JPL Reclutamiento',
        'to_address'   => 'info@jpl-asociados.com',
        'to_name'      => 'Receptor Info/Equipo'
    ],

    'productos_servicios' => [
        'host'         => 'mail.jpl-asociados.com',
        'port'         => 465,
        'encryption'   => 'ssl',
        'username'     => 'medios@jpl-asociados.com',
        'password'     => 'TU_PASSWORD_AQUI',
        'from_address' => 'medios@jpl-asociados.com',
        'from_name'    => 'JPL Productos y Servicios',
        'to_address'   => 'info@jpl-asociados.com',
        'to_name'      => 'Receptor Productos/Servicios'
    ],

    'default' => [
        'host'         => 'mail.jpl-asociados.com',
        'port'         => 465,
        'encryption'   => 'ssl',
        'username'     => 'medios@jpl-asociados.com',
        'password'     => 'TU_PASSWORD_AQUI',
        'from_address' => 'medios@jpl-asociados.com',
        'from_name'    => 'JPL Contacto General',
        'to_address'   => 'info@jpl-asociados.com',
        'to_name'      => 'Receptor General'
    ]
];

