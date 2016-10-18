var current_page = 'home';
var current_cache_index = 1;

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
        page_keys = Object.keys(pages[page_short_title]);
        if (!(page_keys.includes('navbar')) || pages[page_short_title].navbar == true) {
          navbarLinks += "<li class=\"active\"><a href=\"" + page_short_title + "\">" + page_short_title + "</a></li>\n";
        };
      };
      if (site.is_setup === true) {
        if (sessionStorage.token) {
          navbarLinks += "<li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getEditForm()\">Edit This Page</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"deletePage()\">Delete This Page</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getNewPageForm()\">New Page</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getImportForm()\">Import</a></li><li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"logout()\">Logout</a></li>";
        } else {
          navbarLinks += "<li class=\"active\"><a href=\"javascript:void(0);\" onclick=\"getLoginForm()\">Login</a></li><li class=\"active\"><a id=\"contact-email\" href=\"http://kris.shaffermusic.com/contact/\">Contact</a></li><li class=\"active\">";
        };
        document.getElementById('navbar').innerHTML = navbarContent;
        document.getElementById('navbar-links').innerHTML = navbarLinks;
        if (!sessionStorage.token) {
          document.getElementById('contact-email').href = 'mailto:' + site.contact_email;
        }
      }
    });
  });
};

function getCurrentPage() {
  page_path = String(window.location.pathname.replace('/', ''));
  return page_path.toTitleCase();
};


// load syllabus data from site_content.json and populate page
function getPageContent(pageName) {
  var siteRoot = window.location.hostname;
  window.location.assign('https://' + siteRoot + '/' + pageName);
};

// opens edit page, loads data from database for editing
function getEditForm() {
  current_page = getCurrentPage();
  $.ajax({
    headers: { 'Authorization': ('Bearer ' + sessionStorage.token)},
    type: 'GET',
    url: 'edit_content.php',
    success: function (data) {
      var editFormContent = data;
      document.getElementById('page-heading').innerHTML = '';
      //document.getElementById('page-subheading').innerHTML = '';


      // load page data from site_content.json and populate form
      $.getJSON('site_content.json', function (data) {
        var siteContent = data.pages[current_page];
        console.log(data.pages[current_page]);
        if (Object.keys(data.pages[current_page]).includes('navbar') && data.pages[current_page].navbar == false) {
          document.getElementById('page-content').innerHTML = editFormContent.form_content.replace('checked', '');
        } else {
          document.getElementById('page-content').innerHTML = editFormContent.form_content;
        }
        document.getElementById('editPageContent').innerHTML = data.pages[current_page].content;
        document.getElementById('editContentTitle').value = data.pages[current_page].title;

        editor = new MediumEditor('.editable', {
          buttonLabels: 'fontawesome',
          placholder: false,
          paste: {
            forcePlainText: false,
            cleanPastedHTML: true,
            cleanReplacements: [],
            cleanAttrs: ['class', 'style', 'dir'],
            cleanTags: ['meta'],
            unwrapTags: []
          }
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
    var allContent = editor.serialize();
    var title = document.inputNewTitle.title.value;
    var navbar_include = document.inputNewTitle.include_in_navbar.checked;
    console.log(navbar_include);
    var content = allContent.editPageContent.value;
    var short_title = current_page;
    var post_object = {
      "timestamp": "",
      "feature_image": "",
      "image_credit_url": "",
      "image_credit_photographer": "",
      "author": "",
      "content": content,
      "title": title,
      "navbar": navbar_include
    };
    site_content.pages[short_title] = post_object;

    var post_object_string = JSON.stringify(site_content);

    if (navbar_include == false) {
      window.alert('The ' + short_title + ' page will not be included in the navigation bar. Be sure to link to it from another page, or click "Edit this page" and check the box to include in the navigation bar.');
    }

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

function deletePage() {
  current_page = getCurrentPage();
  var yes_i_really_want_to = confirm("Click OK if you want to permanently delete the " + current_page + " page from your site. Otherwise click Cancel.");
  if (yes_i_really_want_to) {
    $.getJSON('site_content.json', function (data) {
      var site_content = data;
      delete site_content.pages[current_page];
      var site_content_string = JSON.stringify(site_content);
      $.ajax({
        type: 'POST',
        url: './save_file.php',
        data: { data: site_content_string },
        success: getPageContent('Home'),
        dataType: 'application/json'
      });
    });
  }
}

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
    var short = document.newPageForm.shortlink.value;
    var short_title = short.toTitleCase();
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
      success: getPageContent(current_page),
      dataType: 'application/json'
    });
  });
  event.preventDefault();
};

function getImportForm() {
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
  var yes_i_really_want_to = confirm("Importing another Peasy site's content will completely delete and replace your current content. Click OK if you really want to do that.");
  if (yes_i_really_want_to) {
  // load local metadata
    $.getJSON('site_content.json', function (data) {
      var site_content = data;
      var site_meta_data = site_content.meta;
      var siteImportURL = (document.importurl.siteImportURL.value + '/api.php');
      var siteImportURL_root = document.importurl.siteImportURL.value;

      // load remote data to import
      $.get(siteImportURL, function (data) {
        var imported_data = JSON.parse(data);
        if (imported_data.meta.platform === "rooibos" || imported_data.meta.platform === "peasy") {
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
          success: getPageContent('Home'),
          dataType: 'application/json'
          });
        } else {
          alert('The platform on ' + siteImportURL + ' is not supported.');
        };
      });
    });
  } else {
    getImportForm();
  }
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
      document.getElementById('page-heading').innerHTML = 'Peasy Site Setup';
      //document.getElementById('page-subheading').innerHTML = '';
      document.getElementById('page-content').innerHTML = setupFormContent;
      document.getElementById('metaclone').innerHTML = 'https://peasy.pushpullfork.com';
    }
  });
};

function writeInitialSetupData() {
  $.get('https://syllabus.pushpullfork.com/generate_key.php', function (data) {
    postSetupData(data.secretkey);
  });
  event.preventDefault();
};

function postSetupData(secret_key) {
  var secret_key = secret_key;
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
    "algorithm": "HS512",
    "serverName": window.location.href,
    "key": secret_key
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
    "platform": "peasy",
    "version": "beta01",
    "footer_copyright": "<p><a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\"><img alt=\"Creative Commons License\" style=\"border-width:0; float: right\" src=\"https://i.creativecommons.org/l/by-sa/4.0/88x31.png\" /></a>Copyright &copy;",
    "footer_license": "This work is licensed under a <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">Creative Commons Attribution-ShareAlike 4.0 International License</a>.</p>",
    "footer_attribution": "<p>This site was originally cloned from " + "<a href=\"" + siteImportURL_root + "\">" + siteImportURL_root + "</a>.</p>",
    "index_feature_image": "",
    "index_feature_image_credit": ""
  };

  // load remote data to import
  $.get(siteImportURL, function (data) {
    var imported_data = JSON.parse(data);
    if (imported_data.meta.platform === "rooibos" || imported_data.meta.platform === "peasy") {
      var site_import_pages = imported_data.pages;
      var site_import_posts = imported_data.posts;
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
      success: setTimeout(function() { getPageContent('') }, 500)
      });
    } else {
      alert('The platform on ' + siteImportURL + ' is not supported.');
    };
  });
  event.preventDefault();
};
