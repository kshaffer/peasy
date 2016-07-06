var site = JSON.parse('{ "title": "Peasy test blog", "author": "Kris Shaffer" }');
var page = JSON.parse('{ "title": "This is the post title", "author": "Kris Shaffer", "text": "<p>This is post content.</p><p>And here is another paragraph.</p>" }');

window.onload=function() {
  document.getElementById('site-title').innerHTML = site.title;
  document.getElementById('banner-title').innerHTML = site.title;
  document.getElementById('site-author').innerHTML = site.author;
  document.getElementById('post-title').innerHTML = page.title;
  document.getElementById('post-text').innerHTML = page.text;
  document.getElementById('post-author').innerHTML = page.author;
}
