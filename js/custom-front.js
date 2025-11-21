var nilesh = {

    validateEmail : function (data) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(data);
       },

     validateMobile : function (data) {
            var pattern = /^[0-9]{10}$/;
            return pattern.test(data);
        },

    isNumber : function (data) {
           var pattern = /^\d+$/;
           return pattern.test(data);
     },

    refreshCaptcha : function(){
        var min = 1;
        var max = 10;
        var value1 = Math.floor(Math.random() * (max - min + 1)) + min;
        var value2 = Math.floor(Math.random() * (max - min + 1)) + min;

        $('.value1').data('value', value1);
        $('.value2').data('value', value2);

        $('.value1').html(value1);
        $('.value2').html(value2);
    },

    validURL : function(myURL) {
            var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
            '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i');
            return pattern.test(myURL);
         },
    strongPass : function(pass) {
            var pattern = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
            return pattern.test(pass);
         },
     alert: function (respon) {
            if (respon.status === 0) {
                $.toast({
                    heading: respon.title,
                    text: respon.message,
                    icon: 'error',
                    loaderBg: '#bf441d',
                    position: 'bottom-right',
                    allowToastClose: false,
                    hideAfter: 4000
                });
            } else {
                if (respon.status === 1) {
                    $.toast({
                        heading: respon.title,
                        text: respon.message,
                        icon: 'success',
                        loaderBg: '#5ba035',
                        position: 'bottom-right',
                        allowToastClose: false,
                        hideAfter: 4000
                    });
                } else {
                    $.toast({
                        heading: respon.title,
                        text: respon.message,
                        icon: 'info',
                        loaderBg: '#26afa4',
                        position: 'bottom-right',
                        allowToastClose: false,
                        hideAfter: 4000
                    });
                }
            }
        },
     ucwords : function (str) {
            if($.trim(str) != ''){
                str = str.toLowerCase();
                return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                    return $1.toUpperCase();
                });
            }
        },
        copyToClipboard : function (text) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(text).select();
            document.execCommand("copy");
            $temp.remove();
        },


};

function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      console.log(result);
      return result;
    } 

function showError($message){
    $('.alert-dismissible').remove();
    $('.errors').html($message);
    $('.errors').addClass('active');
    $('html, body').animate({
        scrollTop: $(".errors").offset().top-100
    }, 700);
}

function hideError(){
    $('.errors').html('');
    $('.errors').removeClass('active');
}

