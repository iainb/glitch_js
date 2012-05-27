(function () {
    
    function GLITCH (){
    }

    this.GLITCH = GLITCH;

    GLITCH.prototype.Load = function (url,func) {

        this.url = url;
        this.LoadBinaryResource(url,func);
    };

    GLITCH.prototype.LoadBinaryResource = function (url,func) {
        var req, self, img, b64;

        self = this;

        req = new XMLHttpRequest();
        req.responseType = "arraybuffer";        
        req.open('GET', url, true);
        req.onload = function (e) {
            self.raw = this.response;
            self.bytes = new Uint8Array(self.raw);
            self.reader = new DataView(self.raw);
            self.length = self.bytes.byteLength;

            self.jpeg = new JPEG();
            self.jpeg.Load(self.raw);
            self.toks = self.jpeg.GetTokens();
            
            img = new Image();
            img.onload = function () {
                self.height = img.height;
                self.width  = img.width;
                func();
            }
            b64 = self.ArrayBufferToBase64(self.bytes);
            img.src = 'data:image/jpeg;base64,' + b64;
        };
        req.send(null);
    };

    GLITCH.prototype.ArrayBufferToBase64 = function (buffer) {
        var bytes,len,binary,i;
        bytes = new Uint8Array(buffer);
        len = bytes.byteLength;
        binary = '';
        for (i=0;i<len;i=i+1) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    GLITCH.prototype.Display = function (buffer,x,y) {
        var img,canvas,ctx,b64;
        img = new Image();
        canvas = document.getElementById('output')
        canvas.setAttribute('width',this.width);
        canvas.setAttribute('height',this.height);
        ctx = canvas.getContext('2d');

        img.onload = function () {
            ctx.drawImage(img,x,y);
        };
        b64 = this.ArrayBufferToBase64(buffer);
        img.src = 'data:image/jpeg;base64,' + b64;
    };

    GLITCH.prototype.Update = function () {
        this.Display(this.bytes,0,0);
    };

    GLITCH.prototype.Quantization = function (input,meth) {
        var n,i,j,tok;
        n = new Uint8Array(input);
        for (i=0;i<this.toks.length;i=i+1) {
            if (this.toks[i].type === 'DQT') {
                tok = this.toks[i]; 
                console.log(tok);
                for (j=tok.start;j < tok.end;j=j+1) {
                    //n[j] = Math.round(Math.random()*200);
                    //n[j] = n[j*2] 
                    n[j] = meth(j,n[j]);
                    console.log('setting',j,'to',n[j]);
                }
            }
        }
        return n;
    };

    GLITCH.prototype.ApplyFunction = function (input,type,benice,method) {
        var n,i,j,tok,tmp;
        n = new Uint8Array(input);
        for (i=0;i<this.toks.length;i=i+1) {
            if (this.toks[i].type === type) {
                tok = this.toks[i]; 
                for (j=tok.start;j < tok.end;j=j+1) {
                    val = method(j,n[j]);
                    if (benice === true) {
                        n = this.ApplyNiceValue(n,j,val);
                    } else {
                        n[j] = val;
                    }
                    console.log('set',j,'to',n[j]);
                }
            }
        }
        return n;
    };

    /* 
        ApplyNiceValue handles setting 0xFF into the data section
        All 0xFF values must be followed by 0x0 (which is then
        ignored by the jpeg decoder)
        
        Also leaves reset blocks in place
        0xFF followed by 0xD0 ... 0xD7 (255 followed by 208 ...215)

        @param input - input array
        @param pos   - position in array
        @param value - value to be inserted 
        @return modified input array
    */
    GLITCH.prototype.ApplyNiceValue = function (input,pos,value) {
        /*
        if (input[pos-1] !== 255) {
            if (input[pos] !== 0 &&  input[pos] < 208 && input[pos] > 215) {
                if (value === 255) {
                    input[pos] = 255;
                    input[pos+1] = 0;
                } else {
                    input[pos] = value;
                }    
            }
        } 
        */

        if (input[pos-1] !== 255 && input[pos] !== 255) {
            if (value === 255) {
                input[pos] = 255;
                input[pos+1] = 0;
            } else {
                input[pos] = value;
            }
        }  
        return input; 
    };

    GLITCH.prototype.RandomData = function (input,ammount) {
        var n,i,j,tok,count,pos,val;
        n = new Uint8Array(input);
        for (i=0;i<this.toks.length;i=i+1) {
            if (this.toks[i].type === 'SOID') {
                tok = this.toks[i]; 
                count = ammount;
                while (count > 0) {
                    pos = this.RandomRange(tok.start,tok.end);
                    val = Math.round(Math.random()*255);
                    if (n[pos] === 0) {
                        n[pos-1] =  Math.round(Math.random()*254);
                        if (val === 255) {
                            n[pos] = 255;
                            n[pos+1] = 0;
                        }   else {
                            n[pos] = val;
                        }
                    }
                    count = count - 1;
                }
            }
        }
        //this.Display(n);
        return n;

    };

    GLITCH.prototype.RandomRange = function (min,max) {
        return Math.round(min + (Math.random()*(max-min)));
    };

}());
