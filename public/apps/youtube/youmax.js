(function ($) {
	/*var DateDiff = {

		inDays: function(d1, d2) {
			var t2 = d2.getTime();
			var t1 = d1.getTime();

			return parseInt((t2-t1)/(24*3600*1000));
		},

		inWeeks: function(d1, d2) {
			var t2 = d2.getTime();
			var t1 = d1.getTime();

			return parseInt((t2-t1)/(24*3600*1000*7));
		},

		inMonths: function(d1, d2) {
			var d1Y = d1.getFullYear();
			var d2Y = d2.getFullYear();
			var d1M = d1.getMonth();
			var d2M = d2.getMonth();

			return (d2M+12*d2Y)-(d1M+12*d1Y);
		},

		inYears: function(d1, d2) {
			return d2.getFullYear()-d1.getFullYear();
		}
	},*/

	var secondsToTime = function(duration) {
		if(null==duration||duration==""||duration=="undefined")
			return "?";

		var minutes = Math.floor(duration/60);
		//alert(minutes);
		
		var seconds = duration%60;

		if(seconds<10)
			seconds = "0"+seconds;
			
		var time = minutes+":"+seconds;
		return time;
		//alert()
		
	},
	
		//utility function to display time
	convertDuration = function(videoDuration) {
		
		
		var d = videoDuration.replace('PT','');
		var hours = d.match(/[0-9]+H/);
		var minutes = d.match(/[0-9]+M/);
		var seconds = d.match(/[0-9]+S/);
		
		if(hours)
		{
			hours = hours.toString().replace('H','');
		}
		else
			hours = '';
		if(minutes)
		{
			minutes = minutes.toString().replace('M','');
			if(hours != '')
			{
				if(minutes.length == 1)
					minutes = '0' + minutes;
				minutes = ':' + minutes;
			}
		}
		else
		{
			if(hours != '')
				minutes = '00';
			else
				minutes = '';
			if(hours != '')
				minutes = ':' + minutes;
		}
		if(seconds)
		{
			seconds = seconds.toString().replace('S','');
			if(minutes != '')
			{
				if(seconds.length == 1)
					seconds = '0' + seconds;
				seconds = ':' + seconds;
			}
		}
		else
		{
			seconds = ':00';
		}
		
		var returnDuration = hours + minutes + seconds;
		
		if(returnDuration == "0")
			returnDuration = "Directo";
		return returnDuration;
		
		/*var duration,returnDuration;
		videoDuration = videoDuration.replace('PT','').replace('S','').replace('M',':').replace('H',':');	
		
		//TODO: fix some duration settings
		//console.log('videoDuration-'+videoDuration);
		
		var videoDurationSplit = videoDuration.split(':');
		returnDuration = videoDurationSplit[0];
		for(var i=1; i<videoDurationSplit.length; i++) {
			duration = videoDurationSplit[i];
			////console.log('duration-'+duration);
			if(duration=="") {
				returnDuration+=":00";
			} else {
				duration = parseInt(duration,10);
				////console.log('duration else -'+duration)
				if(duration<10) {
					returnDuration+=":0"+duration;
				} else {
					returnDuration+=":"+duration;
				}
			}
		}
		if(videoDurationSplit.length==1) {
			returnDuration="0:"+returnDuration;
		}
		
		if(returnDuration == "00:00")
			returnDuration = "Directo";
		return returnDuration;*/
		
	},


	getDateDiff = function(timestamp) {
		
		
		if(null==timestamp||timestamp==""||timestamp=="undefined")
			return "?";
		var now = moment();
		var then = moment(timestamp.replace('T',''));

		return '<i class="fa fa-clock-o" aria-hidden="true"></i> ' + now.from(then, true)/*.replace('in ','').replace('a ', 'one ')*/;
		/*var splitDate=((timestamp.toString().split('T'))[0]).split('-');
		var d1 = new Date();
		
		var d1Y = d1.getFullYear();
        var d2Y = parseInt(splitDate[0],10);
        var d1M = d1.getMonth();
        var d2M = parseInt(splitDate[1],10);

        var diffInMonths = (d1M+12*d1Y)-(d2M+12*d2Y);
		if(diffInMonths<=1)
			return "1 month";
		else if(diffInMonths<12)
			return  diffInMonths+" months";
		
		var diffInYears = Math.floor(diffInMonths/12);
		
		if(diffInYears<=1)
			return "1 year";
		else if(diffInYears<12)
			return  diffInYears+" years";*/
		
	},
	
	getReadableNumber = function(number) {
		if(null==number||number==""||number=="undefined")
			return "?";
			
		number=number.toString();
		var readableNumber = '';
		var count=0;
		for(var k=number.length; k>=0;k--) {
			readableNumber+=number.charAt(k);
			if(count==3&&k>0) {
				count=1;
				readableNumber+=',';
			} else {
				count++;
			}
		}
		return readableNumber.split("").reverse().join("");
	},
	
		
	loadYoumax = function() {	

		youmaxWidgetWidth = $(this).width();
		
		$(this).append('<div id="youmax-header"><div id="youmax-stat-holder"></div></div>');

		//$('#youmax').append('<div id="youmax-tabs"></div>');
		
		$(this).append('<div id="youmax-tabs"><span id="featured_" class="youmax-tab">Featured</span><span id="uploads_" class="youmax-tab">Uploads</span><span id="playlists_" class="youmax-tab">Playlists</span></div>');

		
		$(this).append('<div id="youmax-encloser"><iframe id="youmax-video" width="'+this.youmax_global_options.deviceWidth+'" height="'+this.youmax_global_options.deviceHeight+'" src="" frameborder="0" allowfullscreen></iframe><div id="youmax-video-list-div"></div><div id="youmax-load-more-div">Load More</div></div>');
		
		$(this).find('#youmax-video').hide();
		
	},
	
	//get channel Id if channel URL is of the form ....../user/Adele
	getChannelId = function(apiUrl) {
		//console.log('inside getChannelId');
		//console.log('apiUrl-'+apiUrl);
		//showLoader();
		var self = this;
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { 
				self.youmax_global_options.youmaxChannelId = response.items[0].id
				getChannelDetails.call(self, self.youmax_global_options.youmaxChannelId);
			},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},

	
	getChannelDetails = function(channelId) {
	
		//var apiProfileURL = "http://gdata.youtube.com/feeds/api/users/"+youmaxUser+"?v=2&alt=json";
		var apiProfileURL = "https://www.googleapis.com/youtube/v3/channels?part=brandingSettings%2Csnippet%2Cstatistics%2CcontentDetails&id="+channelId+"&key="+this.youmax_global_options.apiKey;
		var self = this;
		$.ajax({
			url: apiProfileURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { showInfo.call(self, response);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});		

	},
	
	
	setHeader = function(xhr) {
		if(xhr && xhr.overrideMimeType) {
			xhr.overrideMimeType("application/j-son;charset=UTF-8");
		}
	},
	
	showLoader = function() {
		this.youmax_global_options.youmaxItemCount = 0;
		$(this).find('#youmax-video-list-div').empty();
		$(this).find('#youmax-video').hide();
		$(this).find('#youmax-video').attr('src','');
		$(this).find('#youmax-video-list-div').append('<div style="text-align:center; height:200px; font:14px Calibri;"><br><br><br><br><br><br><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
	},

	showInfo = function(response) {
		console.log('showInfo');
		console.log(response);

		var channelData = response.items[0];
		var channelId = channelData.id;
		var channelName = channelData.snippet.title;
		var channelPic = channelData.snippet.thumbnails.default.url;
		var channelSubscribers = channelData.statistics.subscriberCount;
		var channelViews = channelData.statistics.viewCount;
		var channelDesc = "";
		var channelUploadsPlaylistId = channelData.contentDetails.relatedPlaylists.uploads;
		var banner = channelData.brandingSettings.image.bannerImageUrl;
		
		
		$(this).find('#youmax-header').append('<img id="youmax-header-logo" src="'+channelPic+'"/>'+channelName);
		$(this).find('#youmax-header').css("background-image", 'url(' + banner + ')');
		
		$(this).find('#youmax-header').append('&nbsp;&nbsp;&nbsp;&nbsp;<div class="youmax-subscribe"><div class="g-ytsubscribe" data-channelid="'+channelId+'" data-layout="default" data-count="default"></div></div>');
		
		$(this).find('#youmax-stat-holder').append('<div class="youmax-stat">'+channelSubscribers+'<br/> subscribers </div><div class="youmax-stat">'+channelViews+'<br/>video views</div>');
		
		$(this).find('#youmax-stat-holder').append('<div class="youmax-stat"><span class="youmax-stat-count">'+getReadableNumber(channelViews)+'</span><br/> video views </div><div class="youmax-stat"><span class="youmax-stat-count">'+getReadableNumber(channelSubscribers)+'</span><br/>subscribers</div>');
		
		//$(this).find('#youmax-header').append('About '+channelName+'<br/>'+channelDesc);
		
		if(this.youmax_global_options.showSubscribeButton)
			renderSubscribeButton.call(this);
		
		$(this).find('#youmax-tabs').find('span[id^=uploads_]').attr('id','uploads_'+channelUploadsPlaylistId);
		
		youmaxDefaultTab = this.youmax_global_options.youmaxDefaultTab;
		
		if(typeof youmaxDefaultTab === 'undefined'||null==youmaxDefaultTab||youmaxDefaultTab==""||youmaxDefaultTab=="undefined") {
			$(this).find("#youmax-tabs span[id^=featured_]").click();
		} else if(youmaxDefaultTab.toUpperCase()=='UPLOADS'||youmaxDefaultTab.toUpperCase()=='UPLOAD') {
			$(this).find("#youmax-tabs span[id^=uploads_]").click();
		} else if(youmaxDefaultTab.toUpperCase()=='PLAYLISTS'||youmaxDefaultTab.toUpperCase()=='PLAYLIST') {
			$(this).find("#youmax-tabs span[id^=playlists_]").click();
		} else if(youmaxDefaultTab.toUpperCase()=='FEATURED'||youmaxDefaultTab.toUpperCase()=='FEATURED') {
			$(this).find("#youmax-tabs span[id^=featured_]").click();
		}
		if(this.youmax_global_options.afterLoad)
			this.youmax_global_options.afterLoad(response);
	},

	renderSubscribeButton = function() {
		$.ajaxSetup({
		  cache: true
		});
		
		$.getScript("https://apis.google.com/js/platform.js")
		.done(function( script, textStatus ) {
			//alert( textStatus );
		})
		.fail(function( jqxhr, settings, exception ) {
			//alert( "Triggered ajaxError handler." );
		});		
	},


	showPlaylists = function(response,loadMoreFlag) {
		console.log(response);
		
		if(!loadMoreFlag) {
			$(this).find('#youmax-video-list-div').empty();
		}

		var nextPageToken = response.nextPageToken;
		var $youmaxLoadMoreDiv = $(this).find('#youmax-load-more-div');
		//console.log('nextPageToken-'+nextPageToken);
		
		if(null!=nextPageToken && nextPageToken!="undefined" && nextPageToken!="") {
			$youmaxLoadMoreDiv.data('nextpagetoken',nextPageToken);
		} else {
			$youmaxLoadMoreDiv.data('nextpagetoken','');
		}
		
		youmaxColumns = this.youmax_global_options.youmaxColumns;
		
		var playlistArray = response.items;
		var playlistIdArray = [];
		var zeroPlaylistCompensation = 0;
		for(var i=0; i<playlistArray.length; i++) {
			playListId = playlistArray[i].id;
			playlistSize = playlistArray[i].contentDetails.itemCount;
			if(playlistSize<=0){
				zeroPlaylistCompensation++;
				continue;
			}				
			playlistIdArray.push(playListId);
			playlistTitle = playlistArray[i].snippet.title;
			playlistUploaded = playlistArray[i].snippet.publishedAt;
			playlistThumbnail = playlistArray[i].snippet.thumbnails.medium.url;
			//playlistThumbnail = playlistThumbnail.replace("hqdefault","mqdefault");
			if((i+this.youmax_global_options.youmaxItemCount-zeroPlaylistCompensation)%youmaxColumns!=0)
				$(this).find('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+playListId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+playlistThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+playlistThumbnail+'\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-'+playListId+'"><span class="youmax-playlist-video-count"><b>'+playlistSize+'</b><br/>VIDEOS</span></div></div><span class="youmax-video-list-title">'+playlistTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(playlistUploaded)+' ago</span></div>');
			else
				$(this).find('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%; clear:both;" id="'+playListId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+playlistThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+playlistThumbnail+'\')"><div class="youmax-playlist-sidebar" id="youmax-playlist-sidebar-'+playListId+'"><span class="youmax-playlist-video-count"><b>'+playlistSize+'</b><br/>VIDEOS</span></div></div><span class="youmax-video-list-title">'+playlistTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(playlistUploaded)+' ago</span></div>');
				
		}
		
		this.youmax_global_options.youmaxItemCount+=playlistArray.length-zeroPlaylistCompensation;
			//console.log(playlistIdArray);
		var self = this;
		$(this).find('.youmax-video-tnail-box').click(function(e) {
			//alert(this.id);
			showLoader.call(self);
			playlistTitle = $(this).find(".youmax-video-list-title").text();
			getUploadsPlayList.call(self, "play_"+this.id,playlistTitle);
			if(self.youmax_global_options.onclickPlayListCallback)
			{
				self.youmax_global_options.onclickPlayListCallback(e, this.id);
			}
			else
				$.ajax({
					url: "https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&id=" + this.id + "&key="+self.youmax_global_options.apiKey,
					dataType:"jsonp",
					success: function(data1){
						if(data1.items[0])
						{
							$.ajax({
								url: "https://www.googleapis.com/youtube/v3/playlistItems?part=id%2Csnippet&playlistId="+data1.items[0].id+"&key="+self.youmax_global_options.apiKey,
								dataType:"jsonp",
								success: function(data2){
									if(data2.items[0])
									{
										$(self).find('#youmax-video').attr('src', 'https://www.youtube.com/embed/' + data2.items[0].id + '?list=' + data1.items[0].id);
										$(self).find('#youmax-video').show();
									}
								}
							});
						}
					}
				});
			//getPlaylistVideos(this.id);
		});
		if(this.youmax_global_options.onmouseupPlayListCallback)
		{
			$(this).find('.youmax-video-tnail-box').mouseup(function(e) {
				self.youmax_global_options.onmouseupPlayListCallback(e, this.id);
			});
		}
		/* not sure why this is needed
		var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
		youmaxTnailWidth=youmaxTnailWidth.substring(0,youmaxTnailWidth.indexOf("px"));
		var youmaxTnailHeight = youmaxTnailWidth/youtubeMqdefaultAspectRatio;
		//$('html > head').append('<style>.youmax-video-tnail{height:'+youmaxTnailHeight+'px;}</style>');	
		$('div.youmax-video-tnail').css({'height':youmaxTnailHeight+'px'});
		*/
		
		
		/*
		if(youmaxTnailHeight<130) {
			maxTopVideos = 3;
			$('html > head').append('<style>.youmax-playlist-video-count{margin: 10%;margin-top: 15%;}.youmax-playlist-sidebar-video{margin: 8% auto;}</style>');	
			//$('div.youmax-playlist-video-count').css({'margin':'10%','margin-top':'15%'});
			//$('div.youmax-playlist-sidebar-video').css({'margin':'8% auto'});
		} else {
			maxTopVideos = 4;
		}*/
		
		resetLoadMoreButton.call(this);
		
		//console.log(youmaxTnailWidth);
		//console.log(youmaxTnailHeight);

		//getTopVideosFromPlaylist(playlistIdArray,maxTopVideos);
	},

	showUploads = function(response,playlistTitle,loadMoreFlag) {
		console.log(response);

		if(!loadMoreFlag) {
			$(this).find('#youmax-video-list-div').empty();
			var self = this;
			if(playlistTitle) {
				$(this).find('.youmax-tab-hover').removeClass('youmax-tab-hover');
				var $lbl = $('<span style="cursor: pointer;" class="youmax-showing-title youmax-tab-hover" id="uploadsplaylist_'+response.items[0].snippet.playlistId+'" style="max-width:100%;"><span class="youmax-showing">&nbsp;&nbsp;Showing playlist: </span>'+playlistTitle+'</span><br/>');
				
				if(this.youmax_global_options.onmouseupPlayListCallback)
					$lbl.mouseup(function(e){
						self.youmax_global_options.onmouseupPlayListCallback(e, this.id.replace('uploadsplaylist_',''));
					});
				if(this.youmax_global_options.onclickPlayListCallback)
					$lbl.click(function(e){
						self.youmax_global_options.onclickPlayListCallback(e, this.id.replace('uploadsplaylist_',''));
					});
				$(this).find('#youmax-video-list-div').append($lbl);
			}
		}
		
		var nextPageToken = response.nextPageToken;
		var $youmaxLoadMoreDiv = $(this).find('#youmax-load-more-div');
		//console.log('nextPageToken-'+nextPageToken);
		
		youmaxColumns = this.youmax_global_options.youmaxColumns;
		
		if(null!=nextPageToken && nextPageToken!="undefined" && nextPageToken!="") {
			$youmaxLoadMoreDiv.data('nextpagetoken',nextPageToken);
		} else {
			$youmaxLoadMoreDiv.data('nextpagetoken','');
		}
		
		var uploadsArray = response.items;
		var videoIdArray = [];
		var j = $(this).find('.youmax-video-tnail-box').length;
		for(var i=0; i<uploadsArray.length; i++) {
			if(uploadsArray[i].id.kind && uploadsArray[i].id.kind != "youtube#video")
				continue;
			videoId = uploadsArray[i].id.videoId||uploadsArray[i].snippet.resourceId.videoId;
			videoTitle = uploadsArray[i].snippet.title;
			//videoViewCount = uploadsArray[i].snippet.viewCount;
			//videoDuration = uploadsArray[i].snippet.duration;				
			videoUploaded = uploadsArray[i].snippet.publishedAt;
			videoThumbnail = uploadsArray[i].snippet.thumbnails.medium.url;
			//videoThumbnail = videoThumbnail.replace("hqdefault","mqdefault");
			var escapedTitle = htmlEntities(videoTitle);
			videoIdArray.push(videoId);
			
			//$('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration">'+secondsToTime(videoDuration)+'</div></div><span class="youmax-video-list-title">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getReadableNumber(videoViewCount)+' views | '+getDateDiff(videoUploaded)+' ago</span></div>');

								
			if((j+this.youmax_global_options.youmaxItemCount)%youmaxColumns!=0)
				$(this).find('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration"></div></div><span class="youmax-video-list-title" title="'+escapedTitle+'">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span></div>');
			else
				$(this).find('#youmax-video-list-div').append('<div class="youmax-video-tnail-box" style="width:'+((100/youmaxColumns)-4)+'%; clear:both;" id="'+videoId+'"><div class="youmax-video-tnail" style="filter: progid:DXImageTransform.Microsoft.AlphaImageLoader( src=\''+videoThumbnail+'\', sizingMethod=\'scale\'); background-image:url(\''+videoThumbnail+'\')"><div class="youmax-duration"></div></div><span class="youmax-video-list-title" title="'+escapedTitle+'">'+videoTitle+'</span><br/><span class="youmax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span></div>');
			j++;
		}
		
		this.youmax_global_options.youmaxItemCount+=uploadsArray.length;
		var self = this;
		$(this).find('.youmax-video-tnail-box').click(function(e){
			if(self.youmax_global_options.onclickCallback){
				self.youmax_global_options.onclickCallback(e, this.id);
			}
			else {
				$(self).find('#youmax-video').attr('src','http://www.youtube.com/embed/'+this.id);
				$(self).find('#youmax-video').show();
				/*??*///$(self).find('html,body').animate({scrollTop: $("#youmax-header").offset().top},'slow');
			}
		});
		if(this.youmax_global_options.onmouseupCallback)
		{
			$(this).find('.youmax-video-tnail-box').unbind('mouseup');
			$(this).find('.youmax-video-tnail-box').mouseup(function(e) {
				self.youmax_global_options.onmouseupCallback(e, this.id);
			});
		}
		// not sure why this is needed
		/*var youmaxTnailWidth = $('.youmax-video-tnail').css('width');
		youmaxTnailWidth=youmaxTnailWidth.substring(0,youmaxTnailWidth.indexOf("px"));
		var youmaxTnailHeight = youmaxTnailWidth/youmax_global_options.youtubeMqdefaultAspectRatio;
		//$('html > head').append('<style>.youmax-video-tnail{height:'+youmaxTnailHeight+'px;}</style>');	
		$('div.youmax-video-tnail').css({'height':youmaxTnailHeight+'px'});*/
		

		getVideoStats.call(this, videoIdArray);
		resetLoadMoreButton.call(this);

	},


	//get video stats using Youtube API
	getVideoStats = function(videoIdList) {
		//console.log('inside getVideoStats');
		//console.log(videoIdList);
		//showLoader();
		
		apiVideoStatURL = "https://www.googleapis.com/youtube/v3/videos?part=statistics%2CcontentDetails&id="+videoIdList+"&key="+this.youmax_global_options.apiKey;
		$.ajax({
			url: apiVideoStatURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { displayVideoStats(response);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},

	//display video statistics
	displayVideoStats = function(response) {
		//console.log(response);
		
		var videoArray = response.items;
		var $videoThumbnail;

		for(var i=0; i<videoArray.length; i++) {
			videoId = videoArray[i].id;
			videoViewCount = videoArray[i].statistics.viewCount;
			videoViewCount = getReadableNumber(videoViewCount);
			videoDuration = videoArray[i].contentDetails.duration;
			//console.log('videoDuration-'+videoDuration);
			
			videoDuration = convertDuration(videoDuration);
			videoDefinition = videoArray[i].contentDetails.definition.toUpperCase();
			$videoThumbnail = $('#youmax-video-list-div #'+videoId);
			$videoThumbnail.find('.youmax-video-list-views').prepend('<i class="fa fa-eye" aria-hidden="true"></i>' +videoViewCount + ' views | ');
			$videoThumbnail.find('.youmax-duration').append(videoDuration);
			if(videoDuration == "Directo")
				$videoThumbnail.find('.youmax-duration').addClass('direct');
			//$videoThumbnail.append('<div class="youmax-definition">'+videoDefinition+'</div>');
			
		}
	},

		
	getUploads = function(youmaxTabId,playlistTitle,nextPageToken) {
		//showLoader();
		//var apiUploadURL = "http://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/uploads/?v=2&alt=jsonc&max-results=50";
		
		var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		if(null!=nextPageToken) {
			pageTokenUrl = "&pageToken="+nextPageToken;
			loadMoreFlag = true;
		}

		var uploadsPlaylistId = youmaxTabId.substring(youmaxTabId.indexOf('_')+1);
		//var apiUploadURL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId="+uploadsPlaylistId+"&maxResults="+this.youmax_global_options.maxResults+pageTokenUrl+"&key="+this.youmax_global_options.apiKey;
		var apiUploadURL = "https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&channelId=" + this.youmax_global_options.youmaxChannelId + "&maxResults="+this.youmax_global_options.maxResults+pageTokenUrl+"&order=date&key=" + this.youmax_global_options.apiKey;

		console.log('apiUploadURL-'+apiUploadURL);
		
		var self = this;
		$.ajax({
			url: apiUploadURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { showUploads.call(self,response,playlistTitle,loadMoreFlag);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	
	getUploadsPlayList = function(youmaxTabId,playlistTitle,nextPageToken) {
		//showLoader();
		//var apiUploadURL = "http://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/uploads/?v=2&alt=jsonc&max-results=50";
		
		var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		if(null!=nextPageToken) {
			pageTokenUrl = "&pageToken="+nextPageToken;
			loadMoreFlag = true;
		}

		var uploadsPlaylistId = youmaxTabId.substring(youmaxTabId.indexOf('_')+1);
		var apiUploadURL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId="+uploadsPlaylistId+"&maxResults="+this.youmax_global_options.maxResults+pageTokenUrl+"&key="+this.youmax_global_options.apiKey;

		console.log('apiUploadURL-'+apiUploadURL);
		
		var self = this;
		$.ajax({
			url: apiUploadURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { showUploads.call(self,response,playlistTitle,loadMoreFlag);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	
	getPlaylists = function(nextPageToken) {

		var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		if(null!=nextPageToken) {
			pageTokenUrl = "&pageToken="+nextPageToken;
			loadMoreFlag = true;
		}
		
		var apiChannelPlaylistsURL = "https://www.googleapis.com/youtube/v3/playlists?part=contentDetails,snippet&channelId="+this.youmax_global_options.youmaxChannelId+"&maxResults="+this.youmax_global_options.maxResults+pageTokenUrl+"&key="+this.youmax_global_options.apiKey;
		var self = this;
		//var apiPlaylistURL = "https://gdata.youtube.com/feeds/api/users/"+youmaxUser+"/playlists?v=2&alt=jsonc&max-results=50";	
		$.ajax({
			url: apiChannelPlaylistsURL,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { showPlaylists.call(self, response,loadMoreFlag);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},		

		
	resetLoadMoreButton = function() {
		var $youmaxLoadMoreDiv = $(this).find('#youmax-load-more-div');
		$youmaxLoadMoreDiv.removeClass('youmax-load-more-div-click');
		$youmaxLoadMoreDiv.text('Load More');
	},
	
	prepareYoumax = function() {
		$(this).empty();
		/*
		if(youTubeChannelURL.indexOf("youtube.com/user/")!=-1) {
			if(null!=youTubeChannelURL&&youTubeChannelURL.indexOf("?feature")!=-1)
				youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/")+17,youTubeChannelURL.indexOf("?feature"));
			else
				youmaxUser = youTubeChannelURL.substring(youTubeChannelURL.indexOf("youtube.com/user/")+17);
		}
		
		console.log('youTubeChannelURL-'+youTubeChannelURL);
		console.log('youmaxUser-'+youmaxUser);

		//youmaxUser = 'UCVUZWBzxM7w8ug87qYwkBLg';
		//youmaxUser = 'AdeleVEVO';
		*/
		
		loadYoumax.call(this);
		showLoader.call(this);
		
		var self = this;
		$(this).find('.youmax-tab').click(function(){
			$(self).find('.youmax-tab-hover').removeClass('youmax-tab-hover');
			$(this).addClass('youmax-tab-hover');
			//$('.youmax-tab').css('color','#666');
			//$('.youmax-tab').css('background-color','rgb(230,230,230)');
			//$('.youmax-tab').css('text-shadow','0 1px 0 #fff');

			//$(this).css('color','#eee');
			//$(this).css('background-color','#999');
			//$(this).css('text-shadow','0 0');
			
			youmaxTabId = this.id;
			
			showLoader.call(self);
			
			if(youmaxTabId.indexOf("featured_")!=-1) {
				getUploads.call(self, 'featured_'+self.youmax_global_options.youmaxFeaturedPlaylistId,null,null);
			} else if(youmaxTabId.indexOf("uploads_")!=-1) {
				getUploads.call(self, youmaxTabId);
			} else if(youmaxTabId.indexOf("playlists_")!=-1) {
				getPlaylists.call(self);
			}
		});
		
		$(this).find('#youmax-load-more-div').click(function(){

			var $youmaxLoadMoreDiv = $(self).find('#youmax-load-more-div');
			$youmaxLoadMoreDiv.html('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>');
			$youmaxLoadMoreDiv.addClass('youmax-load-more-div-click');
			
			var youmaxTabId = $(self).find('.youmax-tab-hover').attr('id');
			var nextPageToken = $youmaxLoadMoreDiv.data('nextpagetoken');
			console.log('load more clicked : nextPageToken-'+nextPageToken);
			
			if(null!=nextPageToken && nextPageToken!="undefined" && nextPageToken!="") {
				if(youmaxTabId.indexOf("featured_")!=-1) {
					getUploads.call(self, 'featured_'+self.youmax_global_options.youmaxFeaturedPlaylistId,null,nextPageToken);
				} else if(youmaxTabId.indexOf("uploads_")!=-1) {
					getUploads.call(self, youmaxTabId, null, nextPageToken);
				} else if(youmaxTabId=="playlists_") {
					getPlaylists.call(self, nextPageToken);
				} else if(youmaxTabId.indexOf("uploadsplaylist_")!=-1){
					getUploadsPlayList.call(self, youmaxTabId, null, nextPageToken);
				}
			} else {
				$youmaxLoadMoreDiv.html('ALL DONE');
			}

		});		
		
		youTubeChannelURL = this.youmax_global_options.youTubeChannelURL;
		
		//Get Channel header and details 
		if(youTubeChannelURL!=null) {
			s=youTubeChannelURL.indexOf("/user/");
			////console.log('s-'+s);
			if(s!=-1) {
				userId = youTubeChannelURL.substring(s+6);
				this.youmax_global_options.youmaxChannelId = userId;
				//console.log('userId-'+userId);
				apiUrl = "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername="+userId+"&key="+this.youmax_global_options.apiKey;
				getChannelId.call(self, apiUrl);
			} else {
				s=youTubeChannelURL.indexOf("/channel/");
				if(s!=-1) {
					youmaxChannelId = youTubeChannelURL.substring(s+9);
					this.youmax_global_options.youmaxChannelId = youmaxChannelId;
					//console.log('channelId-'+channelId);
					getChannelDetails.call(self, youmaxChannelId);
				} else {
					this.youmax_global_options.youmaxChannelId = youTubeChannelURL;
					getChannelDetails.call(self, youTubeChannelURL);
				}
			}
		}
	
	}		
	
	
	$.fn.youmax = function(options) {

		$(this).addClass("youmax");
		//set local options
		this.youmax_global_options = {};
		this.youmax_global_options.afterLoad = options.afterLoad||false;
		this.youmax_global_options.showSubscribeButton = options.showSubscribeButton ||false;
		this.youmax_global_options.apiKey = options.apiKey;
		this.youmax_global_options.onclickCallback = options.onclickCallback||null;
		this.youmax_global_options.onclickPlayListCallback = options.onclickPlayListCallback||null;
		this.youmax_global_options.onmouseupCallback = options.onmouseupCallback||null;
		this.youmax_global_options.onmouseupPlayListCallback = options.onmouseupPlayListCallback||null;
		this.youmax_global_options.deviceWidth = options.deviceWidth||800;
		this.youmax_global_options.deviceHeight = options.deviceHeight||600;
		this.youmax_global_options.youTubeChannelURL = options.youTubeChannelURL||'';
		this.youmax_global_options.youTubePlaylistURL = options.youTubePlaylistURL||'';
		this.youmax_global_options.youmaxDefaultTab = options.youmaxDefaultTab||'FEATURED';
		this.youmax_global_options.youmaxColumns = options.youmaxColumns||3;
		this.youmax_global_options.youmaxChannelId = '';
		this.youmax_global_options.maxResults = options.maxResults||15;
		this.youmax_global_options.youmaxItemCount = 0;
		this.youmax_global_options.youtubeVideoAspectRatio = 640/360;
	
		this.youmax_global_options.youmaxWidgetWidth = options.youmaxWidgetWidth||800;
		$(this).css("width", this.youmax_global_options.youmaxWidgetWidth + '!important');
		//youmax_global_options.showFeaturedVideoOnLoad = options.showFeaturedVideoOnLoad||false;
		this.youmax_global_options.youtubeMqdefaultAspectRatio = 300/180;

		//initFeaturedVideos.call(this);
		prepareYoumax.call(this);
	
	};
	
 
}( jQuery ));


