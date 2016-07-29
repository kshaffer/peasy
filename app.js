var current_page = 'Home';

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function getHeaderAndFooter() {
  // load site data from meta.json and populate banner
  $.getJSON('site_content.json', function (data) {
    var site = data.meta;
    document.getElementById('site-title').innerHTML = site.title;
    document.getElementById('page-footer').innerHTML = (site.footer_copyright + site.copyright_year + ' ' + site.author + '. ' + site.footer_license + '<br/>' + site.footer_attribution);
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
        navbarLinks += "<li class=\"active\"><a href=\"" + page_short_title + "\">" + page_short_title + "</a></li>\n";
      };
      if (sessionStorage.token) {
        navbarLinks += "<li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getEditForm()\">Edit This Page</a></li><li class=\"active\"><a href=\"new\">New Page</a></li><li class=\"active\"><a href=\"import\">Import</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"logout()\">Logout</a></li>";
      } else {
        navbarLinks += "<li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getLoginForm()\">Login</a></li><li class=\"active\"><a id=\"contact-email\" href=\"http://kris.shaffermusic.com/contact/\">Contact</a></li><li class=\"active\">";
      };
      document.getElementById('navbar').innerHTML = navbarContent;
      document.getElementById('navbar-links').innerHTML = navbarLinks;
      if (!sessionStorage.token) {
        document.getElementById('contact-email').href = 'mailto:' + site.contact_email;
      }
    });
  });
};

function getPageContentFromURL() {
  $.getJSON('site_content.json', function (data) {
    if (data.meta.is_setup === true) {
      getNavbar();
      var sitePages = data.pages;
      if (window.location.pathname.replace('/', '') in sitePages) {
        var pageName = window.location.pathname.replace('/', '');
        var siteContent = data.pages[pageName];
        current_page = pageName;
      } else if (window.location.pathname.replace('/', '').toTitleCase() in sitePages) {
        var pageName = window.location.pathname.replace('/', '').toTitleCase();
        var siteContent = data.pages[pageName];
        current_page = pageName;
      } else if (window.location.pathname.replace('/', '') === 'new') {
        getNewPageForm();
      } else if (window.location.pathname.replace('/', '') === 'import') {
        getImportForm();
      } else {
        var siteContent = data.pages.Home;
        current_page = 'Home';
      }
      if (pageName === 'Home') {
        document.getElementById('page-heading').innerHTML = data.meta.title;
      } else {
        document.getElementById('page-heading').innerHTML = siteContent.title;
      }
      //document.getElementById('page-subheading').innerHTML = siteContent.author;
      document.getElementById('page-content').innerHTML = siteContent.content;
    } else {
      getSetupForm();
    }
  });
};

// load syllabus data from site_content.json and populate page
function getPageContent(pageName) {
  var siteRoot = window.location.hostname;
  window.location.assign('https://' + siteRoot + '/' + pageName);
  /*
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
      if (pageName === 'Home') {
        document.getElementById('page-heading').innerHTML = data.meta.title;
      } else {
        document.getElementById('page-heading').innerHTML = siteContent.title;
      }
      //document.getElementById('page-subheading').innerHTML = siteContent.author;
      document.getElementById('page-content').innerHTML = siteContent.content;
    } else {
      getSetupForm();
    }
  });
  */
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
      //document.getElementById('page-subheading').innerHTML = '';
      document.getElementById('page-content').innerHTML = editFormContent.form_content;

      // load page data from site_content.json and populate form
      $.getJSON('site_content.json', function (data) {
        var siteContent = data.pages[current_page];
        console.log(data.pages[current_page]);
        console.log(data.pages[current_page].title);
        console.log(data.pages[current_page].author);
        document.getElementById('editPageContent').innerHTML = data.pages[current_page].content;
        document.getElementById('editContentTitle').value = data.pages[current_page].title;

        editor = new MediumEditor('.editable', {
          placholder: false
        });

        $(function () {
            $('.editable').mediumInsert({
                editor: editor,
                addons: {
                    images: {
                        uploadScript: null,
                        deleteScript: null,
                        captionPlaceholder: 'Type caption for image',
                        fileUploadOptions: {
                            url: 'upload.php',
                            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
                        },
                        styles: { // (object) Available image styles configuration
                            wide: { // (object) Image style configuration. Key is used as a class name added to an image, when the style is selected (.medium-insert-images-wide)
                            label: '<span class="fa fa-align-justify"></span>', // (string) A label for a style
                            added: function ($el) {}, // (function) Callback function called after the style was selected. A parameter $el is a current active paragraph (.medium-insert-active)
                            removed: function ($el) {} // (function) Callback function called after a different style was selected and this one was removed. A parameter $el is a current active paragraph (.medium-insert-active)
                            },
                            left: {
                                label: '<span class="fa fa-align-left"></span>'
                            },
                            right: {
                                label: '<span class="fa fa-align-right"></span>'
                            },
                            grid: {
                                label: '<span class="fa fa-th"></span>'
                            }
                        },
                        actions: null,
                        messages: {
                            acceptFileTypesError: 'This file is not in a supported format: ',
                            maxFileSizeError: 'This file is too big: '
                        }

                    },
                    embeds: { // (object) Embeds addon configuration
                        label: '<span class="fa fa-youtube-play"></span>', // (string) A label for an embeds addon
                        placeholder: 'Paste a YouTube, Vimeo, Facebook, Twitter or Instagram link and press Enter', // (string) Placeholder displayed when entering URL to embed
                        captions: true, // (boolean) Enable captions
                        captionPlaceholder: 'Type caption (optional)', // (string) Caption placeholder
                        oembedProxy: null, // (string/null) URL to oEmbed proxy endpoint, such as Iframely, Embedly or your own. You are welcome to use "http://medium.iframe.ly/api/oembed?iframe=1" for your dev and testing needs, courtesy of Iframely. *Null* will make the plugin use pre-defined set of embed rules without making server calls.
                        styles: { // (object) Available embeds styles configuration
                            wide: { // (object) Embed style configuration. Key is used as a class name added to an embed, when the style is selected (.medium-insert-embeds-wide)
                                label: '<span class="fa fa-align-justify"></span>', // (string) A label for a style
                                added: function ($el) {}, // (function) Callback function called after the style was selected. A parameter $el is a current active paragraph (.medium-insert-active)
                                removed: function ($el) {} // (function) Callback function called after a different style was selected and this one was removed. A parameter $el is a current active paragraph (.medium-insert-active)
                            },
                            left: {
                                label: '<span class="fa fa-align-left"></span>'
                            },
                            right: {
                                label: '<span class="fa fa-align-right"></span>'
                            }
                        },
                        actions: { // (object) Actions for an optional second toolbar
                            remove: { // (object) Remove action configuration
                                label: '<span class="fa fa-times"></span>', // (string) Label for an action
                                clicked: function ($el) { // (function) Callback function called when an action is selected
                                    var $event = $.Event('keydown');

                                    $event.which = 8;
                                    $(document).trigger($event);
                                }
                            }
                        }
                    }
                }
            });
        });

        editor.addElements(document.getElementsByClassName('editable'));
        editor.subscribe('editableInput', function (event, editable) {
          bodyContentInput = editable.innerHTML;
        });
      });
    }
  });
  event.preventDefault();
};

