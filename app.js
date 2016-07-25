function getHeaderAndFooter() {
  // load site data from meta.json and populate banner
  $.getJSON('meta.json', function (data) {
    var site = data;
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
  $.getJSON('meta.json', function (data) {
    if (data.is_setup === true) {

      // load syllabus data from site_content.json and populate page
      $.getJSON('site_content.json', function (data) {
        var siteContent = data;
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
        var siteContent = data;
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
  })
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
  })
};

// collect document information from edit form`and write to database
function collectContent() {
  var allContent = editor.serialize();
  var title = allContent.editContentTitle.value;
  var author = allContent.editContentAuthor.value;
  var content = bodyContentInput;

  var post_object = {
    "index": "1",
    "timestamp": "",
    "feature_image": "",
    "image_credit_url": "",
    "image_credit_photographer": "",
    "author": author,
    "title": title,
    "content": content
  }
  var post_object_string = JSON.stringify(post_object);

  // write form content to file
  // send data to local (PHP) script which will write to file

  $.ajax({
  type: 'POST',
  url: './save_file.php',
  data: { data: post_object_string },
  success: getIndexContent(),
  dataType: 'application/json'
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
              alert("jqXHR: " + jqXHR.status + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
            }
});

  event.preventDefault();
};

function logout() {
  delete sessionStorage.token;
  getLoggedOutNavbar();
  getIndexContent();
};

// get URL of syllabus to clone from user,
// fetch data, then go to edit page
function editFromURL() {
  var syllabusurl = (document.importurl.syllabusurl.value + '/api.php');

  // load syllabus data from database
  $.get(syllabusurl, function (data) {

      var syllabus = JSON.parse(data);

      var title = syllabus.title;
      var author = syllabus.author;
      var content = syllabus.content;

    var post_object = {
      "index": "1",
      "timestamp": "",
      "feature_image": "",
      "image_credit_url": "",
      "image_credit_photographer": "",
      "author": author,
      "title": title,
      "content": content
    }
    var post_object_string = JSON.stringify(post_object);

    // write form content to file
    // send data to local (PHP) script which will write to file

    $.ajax({
    type: 'POST',
    url: './save_file.php',
    data: { data: post_object_string },
    success: getEditForm(),
    dataType: 'application/json'
    });
  });

  event.preventDefault();
};

function getLoginForm() {
  $.get('includes/login_form.html', function (data) {
    var importFormContent = data;
    document.getElementById('page-content').innerHTML = importFormContent;
  });
};


// when site is not yet setup, opens setup form,
// loads data from meta.json, and edits/adds meta.json data
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
    }
  });
};


function writeInitialSetupData() {
  var siteurl = (document.setupform.metaclone.value + '/api.php');
  var title = document.setupform.metatitle.value;
  var author = document.setupform.metaauthor.value;
  var email = document.setupform.metaemail.value;
  var user = document.setupform.metauser.value;
  var pass = document.setupform.metapass.value;

  // write setup form data to meta.json
  $.get('meta.json', function (data) {
    var post_object = {
      "title": title,
      "author": author,
      "footer_copyright": "<a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\"><img alt=\"Creative Commons License\" style=\"border-width:0; float: right\" src=\"https://i.creativecommons.org/l/by-sa/4.0/88x31.png\" /></a>Copyright &copy;",
      "footer_license": "This work is licensed under a <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">Creative Commons Attribution-ShareAlike 4.0 International License</a>.",
      "copyright_year": "2016",
      "contact_email": email,
      "is_setup": true,
      "index_feature_image": "",
      "index_feature_image_credit": "",
      "url": window.location.href,
      "platform": "peasy",
      "version": "alpha"
    }
    var post_object_string = JSON.stringify(post_object);

    // write site content to file

    $.ajax({
    type: 'POST',
    url: './save_meta.php',
    data: { data: post_object_string },
    success: console.log('Site meta data created.'),
    dataType: 'application/json'
    });
    event.preventDefault();
  });

  // write new login data to user_db.json
  $.get('config/user_db.json', function (data) {
    var login_object = {
      "username": user,
      "password": pass
    }
    var login_object_string = JSON.stringify(login_object);

    // write site content to file

    $.ajax({
    type: 'POST',
    url: './save_login.php',
    data: { data: login_object_string },
    success: console.log('User account created.'),
    dataType: 'application/json'
    });
    event.preventDefault();
  });

  // load site data from site to clone
  $.get(siteurl, function (data) {

      var site_to_clone = JSON.parse(data);

      var title = site_to_clone.title;
      var author = site_to_clone.author;
      var content = site_to_clone.content;

    var post_object = {
      "index": "1",
      "timestamp": "",
      "feature_image": "",
      "image_credit_url": "",
      "image_credit_photographer": "",
      "author": author,
      "title": title,
      "content": content
    }
    var post_object_string = JSON.stringify(post_object);

    // write site content to file

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
