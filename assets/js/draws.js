/**
 * Desc: HTML5 FM播放器, 重在学习 Web Audio Api
 * 
 *       => 音波画图函数
 * 
 * Author: Rodey
 * Update-Date: 2014-07-30
 * github: https://github.com/RodeyManager/HTML5-FMPlayer.git
 * blog: www.roadey.com
 * site: www.senuu.com
 */



var effectsObject = {



    /**
	 * 画矩阵
	 * @return {[type]} [description]
	 */
	drawMeter: function (){

		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);
        var step = Math.floor(array.length / meterNum);
        soundWave.clearRect(0, 0, cw, ch);
        soundWave.fillStyle = fillColor || '#F72A62';
        if(isMoreColor){
        	gradient = soundWave.createLinearGradient(0, 0, 0, 500);
	        gradient.addColorStop(1, 'rgba(230, 28, 78, .3)');
	        gradient.addColorStop(0.5, 'rgba(228, 246, 30, .3)');
	        gradient.addColorStop(0, '#F72A62');
            soundWave.fillStyle = gradient;
        }
        
        for (var i = 0; i < meterNum; i++) {
            var value = array[i] * lineStep;
            var w = meterWidth;
            var h = value;
            var x = i * (meterWidth + 1);
            var y = 0;
            soundWave.fillRect(x, y, meterWidth, h);
            if(h > 0){
            	soundWave.beginPath();
	            soundWave.fillStyle = fillColor;
	            soundWave.arc(x + 1, h + 5, 1, Math.PI * 2, false);
	            soundWave.fill();
	            soundWave.closePath();
            }
        }

        //requestAnimationFrame(drawMeter);
	},

	/**
	 * 画圆
	 * @return {[type]} [description]
	 */
	drawCircle: function (){
		var meterWidth = 20,
            meterNum = Math.floor(cw / meterWidth);
       
		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);
        var w = meterWidth;
        var h = Math.PI * 2;
        var x = cw / 2;// (cw - r * 2) / 2;
        var y = soundWave.canvas.height / 2 - 50;//(soundWave.canvas.height - r * 2) - r * 2;
        var rr = 0;
        var strokeColor = strokeColor || '#F72A62';
        soundWave.clearRect(0, 0, cw, ch);
		var index = 0;
        for (var i = 0; i < meterNum; i++) {
			index += i;

            //半径控制
            var value = array[index] / cw * array[index] * lineStep;
			if(cw > ch){
				value = array[index] / (cw / ch * 1000) * array[index] * lineStep;
			}else{
				value = array[index] / (ch / cw * 1000) * array[index] * lineStep;
			} 
            var r = rr = Math.round(value / 0.7) + 3;

            //多色
			if(isMoreColor){
				var strokeColor = 'rgb('+ Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 +')';
			}
            
        	soundWave.beginPath();
            soundWave.strokeStyle = strokeColor; 
            soundWave.lineWidth = 2;
            soundWave.arc(x, y, r, h, false);
            soundWave.stroke();
            soundWave.closePath();
        }

		index++;

        //画中间实心圆
        soundWave.beginPath();
        soundWave.fillStyle = strokeColor; //'#F72A62';
        soundWave.arc(x, y, rr / 5, h, false);
        soundWave.fill();
        soundWave.closePath();

	},
	
	/**
	 * 画圆和点
	 * @return {[type]} [description]
	 */
	drawCirclePoint: function (){
		var meterWidth = 20,
            meterNum = Math.floor(cw / meterWidth);
       
		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);
        var w = meterWidth;
        var h = Math.PI * 2;
        var x = cw / 2;// (cw - r * 2) / 2;
        var y = soundWave.canvas.height / 2 - 50;//(soundWave.canvas.height - r * 2) - r * 2;
        var rr = 0;
        var strokeColor = strokeColor || '#F72A62';
        soundWave.clearRect(0, 0, cw, ch);
		var index = 0;
        for (var i = 0; i < meterNum; i++) {
			index += i;

            //半径控制
            var value = array[index] / cw * array[index] * lineStep;
            if(cw > ch){
                value = array[index] / (cw / ch * 1000) * array[index] * lineStep;
            }else{
                value = array[index] / (ch / cw * 1000) * array[index] * lineStep;
            } 
            var r = rr = Math.round(value / 0.7) + 3;
            
            //多色
			if(isMoreColor){
				strokeColor = 'rgb('+ Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 +')';
			}
            
        	soundWave.beginPath();
            soundWave.strokeStyle = strokeColor; 
            soundWave.lineWidth = 2;
            soundWave.arc(x, y, r, h, false);
            soundWave.stroke();
            soundWave.closePath();
			
			/*soundWave.beginPath();
            soundWave.fillStyle = strokeColor; //'#F72A62';
            soundWave.arc(x, y, r / 10, h, false);
            soundWave.fill();
            soundWave.closePath();*/
			
			soundWave.beginPath();
            soundWave.fillStyle = strokeColor; //'#F72A62';
            soundWave.arc(x + (Math.random() * r) - (Math.random() * x / 6), y + (Math.random() * r) - (Math.random() * y / 6), (Math.random() * r / 8), h, false);
            soundWave.fill();
            soundWave.closePath();
            
        }

        //画中间实心圆
        soundWave.beginPath();
        soundWave.fillStyle = strokeColor; //'#F72A62';
        soundWave.arc(x, y, rr / 5, h, false);
        soundWave.fill();
        soundWave.closePath();

		index++;

	},
	
	/**
	 * 画圆点
	 * @return {[type]} [description]
	 */
	drawPoint: function (){
		var meterWidth = 20,
            meterNum = Math.floor(cw / meterWidth);
       
		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);

        var h = Math.PI * 2;
        var fillColor = fillColor || '#F72A62';
        soundWave.clearRect(0, 0, cw, ch);
        var index = 0;
        var len = array[Math.floor(Math.random() * array.length)]  * array[Math.floor(Math.random() * array.length)] / 3 ;
        for (var i = 0; i < len; i++) {
            index += i;
            var value = array[index] / ch * array[index];
            var r = Math.round(value / 10);
            var x = 100 + Math.random() * (cw - 200);
            var y = 100 + Math.random() * (soundWave.canvas.height - 200);

            if(isMoreColor){
                fillColor = 'rgba('+ Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 +', .8)';
            }

            soundWave.beginPath();
            soundWave.fillStyle = fillColor; //'#F72A62';
            soundWave.arc(x, y, r, h, false);
            soundWave.fill();
            soundWave.closePath();
            
        }
        index++;

        
	},

    /**
     * 画点和线
     * @return {[type]} [description]
     */
    drawBazire: function(){
        var meterWidth = 20,
            meterNum = Math.floor(cw / meterWidth);
       
        var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);

        var h = Math.PI * 2;
        soundWave.clearRect(0, 0, cw, ch);
        var canw = cw,
            canh = soundWave.canvas.height;
        var fillColor = fillColor || '#F72A62';
        //画点
        var index = 0;
        var len = array[Math.floor(Math.random() * array.length)]  * array[Math.floor(Math.random() * array.length)] / 3 ;
        for (var i = 0; i < len; i++) {
            index += i;
            var value = array[index] / ch * array[index];
            var r = Math.round(value / 10);
            var x = Math.random() * cw;
            //var y = Math.random() * (canh * .5) + canh / 4;
            var y = canh / 3 + (array[Math.floor(Math.random() * array.length)]);

            if(isMoreColor){
                fillColor = 'rgba('+ Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 +', .8)';
            }

            soundWave.beginPath();
            soundWave.fillStyle = fillColor //'#F72A62';
            soundWave.arc(x, y, r, h, false);
            soundWave.fill();
            soundWave.closePath();
        }
        index++;
        //画线
        var deg = Math.PI / 180;
        var m = Math.random() * array[Math.floor(Math.random() * array.length)] / 3;
        for(var i = 0; i < m; ++i){

            soundWave.beginPath();
            soundWave.strokeStyle = 'rgba(247, 42, 98, '+ Math.random() +')';
            soundWave.lineWidth = 1;   
            soundWave.moveTo(0, canh / 3 + (array[Math.floor(Math.random() * array.length)] / 1.2));
            soundWave.lineTo(canw, canh / 3 + (array[Math.floor(Math.random() * array.length)] / 1.2));
            soundWave.stroke();
            soundWave.closePath();
        }

        //soundWave.rotate(-180 * deg);
        $('#sound-wave').css({
            '-webkit-transform': 'rotateX(-180deg)',
            '-moz-transform': 'rotateX(-180deg)',
            '-ms-transform': 'rotateX(-180deg)',
            '-o-transform': 'rotateX(-180deg)',
            'transform': 'rotateX(-180deg)'
        });

    },


    drawMeterStreamgraph: function(){
        var meterWidth = 1,
            meterNum = Math.floor(cw / meterWidth)
        var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);
       
        soundWave.clearRect(0, 0, cw, ch);

        var m = array[Math.floor(Math.random() * array.length)];
        for (var i = 0; i < m; ++i) {
            var value = array[i] * lineStep;
            var w = meterWidth;
            var h = value;
            var x = cw / 2 + Math.abs(Math.sin(h / i * 5) * 270) + 5; //i * (meterWidth + 1);
            var y = Math.cos(h / i * 5) * -120 + ch / 4;

            soundWave.fillStyle = 'rgba(247, 42, 98, '+ Math.random() +')';
            //soundWave.fillStyle = fillColor;
            soundWave.fillRect(x, y, meterWidth, h / 2.5);
            
            if(h > 0){
                soundWave.beginPath();
                soundWave.arc(x + 1, y - 5, .5, Math.PI * 2, false);
                soundWave.fill();
                soundWave.closePath();

                soundWave.beginPath();
                soundWave.arc(x + 1, h + Math.abs(y) - 5, 1, Math.PI * 2, false);
                soundWave.fill();
                soundWave.closePath();
            }
        }
        
        for (var i = m + 1; i >= 0; --i) {
            var value = array[i] * lineStep;
            var w = meterWidth;
            var h = value;
            var x = cw / 2 - Math.sin(h / i * 5) * 270 + 5; //i * (meterWidth + 1);
            var y = Math.cos(h / i * 5) * -120 + ch / 4;

            soundWave.fillStyle = 'rgba(247, 42, 98, '+ Math.random() +')';
            //soundWave.fillStyle = fillColor;
            soundWave.fillRect(x, y, meterWidth, h / 2.5);
            
            if(h > 0){
                soundWave.beginPath();
                soundWave.arc(x + 1, y - 5, .5, Math.PI * 2, false);
                soundWave.fill();
                soundWave.closePath();

                soundWave.beginPath();
                soundWave.arc(x + 1, h + Math.abs(y) - 5, 1, Math.PI * 2, false);
                soundWave.fill();
                soundWave.closePath();
            }
        }

    }




};