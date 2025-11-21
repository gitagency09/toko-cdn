(function ($) {
    'use strict';

    moment.tz.setDefault(hh_params.timezone);

    var isReload = true;

    //After page loaded
    $(document).ready(function () {

        let Search_Result_Page = {
            search_container: '',
            xhr: null,
            dataFilter: [],
            currentURL: window.location,
            mapObject: undefined,
            checkHover: -1,
            allPopups: [],
            // bounds: new mapboxgl.LngLatBounds(),
            init: function (el) {
                let base = this;
                base.search_container = $(el);
                base.dataFilter = base.urlToArray();
                // base._searchCallBack();
                base._eventsSearch();
                base._events();
            },
            _setHeightRender: function (set) {
                let base = this;
                let body = $('body');
                let search_wrapper = $('.hh-search-content-wrapper', base.search_container);
                if (set) {
                    search_wrapper.css({
                        'height': $(window).height() - $('#header', body).outerHeight() - $('.hh-search-bar-wrapper', base.search_container).outerHeight()
                    });
                } else {
                    search_wrapper.css({
                        'height': ''
                    });
                }
            },
            _events: function () {
                let base = this;
                let body = $('body');
                // stop event when click the dropdown menu
                $('.hh-search-bar-buttons .dropdown-menu', base.search_container).on('click', function (event) {
                    event.stopPropagation();
                });


                // Click to show filter box on mobile
                $('#show-filter-mobile', base.search_container).on('click', function () {
                    $('#filter-mobile-box', base.search_container).fadeIn();
                    $('body').css({'overflow': 'hidden'});
                });

                // Click to hide filter box on mobile
                $('#filter-mobile-box .popup-filter-close, #filter-mobile-box .view-result', base.search_container).on('click', function () {
                    $('#filter-mobile-box', base.search_container).fadeOut();
                    $('body').css({'overflow': ''});
                });

                // Resize window to apply searching
                $(window).on('resize', function () {
                    if (window.matchMedia("(min-width: 992px)").matches) {
                        let search_wrapper = $('.hh-search-content-wrapper', base.search_container);
                        if (!search_wrapper.hasClass('no-map')) {
                            base._setHeightRender(true);
                            if ($('.hh-search-results-map', search_wrapper).length && !$('.hh-search-results-map', search_wrapper).is(':visible') && !search_wrapper.hasClass('no-map')) {
                                $('.hh-search-results-map', search_wrapper).show();
                            }
                            search_wrapper.trigger('hh_resize_map_search_container');
                            setTimeout(function () {
                                $.fn.slimScroll && $('.hh-search-results-render .render', base.search_container).slimScroll({
                                    height: false,
                                    alwaysVisible: false,
                                    railVisible: false,
                                    railOpacity: 0,
                                    wheelStep: 10,
                                    size: 8,
                                    color: "#CCC",
                                    allowPageScroll: false,
                                    disableFadeOut: false
                                });
                            }, 150);
                            $('body').addClass('hide-footer');
                        }

                    } else {
                        let search_wrapper = $('.hh-search-content-wrapper', base.search_container);
                        base._setHeightRender(false);
                        if ($('.hh-search-results-map', base.search_container).length && $('.hh-search-results-map', base.search_container).is(':visible') && search_wrapper.hasClass('no-map')) {
                            $('.hh-search-results-map', base.search_container).hide();
                        }
                        $.fn.slimScroll && $('.hh-search-results-render .render', base.search_container).slimScroll({destroy: true});
                        $('body').removeClass('hide-footer');
                    }
                }).resize();


                let allowMoveMap = $('#chk-map-move', base.search_container).is(':checked');
                /*$('#show-map-mobile', base.search_container).click(function () {
                    $('.hh-search-results-map', base.search_container).addClass('map-popup');
                    base.mapObject.resize();
                    if (!allowMoveMap) {
                        base.mapObject.fitBounds(base.bounds, {
                            padding: 70
                        });
                    }
                    $('body').css({'overflow': 'hidden'});
                });*/


                /*$('#hide-map-mobile', base.search_container).click(function () {
                    $('.hh-search-results-map', base.search_container).removeClass('map-popup').fadeOut();
                    $('body').css({'overflow': ''});
                });*/
            },
            _eventsSearch: function () {
                let base = this;

                //Pagination
                base.search_container.on('click', '.pagination li a', function (ev) {
                    ev.preventDefault();
                    if (!$(this).parent().hasClass('active') && $(this).data('pagination') !== undefined) {
                        let pageSelected = parseInt($(this).data('pagination'));
                        if (pageSelected <= 0) {
                            pageSelected = 1;
                        }
                        base.dataFilter['page'] = pageSelected;
                        base._searchCallBack(true, true);
                        base.pushStateToFilter('page', pageSelected);
                    }
                });
                
                base.search_container.on('change', '.all-filter-checkbox', function (ev) {
                     var checked = $(this).is(':checked');
                     console.log(checked);
                     console.log('aaya');
                     if(checked){
                       $(this).parents('.thmflt-box').find('input[type="checkbox"]:not(.d-none)').each(function(){
                         $(this).prop("checked",true);
                       });
                     }else{
                       $(this).parents('.thmflt-box').find('input[type="checkbox"]').each(function(){
                         $(this).prop("checked",false);
                       });
                     }
                 });

                base.search_container.on('click', '.nrmchkb', function (ev) {
                    var ch_parent = $(this).parents('.thmflt-box');
                    var checkbox_count = ch_parent.find('.nrmchkb').length;

                    if(checkbox_count == ch_parent.find('.nrmchkb_op:checked').length) {
                        ch_parent.find('.all-filter-checkbox').prop("checked", true);
                    } else {
                       ch_parent.find('.all-filter-checkbox').prop("checked", false);
                    }
                });
  

                function setUnset($key,$val){
                    if ($.trim($val)) {
                        base.dataFilter[$key] = $val;
                        base.pushStateToFilter($key, $val);
                    } else {
                        base.dataFilter[$key] = '';
                        base.pushStateToFilter($key, '',true);
                    }
                }

                base.search_container.on('click', '.search_reset', function (ev) {
                    base._resetPage();
                    base._searchCallBack();
                });
                
                function filterSchools() {
                    let region = $('#search_region').val();
                    let district = $('#search_district').val();

                    $('#search_category option').each(function () {
                        // always keep the first placeholder option
                        if ($(this).val() === "") {
                            return; // skip "School"
                        }

                        let optRegion = $(this).data('region');
                        let optDistrict = $(this).data('district');

                        let show = true;
                        if (region && optRegion != region) show = false;
                        if (district && optDistrict != district) show = false;

                        $(this).toggle(show);
                    });

                    // reset selection whenever filters change
                    $('#search_category').val('');
                }

                // run on change
                base.search_container.on('change', '#search_region, #search_district', filterSchools);

                // run once on page load
                $(document).ready(function () {
                    filterSchools();
                });

                base.search_container.on('click', '.search_res_button', function (ev) {
                    //alert('inn');
                    let parent = base.search_container;
                    let region = parent.find('select[name="region"] :selected').val();
                    let district = parent.find('select[name="district"] :selected').val();
                    let category = parent.find('select[name="category"] :selected').val();
                    let type = parent.find('select[name="type"] :selected').val();
 
                    let reserve_between = parent.find('input[name="reserve_between"]').val();
                    let startbid_between = parent.find('input[name="startbid_between"]').val();
                    let reserve_met = parent.find('input[name="reserve_met"]:checked').val();
 
                    if(type == 'auction'){
                        setUnset('reserve_between',reserve_between);
                        setUnset('startbid_between',startbid_between);
                        setUnset('reserve_met',reserve_met);
                        setUnset('start_date',$('#s_startDate').val());
                        setUnset('end_date',$('#s_endDate').val());
                    }else{
                        setUnset('reserve_between','');
                        setUnset('startbid_between','');
                        setUnset('reserve_met','');
                        setUnset('start_date','');
                        setUnset('end_date','');
                    }

                    setUnset('region',region);
                    setUnset('district',district);
                    setUnset('category',category);
                    setUnset('type',type);
                    

                    $('.dropdown-menu09 .button-dropdown09').each(function () {
                        let inputData = $(this).find('input[type="hidden"]');
                        let resTemp = [];

                        $(this).find('input[type="checkbox"]').each(function () {
                            if ($(this).is(':checked')) {
                                resTemp.push($(this).val());
                            }
                        });
                        /*
                         $(this).find('input[type="checkbox"]').each(function () {
                            if ($(this).is(':checked')) {
                                resTemp.push($(this).val());
                            }
                        });*/
                        if (resTemp.length > 0) {
                            inputData.val(resTemp.toString());
                            setUnset($(this).data('type'),resTemp.toString());
                        } else {
                            inputData.val('');
                            setUnset($(this).data('type'),'');
                        }
                    });

                    let sort_by = $('.nj_sort_by a.active').data('value');
                    setUnset('sort',sort_by);

                    base._resetPage();
                    base._searchCallBack();
                    // parent.removeClass('show');
                });
    
                
                    

                //FilerPrice
                /*$('input[name="price_filter"]', base.search_container).on('hh_ranger_changed', function () {
                    let value = $(this).val();
                    if (base.dataFilter['price_filter'] !== value) {
                        base.dataFilter['price_filter'] = value;
                        base._resetPage();
                        base._searchCallBack();
                        base.pushStateToFilter('price_filter', value);
                    }
                });*/

                //DateRangePicker
                /*$('input[name="startdate"]', base.search_container).on('daterangepicker_change', function (e, start, end) {
                    let checkIn = start.format('YYYY-MM-DD'),
                        checkOut = end.format('YYYY-MM-DD'),
                        // checkInOut = checkIn + '+12:00+am-' + checkOut + '+11:59+pm';
                    if (base.dataFilter['startDate'] !== checkIn || 
                        base.dataFilter['endDate'] !== checkOut 
                        && checkIn !== checkOut) {

                        base.dataFilter['startDate'] = checkIn;
                        base.dataFilter['endDate'] = checkOut;
                        base._resetPage();
                        base._searchCallBack();
                        base.pushStateToFilter('startDate', checkIn);
                        base.pushStateToFilter('endDate', checkOut);
                    }
                });
*/

                //Taxonomy
                /*$('.button-more-filter .dropdown-menu a.apply-more-filter', base.search_container).on('click', function (e) {
                    e.preventDefault();
                    let t = $(this),
                        parent = t.closest('.dropdown-menu');

                    $('.item-filter-wrapper', parent).each(function () {
                        let inputData = $(this).find('input[type="hidden"]');
                        let resTemp = [];
                        $(this).find('input[type="checkbox"]').each(function () {
                            if ($(this).is(':checked')) {
                                resTemp.push($(this).val());
                            }
                        });
                        if (resTemp.length > 0) {
                            inputData.val(resTemp.toString());
                            base.dataFilter[$(this).data('type')] = resTemp.toString();
                            base.pushStateToFilter($(this).data('type'), resTemp.toString());
                        } else {
                            inputData.val('');
                            base.dataFilter[$(this).data('type')] = '';
                            base.pushStateToFilter($(this).data('type'), '', true);
                        }
                    });
                    base._resetPage();
                    base._searchCallBack();
                    parent.removeClass('show');
                });
*/
               

                
                //Taxonomy Popup
                /*$('.popup-tax-filter input[type="checkbox"]', base.search_container).on('change', function (e) {
                    e.preventDefault();
                    let t = $(this),
                        parent = t.closest('.popup-filter-content');
                    $('.popup-tax-filter', parent).each(function () {
                        let inputData = $(this).find('input[type="hidden"]');
                        let resTemp = [];
                        $(this).find('input[type="checkbox"]').each(function () {
                            if ($(this).is(':checked')) {
                                resTemp.push($(this).val());
                            }
                        });
                        if (resTemp.length > 0) {
                            inputData.val(resTemp.toString());
                            base.dataFilter[$(this).data('type')] = resTemp.toString();
                            base.pushStateToFilter($(this).data('type'), resTemp.toString());
                        } else {
                            inputData.val('');
                            base.dataFilter[$(this).data('type')] = '';
                            base.pushStateToFilter($(this).data('type'), '', true);
                        }
                    });
                    base._resetPage();
                    base._searchCallBack();
                    parent.removeClass('show');
                });*/

                
            },

            _initOwl: function () {
                $(".owl-listslider").owlCarousel({
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
                    // stopOnHover : true,
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
            },
            _resetPage: function () {
                let base = this;
                base.dataFilter['page'] = 1;
                base.pushStateToFilter('page', 1);
            },

            _showSelectedFilter: function () {
                let base = this;
                
                let parent = base.search_container;
                let region = parent.find('select[name="region"] :selected').val();
                let district = parent.find('select[name="district"] :selected').val();
                let category = parent.find('select[name="category"] :selected').val();
                let type = parent.find('select[name="type"] :selected').val();

                let reserve_between = parent.find('input[name="reserve_between"]').val();
                let startbid_between = parent.find('input[name="startbid_between"]').val();
                let reserve_met = parent.find('input[name="reserve_met"]:checked').val();

                let selected_html = '';

                let region_name = parent.find('select[name="region"] :selected').text();
                let district_name = parent.find('select[name="district"] :selected').text();
                let category_name = parent.find('select[name="category"] :selected').text();

                if(region != ''){
                    selected_html += '<li data-type="select" data-subtype="region" data-target="#search_region"><div class="results_show_tx">'+region_name+'<a class="results_show_close" >×</a></div></li>';
                }
                if(district != ''){
                    selected_html += '<li data-type="select" data-subtype="district" data-target="#search_district"><div class="results_show_tx">'+district_name+'<a class="results_show_close" >×</a></div></li>';
                }
                if(category != ''){
                    selected_html += '<li data-type="select" data-subtype="category" data-target="#search_category"><div class="results_show_tx">'+category_name+'<a class="results_show_close" >×</a></div></li>';
                }

                //facilities
                $('.dropdown-menu09 .button-dropdown09').each(function () {
                    let filterType = $(this).data('type');

                    $(this).find('input[type="checkbox"]').each(function () {
                        if ($(this).is(':checked')) {
                            selected_html += '<li data-type="checkbox" data-subtype="'+filterType+'" data-target="#'+filterType+'-'+$(this).val()+'"><div class="results_show_tx">'+$(this).next('span').text()+'<a class="results_show_close" >×</a></div></li>';

                        }
                    });
                });

                if(type == 'auction'){
                    if($('#s_startDate').val() != '' && $('#s_endDate').val() != ''){
                        let text = $('#s_startDate').val() +' to ' +$('#s_endDate').val();

                        selected_html += '<li data-type="date" data-subtype="auctiondate" data-target="#search-rangeDate"><div class="results_show_tx">'+text+'<a class="results_show_close" >×</a></div></li>';
                    }

                    let reservePrice = $("#reserve_between").data("ionRangeSlider");
                    if(reservePrice.result.from != 0 || reservePrice.result.to != reservePrice.result.max){

                        let text = 'Reserve Price between : $'+reservePrice.result.from+' - $'+reservePrice.result.to;
                        selected_html += '<li data-type="range" data-subtype="reserve_between" data-target="#reserve_between"><div class="results_show_tx">'+text+'<a class="results_show_close" >×</a></div></li>';
                    }

                    let startbidPrice = $("#startbid_between").data("ionRangeSlider");
                    if(startbidPrice.result.from != 0 || startbidPrice.result.to != startbidPrice.result.max){

                        let text = 'Start bid between : $'+startbidPrice.result.from+' - $'+startbidPrice.result.to;
                        selected_html += '<li data-type="range" data-subtype="startbid_between" data-target="#startbid_between"><div class="results_show_tx">'+text+'<a class="results_show_close" >×</a></div></li>';
                    }

                    if(reserve_met != 'all'){

                        let text = (reserve_met == 'yes') ? 'Reserve met' : 'Reserver not met';
                        selected_html += '<li data-type="radio" data-subtype="reserve_met" data-target="#reserve_met_all"><div class="results_show_tx">'+text+'<a class="results_show_close" >×</a></div></li>';
                    }
                }

                $('.search_results_show ul').html(selected_html);
            },

            _searchCallBack: function (applyMove = true) {
                let base = this;
                if (base.xhr != null) {
                    base.xhr.abort();
                }
                base.dataFilter['_token'] = $('meta[name="csrf-token"]').attr('content');

                let loader = $('.hh-map-tooltip .hh-loading-map', base.search_container);
                if (applyMove) {
                    loader = $('.hh-loading', base.search_container);
                }

                if (!isReload) {
                    loader.show();
                }

                base._showSelectedFilter();
                

                // console.log(base.dataFilter);
                base.xhr = $.post(base.search_container.data('url'), base.dataFilter, function (res) {
                    if (typeof res == 'object') {
                        let renderWrapper = $('.hh-search-results-render', base.search_container),
                            renderString = $('.hh-search-results-string', renderWrapper),
                            renderHtml = $('.hh-search-content', renderWrapper),
                            renderPag = $('.hh-search-pagination', renderWrapper);
                        if (res.status) {

                            renderString.hide().html(res.search_string).fadeIn(300);
                            renderHtml.hide().html(res.html).fadeIn(300);
                            renderPag.hide().html(res.pag).fadeIn(300);

                            base._initOwl();

                            //google rating
                            if($('.product-card-google-rating').length){
                                $('.product-card-google-rating').each(function(item){

                                    $(this).starRating({
                                        readOnly: true,
                                        starSize: 20,
                                        strokeWidth: 3,
                                        strokeColor: '#fab531',
                                        initialRating: $(this).data('rating'),
                                        starGradient: {
                                            start: '#fab531',
                                            end: '#fab531'
                                        },
                                    });
                                });
                            }

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

                                    if (hour == '00' && min == '00' && sec == '00') {
                                        flag = 0;
                                        element.html('00:00:00');
                                        clearInterval(timeinterval);
                                    } else {
                                        element.html(hour + "H:" + min + "M:" + sec + "S");
                                    }
                                }

                                if(flag == 1){
                                    updateClock();
                                    var timeinterval = setInterval(updateClock, 1000);
                                }
                            }
    
                            $('.nj_p_counter').each(function(i,v){
                                let $hour   = $(this).data('hour');
                                let $minutes = $(this).data('minutes');
                                let $seconds = $(this).data('seconds');

                                initializeClock($(this), $hour,$minutes,$seconds);
                            });

                            setTimeout(function () {
                                base.search_container.trigger('hh_search_result_loaded');
                            }, 300);

                            // $("html, body").animate({ scrollTop: $(".hh-search-content-wrapper").offset().top }, "slow");
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                        loader.hide();
                    }
                }, 'json');
                isReload = false;

            },
            urlToArray: function () {
                let base = this;
                let res = {};

                if ($('.pagination li.active a', base.search_container).length) {
                    let pagination = parseInt($('.pagination li.active a', base.search_container).data('pagination'));
                    res['page'] = pagination <= 0 ? 1 : pagination;
                } else {
                    res['page'] = 1;
                }
                res['current_url'] = $('.hh-search-results-render', base.search_container).data('url');

                let sPageURL = window.location.search.substring(1);
                if (sPageURL !== '') {
                    let sURLVariables = sPageURL.split('&');
                    if (sURLVariables.length) {
                        for (let i = 0; i < sURLVariables.length; i++) {
                            let sParameterName = sURLVariables[i].split('=');
                            if (sParameterName.length) {
                                let val = decodeURIComponent(sParameterName[1]);
                                res[decodeURIComponent(sParameterName[0])] = (val === 'undefined') ? '' : val;
                            }
                        }
                    }
                }
                return res;
            },
            pushStateToFilter: function (key, value, del = false) {
                let base = this;
                let url = new URL(base.currentURL);
                let query_string = url.search;
                let search_params = new URLSearchParams(query_string);

                if (del) {
                    if (search_params.has(key)) {
                        search_params.delete(key);
                    }
                } else {
                    if (search_params.has(key)) {
                        search_params.set(key, value);
                    } else {
                        search_params.append(key, value);
                    }
                }

                url.search = search_params.toString();
                base.currentURL = url.toString();
                window.history.pushState({path: base.currentURL}, '', base.currentURL);
            }
        };

        Search_Result_Page.init('.hh-search-result');
    });
    
    function hideAuctionFilters(){
        if($('.filtr_bktype select').val() == 'auction'){
            $('.fltr_auction, .fltr_auctiondate').show();
        }else{
            $('.fltr_auction, .fltr_auctiondate').hide();
        }
    }
    $('.filtr_bktype select').on('change',function(){
        hideAuctionFilters();
    });
    hideAuctionFilters();
})(jQuery);


//dropdown
/*jQuery(document).ready(function (e) {
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
});*/
//dropdown


// tabs
const tabs = document.querySelectorAll(".tab09");

function tabify(tab) {
  const tabList = tab.querySelector(".tab__list09");

  if (tabList) {
    const tabItems = [...tabList.children];
    const tabContent = tab.querySelector(".tab__content09");
    const tabContentItems = [...tabContent.children];
    let tabIndex = 0;

    tabIndex = tabItems.findIndex((item, index) => {
      return [...item.classList].indexOf("is--active") > -1;
    });

    tabIndex > -1 ? (tabIndex = tabIndex) : (tabIndex = 0);

    function setTab(index) {
      tabItems.forEach((x, index) => x.classList.remove("is--active"));
      tabContentItems.forEach((x, index) => x.classList.remove("is--active"));

      tabItems[index].classList.add("is--active");
      tabContentItems[index].classList.add("is--active");
    }

    tabItems.forEach((x, index) =>
      x.addEventListener("click", () => setTab(index))
    );
    setTab(tabIndex);
    tab.querySelectorAll(".tab09").forEach((tabContent) => tabify(tabContent));
  }
}
tabs.forEach(tabify);
// tabs
