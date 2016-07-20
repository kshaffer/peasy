function getSiteBanner() {
  // load site data from meta.json and populate banner
  $.getJSON('meta.json', function (data) {
    var site = data;
    document.getElementById('page-heading').innerHTML = site.title;
    document.getElementById('page-subheading').innerHTML = site.author;
  });
};

function getSiteTitle() {
  // load site data from meta.json and populate banner
  $.getJSON('meta.json', function (data) {
    var site = data;
    document.getElementById('site-title').innerHTML = site.title;
  });
};

function getNavbar() {
  // get navbar from navbar.html and load into html
  $.get('navbar.html', function (data) {
    var navbarContent = data;
    document.getElementById('navbar').innerHTML = navbarContent;
  });
};

function getFooter() {
  // load site data from meta.json and populate banner
  $.getJSON('meta.json', function (data) {
    var site = data;
    document.getElementById('page-footer').innerHTML = (site.footer_copyright + ' ' + site.author + '. ' + site.footer_license);
  });
};

function getIndexContent() {
  // load syllabus data from site_content.json and populate page
  $.getJSON('site_content.json', function (data) {
    var siteContent = data;
    document.getElementById('page-heading').innerHTML = siteContent.title;
    document.getElementById('page-subheading').innerHTML = siteContent.author;
    document.getElementById('page-content').innerHTML = siteContent.content;
    document.getElementById('page-footer').innerHTML = siteContent.footer;
  });
};

function populateForm(data) {
    var syllabus = JSON.parse(data);

    // populate website info with metadata
    document.getElementById('course-title').value = syllabus.title;
    document.getElementById('course-instructor').value = syllabus.author;
    document.getElementById('syllabus-content').value = syllabus.content;

  };

function getContentForEditing() {
  // load syllabus data from site_content.json and populate form
  $.getJSON('site_content.json', function (data) {
    var siteContent = data;
    document.getElementById('content-title').value = siteContent.title;
    document.getElementById('content-author').value = siteContent.author;
    document.getElementById('page-content').value = siteContent.content;
  });
};

function goToHomePage(){
  window.location='/';
};

function goToEdit() {
  window.location='/edit.html';
};

// collect document information from form`
function collectContent() {
  var author = document.editedpost.author.value;
  var title = document.editedpost.title.value;
  var content = document.editedpost.postcontent.value;

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
  success: goToHomePage(),
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
    window.sessionStorage.token = returnedData.jwt;
    goToEdit();
  },
  error: function (jqXHR, textStatus, errorThrown) {
              delete window.sessionStorage.token;
              alert("jqXHR: " + jqXHR.status + "\ntextStatus: " + textStatus + "\nerrorThrown: " + errorThrown);
            }
});

  event.preventDefault();
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
    success: goToEdit(),
    dataType: 'application/json'
    });
  });

  event.preventDefault();
};


// The following code can be used for a blog format, rather than a single page

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
