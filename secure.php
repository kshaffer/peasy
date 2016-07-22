<?php

  $credentials = json_decode($_POST['data']);
  if(isset($credentials->action) && $credentials->action == "authenticate") {
    $df = fopen('user_db/db.json', 'r');
    $datafile = fread($df, filesize('user_db/db.json'));
    $auth = json_decode($datafile);
    $credentialsAreValid = array("logged_in" => False);
    if($auth->username == $credentials->username && $auth->password == $credentials->password) {
      $credentialsAreValid["logged_in"] = True;
    }
  }

  //echo json_encode($credentialsAreValid);

  require_once('vendor/autoload.php');
  use Zend\Config\Factory;
  use Zend\Http\PhpEnvironment\Request;
  use Firebase\JWT\JWT;

  /*
   * Application setup, database connection, data sanitization and user
   * validation routines are here.
   */
  $config = Factory::fromFile('config/config.php', true); // Create a Zend Config Object

  if ($credentialsAreValid["logged_in"]) {

      $tokenId    = base64_encode(mcrypt_create_iv(32));
      $issuedAt   = time();
      $notBefore  = $issuedAt - 1;             //Adding 5 seconds
      $expire     = $notBefore + 3600;            // Adding 20 minutes
      $serverName = $config->serverName; // Retrieve the server name from config file

      /*
       * Create the token as an array
       */
      $data = [
          'iat'  => $issuedAt,         // Issued at: time when the token was generated
          'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
          'iss'  => $serverName,       // Issuer
          'nbf'  => $notBefore,        // Not before
          'exp'  => $expire,           // Expire
          'data' => [                  // Data related to the signer user
              'userId'   => $auth->username, // userid from the users table
              'userName' => $credentials->username, // User name
          ]
      ];

      /*
     * Extract the key, which is coming from the config file.
     *
     * Best suggestion is the key to be a binary string and
     * store it in encoded in a config file.
     *
     * Can be generated with base64_encode(openssl_random_pseudo_bytes(64));
     *
     * keep it secure! You'll need the exact key to verify the
     * token later.
     */
    $secretKey = base64_decode($config->get('jwt')->get('key'));

    /*
     * Encode the array to a JWT string.
     * Second parameter is the key to encode the token.
     *
     * The output string can be validated at http://jwt.io/
     */
    $jwt = JWT::encode(
        $data,      //Data to be encoded in the JWT
        $secretKey, // The signing key
        'HS512'     // Algorithm used to sign the token, see https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40#section-3
        );

    $unencodedArray = ['jwt' => $jwt];
    echo json_encode($unencodedArray);

  }
?>
