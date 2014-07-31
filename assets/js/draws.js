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





    /**
	 * 画矩阵
	 * @return {[type]} [description]
	 */
	function drawMeter(){

		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);
        var step = Math.floor(array.length / meterNum);
        soundWave.clearRect(0, 0, cw, ch);
        soundWave.fillStyle = "#ffffff";
        if(isMoreColor){
        	gradient = soundWave.createLinearGradient(0, 0, 0, 500);
	        gradient.addColorStop(1, 'rgba(230, 28, 78, .3)');
	        gradient.addColorStop(0.5, 'rgba(228, 246, 30, .3)');
	        gradient.addColorStop(0, '#fff');
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
	            soundWave.fillStyle = '#FFF'; //"#00EBDF";
	            soundWave.arc(x + 1, h + 5, 1, Math.PI * 2, false);
	            soundWave.fill();
	            soundWave.closePath();
            }
        }

        //requestAnimationFrame(drawMeter);
	}

	/**
	 * 画圆
	 * @return {[type]} [description]
	 */
	function drawCircle(){
		var meterWidth = 20,
            meterNum = Math.floor(cw / meterWidth);
       
		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);
        var w = meterWidth;
        var h = Math.PI * 2;
        var x = cw / 2;// (cw - r * 2) / 2;
        var y = soundWave.canvas.height / 2 - 50;//(soundWave.canvas.height - r * 2) - r * 2;
        var rr = 0;
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
			}else{
				strokeColor = '#F72A62';
			}
            
        	soundWave.beginPath();
            soundWave.strokeStyle = strokeColor; //'#F72A62';
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

	}
	
	/**
	 * 画圆和点
	 * @return {[type]} [description]
	 */
	function drawCirclePoint(){
		var meterWidth = 20,
            meterNum = Math.floor(cw / meterWidth);
       
		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);
        var w = meterWidth;
        var h = Math.PI * 2;
        var x = cw / 2;// (cw - r * 2) / 2;
        var y = soundWave.canvas.height / 2 - 50;//(soundWave.canvas.height - r * 2) - r * 2;
        var rr = 0;
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
			}else{
				strokeColor = '#F72A62';
			}
            
        	soundWave.beginPath();
            soundWave.strokeStyle = strokeColor; //'#F72A62';
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

	}
	
	/**
	 * 画圆点
	 * @return {[type]} [description]
	 */
	function drawPoint(){
		var meterWidth = 20,
            meterNum = Math.floor(cw / meterWidth);
       
		var array = new Uint8Array(analyserObj.frequencyBinCount);
        analyserObj.getByteFrequencyData(array);

        var h = Math.PI * 2;
        soundWave.clearRect(0, 0, cw, ch);
        var index = 0;
        var len = array[Math.floor(Math.random() * array.length)]  * array[Math.floor(Math.random() * array.length)] / 3 ;
        for (var i = 0; i < len; i++) {
            index += i;
            var value = array[index] / ch * array[index];
            var r = Math.round(value / 10);
            var x = 100 + Math.random() * (cw - 200);
            var y = 100 + Math.random() * (soundWave.canvas.height - 200);

            var fillColor = '#F72A62';

            if(isMoreColor){
                fillColor = 'rgba('+ Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 + ',' + Math.round(Math.random()) * 200 +', .8)';
            }else{
                fillColor = '#F72A62';
            }

            soundWave.beginPath();
            soundWave.fillStyle = fillColor; //'#F72A62';
            soundWave.arc(x, y, r, h, false);
            soundWave.fill();
            soundWave.closePath();
            
        }
        index++;

        
	}