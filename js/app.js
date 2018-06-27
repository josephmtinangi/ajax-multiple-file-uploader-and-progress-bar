var app = app || {};

(function(o) {
	"use strict";

	// Private methods
	var ajax, getFormData, setProgress, setTime;
	var started_at = new Date().getTime();

	ajax = function(data) {
		var xhr = new XMLHttpRequest(), uploaded;

		xhr.addEventListener('readystatechange', function () {
			if(this.readyState === 4) {
				if(this.status === 200) {
					uploaded = JSON.parse(this.response);

					if(typeof o.options.finished === 'function') {
						o.options.finished(uploaded);
					}
				} else {
					if(typeof o.options.error === 'function') {
						o.options.error();
					}
				}
			}
		});

		xhr.upload.addEventListener('progress', function (event) {
			var percent;


			if(event.lengthComputable === true) {			
				var loaded = event.loaded;
		        var total = event.total;				
				percent = Math.round((event.loaded / event.total) * 100);
				setProgress(percent);
				setTime(event, started_at, loaded, total);
			}
		});

		xhr.open('POST', o.options.processor);
		xhr.send(data);
	};

	getFormData = function (source) {
		var data = new FormData(), i;

		for(i = 0; i < source.length; i++) {
			data.append('file[]', source[i]);
		}
		data.append('ajax', true);

		return data;
	};

	setProgress = function (value) {
		if (o.options.progressBar !== undefined) {
			o.options.progressBar.style.width = value ? value + '%' : 0;
		}

		if(o.options.progressText !== undefined) {
			o.options.progressText.innerText = value ? value + '%' : '';
		}
	};

	setTime = function (event, started_at, loaded, total) {
		// Time Remaining
		// console.log('started_at = ' + started_at);
		var current_time = new Date().getTime();
		// console.log('current_time = ' + current_time);
        var seconds_elapsed =   (current_time - started_at) / 1000;			
        // console.log('seconds_elapsed = ' + seconds_elapsed);
        var bytes_per_second =  seconds_elapsed ? loaded / seconds_elapsed : 0 ;
        // console.log('bytes_per_second = ' + bytes_per_second);
        var Kbytes_per_second = bytes_per_second / 1000 ;
        // console.log('Kbytes_per_second = ' + Kbytes_per_second);
        var remaining_bytes =   total - loaded;
        // console.log('remaining_bytes = ' + remaining_bytes);
        var seconds_remaining = seconds_elapsed ? Math.round(remaining_bytes / bytes_per_second) : 'calculating' ;	
        // console.log('seconds_remaining = ' + seconds_remaining);
		
		if(o.options.secondsRemaining !== undefined) {
			o.options.secondsRemainingText.innerText = 'Time: ' + seconds_remaining ? seconds_remaining + ' seconds remaining' : '';
			o.options.bytes.innerText = 'Speed: ' + Math.round(Kbytes_per_second) + ' KB/s';
		}
	};

	o.uploader = function (options) {
		o.options = options;

		if (o.options.files !== undefined) {
			ajax(getFormData(o.options.files.files));
		}
	}
}(app))