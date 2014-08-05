
/**
 * Desc: HTML5 FM播放器, 重在学习 Web Audio Api
 *
 *	=> 播放器控制
 * 
 * Author: Rodey
 * Update-Date: 2014-07-30
 * github: https://github.com/RodeyManager/HTML5-FMPlayer.git
 * blog: www.roadey.com
 * site: www.senuu.com
 */


//窗口
var cw = window.innerWidth;
var ch = window.innerHeight;

//当前歌曲
var song = null;
//当前歌曲源
var hamp = null;
var audioContext = null;
var analyserObj = null;
var audioBuffer = null;
//当前歌曲时间
var totalTime = 0;
var currentTime = 0;
//canvas
var soundWave = null;
//歌词相关
var lrcTime = 0;
var lrcString = '暂无歌词';
var ts = 0;
var hs = 0;
var ps = null;
var gint = null;
var gout = null;

//播放控制
var isPlay = false;
var isNext = true;
var isMoreColor = false;
var playerBarMaskerDom_w = 0;
//填充色
var fillColor = '#F72A62'; 
//轮廓色
var strokeColor = '#F72A62'; 

//音量相关
var currentVolum = 80;

//音波定时器
var sint = null;
var sout = null;

//画图相关参数 
var meterNum = 800 / (10 + 2);
var lineStep = 1.6;
var meterWidth = 2,
    meterNum = Math.floor(cw / meterWidth);

//歌曲信息路径
var songsURL = 'data/wo_songs.json';

//音波效果:  drawCircle || drawMeter || drawPoint || drawCirclePoint || 
//			 drawBazire || drawMeterStreamgraph
var eff = 'drawBazire';

