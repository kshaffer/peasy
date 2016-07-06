window.onload = function() {
  var post_list_content = '';

  for(i = content.posts.length - 1; i >= 0; i -= 1) {
    post_list_content += '<h1>';
    post_list_content += content.posts[i].title;
    post_list_content += '</h1>\n<h2>';
    post_list_content += content.posts[i].author;
    post_list_content += '</h2>\n<br/>';
    post_list_content += content.posts[i].text;
    post_list_content += '\n<br/><hr/><br/>';
}

  document.getElementById('list-of-posts').innerHTML = post_list_content;
  document.getElementById('site-title').innerHTML = site.title;
  document.getElementById('banner-title').innerHTML = site.title;
  document.getElementById('site-author').innerHTML = 'by ' + site.author;
}