$(document).ready(function(){

$(function() {
  AOS.init();
});

//home page slider
if($(".owl-homesldier").length){
	$(".owl-homesldier").owlCarousel({
		items : 1,
		itemsCustom : false,
		itemsDesktop : [1199,1],
		itemsDesktopSmall : [991,1],
		itemsTablet: [768,1],
		itemsTabletSmall: [600,1],
		itemsMobile : [479,1],
		singleItem : false,
		itemsScaleUp : false,
        autoHeight: true,
	 
		//Autoplay
		autoPlay : true,
		stopOnHover : true,
	 
		// Navigation
		navigation : true,
		navigationText : ['<img src="'+site_url+'/images/icon/arro1.png">','<img src="'+site_url+'/images/icon/arro2.png">'],
		rewindNav : true,
		scrollPerPage : false,
	 
		//Pagination
		pagination : false,
		paginationNumbers: false,
	 
		// Responsive 
		responsive: true,
		responsiveRefreshRate : 200,
		responsiveBaseWidth: window,    
	});
}
//home page slider end



// Owl Tours
if($(".owl-homeproduct").length){
	$(".owl-homeproduct").owlCarousel({
		items : 3,
		itemsCustom : false,
		itemsDesktop : [1199,3],
		itemsDesktopSmall : [991,3],
		itemsTablet: [768,2],
		itemsTabletSmall: [600,1],
		itemsMobile : [479,1],
		singleItem : false,
		itemsScaleUp : false,
	 
		//Autoplay
		autoPlay : true,
		stopOnHover : true,
	 
		// Navigation
		navigation : true,
		navigationText : ['<img src="'+site_url+'/images/icon/arro1.png">','<img src="'+site_url+'/images/icon/arro2.png">'],
		rewindNav : true,
		scrollPerPage : false,
	 
		//Pagination
		pagination : false,
		paginationNumbers: false,
	 
		// Responsive 
		responsive: true,
		responsiveRefreshRate : 200,
		responsiveBaseWidth: window,    
	});
}
// Owl Tours
if($(".owl-homeproduct2").length > 0){

$(".owl-homeproduct2").owlCarousel({
	items : 4,
	itemsCustom : false,
	itemsDesktop : [1199,4],
	itemsDesktopSmall : [991,3],
	itemsTablet: [768,2],
	itemsTabletSmall: [600,1],
	itemsMobile : [479,1],
	singleItem : false,
	itemsScaleUp : false,
 
	//Autoplay
	autoPlay : true,
	stopOnHover : true,
 
	// Navigation
	navigation : true,
	navigationText : ['<img src="'+site_url+'/images/icon/arro1.png">','<img src="'+site_url+'/images/icon/arro2.png">'],
	rewindNav : true,
	scrollPerPage : false,
 
	//Pagination
	pagination : false,
	paginationNumbers: false,
 
	// Responsive 
	responsive: true,
	responsiveRefreshRate : 200,
	responsiveBaseWidth: window,    
});

}
   
// Owl Reviews
if($(".owl-customer_rev").length > 0){
    $(".owl-customer_rev").owlCarousel({
    items : 1,
    itemsCustom : false,
    itemsDesktop : [1199,1],
    itemsDesktopSmall : [991,1],
    itemsTablet: [768,1],
    itemsTabletSmall: [600,1],
    itemsMobile : [479,1],
    singleItem : false,
    itemsScaleUp : false,
 
    //Autoplay
    autoPlay : false,
    stopOnHover : true,
 
    // Navigation
    navigation : true,
    navigationText : ['<img src="'+site_url+'/images/icon/arro1.png">','<img src="'+site_url+'/images/icon/arro2.png">'],
    rewindNav : true,
    scrollPerPage : false,
 
    //Pagination
    pagination : false,
    paginationNumbers: false,
 
    // Responsive 
    responsive: true,
    responsiveRefreshRate : 200,
    responsiveBaseWidth: window,    
});
}


//home testimonials
if($(".owl-testimonial").length ){
$(".owl-testimonial").owlCarousel({
    items : 1,
    itemsCustom : false,
    itemsDesktop : [1199,1],
    itemsDesktopSmall : [991,1],
    itemsTablet: [768,1],
    itemsTabletSmall: [600,1],
    itemsMobile : [479,1],
    singleItem : false,
    itemsScaleUp : false,
 
    //Autoplay
    autoPlay : false,
    stopOnHover : true,
 
    // Navigation
    navigation : false,
    navigationText : ['<img src="'+site_url+'/images/icon/arro1.png">','<img src="'+site_url+'/images/icon/arro2.png">'],

    rewindNav : true,
    scrollPerPage : false,
 
    //Pagination
    pagination : true,
    paginationNumbers: false,
 
    // Responsive 
    responsive: true,
    responsiveRefreshRate : 200,
    responsiveBaseWidth: window,    
});
}

//home brands
if($(".owl-brands").length ){
$(".owl-brands").owlCarousel({
    items : 4,
    itemsCustom : false,
    // itemsDesktop : [1199,1],
    // itemsDesktopSmall : [991,1],
    // itemsTablet: [768,1],
    // itemsTabletSmall: [600,1],
    // itemsMobile : [479,1],
    singleItem : false,
    itemsScaleUp : false,
 
    //Autoplay
    autoPlay : false,
    stopOnHover : true,
 
    // Navigation
    navigation : false,
    navigationText : ['<img src="'+site_url+'/images/icon/arro1.png">','<img src="'+site_url+'/images/icon/arro2.png">'],

    rewindNav : true,
    scrollPerPage : false,
 
    //Pagination
    pagination : true,
    paginationNumbers: false,
 
    // Responsive 
    responsive: true,
    responsiveRefreshRate : 200,
    responsiveBaseWidth: window,    
});
}

    $(document).on('click','.addtowishlist',function(e){

		e.preventDefault();
       	var post_id = $(this).data('post');

       	$element = $('a[data-post="' + post_id + '"] > i.fa-heart');

        if($element.hasClass('fa-beat')){
       		return false;
        }
        
        $element.addClass('fa-beat');
       
       $.ajax({
          type: "POST",
          url: site_url+'/update-wishlist',
          data: ({post_id: post_id,  _token: $('meta[name="csrf-token"]').attr('content') }),
          dataType:'json',
          success: function(response) {

          		$element.removeClass('fa-beat');
	          	if(response.status == 1){
	          		if(response.type == 'add')
	                {
	                   	$element.addClass('color-red');
	                }
	                else{
	                   	$element.removeClass('color-red');
	                }
	          	}
                nilesh.alert(response);
          	}   
       });   
    }); 

	$("body").on('click', '.toggle-password', function() {
			$targetInput = $(this).data('pass');

		    $(this).find('i').toggleClass("fa-eye fa-eye-slash");
		    var input = $("#"+$targetInput);
		    if (input.attr("type") === "password") {
		      input.attr("type", "text");
		    } else {
		      input.attr("type", "password");
		    }
	});


	//country region dropdown
    $('#location_country').on('change',function(){
        $val = $.trim($(this).val());
                    
        $('#location_region').html('<option value="">Select Region</option>');
        $('#location_district').html('<option value="">Select District</option>');            

        if($val){
            var data = [];

            data.push(
                { name: 'country',value: $('#location_country').val()},
                { name: '_token',value: $('meta[name="csrf-token"]').attr('content'),
            });

            $url = $(this).data('route');

            $.ajax({
              type: 'get',
                url:  $url,
                data: data,
                dataType: "json",
                success: function(response) {
                    console.log(response);
                    
                    $html = '<option value="">Select Region</option>';
                    if(response.data){
                        $.each( response.data, function( key, value) {
                            $html += '<option value="'+value.region_id+'">'+value.name+'</option>';
                        });
                    }  
                    $('#location_region').html($html);

                },
                error: function(error, textStatus, errorMessage) {
                    console.log(error);
                    alert('Request could not be completed');
                }             
            });
        }

    });

    //get districts
    $('#location_region').on('change',function(){
        $val = $.trim($(this).val());
        
        $('#location_district').html('<option value="">Select District</option>');

        if($val){
            var data = [];

            data.push(
                { name: 'country',value: $('#location_country').val()},
                { name: 'region',value: $('#location_region').val()},
                { name: '_token',value: $('meta[name="csrf-token"]').attr('content'),
            });

             $url = $(this).data('route');

            $.ajax({
              type: 'get',
                url: $url ,
                data: data,
                dataType: "json",
                success: function(response) {
                    console.log(response);
                    $html = '<option value="">Select District</option>';

                    if(response.data){
                        $.each( response.data, function( key, value) {
                            $html += '<option value="'+value.district_id+'">'+value.name+'</option>';
                        });
                    }  
                    $('#location_district').html($html);
                },
                error: function(error, textStatus, errorMessage) {
                    console.log(error);
                    alert('Request could not be completed');
                }             
            });
        }
    });

    //search region
    $('#search_region').on('change',function(){
        $val = $.trim($(this).val());
        
        $('#search_district').html('<option value="">District</option>');

        var data = [];

        data.push(
            { name: 'region',value: $('#search_region').val()},
            { name: '_token',value: $('meta[name="csrf-token"]').attr('content'),
        });

        $url = $(this).data('route');

        $.ajax({
          type: 'get',
            url: $url ,
            data: data,
            dataType: "json",
            success: function(response) {
                console.log(response);
                $html = '<option value="">District</option>';

                if(response.data){
                    $.each( response.data, function( key, value) {
                        $html += '<option value="'+value.district_id+'">'+nilesh.ucwords(value.name)+'</option>';
                    });
                }  
                $('#search_district').html($html);
            },
            error: function(error, textStatus, errorMessage) {
                console.log(error);
                alert('Request could not be completed');
            }             
        });
        
    });


//dropdown
jQuery(document).ready(function (e) {
    function t(t) {
        e(t).bind("click", function (t) {
            t.preventDefault();
            e(this).parent().fadeOut()
        })
    }
    e(".dropdown-toggle09").click(function () {
        var t = e(this).parents(".button-dropdown09").children(".dropdown-menu09").is(":hidden");
        e(".button-dropdown09 .dropdown-menu09").hide();
        e(".button-dropdown09 .dropdown-toggle09").removeClass("active09");
        if (t) {
            e(this).parents(".button-dropdown09").children(".dropdown-menu09").toggle().parents(".button-dropdown09").children(".dropdown-toggle09").addClass("active09")
        }
    });
    e(document).bind("click", function (t) {
        var n = e(t.target);
        if (!n.parents().hasClass("button-dropdown09")) e(".button-dropdown09 .dropdown-menu09").hide();
    });
    e(document).bind("click", function (t) {
        var n = e(t.target);
        if (!n.parents().hasClass("button-dropdown09")) e(".button-dropdown09 .dropdown-toggle09").removeClass("active09");
    })
});
//dropdown
    
    $('.openRegModal').click(function(){
        $('.modal').modal('hide')
        $('#hh-register-modal').modal('show')
    });
    
    //Custom share
    try {
        var sharebar = new ShareBar(
            {   
                buttonWidth: 50,
                'networks': [
                    'facebook',
                    'twitter',
                    'whatsapp',
                    'copy',
                  ],
            });
    } catch(e) {

    }


    $(document).on('click','.sharethis',function(e){
        e.preventDefault();

        $title = $(this).data('title');
        $url = $(this).data('url');

        $html = '<div class="share-bar" data-url="'+$url+'" data-title="'+$title+'" ></div>';
        
        $('#shareModal .modal-body').html($html);

        sharebar.createBar(document.querySelector('.share-bar'));

        $('#shareModal').modal('show');
    });

     $(document).on('click','.cust_copy',function(e){
        e.preventDefault();

        $url = decodeURIComponent($(this).attr('href'));
        navigator.clipboard.writeText($url);

        alert('Copied product url ');
    });



    function initializeClock(element, h,m,s) {
        var hour =h;
        var min = m;
        var sec = s;

        var flag = 1;

        function updateClock() {
            sec--;
            if (sec < 0) {
                min--;
                sec = 59
            }
            if (min < 0) {
                hour--;
                min = 59
            }

            var pat = /^[0-9]{1}$/;
            sec = (pat.test(sec) == true) ? '0' + sec : sec;
            min = (pat.test(min) == true) ? '0' + min : min;
            hour = (pat.test(hour) == true) ? '0' + hour : hour;
            // document.getElementById('strclock').innerHTML = hour + ":" + min + ":" + sec;
            // console.log(hour,min,sec);
            if (hour == '00' && min == '00' && sec == '00') {
                flag = 0;
                // alert("Times Out!");
                element.html('00:00:00');

                clearInterval(timeinterval);
            } else {
                element.html(hour + "H:" + min + "M:" + sec + "S");
                // SD = window.setTimeout("countdown()", 1000);
            }

            /* if (t.total <= 0) {
              clearInterval(timeinterval);
            }*/
        }

        if(flag == 1){
            updateClock();
            var timeinterval = setInterval(updateClock, 1000);
            // const timeinterval = window.setTimeout(updateClock, 1000);
        }
    }
    
   function initializeProductTimer(){
        $('.nj_p_counter').each(function(i,v){
            $hour   = $(this).data('hour');
            $minutes = $(this).data('minutes');
            $seconds = $(this).data('seconds');

            initializeClock($(this), $hour,$minutes,$seconds);
        });
    }

    initializeProductTimer();
    


}); //doc ready end


// Drop Down End
var btn = document.getElementById("select_otn").addEventListener("click", function () {
  var btnClass = document.getElementById("select_otn").classList.toggle("select_otn_act");
  var list = document.getElementById("select_list").classList.toggle("select_list_act");
});
// Drop Down End

