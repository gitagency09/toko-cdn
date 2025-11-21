
$(document).ready(function(){

	function homeInitOwl($parent){
        $parent.find(".owl-homeproduct").owlCarousel({
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

    function renderHomapageStarRating($element){
		if($element.length){
			$element.each(function(item){
				$rating = $(this).data('rating');
				$(this).starRating({
	                readOnly: true,
	                starSize: 20,
	                strokeWidth: 3,
	                strokeColor: '#fab531',
	                initialRating: $rating,
	                starGradient: {
	                    start: '#fab531',
	                    end: '#fab531'
	                },
	            });
			});
		}
	}
	renderHomapageStarRating($('.product-card-google-rating'));

	function getSliderData($object,$parent,$query){

        /*var data = [];
        data.push(
            { name: '_token', value: $('meta[name="csrf-token"]').attr('content') }
            );

        data.push($object);*/
        var data = [
        	{ name: '_token', value: $('meta[name="csrf-token"]').attr('content') }
        ];
        Array.prototype.push.apply(data,$object);

        console.log(data);
        $parent.find('.hh-loading ').show();

        $viewall = $('#search_url').val()+'?'+$query;

        $.ajax({
          type: 'post',
            url: 'get-products',
            data: data,
            dataType: "json",
            success: function(response) {

                $parent.find('.hh-loading ').hide();

                if(response.html){
                	$parent.find('.home_owl_block').html(response.html);
                	$parent.find('.view_all_link a').attr('href',$viewall).show();

                	homeInitOwl($parent);

                	renderHomapageStarRating($parent.find('.product-card-google-rating'));
                }
                else{
                    $parent.find('.home_owl_block').html('<p class="home_nt_fnd">Products not found.</p>');
                	$parent.find('.view_all_link a').hide();
                }
            },
            error: function(error, textStatus, errorMessage) {
            	$parent.find('.hh-loading ').hide();
                console.log(error);
                alert('Request could not be completed');
            }             
        });
	}


	$("input[name=reserve_between], input[name=startbid_between]").ionRangeSlider({
		skin: "round",
	    // type: "double",
	    min: 0,
	    max: 1000,
	    from: 1000,
	    // to: 1000,
	    onStart: function (data) {
	        // fired then range slider is ready
	    },
	    onChange: function (data) {
	        
	    },
	    onFinish: function (data) {   
	    	$key = data.input.attr('name');
	    	$value = data.input.val();

	    	$class = $('#'+$key+'_block .selected_lessprice').text('$'+$value);

	    	temp = [
				{ name : $key, value: $value }
			];

	    	$query = $key+'='+$value;
	    	// getSliderData(temp,$('#reserve_between_block'),$query);
	    	getSliderData(temp, $('#'+$key+'_block'), $query);

	        console.log(data.input.val(), data);
	    },
	    onUpdate: function (data) {
	        // fired on changing slider with Update method
	    }
	});

	$("#region_block li").click(function(){
		$("#region_block .button-dropdown09").trigger('click');
		$("#region_block li").removeClass('active');
		$(this).addClass('active');

		temp = [
				{ name :'region', value: $(this).data('value') },
				{ name :'divide', value: 1 }
			];

		$query = 'region='+$(this).data('value');
		getSliderData(temp, $('#region_block'), $query);
	});

	



});