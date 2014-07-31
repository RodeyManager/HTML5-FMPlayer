/**
 * Desc: HTML5 FM播放器, 重在学习 Web Audio Api
 *
 *	=> 创建和加载音频源对象 
 * 
 * Author: Rodey
 * Update-Date: 2014-07-30
 * github: https://github.com/RodeyManager/HTML5-FMPlayer.git
 * blog: www.roadey.com
 * site: www.senuu.com
 */


/**
 * USE:  
 *
 * hamp = new HTML5AudioPlayer([song.url], [canvas], function(buffer, analyser){
		//开始播放
		start(this, buffer);
	});
 *
 */

;(function(){

	'use strict';

	var HTML5AudioPlayer = function(url, canvas, callback){
		this.url = url;
		this.canvas = canvas;
		this.title = song.title;
		this.source = null;
		this.audioContext = null;
		this.forceStop = false;
		this.buffer = null;
		this.playing = false;
		this.callback = callback;
		this.analyser = null;
		this.gainNode = null;
		this.filter = null;
		this.request = null;

		this.FADE_TIME = 1;

		this.sint = null;
		this.sout = null;

		this._init();
	};

	HTML5AudioPlayer.prototype = {

		_init: function(){
			this._fatchAPI();
			this._start();
		},

		_fatchAPI: function(){
			window.hasAudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext);
			window.hasRequestAnimation = (window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
			try {
	            this.audioContext = new AudioContext();
	        } catch (e) {
	            alert('您的浏览器不支持AudioContext！', false);
	            console.log(e);
	        }
		},

		_start: function(){
			var self = this,
				url = this.url;
			if(!self.canvas){
				this.canvas = self.createCanvas();
			}else{
				this.canvas = document.getElementById(this.canvas);
				this.canvas = this.canvas.getContext('2d');
			}
			self._load(url);
		},

		_load: function(url){
			var self = this;
			var audioContext = this.audioContext;
			self.request = new XMLHttpRequest(); //建立一个请求
			//request.abort();
		   	self.request.open('GET', url, true); //配置好请求类型，文件路径等
		   	self.request.responseType = 'arraybuffer'; //配置数据返回类型
		   	// 一旦获取完成，对音频进行进一步操作，比如解码
		   	self.request.onload = function() {
		       	self.buffer = self.request.response;
		       	//console.log(request.response);

		       	audioContext.decodeAudioData(self.request.response, function(buffer) {
		       		self.buffer = buffer;
		       		//console.log(buffer);
	                self._visualize(audioContext, buffer);
	            }, function(e) {
	                console.log(e);
	            });
		   	}

		   	self.request.send();
		},

		_visualize: function(context, buffer){
			var self = this;
			//创建各自实例
			var currentPlayer 	= self.createSource(buffer);

	        self.source 		= currentPlayer.audioBuffer;
	        self.analyser 		= currentPlayer.analyser;
	        self.gainNode 		= currentPlayer.gainNode;
	        self.filter 		= currentPlayer.filter;

   			if(typeof self.callback === 'function'){
        		self.callback(self.source, self.analyser, currentPlayer);
        	}
		},

		createSource: function(buffer){
			var self = this;
			var audioContext = self.audioContext;
			//创建一个gain node
			var gainNode = audioContext.createGainNode ? audioContext.createGainNode() : audioContext.createGain();
			// 创建滤波器
			var filter = audioContext.createBiquadFilter();
			//创建一个音频源
			var audioBufferSouceNode = audioContext.createBufferSource();
			//创建音波源
			var analyser = audioContext.createAnalyser();
			

			audioBufferSouceNode.buffer = buffer || self.buffer;
			gainNode.gain.value = 0.1;

			//将实例与gain node相连
			audioBufferSouceNode.connect(gainNode);
			//将gain node与播放设备连接
			gainNode.connect(audioContext.destination);
			//将audioBuffer与音频
	        audioBufferSouceNode.connect(analyser);
	        analyser.connect(audioContext.destination);
	        // 创建音频混音组
			audioBufferSouceNode.connect(filter);
			filter.connect(audioContext.destination);

			//给属性赋值
			self.source 		= audioBufferSouceNode;
	        self.analyser 		= analyser;
	        self.gainNode 		= gainNode;
	        self.filter 		= filter;

			return {
				audioBuffer: audioBufferSouceNode,
				analyser: analyser,
				gainNode: gainNode,
				filter: filter
			};
		},

		_malize: function(){
			var self = this;
			var duration = seld.source.duration;
			var currTime = self.audioContext.currentTime;
			// 在曲子快要结束时，淡出之
			self.gainNode.gain.linearRampToValueAtTime(1, currTime + duration - self.FADE_TIME);
			self.gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
		},


		/**
		 * 画矩阵
		 * @return {[type]} [description]
		 */
		_drawMeter: function(){
			var self = this;
			var analyserObj = self.analyser;
			var soundWave = self.canvas;

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
		},


		createCanvas: function(width, height){
			var cw = window.innerWidth;
			var ch = window.innerHeight;
			var canvas = document.createElement('canvas');
			canvas.setAttribute('id', 'canvas');
			var ctx = canvas.getContext('2d');
			ctx.canvas.width = width || cw;
			ctx.canvas.height = height || ch - 150;
			return ctx;
		},


		/** ====== PUBLIC ======== **/

		setFilter: function(type, frequency){
			var self = this;
			// 设定低通滤波器
			self.filter.type = type || 'allpass'; // 低通滤波器。请参阅手册
			self.filter.frequency.value = frequency || 5000; // 设定频率为440Hz
			//console.log(self.filter);
		},

		play: function(currTime, flag){
			var self = this;
			
			if (!self.source.start) {
	            self.source.start = self.source.noteOn; 
	        };

	        if(flag){
	        	self.createSource();
	        }

        	self.source.start(currTime || 0);
        	self.playing = true;

		},

		stop: function(currTime){
			var self = this;
			clearInterval(this.sint);
			//var self.source = self.source;
			if (!self.source.stop) {
	            self.source.stop = self.source.noteOff;
	        };
        	self.source.stop(currTime || 0);
        	self.playing = false;
	        /*self.source.onended = function() {

	            console.log('loaded end!');
	        };*/
		},

		setVolum: function(size){
			var self = this;
			//一旦设定完成之后，你就可以通过改变值之后来控制音量了。
			//减少音量
			self.gainNode.gain.value = size;
			self.buffer.gain = size;
		},


	};


	window.HTML5AudioPlayer = HTML5AudioPlayer;
	return HTML5AudioPlayer;


}).call(this);