function populateForm(data) {
    console.log(data);

    var syllabus = JSON.parse(data);

    // populate website info with metadata
    document.getElementById('course-title').value = syllabus.title;
    document.getElementById('course-instructor').value = syllabus.author;
    document.getElementById('syllabus-content').value = syllabus.content;

  };

window.onload = function() {
  // load site data from meta.json
  $.getJSON('meta.json', function (data) {
    var site = data;

    // populate website info with metadata
    document.getElementById('banner-title').innerHTML = site.title;
    document.getElementById('site-title').innerHTML = site.title;
  });

  // load syllabus data from database
  $.get('syllabus.json', function (data) {

    //var syllabus = JSON.parse(data);
    var syllabus = data;

    // populate website info with metadata
    document.getElementById('course-title').value = syllabus.title;
    document.getElementById('course-instructor').value = syllabus.author;
    document.getElementById('syllabus-content').value = syllabus.content;
  });

    // get navbar and load into html
    $.get('navbar.html', function (data) {
      var navbarContent = data;
      document.getElementById('navbar').innerHTML = navbarContent;
    });

}


// function to view syllabus when editing form is submitted
function visitPage(){
        window.location='/';
    }

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
  success: visitPage(),
  dataType: 'application/json'
});

  event.preventDefault();
};

// get URL of syllabus to clone from user,
// fetch data, then go to edit page`
function editFromURL() {
  var syllabusurl = (document.importurl.syllabusurl.value + '/api.php');

  // load syllabus data from database
  $.get(syllabusurl, function (data) {

    var syllabus = JSON.parse(data);

    // populate website info with metadata
    document.getElementById('course-title').value = syllabus.title;
    document.getElementById('course-instructor').value = syllabus.author;
    document.getElementById('syllabus-content').value = syllabus.content;
  });

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
  success: visitPage(),
  dataType: 'application/json'
});

  event.preventDefault();
};
