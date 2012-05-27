(function () {
    
    function T (){
        this.data = [];
    }

    this.T = T;

    T.prototype.Load = function () {
        var url, args, img, ctx, filestream, self;
        //url = 'testcard.jpg';
        url = 'cameron.jpg';
        args = {};
        img = new Image();
        ctx = document.getElementById('canvas').getContext('2d');
        img.onload = function () {
            console.log('loading!');
            ctx.drawImage(img,0,0);
        };
   
        this.raw = this.load_binary_resource(url);
        img.src = this.byteBufToBase64(this.raw);
        //console.log(this.img.src);
    };


    T.prototype.load_binary_resource = function (url) {
        var req, bytes;
        req = new XMLHttpRequest();
        req.overrideMimeType('text\/plain; charset=x-user-defined');
        req.open('GET', url, false);
        req.responseType = "arraybuffer";
        req.send(null);
        if (req.status != 200) return '';
        console.log(req); 
        bytes = new Uint8Array(req.response);
        return bytes;
    }

    T.prototype.byteBufToBase64 = function( bytes ) {
        var binary = '';
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] )
        }
        return 'data:image/jpeg;base64,' + window.btoa( binary );
    };
    

    T.prototype.arrayBufToBase64 = function( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] )
        }
        return 'data:image/jpeg;base64,' + window.btoa( binary );
    };

    T.prototype.doBadThings = function ( input, numberOfBadThings ) {
        var num,byteLen,i,offset,bytes;

        bytes = new Uint8Array(input);

        num = Math.round(Math.random()*numberOfBadThings);
        byteLen = bytes.byteLength;
        while (num > 0) {
            offset = Math.round(Math.random()*byteLen);
            bytes[offset] = Math.round(Math.random()*255);
            num = num - 1;
        }
        return bytes;
    };


    T.prototype.Update = function () {
        var bytes,canvas,num;
        num = Math.round(Math.random()*500);
        bytes = this.doBadThings(this.raw,num);
        img = new Image();
        ctx = document.getElementById('canvas').getContext('2d');
        canvas = $("#canvas");
        img.onload = function () {
            console.log('loading!');
            //ctx.clearRect(0,0,canvas.width(),canvas.height());
            ctx.drawImage(img,0,0);
        };
        img.src = this.byteBufToBase64(bytes);

    };

    T.prototype.Spin = function () {
        var timeout;
        timeout = Math.round(Math.random()*500);
        t.Update();
    };

}());


var t,timeout, spin;
$(document).ready(function () {
    t = new T();
    t.Load();
    
    spin = function () { 
        timeout = Math.round(Math.random()*250);
        t.Update();
        window.setTimeout(function () { spin(); },timeout);
    };
    spin();
});

