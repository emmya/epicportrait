document.addEventListener("DOMContentLoaded", function(event) {

	console.log("Beginning JS");


//JQUERY
$(document).ready(function(){ 
						   
	console.log("Beginning JQuery");
  //====Accordion====
	$(function() {
		$("#accordion").accordion({
		});
    $("#pt1").on('click',function(e){
      $("#pt1").fadeOut();
      $("#pt2").fadeIn();
    });
    $("#pt2").on('click',function(e){
      $("#pt2").fadeOut();
      $("#pt3").fadeIn();
    });
    $("#pt3").on('click',function(e){
      $("#pt3").fadeOut();
      $("#pt4").fadeIn();
    });
    $("#pt4").on('click',function(e){
      $("#pt4").fadeOut();
      $("#pt5").fadeIn();
    });
    // 

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
      this.img.classList.add("canvas");
      document.body.appendChild(this.img);
    };
    this.init( parent );
    document.getElementById('jpger').style.display = "none";
};

var divsToJPG = new DivsToJPG($('#jpger'));
console.log("CREATED CANVAS "+divsToJPG);



});  
});

});