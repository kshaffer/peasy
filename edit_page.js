window.onload = function() {
  document.getElementById('banner-title').innerHTML = site.title;
  document.getElementById('site-title').innerHTML = site.title;
}

// collect form information
function collectContent() {
  var author = document.editedpost.author.value;
  var title = document.editedpost.title.value;
  var content = document.editedpost.postcontent.value;

  var post_object = {
    "author": author,
    "title": title,
    "content": content
  }

  // write form content to file
  // send data to local (node.js?) script which will write to file

  $.ajax({
  type: 'POST',
  url: './save_file.php',
  data: post_object, //your data
  success: 'success', //callback when ajax request finishes
  dataType: 'application/json' //text/json...
});

  console.log(post_object);



  event.preventDefault();
};
