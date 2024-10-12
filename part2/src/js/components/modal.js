const imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

console.log('here');

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

function generateAscii() {
  
  var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
  var data = imgData.data;

  // enumerate all pixels
  // each pixel's r,g,b,a datum are stored in separate sequential array elements

  for(var i=0; i<data.length; i+=4) {
    var red = data[i];
    var green = data[i+1];
    var blue = data[i+2];
    var alpha = data[i+3];
    console.log(`red: ${red}, green: ${green}, blue: ${blue}, alpha: ${alpha}`)
  }
  
}

document.querySelector('#generate-ascii').addEventListener('click', generateAscii);
