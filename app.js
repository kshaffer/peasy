var current_page = 'Home';

function getHeaderAndFooter() {
  // load site data from meta.json and populate banner
  $.getJSON('site_content.json', function (data) {
    var site = data.meta;
    document.getElementById('site-title').innerHTML = site.title;
    document.getElementById('page-footer').innerHTML = (site.footer_copyright + site.copyright_year + ' ' + site.author + '. ' + site.footer_license);
  });
};

function getNavbar() {
  $.get('includes/navbar_all.html', function (data) {
    var navbarContent = data;
    $.getJSON('site_content.json', function (data) {
      var site = data.meta;
      var pages = data.pages;
      var navbarLinks = '';
      for (page_short_title in pages) {
        navbarLinks += "<li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getPageContent('" + page_short_title + "')\">" + page_short_title + "</a></li>\n";
        console.log(page_short_title);
      };
      if (sessionStorage.token) {
        navbarLinks += "<li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getEditForm()\">Edit This Page</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getNewPageForm()\">New Page</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getImportForm()\">Import</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"logout()\">Logout</a></li>";
      } else {
        navbarLinks += "<li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getLoginForm()\">Login</a></li><li class=\"active\"><a id=\"contact-email\" href=\"http://kris.shaffermusic.com/contact/\">Contact</a></li><li class=\"active\">";
      };
      document.getElementById('navbar').innerHTML = navbarContent;
      document.getElementById('navbar-links').innerHTML = navbarLinks;
      document.getElementById('contact-email').href = 'mailto:' + site.contact_email;
    });
  });
};

// load syllabus data from site_content.json and populate page
function getPageContent(pageName) {
  $.getJSON('site_content.json', function (data) {
    if (data.meta.is_setup === true) {
      getNavbar();
      var sitePages = data.pages;
      if (pageName in sitePages) {
        var siteContent = data.pages[pageName];
        current_page = pageName;
      } else {
        var siteContent = data.pages.Home;
        current_page = 'Home';
      }
      document.getElementById('page-heading').innerHTML = siteContent.title;
      document.getElementById('page-subheading').innerHTML = siteContent.author;
      document.getElementById('page-content').innerHTML = siteContent.content;
      document.getElementById('content-edit-label').innerHTML = '';
    }
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
        var siteContent = data.pages[current_page];
        document.getElementById('editContentTitle').innerHTML = siteContent.title;
        document.getElementById('editContentAuthor').innerHTML = siteContent.author;
        document.getElementById('editPageContent').innerHTML = siteContent.content;
        editor = new MediumEditor('.editable');
        $(function () {
          $('.editable').mediumInsert({
            editor: editor
          });
        });
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
    var short_title = current_page;
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
      success: setTimeout(function() { getPageContent(current_page) }, 200),
      dataType: 'application/json'
    });
  });
  event.preventDefault();
};

function getNewPageForm() {
  $.ajax({
    headers: { 'Authorization': ('Bearer ' + sessionStorage.token)},
    type: 'GET',
    url: 'new_page_content.php',
    success: function (data) {
      var editFormContent = data;
      document.getElementById('page-heading').innerHTML = '';
      document.getElementById('page-subheading').innerHTML = '';
      document.getElementById('page-content').innerHTML = editFormContent.form_content;
      document.getElementById('content-edit-label').innerHTML = '';
    }
  });
};

// collect document information from edit form`and write to database
function createNewPage() {
  $.getJSON('site_content.json', function (data) {
    var site_content = data;
    var title = document.newPageForm.pagetitle.value;
    var author = document.newPageForm.pageauthor.value;
    var short_title = document.newPageForm.shortlink.value;
    var post_object = {
      "timestamp": "",
      "feature_image": "",
      "image_credit_url": "",
      "image_credit_photographer": "",
      "author": author,
      "title": title,
      "content": ''
    };
    site_content.pages[short_title] = post_object;

    var post_object_string = JSON.stringify(site_content);

    // write form content to file
    $.ajax({
      type: 'POST',
      url: './save_file.php',
      data: { data: post_object_string },
      success: getPageContent(current_page),
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
      if (imported_data.meta.platform === "rooibos") {
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
      } else {
        alert('The platform on ' + siteImportURL + ' is not supported.');
      };
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
    getPageContent('Home');
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
  getNavbar();
  getPageContent('Home');
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
      document.getElementById('page-heading').innerHTML = 'Rooibos Site Setup';
      document.getElementById('page-subheading').innerHTML = '';
      document.getElementById('page-content').innerHTML = setupFormContent;
      document.getElementById('metaclone').innerHTML = 'https://rooibos.pushpullfork.com';
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
    "platform": "rooibos",
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
    var site_import_pages = imported_data.pages;
    var site_import_posts = imported_data.posts;
    var post_object = {
      "meta": site_meta_object,
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
    success: getPageContent('Home')
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
