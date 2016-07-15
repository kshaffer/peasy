window.onload = function() {
  // load site data from meta.json
  $.getJSON('meta.json', function (data) {
    var site = data;

    // populate website info with metadata
    document.getElementById('banner-title').innerHTML = site.title;
    document.getElementById('site-title').innerHTML = site.title;
  });

}

function visitEditPage(){
        window.location='/edit.html';
    }


// get URL of syllabus to clone from user,
// fetch data, then go to edit page`
function editFromURL() {
  var syllabusurl = (document.importurl.syllabusurl.value + '/api.php');

  // load syllabus data from database
  $.get(syllabusurl, function (data) {

    var syllabus = JSON.parse(data);
    
    var author = syllabus.author;
    var title = syllabus.title;
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
  success: visitEditPage(),
  dataType: 'application/json'
});

});

  event.preventDefault();
};
