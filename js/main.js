document.addEventListener("DOMContentLoaded", function () {
  let doc = document;
  let imgSize = document.querySelector('#spasing');
  let imgColor = document.querySelector('#base');

  let buttons = doc.querySelectorAll('.contols-buttons button');

  let canvas = doc.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let isMouseDown = false;
  let coords = [];

  let size = '5';
  let color = '#000';

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.strokeStyle = color;


  canvas.addEventListener('mousedown', function(){
    isMouseDown = true;
  });

  canvas.addEventListener('mouseup', function(){
    isMouseDown = false;
    ctx.beginPath();
    coords.push('mouseup');
  });

  ctx.lineWidth = size * 2;

  canvas.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
      coords.push([e.clientX, e.clientY]);

      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 2;



      ctx.beginPath();
      ctx.arc(e.clientX, e.clientY, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;


      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
  });

  function save() {
    localStorage.setItem('coords', JSON.stringify(coords));
  }

  function replay() {
    let timer = setInterval(function() {
      if(!coords.length) {
        clearInterval(timer);
        ctx.beginPath();
        return;
      }
      let crd = coords.shift ();
      let e = {
        clientX: crd['0'],
        clientY: crd['1']
      };

      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(e.clientX, e.clientY, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
      
    }, 10)
  }

  function clear() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = color;
  }

  for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.addEventListener('click', function() {

      if(button.className == 'save') {
        save();
      }

      if(button.className == 'replay') {
        coords = JSON.parse(localStorage.getItem('coords'));
        clear();
        replay();
      }

      if(button.className == 'clear') {
        clear();
      }
    });
};





  
  
  function handleUpdate() {
    size = this.value;
    console.log(ctx.lineWidth)

}

  function colorChange() {
    color = this.value;
    console.log(color);

  }
  
  
  console.log(size);

  imgSize.addEventListener('change', handleUpdate);
  imgColor.addEventListener('change', colorChange);




});
