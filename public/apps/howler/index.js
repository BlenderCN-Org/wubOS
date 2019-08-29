(function(){ 
	var howler = new App('howler', 'apps/howler/img/favicon.png', 'Howler',
					['apps/howler/howler.core.min.js', 'apps/howler/siriwave.js'], ['apps/howler/styles.css'], 
					/((.+\.mp3)|(.+\.wma)|(.+\.wav)|(.+\.m4a))/i,
					null, true);
	howler.run = function(fileParam){
		var self = this;
		var prog = new Program(self, function(){
			var selfProg = this;
			var v = new ventana(selfProg.proceso,{
				sizeX: 720,
				sizeY: 430,
				minSizeX: 720,
				minSizeY: 430
			});
			v.getDivContenido().className += " howler";
			v.getDivContenido().style.overflow = "hidden";
			v.getDivContenido().style.backgroundColor = "black";
			v.setIcono('apps/howler/img/favicon.png');
			v.setTitulo('Howler');
			v.onClose = function(){
				if(player)
					player.close();
				selfProg.proceso.close();
			};
			
			function GetFilename(url)
			{
			   if (url)
			   {
				  var m = url.toString().match(/.*\/(.+?)\./);
				  if (m && m.length > 1)
				  {
					 return m[1];
				  }
			   }
			   return "";
			}
			
			var player = null;
			var explorerWindow = null;
			v.menuItems.push({
				content: 'Archivo',
				items:[
					{
						content: 'Abrir',
						onclick: function(){
							if(explorerWindow)
								explorerWindow.trarAlFrente();
							else
								explorerWindow = OS.getAppByName("ftpexplorer").run(null, self.primaryExt, true, selfProg.proceso, function(){
									if(this.dialogResult)
										player.addSong({
											title: GetFilename(this.dialogResultNode.urlLink(false)),
											file: this.dialogResultNode.urlLink(true)
										});
									explorerWindow = null;
								}, 'fileNode');
						}
					},
					{
						content: 'Abrir Url',
						onclick: function(){
							swal({
								title: 'Introduce url:',
								input: 'text',
								inputPlaceholder: 'http://...',
								showCancelButton: true,
								inputValidator: function (value) {
									return new Promise(function (resolve, reject) {
										if (value) {
											resolve()
										} else {
											reject('Introduce url válida.')
										}
									})
								}
							}).then(function (result) {
								player.addSong({
									title: result,
									file: result
								});
							})
						}
					}
				]
			});
			
			
			v.cargarContenidoArchivo('apps/howler/index.xml', function(){
				v.mostrar();
				
				// Setup the "waveform" animation.
				var wave = new SiriWave({
					container: v.controles.waveform,
					width: v.getWidth(),
					height: v.getHeight() * 0.3,
					cover: true,
					speed: 0.03,
					amplitude: 0.7,
					frequency: 2
				});
				wave.start();
				
				
				var Player = function(playlist) {
				  this.playlist = playlist;
				  this.index = 0;

				  // Display the title of the first track.
				  if(playlist.length > 0)
					v.controles.track.innerHTML = '1. ' + playlist[0].title;

				  // Setup the playlist display.
				  playlist.forEach(function(song) {
					var div = document.createElement('div');
					div.className = 'list-song';
					div.innerHTML = song.title;
					div.onclick = function() {
					  player.skipTo(playlist.indexOf(song));
					};
					v.controles.list.appendChild(div);
				  });
				};
				Player.prototype = {
				  addSong: function(song){
					this.playlist.push(song);
					var self = this;
					var div = document.createElement('div');
					div.className = 'list-song';
					div.innerHTML = song.title;
					div.onclick = function() {
					  player.skipTo(self.playlist.indexOf(song));
					};
					v.controles.list.appendChild(div);
				  },
				  close: function(){
					for (var i = 0; i < this.playlist.length; i++)
					{
						if(this.playlist[this.index])
						{
							var sound = this.playlist[this.index].howl;
							if(sound)
								sound.unload();
						}
					};
				  },
				  /**
				   * Play a song in the playlist.
				   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
				   */
				  play: function(index) {
					var self = this;
					var sound;

					index = typeof index === 'number' ? index : self.index;
					var data = self.playlist[index];

					if(!data)
						return;
					
					// If we already loaded this track, use the current one.
					// Otherwise, setup and load a new Howl.
					if (data.howl) {
					  sound = data.howl;
					} else {
					  sound = data.howl = new Howl({
						src: [data.file],
						html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
						onplay: function() {
						  // Display the duration.
						  v.controles.duration.innerHTML = self.formatTime(Math.round(sound.duration()));

						  // Start upating the progress of the track.
						  requestAnimationFrame(self.step.bind(self));

						  // Start the wave animation if we have already loaded
						  wave.container.style.display = 'block';
						  v.controles.bar.style.display = 'none';
						  v.controles.pauseBtn.style.display = 'block';
						},
						onload: function() {
						  // Start the wave animation.
						  wave.container.style.display = 'block';
						  v.controles.bar.style.display = 'none';
						  v.controles.loading.style.display = 'none';
						},
						onend: function() {
						  // Stop the wave animation.
						  wave.container.style.display = 'none';
						  v.controles.bar.style.display = 'block';
						  self.skip('right');
						},
						onpause: function() {
						  // Stop the wave animation.
						  wave.container.style.display = 'none';
						  v.controles.bar.style.display = 'block';
						},
						onstop: function() {
						  // Stop the wave animation.
						  wave.container.style.display = 'none';
						  v.controles.bar.style.display = 'block';
						}
					  });
					}

					// Begin playing the sound.
					sound.play();

					// Update the track display.
					v.controles.track.innerHTML = (index + 1) + '. ' + data.title;
					v.setTitulo("Howler - " + data.title);

					// Show the pause button.
					if (sound.state() === 'loaded') {
					  v.controles.playBtn.style.display = 'none';
					  v.controles.pauseBtn.style.display = 'block';
					} else {
					  v.controles.loading.style.display = 'block';
					  v.controles.playBtn.style.display = 'none';
					  v.controles.pauseBtn.style.display = 'none';
					}

					// Keep track of the index we are currently playing.
					self.index = index;
				  },

				  /**
				   * Pause the currently playing track.
				   */
				  pause: function() {
					var self = this;

					// Get the Howl we want to manipulate.
					var sound = self.playlist[self.index].howl;

					// Puase the sound.
					sound.pause();

					// Show the play button.
					v.controles.playBtn.style.display = 'block';
					v.controles.pauseBtn.style.display = 'none';
				  },

				  /**
				   * Skip to the next or previous track.
				   * @param  {String} direction 'next' or 'prev'.
				   */
				  skip: function(direction) {
					var self = this;

					// Get the next track based on the direction of the track.
					var index = 0;
					if (direction === 'prev') {
					  index = self.index - 1;
					  if (index < 0) {
						index = self.playlist.length - 1;
					  }
					} else {
					  index = self.index + 1;
					  if (index >= self.playlist.length) {
						index = 0;
					  }
					}

					self.skipTo(index);
				  },

				  /**
				   * Skip to a specific track based on its playlist index.
				   * @param  {Number} index Index in the playlist.
				   */
				  skipTo: function(index) {
					var self = this;
					if(!self.playlist[self.index])
						return;
					// Stop the current track.
					if (self.playlist[self.index].howl) {
					  self.playlist[self.index].howl.stop();
					}

					// Reset progress.
					v.controles.progress.style.width = '0%';

					// Play the new track.
					self.play(index);
				  },

				  /**
				   * Set the volume and update the volume slider display.
				   * @param  {Number} val Volume between 0 and 1.
				   */
				  volume: function(val) {
					var self = this;

					// Update the global volume (affecting all Howls).
					Howler.volume(val);

					// Update the display on the slider.
					var barWidth = (val * 90) / 100;
					v.controles.barFull.style.width = (barWidth * 100) + '%';
					v.controles.sliderBtn.style.left = (v.getWidth() * barWidth + v.getWidth() * 0.05 - 25) + 'px';
				  },

				  /**
				   * Seek to a new position in the currently playing track.
				   * @param  {Number} per Percentage through the song to skip.
				   */
				  seek: function(per) {
					var self = this;

					// Get the Howl we want to manipulate.
					var sound = self.playlist[self.index].howl;

					// Convert the percent into a seek position.
					if (sound.playing()) {
					  sound.seek(sound.duration() * per);
					}
				  },

				  /**
				   * The step called within requestAnimationFrame to update the playback position.
				   */
				  step: function() {
					var self = this;

					// Get the Howl we want to manipulate.
					var sound = self.playlist[self.index].howl;
					if(!sound)
						return;
					// Determine our current seek position.
					var seek = sound.seek() || 0;
					v.controles.timer.innerHTML = self.formatTime(Math.round(seek));
					v.controles.progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

					// If the sound is still playing, continue stepping.
					if (sound.playing()) {
					  requestAnimationFrame(self.step.bind(self));
					}
				  },

				  /**
				   * Toggle the playlist display on/off.
				   */
				  togglePlaylist: function() {
					var self = this;
					var display = (v.controles.playlist.style.display === 'block') ? 'none' : 'block';

					setTimeout(function() {
					  v.controles.playlist.style.display = display;
					}, (display === 'block') ? 0 : 500);
					v.controles.playlist.className = (display === 'block') ? 'volume fadein' : 'volume fadeout';
				  },

				  /**
				   * Toggle the volume display on/off.
				   */
				  toggleVolume: function() {
					var self = this;
					var display = (v.controles.volume.style.display === 'block') ? 'none' : 'block';

					setTimeout(function() {
					  v.controles.volume.style.display = display;
					}, (display === 'block') ? 0 : 500);
					v.controles.volume.className = (display === 'block') ? 'volume fadein' : 'volume fadeout';
				  },

				  /**
				   * Format the time from seconds to M:SS.
				   * @param  {Number} secs Seconds to format.
				   * @return {String}      Formatted time.
				   */
				  formatTime: function(secs) {
					var minutes = Math.floor(secs / 60) || 0;
					var seconds = (secs - minutes * 60) || 0;

					return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
				  }
				};

				// Setup our new audio player class and pass it the playlist.
				player = new Player([]);
				  /*{
					title: 'Rave Digger',
					file: 'rave_digger',
					howl: null
				  },
				  {
					title: '80s Vibe',
					file: '80s_vibe',
					howl: null
				  },
				  {
					title: 'Running Out',
					file: 'running_out',
					howl: null
				  }
				]);*/

				// Bind our player controls.
				v.controles.playBtn.addEventListener('click', function() {
				  player.play();
				});
				v.controles.pauseBtn.addEventListener('click', function() {
				  player.pause();
				});
				v.controles.prevBtn.addEventListener('click', function() {
				  player.skip('prev');
				});
				v.controles.nextBtn.addEventListener('click', function() {
				  player.skip('next');
				});
				v.controles.waveform.addEventListener('click', function(event) {
				  player.seek((event.pageX - $(this).offset().left) / v.getWidth());
				});
				v.controles.playlistBtn.addEventListener('click', function() {
				  player.togglePlaylist();
				});
				v.controles.playlist.addEventListener('click', function() {
				  player.togglePlaylist();
				});
				v.controles.volumeBtn.addEventListener('click', function() {
				  player.toggleVolume();
				});
				v.controles.volume.addEventListener('click', function() {
				  player.toggleVolume();
				});

				// Setup the event listeners to enable dragging of volume slider.
				v.controles.barEmpty.addEventListener('click', function(event) {
				  var per = event.layerX / parseFloat(v.controles.barEmpty.scrollWidth);
				  player.volume(per);
				});
				var sliderDown = false;
				v.controles.sliderBtn.addEventListener('mousedown', function() {
				  sliderDown = true;
				});
				v.controles.sliderBtn.addEventListener('touchstart', function() {
				  sliderDown = true;
				});
				v.controles.volume.addEventListener('mouseup', function() {
				  sliderDown = false;
				});
				v.controles.volume.addEventListener('touchend', function() {
				  sliderDown = false;
				});

				var move = function(event) {
				  if (sliderDown) {
					var x = event.clientX || event.touches[0].clientX;
					var startX = v.getWidth() * 0.05;
					var layerX = x - startX;
					var per = Math.min(1, Math.max(0, layerX / parseFloat(v.controles.barEmpty.scrollWidth)));
					player.volume(per);
				  }
				};

				v.controles.volume.addEventListener('mousemove', move);
				v.controles.volume.addEventListener('touchmove', move);


				// Update the height of the wave animation.
				// These are basically some hacks to get SiriWave.js to do what we want.
				var resize = function() {
				  var height = v.getHeight();
				  var width = v.getWidth();
				  wave.height = height;
				  wave.height_2 = height / 2;
				  wave.MAX = wave.height_2 - 4;
				  wave.width = width;
				  wave.width_2 = width / 2;
				  wave.width_4 = width / 4;
				  wave.canvas.height = height;
				  wave.canvas.width = width;
				  //wave.container.style.margin = -(height / 2) + 'px auto';

				  // Update the position of the slider.
				  if(player.playlist[player.index])
				  {
					  var sound = player.playlist[player.index].howl;
					  if (sound) {
						var vol = sound.volume();
						var barWidth = (vol * 0.9);
						v.controles.sliderBtn.style.left = (v.getWidth() * barWidth + v.getWidth() * 0.05 - 25) + 'px';
					  }
				  }
				};
				
				
				v.onResizeEnd = function(){
					resize();
				};
				
				resize();
				
				
				
				if(fileParam)
				{
					player.addSong({
						title: GetFilename(fileParam),
						file: fileParam
					});
				}
			});
		});
	};
})();