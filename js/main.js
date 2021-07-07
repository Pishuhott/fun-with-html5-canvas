document.addEventListener("DOMContentLoaded", function () {
    let doc = document;
    let imgSize = doc.querySelector('#spasing');
    let imgColor = doc.querySelector('#base');

    let buttons = doc.querySelectorAll(".contols-buttons button");

    let canvas = doc.getElementById('canvas');
    let canvasPos;
    let ctx = canvas.getContext('2d');
    let isMouseDown = false;
    let coords = [];
    let size = '5';
    let color = '#000';

    //Refresh on window resize
    function upWidthWindow() {
        let wrapeer = doc.querySelector('.wrapper');
        let canvasDiv = doc.querySelector('.wrapper__canvas');
        let width = canvasDiv.offsetWidth;
        let height = wrapeer.offsetHeight;
        canvas.width = width - '40';
        canvas.height = height - '40';

        canvasPos = canvas.getBoundingClientRect();
    }

    window.addEventListener('resize', upWidthWindow);

    upWidthWindow();

    //Drawing function
    ctx.strokeStyle = color;

    canvas.addEventListener('mousedown', function () {
        isMouseDown = true;
    });

    canvas.addEventListener('mouseup', function () {
        isMouseDown = false;
        ctx.beginPath();
        coords.push('mouseup');
    });

    ctx.lineWidth = size * 2;

    canvas.addEventListener('mousemove', function (e) {
        if (isMouseDown) {
            let canvasPosTop = e.clientX - canvasPos.left;
            let canvasPosLeft = e.clientY - canvasPos.top;

            coords.push([canvasPosTop, canvasPosLeft]);

            ctx.lineTo(canvasPosTop, canvasPosLeft);
            ctx.stroke();
            ctx.strokeStyle = color;
            ctx.lineWidth = size * 2;

            ctx.beginPath();
            ctx.arc(canvasPosTop, canvasPosLeft, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo(canvasPosTop, canvasPosLeft);
        }
    });

    //Save, clear and play functions
    function save() {
        localStorage.setItem('coords', JSON.stringify(coords));
        localStorage.setItem('sizes', JSON.stringify(sizes));
        localStorage.setItem('colors', JSON.stringify(colors));
        localStorage.setItem('ctx.strokeStyle', JSON.stringify(ctx.strokeStyle));
        localStorage.setItem('ctx.lineWidth', JSON.stringify(ctx.lineWidth));
    }

    function replay() {
        let timer = setInterval(function () {
            if (!coords.length) {
                clearInterval(timer);
                ctx.beginPath();
                return;
            }
            let crd = coords.shift();
            let e = {
                clientX: crd['0'],
                clientY: crd['1'],
            };

            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(e.clientX, e.clientY, size, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        }, 20);
    }

    function clear() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = color;
    }

    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        button.addEventListener('click', function () {
            if (button.className == 'save') {
                save();
            }

            if (button.className == 'replay') {
                coords = JSON.parse(localStorage.getItem('coords'));
                sizes = JSON.parse(localStorage.getItem('sizes'));
                colors = JSON.parse(localStorage.getItem('colors'));
                clear();
                replay();
            }

            if (button.className == 'clear') {
                clear();
            }
        });
    }

    //Pen size and color
    function handleUpdate() {
        size = this.value;
    }

    function colorUpdate() {
        color = this.value;
    }

    imgSize.addEventListener('change', handleUpdate);
    imgColor.addEventListener('change', colorUpdate);
});
