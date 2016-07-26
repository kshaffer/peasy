function getHeaderAndFooter() {
  // load site data from meta.json and populate banner
  $.getJSON('site_content.json', function (data) {
    var site = data.meta;
    document.getElementById('site-title').innerHTML = site.title;
    document.getElementById('page-footer').innerHTML = (site.footer_copyright + site.copyright_year + ' ' + site.author + '. ' + site.footer_license);
  });
};

function getLoggedOutNavbar() {
  $.get('includes/navbar_loggedout.html', function (data) {
    var navbarContent = data;
    document.getElementById('navbar').innerHTML = navbarContent;
  });
};

function getLoggedInNavbar() {
  $.get('includes/navbar_loggedin.html', function (data) {
    var navbarContent = data;
    document.getElementById('navbar').innerHTML = navbarContent;
  });
};

function getIndexContent() {
  $.getJSON('site_content.json', function (data) {
    if (data.meta.is_setup === true) {

      // load syllabus data from site_content.json and populate page
      $.getJSON('site_content.json', function (data) {
        var siteContent = data.pages.Home;
        if (sessionStorage.token) {
          getLoggedInNavbar();
        } else {
          getLoggedOutNavbar();
        };
        document.getElementById('page-heading').innerHTML = siteContent.title;
        document.getElementById('page-subheading').innerHTML = siteContent.author;
        document.getElementById('page-content').innerHTML = siteContent.content;
        document.getElementById('content-edit-label').innerHTML = '';
      });
    } else {
      getSetupForm();
    };
  });
};

// opens edit page, loads data from database for editing
function getEditForm() {
  $.ajax({
    headers: { 'Authorization': ('Bearer ' + sessionStorage.token)},
    type: 'GET',
    url: 'edit_content.php',
    success: function (data) {
      var editFormContent = data;
      document.getElementById('page-heading').innerHTML = '';
      document.getElementById('page-subheading').innerHTML = '';
      document.getElementById('page-content').innerHTML = editFormContent.form_content;
      document.getElementById('content-edit-label').innerHTML = 'click to edit:';
      document.getElementById('content-edit-label').style = 'text-align: right; color: #7B7D7D;';

      // load page data from site_content.json and populate form
      $.getJSON('site_content.json', function (data) {
        var siteContent = data.pages.Home;
        document.getElementById('editContentTitle').innerHTML = siteContent.title;
        document.getElementById('editContentAuthor').innerHTML = siteContent.author;
        document.getElementById('editPageContent').innerHTML = siteContent.content;
        editor = new MediumEditor('.editable');
        editor.subscribe('editableInput', function (event, editable) {
          bodyContentInput = editable.innerHTML;
        });
        editor.addElements(document.getElementsByClassName('editable'));
      });
    }
  });
};

// collect document information from edit form`and write to database
function collectContent() {
  $.getJSON('site_content.json', function (data) {
    var site_content = data;
    var allContent = editor.serialize();
    var title = allContent.editContentTitle.value;
    var author = allContent.editContentAuthor.value;
    var short_title = "Home";
    var content = bodyContentInput;
    var post_object = {
      "timestamp": "",
      "feature_image": "",
      "image_credit_url": "",
      "image_credit_photographer": "",
      "author": author,
      "title": title,
      "content": content
    };
    site_content.pages[short_title] = post_object;

    var post_object_string = JSON.stringify(site_content);

    // write form content to file
    $.ajax({
      type: 'POST',
      url: './save_file.php',
      data: { data: post_object_string },
      success: getIndexContent(),
      dataType: 'application/json'
    });
  });
  event.preventDefault();
};

function getImportForm() {
  // get navbar from navbar.html and load into html
  $.ajax({
    headers: { 'Authorization': ('Bearer ' + sessionStorage.token)},
    type: 'GET',
    url: 'import_content.php',
    success: function (data) {
      var importFormContent = data;
      document.getElementById('page-content').innerHTML = importFormContent.form_content;
    }
  });
};

// get URL of site to clone from user,
// fetch data, then go to edit page
function editFromURL() {
  // load local metadata
  $.getJSON('site_content.json', function (data) {
    var site_content = data;
    var site_meta_data = site_content.meta;
    var siteImportURL = (document.importurl.siteImportURL.value + '/api.php');

    // load remote data to import
    $.get(siteImportURL, function (data) {
      var imported_data = JSON.parse(data);
      var site_import_pages = imported_data.pages;
      var site_import_posts = imported_data.posts;
      var post_object = {
        "meta": site_meta_data,
        "pages": site_import_pages,
        "posts": site_import_posts
      }
      var post_object_string = JSON.stringify(post_object);

      // write form content to file
      $.ajax({
      type: 'POST',
      url: './save_file.php',
      data: { data: post_object_string },
      success: getEditForm(),
      dataType: 'application/json'
      });
    });
  });
  event.preventDefault();
};

