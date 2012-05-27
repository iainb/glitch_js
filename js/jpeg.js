(function () {
    
    function JPEG (){
    }

    this.JPEG = JPEG;

    JPEG.prototype.Load = function (data) {
        this.raw    = new ArrayBuffer(data);
        this.bytes  = new Uint8Array(data);
        this.reader = new DataView(data);
        this.length = this.bytes.byteLength;
        this.toks   = [];

        this.Tokeniser();
    };

    JPEG.prototype.Tokeniser = function () {
        var i,d,sz,toks,sos;
        d = this.bytes;
        toks = [];
        for (i=0;i<this.length;i=i+1) {

            // Start of Image
            if (d[i] === 0xFF && d[i+1] === 0xD8) {
                console.log('SOI',i);
                toks.push({ type : 'SOI',
                            base  : i,
                            start : i,
                            end   : i});
                continue;
            }

            // Start of Frame - baseline DCT
            if (d[i] === 0xFF && d[i+1] === 0xC0) {
                console.log('SOF0',i);
                continue;
            }

            // Start of Frame - extended sequential DCT
            if (d[i] === 0xFF && d[i+1] === 0xC1) {
                console.log('SOF1',i);
                continue;
            }

            // Start of Frame - progressive DCT
            if (d[i] === 0xFF && d[i+1] === 0xC2) {
                console.log('SOF2',i);
                continue;
            }

            // Start of Frame - Losless (sequential)
            if (d[i] === 0xFF && d[i+1] === 0xC3) {
                console.log('SOF3',i);
                continue;
            }            

            // huffman table
            if (d[i] === 0xFF && d[i+1] === 0xC4) {
                sz = this.reader.getInt16(i+2);
                toks.push({ type : 'DHT',
                            base  : i,
                            start : i + 18,
                            end   : i + sz});
                console.log('DHT',i,sz);
                continue;
            }

            // Start of Frame - Differential sequential DCT
            if (d[i] === 0xFF && d[i+1] === 0xC5) {
                console.log('SOF5',i);
                continue;
            }            

            // Start of Frame - Differential progressive DCT
            if (d[i] === 0xFF && d[i+1] === 0xC6) {
                console.log('SOF6',i);
                continue;
            }            

            // Start of Frame - Differential lossless (sequential)
            if (d[i] === 0xFF && d[i+1] === 0xC7) {
                console.log('SOF7',i);
                continue;
            }            

            // Start of Frame - Differential lossless (sequential)
            if (d[i] === 0xFF && d[i+1] === 0xC8) {
                console.log('JPG',i);
                continue;
            }        

            // Start of Frame - Differential lossless (sequential)
            if (d[i] === 0xFF && d[i+1] === 0xC9) {
                console.log('SOF9',i);
                continue;
            }        

            // Start of Frame - Differential lossless (sequential)
            if (d[i] === 0xFF && d[i+1] === 0xCA) {
                console.log('SOF10',i);
                continue;
            }     

            // Start of Frame - Differential lossless (sequential)
            if (d[i] === 0xFF && d[i+1] === 0xCB) {
                console.log('SOF11',i);
                continue;
            }                 

            if (d[i] === 0xFF && d[i+1] === 0xCD) {
                console.log('SOF13',i);
                continue;
            }        

            if (d[i] === 0xFF && d[i+1] === 0xCE) {
                console.log('SOF14',i);
                continue;
            }        

            if (d[i] === 0xFF && d[i+1] === 0xCF) {
                console.log('SOF15',i);
                continue;
            }        

            if (d[i] === 0xFF && d[i+1] === 0xCC) {
                console.log('DAC',i);
                continue;
            } 


            // quantization table
            if (d[i] === 0xFF && d[i+1] === 0xDB) {
                sz = this.reader.getInt16(i+2);
                toks.push({ type : 'DQT',
                            base: i,
                            start : i + 5,
                            end   : i + sz});
                console.log('DQT',i,sz);
                continue;
            }

            // Start of Scan
            if (d[i] === 0xFF && d[i+1] === 0xDA) {
                sz = this.reader.getInt16(i+2);
                toks.push({ type : 'SOS',
                            base : i,
                            start : i,
                            end  : i + sz});
                console.log('SOS',i,sz);
                sos = i + sz;
                continue;
            }

            // end of image
            if (d[i] === 0xFF && d[i+1] === 0xD9) {
                toks.push({type : 'SOID',
                           base : sos + 1,
                           start : sos + 1,
                           end  : i - 1});
                toks.push({type : 'EOI',
                           base : i,
                           start : i,
                           end   : i});
                           
                console.log('EOI',i);
                continue;
            }

            // comment
            if (d[i] === 0xFF && d[i+1] === 0xFE) {
                console.log('COM',i);
                continue;
            }

        }
        this.toks = toks;
        console.log(toks);

    };

    JPEG.prototype.GetTokens = function () {
        return this.toks;
    };

    JPEG.prototype.ParseLength = function (pos) {
        var val;
        val = this.reader.getInt16(pos);
        console.log('PraseLength',pos,this.bytes[pos],this.bytes[pos+1],val); 
    };

}());
