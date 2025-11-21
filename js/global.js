'use strict';

(function ($) {

    $("#hh-dropdown-notification").on('show.bs.dropdown', function () {
        var t = $(this),
            data = JSON.parse(Base64.decode(t.data('params')));
        data['_token'] = $('meta[name="csrf-token"]').attr('content');

        $.post(t.data('action'), data, function (respon) {
            if (typeof respon == 'object') {
                if (respon.status == 1) {
                    $('.badge', t).remove();
                    $('.notification-render', t).html(respon.notifications);
                    $(".slimscroll", t).slimScroll({
                        height: "auto",
                        position: "right",
                        size: "8px",
                        touchScrollStep: 20,
                        color: "#9ea5ab"
                    })
                } else {
                    HHActions.alert(respon);
                }
            }
        }, 'json');
    });
})(jQuery)