function loginToSite() {
  var username = document.loginform.username.value;
  var password = document.loginform.password.value;

  var login_object = {
    "action": "authenticate",
    "username": username,
    "password": password
  }
  var login_object_string = JSON.stringify(login_object);

  // send login info to PHP API

  $.ajax({
  type: 'POST',
  url: './secure.php',
  data: { data: login_object_string },
  dataType: 'json',
  success: function(returnedData) {
    //alert(text);
    sessionStorage.token = returnedData.jwt;
    getEditForm();
    getLoggedInNavbar();
  },
  error: function (jqXHR, textStatus, errorThrown) {
              delete sessionStorage.token;
              alert("Login error. Please check your username and password." /* + "jqXHR: " + jqXHR.status + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown */ );
            }
  });
  event.preventDefault();
};

function logout() {
  delete sessionStorage.token;
  getLoggedOutNavbar();
  getIndexContent();
};

function getLoginForm() {
  $.get('includes/login_form.html', function (data) {
    var importFormContent = data;
    document.getElementById('page-content').innerHTML = importFormContent;
  });
};


// when site is not yet setup, opens setup form,
// loads and edits/adds meta data
function getSetupForm() {
  $.ajax({
    type: 'GET',
    url: 'includes/setup_form.html',
    success: function (data) {
      var setupFormContent = data;
      document.getElementById('page-heading').innerHTML = 'Peasy Site Setup';
      document.getElementById('page-subheading').innerHTML = '';
      document.getElementById('page-content').innerHTML = setupFormContent;
      document.getElementById('metaclone').innerHTML = 'https://peasy.pushpullfork.com';
      secret_key = getNewSecretKey();
    }
  });
};

function getNewSecretKey() {
  $.get('generate_key.php', function (data) {
    secret_key = data.secretkey;
  });
};

function writeInitialSetupData() {
  var siteImportURL = (document.setupform.metaclone.value + '/api.php');
  var title = document.setupform.metatitle.value;
  var author = document.setupform.metaauthor.value;
  var email = document.setupform.metaemail.value;
  var user = document.setupform.metauser.value;
  var pass = document.setupform.metapass.value;
  var login_object = {
    "username": user,
    "password": pass,
    "key": secret_key,
    "algorithm": "HS512",
    "serverName": window.location.href
  }
  var login_object_string = JSON.stringify(login_object);
  var site_meta_object = {
    "is_setup": true,
    "title": title,
    "author": author,
    "contact_email": email,
    "copyright_year": "2016",
    "url": window.location.href,
    "platform": "peasy",
    "version": "alpha",
    "footer_copyright": "<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\"><img alt=\"Creative Commons License\" style=\"border-width:0; float: right\" src=\"https://i.creativecommons.org/l/by-sa/4.0/88x31.png\" /></a>Copyright &copy;",
    "footer_license": "This work is licensed under a <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">Creative Commons Attribution-ShareAlike 4.0 International License</a>.",
    "index_feature_image": "",
    "index_feature_image_credit": ""
  }

  // write new login data to user_db.json
  $.ajax({
    type: 'POST',
    url: './save_login.php',
    data: { data: login_object_string },
    dataType: 'application/json',
    success: console.log('User account created.')
  });

  // load remote data to import
  $.get(siteImportURL, function (data) {
    var imported_data = JSON.parse(data);
    var site_import_content = imported_data.pages;
    var site_import_posts = imported_data.posts;
    var post_object = {
      "meta": site_meta_data,
      "pages": site_import_pages,
      "posts": site_import_posts
    };
    var post_object_string = JSON.stringify(post_object);

    // write form content to file
    $.ajax({
    type: 'POST',
    url: './save_file.php',
    data: { data: post_object_string },
    dataType: 'application/json',
    success: getIndexContent()
    });
  });
  event.preventDefault();
};


// The following code can be used as the skeleton of a blog format, rather than a single page
// this is old code that needs tweaking in light of updates to the js

/*
window.onload = function() {
  var post_list_content = '';

  // post a single page if asked via URL query
  if (urlObject().parameters['p']) {
    var i = urlObject().parameters['p'] - 1;
    post_list_content += '<h1>';
    post_list_content += content.posts[i].title;
    post_list_content += '</h1>\n<h2>by ';
    post_list_content += content.posts[i].author;
    post_list_content += '</h2>\n<br/>';
    post_list_content += content.posts[i].text;
    post_list_content += '\n<br/><hr/><br/>';
  } else {

  // post all pages in reverse index order (need to change to timestamps and reverse chronological order)
    for(i = content.posts.length - 1; i >= 0; i -= 1) {
      post_list_content += '<h1><a href="';
      post_list_content += site.url;
      post_list_content += '?p=';
      post_list_content += (content.posts[i].index);
      post_list_content += '">';
      post_list_content += content.posts[i].title;
      post_list_content += '</a></h1>\n<h2>by ';
      post_list_content += content.posts[i].author;
      post_list_content += '</h2>\n<br/>';
      post_list_content += content.posts[i].text;
      post_list_content += '\n<br/><hr/><br/>';
  }
}

  document.getElementById('list-of-posts').innerHTML = post_list_content;
  document.getElementById('site-title').innerHTML = site.title;
  document.getElementById('banner-title').innerHTML = site.title;
  document.getElementById('site-author').innerHTML = 'by ' + site.author;
};
*/
