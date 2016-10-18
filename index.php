<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title id="site-title"></title>

    <!-- Bootstrap CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-theme.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Merriweather:300,700,700italic,300italic|Open+Sans:700,400" />

    <!-- Font Awesome for awesome icons. You can redefine icons used in a plugin configuration -->
    <link href="https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

    <!-- Medium Editor (https://yabwe.github.io/medium-editor/) -->
    <link rel="stylesheet" href="css/medium-editor.css">
    <link rel="stylesheet" href="css/themes/default.css">

    <!-- Medium Editor Insert Plugin -->
    <link rel="stylesheet" href="/css/medium-editor-insert-plugin.css">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body onload="getHeaderAndFooter(); getNavbar();">
  <?php

  function current_url () {
    $protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https') === FALSE ? 'http' : 'https';
    $host     = $_SERVER['HTTP_HOST'];
    $script   = $_SERVER['SCRIPT_NAME'];
    $params   = $_SERVER['QUERY_STRING'];
    $currentUrl = $protocol . '://' . $host . $script;
    return $currentUrl;
  }

  $unparsed = file_get_contents('site_content.json');
  $site_content = json_decode($unparsed, true);

  if ($site_content['meta']['is_setup'] === true) {
    $current_url = current_url();
    $parsed_url = parse_url($current_url);
    $current_page = str_replace('/', '', $_SERVER['REQUEST_URI']);
    if ($current_page === '' || $current_page === 'index.php' || $current_page === 'index.html' || $current_page === 'index' || $current_page === 'home') {
      $current_page = 'Home';
      }

    $navbar = ''; // for later

    $header_content = $site_content['pages'][$current_page]['title'];
    $main_content = $site_content['pages'][$current_page]['content'];
    $footer_content = $site_content['meta']['footer_copyright'] . $site_content['meta']['copyright_year'] . ' ' . $site_content['meta']['author'] . '. ' . $site_content['meta']['footer_license'] . '<br/>' . $site_content['meta']['footer_attribution'];

    $page_content = '<div id="navbar">';
    $page_content .= $navbar;
    $page_content .= '</div>';

    $banner_file = './files/banner.jpg';
    if (file_exists($banner_file)) {
      $page_content .= '<div id="banner-image"><img src="/files/banner.jpg" alt="Contribute: hand adding freshly chewed piece of gum to a wall containing many differently colored pieces of chewed gum." style="width: 100%; padding: 0px; margin: 0px; border: 0px;" /></div>';
    };

  } else {
    $main_content = file_get_contents('includes/setup_form.html');
    $header_content = 'Peasy site setup';
    $footer_content = '';
    }

  $page_content .= '<div class="container"><div class="col-md-2"></div><div class="col-md-8">';

  $page_content .= '<h1 id="page-heading">';
  $page_content .= $header_content;
  $page_content .= '</h1>';

  $page_content .= '<div id="page-content">';
  $page_content .= $main_content;
  $page_content .= '</div>';

  $page_content .= '</div><div class="col-md-2"></div></div><div class="container"><div class="col-md-2"></div><div class="col-md-8"><hr/>';

  $page_content .= '<div id="page-footer">';
  $page_content .= $footer_content;
  $page_content .= '</div>';

  $page_content .= '</div><div class="col-md-2"></div></div>';

  echo $page_content;
  ?>

    <!-- Blog content -->
    <script type="text/javascript" src="app.js"></script>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="js/jquery.min.js"><\/script>')</script>
    <script src="js/bootstrap.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="js/ie10-viewport-bug-workaround.js"></script>

    <!-- Medium Editor Plugin -->
    <script src="js/medium-editor.js"></script>

    <!-- Medium Editor Insert Plugin and Dependencies -->
    <script src="js/handlebars.runtime-v4.0.5.js"></script>
    <script src="js/jquery.ui.widget.js"></script>
    <script src="js/jquery.iframe-transport.js"></script>
    <script src="js/jquery.fileupload.js"></script>
    <script src="js/jquery-sortable.js"></script>
    <script src="js/medium-editor-insert-plugin.js"></script>

  </body>
</html>