// collect document information from edit form`and write to database
function collectContent() {
  $.getJSON('site_content.json', function (data) {
    var site_content = data;
    console.log(site_content.pages[current_page].author);
    console.log(site_content.pages[current_page].title);
    var allContent = editor.serialize();
    var title = document.inputNewTitle.title.value;
    var content = allContent.editPageContent.value;
    var short_title = current_page;
    var post_object = {
      "timestamp": "",
      "feature_image": "",
      "image_credit_url": "",
      "image_credit_photographer": "",
      "author": "",
      "content": content,
      "title": title
    };
    site_content.pages[short_title] = post_object;

    var post_object_string = JSON.stringify(site_content);

    // write form content to file
    $.ajax({
      type: 'POST',
      url: './save_file.php',
      data: { data: post_object_string },
      success: setTimeout(function() { getPageContent(current_page) }, 300),
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
      //document.getElementById('page-subheading').innerHTML = '';
      document.getElementById('page-content').innerHTML = editFormContent.form_content;
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
    current_page = short_title;
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
      success: setTimeout(function() { getEditForm() }, 200),
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
    var siteImportURL_root = document.importurl.siteImportURL.value;

    // load remote data to import
    $.get(siteImportURL, function (data) {
      var imported_data = JSON.parse(data);
      if (imported_data.meta.platform === "rooibos") {
        var site_import_pages = imported_data.pages;
        var site_import_posts = imported_data.posts;
        site_meta_data.footer_attribution = "<p>This site was originally cloned from " + "<a href=\"" + siteImportURL_root + "\">" + siteImportURL_root + "</a>.</p>";
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
      //document.getElementById('page-subheading').innerHTML = '';
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
  var siteImportURL_root = document.setupform.metaclone.value;
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

  // write new login data to user_db.json
  $.ajax({
    type: 'POST',
    url: './save_login.php',
    data: { data: login_object_string },
    dataType: 'application/json',
    success: importFromURL(siteImportURL, siteImportURL_root, title, author, email)
  });
  event.preventDefault();
};

// fetch data for initial site import, then go to edit page
function importFromURL(siteImportURL, siteImportURL_root, title, author, email) {
  var site_meta_object = {
    "is_setup": true,
    "title": title,
    "author": author,
    "contact_email": email,
    "copyright_year": "2016",
    "url": window.location.href,
    "platform": "rooibos",
    "version": "alpha",
    "footer_copyright": "<p><a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\"><img alt=\"Creative Commons License\" style=\"border-width:0; float: right\" src=\"https://i.creativecommons.org/l/by-sa/4.0/88x31.png\" /></a>Copyright &copy;",
    "footer_license": "This work is licensed under a <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">Creative Commons Attribution-ShareAlike 4.0 International License</a>.</p>",
    "footer_attribution": "<p>This site was originally cloned from " + "<a href=\"" + siteImportURL_root + "\">" + siteImportURL_root + "</a>.</p>",
    "index_feature_image": "",
    "index_feature_image_credit": ""
  };

  // load remote data to import
  $.get(siteImportURL, function (data) {
    var imported_data = JSON.parse(data);
    if (imported_data.meta.platform === "rooibos") {
      var site_import_pages = imported_data.pages;
      var site_import_posts = imported_data.posts;
      console.log(imported_data.pages);
      console.log(imported_data.posts);
      var post_object = {
        "meta": site_meta_object,
        "pages": site_import_pages,
        "posts": site_import_posts
      }
      var post_object_string = JSON.stringify(post_object);

      // write form content to file
      $.ajax({
      type: 'POST',
      url: './save_file.php',
      data: { data: post_object_string },
      dataType: 'application/json',
      success: setTimeout(function() { getPageContent('Home') }, 400)
      });
    } else {
      alert('The platform on ' + siteImportURL + ' is not supported.');
    };
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
