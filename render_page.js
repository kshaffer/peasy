window.onload = function() {
  // load site data from meta.json
  $.getJSON('meta.json', function (data) {
    var site = data;

    // populate website info with metadata
    document.getElementById('site-title').innerHTML = site.title;
    document.getElementById('syllabus-footer').innerHTML = (site.footer_copyright + ' ' + site.author + '. ' + site.footer_license);
  });

  // load dyllabus data from syllabus.json
  $.getJSON('syllabus.json', function (data) {
    var syllabus = data;

    // populate website info with metadata
    document.getElementById('course-title').innerHTML = syllabus.title;
    document.getElementById('course-author').innerHTML = syllabus.author;
    document.getElementById('syllabus-content').innerHTML = syllabus.content;
  });

  // get navbar and load into html
  $.get('navbar.html', function (data) {
    var navbarContent = data;
    document.getElementById('navbar').innerHTML = navbarContent;
  });
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
