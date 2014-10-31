document.addEventListener("DOMContentLoaded", function(event) {

	console.log("Beginning JS");

//=====Facebook=====
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '565051076960106',
      xfbml      : true,
      version    : 'v2.2'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));



//JQUERY
$(document).ready(function(){ 
						   
//===animations===

// $(".page-header").hide().fadeIn(1000);
// $("#headr").hide().fadeIn(1000);
// $("#accordion").hide().fadeIn(1000);
// $(".fadr").hide().fadeIn(500);

  //====Accordion====
	$(function() {
		$("#accordion").accordion({
		});
    $("#pt1").on('click',function(e){
      $("#pt1").slideUp();
      $("#pt2").slideDown();
    });
    $("#pt2").on('click',function(e){
      $("#pt2").slideUp();
      $("#pt3").slideDown();
    });
    $("#pt3").on('click',function(e){
      $("#pt3").slideUp();
      $("#pt4").slideDown();
    });
    $("#pt4").on('click',function(e){
      $("#pt4").slideUp();
      $("#pt5").slideDown();
    });
    // 
  //=====Draggable images=====
  $(".draggable").draggable({ containment: "parent" });

	//====Canvas====
	var DivsToJPG = function( parent ) {
	console.log("Divs to JPG called");
    this.canvasSizeX = 0;
    this.canvasSizeY = 0;
    console.log("parent is "+parent);
    this.init = function( parent ) {
      this.images = parent.find('img');
      this.setSizes();
      this.createCanvas();
      this.drawImages();
      this.exportJPG();
    };

    this.setSizes = function() {
      for (var i = 0, l = this.images.length; i < l ; i++) {
        var currentImage = this.images.eq(i);
        var posX = currentImage.position().left;
        var width = currentImage.width();
        this.canvasSizeX = this.canvasSizeX > (posX+width) ? this.canvasSizeX : posX + width;
        var posY = currentImage.position().top;
        var height = currentImage.height();
        this.canvasSizeY = this.canvasSizeY > (posY+height) ? this.canvasSizeY : posY + height;   
        }
    };

       this.createCanvas = function() {
        this.canvas = document.createElement('canvas');
        this.canvas.id     = "exportCanvas";
        this.canvas.width  = this.canvasSizeX;
        this.canvas.height = this.canvasSizeY;
        this.ctx = this.canvas.getContext("2d");
        // document.body.appendChild(this.canvas);
    };
    
    this.drawImages = function() {
        for (var i = 0, l = this.images.length; i < l ; i++) {
            var currentImage = this.images[i];
            var $currentImage = this.images.eq(i);
            currentImage.globalAlpha = 0.5;
            this.ctx.drawImage(currentImage, $currentImage.position().left, $currentImage.position().top, $currentImage.width(), $currentImage.height());
        }
    };
  
    this.exportJPG = function() {  
      this.img = document.createElement('img');    
      this.img.id = "createdImage";
      this.img.crossOrigin = "anonymous";
      // var dataURL = this.canvas.toDataURL();
      this.img.src = this.canvas.toDataURL();
      console.log("canvas src is "+this.img.src);
      this.img.classList.add("canvas");
      document.body.appendChild(this.img);
      var imUrl;
      imUrl = this.img.src;
      
      console.log('im url is '+imUrl);

  };
  this.init( parent );
};

//====share attempts====
var share = document.getElementById('share');

share.addEventListener('click', function() {
  var divsToJPG = new DivsToJPG($('#jpger'));
  document.getElementById('result').classList.add('hide');
});

var move = document.getElementById('move');

move.addEventListener('click', function() {
  var canv = document.getElementById('createdImage');
  canv.parentNode.removeChild(canv);
  document.getElementById('result').classList.remove('hide');
});



  // var thang = document.getElementById('createdImage');
//   try {
//     var img = document.getElementById('createdImage').toDataURL('image/jpeg', 0.9).split(',')[1];
// } catch(e) {
//     var img = document.getElementById('createdImage').toDataURL().split(',')[1];
// }

// $.ajax({
//     url: 'https://api.imgur.com/3/image',
//     type: 'post',
//     headers: {
//         Authorization: 'Client-ID <CHANGE_THIS_TO_BE_YOUR_CLIENT_ID>'
//     },
//     data: {
//         image: img
//     },
//     dataType: 'json',
//     success: function(response) {
//         if(response.success) {
//             window.location = response.data.link;
//         }
//     }
// });
  // var divsToJPG = new DivsToJPG($('#jpger'));
  // var img = document.getElementById('createdImage');
  // var isrc = img.src;
  // console.log(isrc);
  // var fixsrc = isrc.substr(isrc.indexOf(",") + 1);
  // console.log(fixsrc);

// });


// var divsToJPG = new DivsToJPG($('#jpger'));

// $('#share').click(function() {
//   // var divsToJPG = new DivsToJPG($('#jpger'));
//   var img = ($('#argh'));
//   var isrc = img.attr('src');
//   console.log("Img src is "+isrc);
//   console.log("divs to is JPG is"+divsToJPG);
//   console.log(img);
//   var srcFix = isrc

// $.ajax({
//     url: 'https://api.imgur.com/3/image',
//     type: 'post',
//     headers: {
//         Authorization: 'Client-ID <CHANGE_THIS_TO_BE_YOUR_CLIENT_ID>'
//     },
//     data: {
//         image: img
//     },
//     dataType: 'json',
//     success: function(response) {
//         if(response.success) {
//             window.location = response.data.link;
//         }
//     }
// });
// });



// $('#share').click(function() {
//   var divsToJPG = new DivsToJPG($('#jpger'));
//   var img = ($('#argh'));
//   console.log("Img src is "+img.src);
//   console.log("divs to is JPG is"+divsToJPG);
//   console.log(img);
//   $.ajax({ 
//     processData: false,
//     url: 'https://api.imgur.com/3/image',
//     headers: {
//         'Authorization': 'Client-ID 4d214ab434e821a'
//     },
//     type: 'POST',
//     data: {
//         'image': img
//     },
//     success : function(data,data1,data2){
//     alert("OK : "+data);
//     console.log(data2);
// },
// error:function (xhr){
//     alert(JSON.stringify(xhr));
//     console.log(xhr);
//     switch (xhr.status) {
//              // Take action, referencing xhr.responseText as needed.
//     }
// },
// complete :  function (xhr){
//     alert(JSON.stringify(xhr));
//     console.log(xhr);
//     switch (xhr.status) {
//              // Take action, referencing xhr.responseText as needed.
//     }
// }
// }); 
// });

//dump img key: iBO6QK9ch58VmGFCaqwlTcOIIkn3Ew0FAOr0OZfKz29LUefjjG2HyfHMkIvDZWT1McA4FOjxduIz62DOaOxzisCjyYmSxwasrPy5

// var divsToJPG = new DivsToJPG($('#jpger'));
// console.log("CREATED CANVAS "+divsToJPG);

//=====upload canvas to imgur====

// function lala(img) {
//   console.log("TRYING TO SHARE");
//     try {
//         img = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
//     } catch(e) {
//         img = canvas.toDataURL().split(',')[1];
//     }
//     var w = window.open();
//     w.document.write('Uploading to imgur.com...');
//     $.ajax({
//         url: 'https://api.imgur.com/3/upload.json',
//         type: 'POST',
//         headers: {
//             Authorization: 'Client-ID 4d214ab434e821a'
//         },
//         data: {
//             type: 'base64',
//             name: 'epic.jpg',
//             title: 'Epic Portrait',
//             description: 'Made via Epic Portrait Generator',
//             image: img
//         },
//         dataType: 'json'
//     }).success(function(data) {
//         var url = 'http://imgur.com/' + data.data.id + '?tags';
//         _gaq.push(['_trackEvent', 'neonflames', 'share', url]);
//         w.location.href = url;
//     }).error(function() {
//         alert('Could not reach api.imgur.com. Sorry :(');
//         w.close();
//         _gaq.push(['_trackEvent', 'neonflames', 'share', 'fail']);
//     });
// }

});  
});

});