//渲染完毕后执行
$(document).ready(function(evt){

	//获取对应DOM元素
	var ctrlConDom = $('#controller-con');
	var avatarDom = $('#avatar');
	var playDom = $('#play');
	var nextDom = $('#next');
	var songNameDom = $('#song-name');
	var playerBarDom = $('#player-bar');
	var playerBarMaskerDom = $('#player-bar-masker');
	var playerBarTipDom = $('#player-bar-tip');
	var headImage = avatarDom.find('img');
	var imageSrc = headImage.attr('default');
	var lrcDom = $('#musicLRC-con');

	//音量控制
	var setVolumBtnDom = $('#volum');
	var setVolumConDom = $('#set-volum-con');
	var volumMaskerDom = $('#volum-masker');
	var volumRangeDom  = $('#volum-range');
	volumRangeDom.val(currentVolum);
	setVolumBtnDom.on('click', showSetVolum);

	//获取canvas
	var soundWaveDom = document.getElementById('sound-wave');
	soundWave = soundWaveDom.getContext('2d');
	soundWave.canvas.width = cw;
	soundWave.canvas.height = ch - 150;

	//初始化样式
	ctrlConDom.width(cw - avatarDom.width() - 60);
	playerBarDom.width(ctrlConDom.width() - 150);
	playerBarMaskerDom_w = playerBarDom.width();

	//窗口改变时触发
	$(window).on('resize', resize);

	//播放按钮
	playDom.on('click', function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		var target = $(evt.currentTarget);

		if(isPlay){
			stopSound();
		}else{
			playSound();
		}

	});

	//下一首按钮
	nextDom.on('click', function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		if(isPlay && !isNext){
			stopSound();
			isNext = true;
		}
		hamp && hamp.request.abort();
		//播放一下首歌曲
		playSound();		
	});

	/**
	 * 初始化加载后开始播放音乐
	 */
	playSound();

	//播放音乐
	function playSound(currentTime){
		//加载进度
		startLoadingStyle();
		
		var self = this;
		//播放开始初始化样式
		startStyle();

		//如果当前正在处于加载状态则直接
		if(!isNext) { return; }
		isNext = false;

		//加载音频
		getSong(songsURL, null, function(res){

			//随机获取歌曲
			song = res.song[Math.floor(Math.random() * res.song.length)];
			//song = res.song[33]; //调式用
			
			//设置标题和头像
			songNameDom.html(song.title);
			headImage.attr('src', song.image);

			hamp = new HTML5AudioPlayer(song.url, 'sound-wave', function(buffer, analyser){
				//开始播放
				start(this, buffer);
			});
		});
		
	}

	/**
	 * 开始播放相关设置
	 * @param  {[type]} hamp   [音频源对象]
	 * @param  {[type]} buffer [音频源数据]
	 * @return {[type]}        [description]
	 */
	function start(hamp, buffer){
		//清楚加载进度
		endLoadingStyle();

		//重置样式
		playDom.css('fill', '#00EBDF');
		playDom.find('use').attr('xlink:href', '#icon-stop');

		//获取当前音频源相关
		audioContext = hamp.audioContext;
		analyserObj = hamp.analyser;
		audioBuffer = buffer;
		//console.log(audioContext)
		
		//获取音频时间相关
		totalTime = audioBuffer.buffer.duration;
		currentTime = audioBuffer.context.currentTime;

		//设置音量
		hamp.setVolum(currentVolum / 100);

		//设置过滤器
		//hamp.setFilter('allpass', 5000);
		//
		//开始播放 
		hamp.play(currentTime, false);
		isPlay = true; //表示已播放
		isNext = false; //表示已加载完毕

		//显示当前播放时间
		showPlayBarTip();

    	//播放歌词
		playLRC();
		
		//播放音波效果
        playAnalyser(eff, 1);
	
	}

	/**
	 * 停止播放 / 播放完成
	 * @return {[type]} [description]
	 */
	function stopSound(){
		//停止音频输出
		//if(isPlay && analyserObj)
		hamp && hamp.stop();

		//情况数据源信息
		audioBuffer = null;
		analyserObj = null;

		//重置不可用状态样式
		isPlay = false;
		isNext = true;
		lrcDom.html('');
		playDom.css('fill', '#00EBDF');
		playDom.find('use').attr('xlink:href', '#icon-play');
		playerBarTipDom.css({ 'left': 0 });
		playerBarMaskerDom.width(0);

		//隐藏当前播放时间
		hidePlayBarTip();

		//清空画布
		soundWave.clearRect(0, 0, cw * 10, ch * 10);
		//移出定时器
		clearInterval(sint);
		clearInterval(gint);
		sint = null;
		gint = null;
		endLoadingStyle();
	
	}

	/**
	 * 播放进度
	 * @return {[type]} [description]
	 */
	function playGress(){
		var pw = 0;
		currentTime = audioBuffer.context.currentTime;
		pw = currentTime / totalTime * playerBarMaskerDom_w;
		playerBarMaskerDom.width(pw);
		playerBarTipDom.css({ 'left': pw - 25 });
		var m = Math.round(currentTime / 60);
		var s = Math.round(currentTime % 60);
		m = m < 10 ? '0' + m : m;
		s = s < 10 ? '0' + s : s;
		playerBarTipDom.html( m + ':' + s );

		if(currentTime >= totalTime){
			clearInterval(sint);
			clearInterval(gint);
			//当前歌曲播放完后自动切换到下一首
			stopSound();
			//延时1秒后播放下一首
			gout = setTimeout(function(){
				playSound();
			}, 1000);
			
		}
	
	}

	/**
	 * 解析并播放歌词
	 * @return {[type]} [description]
	 */
	function playLRC(){
		// 获取并解析歌词
		getLRC(song.lrc, {}, function(res){
			//console.log(res)
			lrcString = res ? res : '暂无歌词';
			
			lrcTime = res ? getLrcTime(res) : 0;

			lrcObj = formateLrc(res);
			lrcDom.html('');
			showLRC(lrcObj);
			//console.log(lrcObj)
			
			//获取歌词dom
			ps = lrcDom.find('p');
			hs = $(ps.get(0)).height();
        	ts = hs / lrcTime;
        	
        	//console.log(totalTime)
        	//console.log(lrcTime)

        	//播放歌词
			gint = setInterval(function(){
				var cuTime = Math.round(currentTime);
	        	var cuIndex = 0;
	        	ps.attr({'style': ''});

	        	for(var i = 0; i < ps.length; ++i){
	        		var t = parseInt(ps[i].getAttribute('data-time'));
	        		
	        		if(cuTime >= t){
	        			cuIndex = i;
	        			//console.log('t: ' + t)
	        		}else{
	        			continue;
	        		}
	        	}
	        	ts = hs * cuIndex;
	        	//console.log(cuIndex)
	        	ps.eq(cuIndex).css({ 'color': '#FF0A54', 'font-size': '18px' });
	        	lrcDom.css({
	        		'-webkit-transform': 'translateY('+ -(ts) +'px)',
	        		'-moz-transform': 'translateY('+ -(ts) +'px)',
	        		'-ms-transform': 'translateY('+ -(ts) +'px)',
	        		'-o-transform': 'translateY('+ -(ts) +'px)',
	        		'transform': 'translateY('+ -(ts) +'px)'
	        	});

			}, 1000);
			
		}, function(e){
			lrcDom.html('<p style="opacity:.5;">暂无歌词</p>');
		});

	}

	/**
	 * 播放音波效果
	 * @param  {[type]} eff  [效果函数名称]
	 * @param  {[type]} time [定时器时间]
	 * @return {[type]}      [description]
	 */
	function playAnalyser(eff, time){
		sint = setInterval(function(){
			playGress();
			if(!sint){
				return false;
			}
			(window.effectsObject && window.effectsObject[eff]) && window.effectsObject[eff]();
        }, time || 10);
	
	}

	/**
	 * 开始加载进度
	 * @return {[type]} [description]
	 */
	
	function startLoadingStyle(){
		//清空画布
		soundWave.clearRect(0, 0, cw * 10, ch * 10);
		//移出定时器
		clearInterval(sint);
		clearInterval(gint);

		var num = 5;
		var i = 0;
		var r = 5;
		var step = 50;
		var index = 0;
		var center = {
			x: cw * .5 - (5 * 50) * .5 + 25,
			y: (ch - 150) * .5
		};

		sint = setInterval(function(){

			if(index > num - 1){
				index = 0;
				//清空画布
				soundWave.clearRect(0, 0, cw * 10, ch * 10);
				return;
			}
			var color = 'rgba(6, 140, 118, ' + (index / 10 + .5) + ')';
			soundWave.restore();
			soundWave.beginPath();
			soundWave.fillStyle = color;
			soundWave.arc(center.x + (index * 50), center.y, r, Math.PI * 2, false );
			soundWave.fill();
			soundWave.closePath();

			index++;
		}, 120);
	
	}
	/**
	 * 结束加载进度
	 * @return {[type]} [description]
	 */
	function endLoadingStyle(){
		//清空画布
		soundWave.clearRect(0, 0, cw * 10, ch * 10);
		//移出定时器
		clearInterval(sint);
		clearInterval(gint);
	
	}
	/**
	 * 显示时间游标
	 * @return {[type]} [description]
	 */
	function showPlayBarTip(){
		playerBarTipDom.css({
			'left': '0px',
			'display': 'block'
		});
	
	}
	/**
	 * 隐藏时间游标
	 * @return {[type]} [description]
	 */
	function hidePlayBarTip(){
		playerBarTipDom.css({
			'left': '0px',
			'display': 'none'
		});
	
	}

	/**
	 * 弹出音量设置
	 */
	function showSetVolum(evt){
		evt.preventDefault();
		evt.stopPropagation();
		var target = $(evt.currentTarget);
		if(target.attr('id') == 'volum'){
			target.css({ 'backgroundColor': '#f0f0f0' });
			setVolumConDom.show();
			volumRangeDom.on('change', volumRangeChange);
			$(window).on('click', hideSetVolum);
		};
	
	}
	function volumRangeChange(evt){
		var value = parseInt(evt.currentTarget.value);
		currentVolum = value;
		hamp && hamp.setVolum(currentVolum / 100);
	
	}

	/**
	 * 隐藏音量设置
	 */
	function hideSetVolum(evt){
		var target = $(evt.target);
		if(target.hasClass('svg-volum') 
			|| target.attr('id') == 'volum' 
			|| target.hasClass('set-volum-con')
			|| target.hasClass('volum-masker')
			|| target.attr('id') == 'volum-range'
			|| target.attr('id') == 'play'
			|| target.attr('id') == 'next'){ return false; }
		else {
			setVolumConDom.hide();
			setVolumBtnDom.css({ 'backgroundColor': 'white' });
		}	
	
	}

	/**
	 * 初始化样式
	 * @return {[type]} [description]
	 */
	function startStyle(){
		playDom.css('fill', '#DDD');
		playDom.find('use').attr('xlink:href', '#icon-play');
		soundWave.clearRect(0, 0, cw * 10, ch * 10);
		lrcDom.css({
    		'-webkit-transform': 'translateY(0px)',
    		'-moz-transform': 'translateY(0px)',
    		'-ms-transform': 'translateY(0px)',
    		'-o-transform': 'translateY(0px)',
    		'transform': 'translateY(0px)'
    	});
	
	}

	/**
	 * 获取歌词显示时间
	 * @param  {[type]} str [时间游标]
	 * @return {[type]}     [description]
	 */
	function getLrcTime(str){
		if('' == str || !str) return 0;
		var ma = str.match(/(\d{2}:\d{2}.*\d{0,2})/gi);
		ma = ma[ma.length - 1].replace(/\[*\]*/gi, '');
		var times = 0;
		if(ma.length){			
			ma = ma.split(/[:|\.]+/gi);
			if(ma[0]){
				times = parseInt(ma[0]) * 60 * 1000;
			}
			if(ma[1]){
				times +=  + parseInt(ma[1]) * 60;
			}
			if(ma[2]){
				times += parseInt(ma[2]);
			}
		}

		return times;
	}

	/**
	 * 格式化歌词
	 * @param  {[type]} lrc [歌词信息]
	 * @return {[type]}     [description]
	 */
	function formateLrc(lrc){
		var times = [];
		var gcs = [];
		var arrs = [];
		var ma = lrc.split(/[\n\r\t]+/gi);
		var ti = '';
		var ar = '';
		var al = '';

		if(ma.length){

			for(var i = 0; i < ma.length; i++){
				if('' == ma[i]) continue;
				var t = ma[i].match(/\d{2}:\d{2}.\d{2}/gi);
				var g = '';
				if(t){
					var l = t.length;
					//console.log(t)
					//歌词中有可能是这样的写法：
					// 	倒序-->：[03:30.17][03:00.86][02:20.86][01:02.02]你就像天使一样
					//	正序-->：[01:02.02][02:20.86][03:00.86][03:30.17]你就像天使一样
					//如果时间是倒序的，则迭代处理
					//如果时间是正序的，则递增处理
					//这种方法兼容每一行前面只有一个时间表 
					/**
					 *
					 * 这里已经注释掉了排序的判断，因为后面直接对数组中
					 * 的每一个元素对象的id值进行排序。
					 * （此处将时间作为数据元素对象的id值）
					 * 	gcs.push({ 'id': time, 'gc': g});
						times.push({ 'id': time, 'time': time});
					 * 
					 */
					
					//if(getLrcTime(t[0]) > getLrcTime(t[l -1])){
					
						for(var j = l - 1; j >= 0; --j){
							g = ma[i].replace(/(\[\d{2}:\d{2}.\d{2}\]\s*)*/gi, '');
							var ms = t[j].split(/[:|\.]+/gi);
							var time = Math.round( (parseInt(ms[0]) * 60) + parseInt(ms[1]) + (parseInt(ms[2]) / 1000) );
							gcs.push({ 'id': time, 'gc': g});
							times.push({ 'id': time, 'time': time});
							//console.log(t[j])
						}
					// }else{
					// 	for(var j = 0; j < l; ++j){
					// 		g = ma[i].replace(/(\[\d{2}:\d{2}.\d{2}\]\s*)*/gi, '');
					// 		var ms = t[j].split(/[:|\.]+/gi);
					// 		var time = Math.round( (parseInt(ms[0]) * 60) + parseInt(ms[1]) + (parseInt(ms[2]) / 1000) );
					// 		gcs.push({ 'id': time, 'gc': g});
					// 		times.push({ 'id': time, 'time': time});
					// 	}
					// }
				}

				//截取标题 作者等相关 
				if(ma[i].match(/^\[ti:([\.\s\S])*\]$/gi)){
					ti = (ma[i].match(/^\[ti:([\.\s\S])*\]$/gi))[0];
					ti = ti.replace(/(\[|\]|ti:)*/gi, '');
				}
				if(ma[i].match(/^\[ar:([\.\s\S])*\]$/gi)){
					ar = (ma[i].match(/^\[ar:([\.\s\S])*\]$/gi))[0];
					ar = ar.replace(/(\[|\]|ar:)*/gi, '');
				}
				if(ma[i].match(/^\[al:([\.\s\S])*\]$/gi)){
					al = (ma[i].match(/^\[al:([\.\s\S])*\]$/gi))[0];
					al = al.replace(/(\[|\]|al:)*/gi, '');
				}	
			}

		}


		//console.log({ times: times, gcs: gcs, ti: ti, ar: ar, al: al})
		return { times: times, gcs: gcs, ti: ti, ar: ar, al: al};
	
	}
	
	/**
	 * 创建歌词显示
	 * @param  {[type]} lrcObj [对歌词信息格式化后的对象]
	 * @return {[type]}        [description]
	 */
	function showLRC(lrcObj){
		var i = 0;
		var l = lrcObj.times.length;
		var times = lrcObj.times;
		var gcs = lrcObj.gcs;
		var html = [];

		//对歌词前的游标重新排序
		times = times.sort(function(a, b){
			return a.id - b.id;
		});
		gcs = gcs.sort(function(a, b){
			return a.id - b.id;
		});

		//歌词头信息相关
		if(lrcObj.ti != ''){
			html.push('<p data-time="0">'+ lrcObj.ti +'</p>');
		}
		if(lrcObj.ar != ''){
			html.push('<p data-time="3">'+ lrcObj.ar +'</p>');
		}
		if(lrcObj.al != ''){
			html.push('<p data-time="6">'+ lrcObj.al +'</p>');
		}

		//创建歌词显示元素
		for(; i < l; ++i){
			var time = times[i].time;
			var gc = gcs[i].gc;
			html.push('<p data-time="'+ time +'">'+ gc +'</p>');
		}
		lrcDom.html(html.join(''));
	
	}
	
	/**
	 * 获取对应的歌词
	 * @param  {[type]} lrcURL [歌词地址]
	 * @param  {[type]} su     [成功后回调]
	 * @param  {[type]} fail   [失败后回调]
	 * @return {[type]}        [description]
	 */
	function getLRC(lrcURL, postData, su, fail){
	
		$.ajax({
			url: lrcURL,
			data: postData || {},
			type: 'get',
			dataType: 'html',
			success: function(res){
				res = res.replace(/\t\n\r/gi, '<br >');
				if(typeof su === 'function') su(res);
			},
			error: function(e){
				console.log(e);
				if(typeof fail === 'function') fail(e);
			}
		});
		
	}

	/**
	 * 获取歌曲地址
	 * @param  {[type]} url      [歌曲信息地址]
	 * @param  {[type]} postData [参数]
	 * @param  {[type]} su       [成功后回调]
	 * @param  {[type]} fail     [失败后回调]
	 * @return {[type]}          [description]
	 */
	function getSong(url, postData, su, fail){
		$.ajax({
			url: url || 'data/songs.json',
			data: postData || {},
			type: 'get',
			dataType: 'json',
			success: function(res){
				//var song = res.song[0];
				if(typeof su === 'function') su(res);
			},
			error: function(errType, xhr){
				console.log(errType);
				console.log(xhr);
				if(typeof fail === 'function') fail();
			}
		});
	
	}

	/**
	 * 窗口改变时 重置元素样式
	 * @return {[type]} [description]
	 */
	function resize(){
		cw = window.innerWidth;
		ch = window.innerHeight;
		soundWave.canvas.width = cw;
		soundWave.canvas.height = ch - 150;
		ctrlConDom.width(cw - avatarDom.width() - 60);
		playerBarDom.width(ctrlConDom.width() - 150);
		playerBarMaskerDom_w = playerBarDom.width();

		meterNum = Math.floor(cw / meterWidth)
	
	}



});// End Ready





