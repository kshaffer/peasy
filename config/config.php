<?php
return array(
    'jwt' => array(
        'key'       => 'OS62n3pW8XQp5iTja1YjEj38hbv4OZ+zkn4ZE+hmQyOu28gcdHgMaNBZTs5LXVaXoc01V+k5XZZcSogzTF4hgw==',     // Key for signing the JWT's, I suggest generate it with base64_encode(openssl_random_pseudo_bytes(64))
        'algorithm' => 'HS512' // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        ),
    'database' => array(
        'user'     => '', // Database username
        'password' => '', // Database password
        'host'     => '', // Database host
        'name'     => '', // Database schema name
    ),
    'serverName' => 'peasy.pushpullfork.com',
);
