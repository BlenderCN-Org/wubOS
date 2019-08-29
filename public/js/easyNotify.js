(function($) {

  $.fn.easyNotify = function(options) {
  
    var settings = $.extend({
      title: "Notification",
      options: {
        body: "",
        icon: "",
        lang: 'es-ES',
        onClose: "",
        onClick: "",
        onError: ""
      }
    }, options);

    this.init = function() {
        var notify = this;
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
      } else if (Notification.permission === "granted") {

        var notification = new Notification(settings.title, settings.options);
        
        notification.onclose = function() {
            if (typeof settings.options.onClose == 'function') { 
                settings.options.onClose();
            }
        };

        notification.onclick = function(){
            if (typeof settings.options.onClick == 'function') { 
                settings.options.onClick();
            }
        };

        notification.onerror  = function(){
            if (typeof settings.options.onError  == 'function') { 
                settings.options.onError();
            }
        };

      } else if (Notification.permission !== 'denied') {
        /*Notification.requestPermission(function(permission) {
          if (permission === "granted") {
			OS.pushNotification = function(opts){
				function html2text(html) {
					var tag = document.createElement('div');
					tag.innerHTML = html;
					
					return tag.innerText;
				};
				var optsAdap = {
					title: opts.heading,
					options: {
						body: html2text(opts.text),
						icon: opts.icon,
						onClick: opts.onClick
					}
				};
				$(document).easyNotify(optsAdap);
			};
            notify.init();
          }
		  else
		  {
			  OS.pushNotification = function(opts){
					var settings2 = $.extend({
						icon: 'info',
						showHideTransition: 'slide',
						allowToastClose: true,
						hideAfter: 5000,
						stack: 10,
						position: {bottom: 40, right: 80},
						textAlign: 'left',
						loader: true
					}, opts);
					$.toast(settings2);
				};
				OS.pushNotification(settings.primalOpts);
		  }

        });*/
      }

    };

    this.init();
    return this;
  };

}(jQuery));


