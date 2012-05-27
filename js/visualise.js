(function () {
    
    function Visualise (){
        this.width = 256;
    }

    this.Visualise = Visualise;

    Visualise.prototype.Visualise = function (bytes,id) {
        var canvas,ctx,len,i,x,y;

        len = bytes.byteLength;
        canvas = document.getElementById(id);
        canvas.setAttribute('width',this.width);
        canvas.setAttribute('height',Math.floor(len/this.width));
        ctx = canvas.getContext('2d');
        for (i=0;i<len;i=i+1) {
            ctx.fillStyle = 'rgb(' + bytes[i] + ',' + bytes[i] + ',' + bytes[i] + ')';
            x = i % this.width;
            y = Math.floor(i/this.width);
            ctx.fillRect(x,y,1,1);
        }
    }   

}());

