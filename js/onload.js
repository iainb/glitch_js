var g,v;
$(document).ready(function () {
    var a,b,numchanges;
    g = new GLITCH();
    v = new Visualise();
    g.Load('img/horse.jpg', function () {
        var last;
        a = g.bytes;
        /* 
        b = g.Quantization(a,function (a,b) { 
            if (Math.random() > 0.75) { 
                b = b + Math.random()*20;
                if (b > 254) {
                    return 254
                } else {
                    return b;
                }
            } else { 
                return b;
            } });
        */
        //a = g.RandomHuffman(a,1); 
        //a = g.RandomData(a,55);
        /*
        last = 254;
        a = g.ApplyFunction(a,'SOID',true,function (pos,val) {
            
            if (pos > 24743 && pos < 34743) {
                last = last - 1;
                if (last === 0) {
                    last = 254;
                }
                return last;
            } else {
                return val;
            }
            
            return val;
        });
        */
        numchanges = 25;
        a = g.ApplyFunction(a,'DQT',false,function (pos,val) {
            if (numchanges > 0) {
                numchanges = numchanges - 1;
                return val + Math.random()*25;
            } else {
                return val;
            }
        });
        

        g.Display(a,0,0);
        v.Visualise(g.bytes,'before');
        v.Visualise(a,'after');
   
    });

});
