(function($) {
    "use strict";

    $(".bd-slider").each(function() {
        var $slider = $(this);
        var options = $slider.data("slider-options");
        var $prevButton = $slider.find(".slider-prev");
        var $nextButton = $slider.find(".slider-next");
        var $pagination = $slider.find(".slider-pagination");
        var autoplay = options.autoplay;

        var swiperOptions = {
            slidesPerView: 1,
            spaceBetween: options.spaceBetween ? options.spaceBetween : 30,
            loop: options.loop !== 0,
            speed: options.speed ? options.speed : 1000,
            autoplay: autoplay || {
                delay: 6000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: $nextButton.get(0),
                prevEl: $prevButton.get(0)
            },
            pagination: {
                el: $pagination.get(0),
                clickable: true,
                renderBullet: function(index, className) {
                    return '<span class="' + className + '" aria-label="Go to Slide ' + (index + 1) + '"></span>';
                }
            }
        };

        var mergedOptions = JSON.parse($slider.attr("data-slider-options"));
        mergedOptions = $.extend({}, swiperOptions, mergedOptions);

        var swiper = new Swiper($slider.get(0), mergedOptions);

        if ($(".slider-area").length > 0) {
            $(".slider-area").closest(".container").parent().addClass("arrow-wrap");
        }

        if ($slider.hasClass("slider-tab")) {
            var swiperTab = new Swiper($slider.get(0), mergedOptions);
        } else if ($slider.hasClass("tab-view")) {
            var tabSwiper = new Swiper($slider.get(0), mergedOptions);
        } else {
            new Swiper($slider.get(0), mergedOptions);
        }

        if (swiperTab && tabSwiper) {
            swiperTab.controller.control = tabSwiper;
            tabSwiper.controller.control = swiperTab;
        }
    });

    $("[data-ani]").each(function() {
        var animation = $(this).data("ani");
        $(this).addClass(animation);
    });

    $("[data-ani-delay]").each(function() {
        var delay = $(this).data("ani-delay");
        $(this).css("animation-delay", delay);
    });

    $("[data-slider-prev], [data-slider-next]").on("click", function() {
        var buttons = $(this).data("slider-prev") || $(this).data("slider-next");
        buttons.split(", ").forEach(function(button) {
            var $button = $(button);
            if ($button.length) {
                var swiper = $button[0].swiper;
                if (swiper) {
                    if ($(this).data("slider-prev")) {
                        swiper.slidePrev();
                    } else {
                        swiper.slideNext();
                    }
                }
            }
        });
    });

    $.fn.activateSliderThumbs = function(options) {
        var settings = $.extend({
            sliderTab: false,
            tabButton: ".tab-btn"
        }, options);

        return this.each(function() {
            var $this = $(this);
            var $tabButtons = $this.find(settings.tabButton);
            var $indicator = $('<span class="indicator"></span>').appendTo($this);
            var sliderId = $this.data("slider-tab");
            var sliderInstance = $(sliderId)[0].swiper;

            $tabButtons.on("click", function(e) {
                e.preventDefault();
                var $clickedButton = $(this);
                if (!$clickedButton.hasClass("active")) {
                    $clickedButton.addClass("active").siblings().removeClass("active");
                    updateIndicatorPosition($clickedButton);
                    $clickedButton.prevAll(settings.tabButton).addClass("list-active");
                    $clickedButton.nextAll(settings.tabButton).removeClass("list-active");
                    if (settings.sliderTab) {
                        var index = $clickedButton.index();
                        sliderInstance.slideTo(index);
                    }
                }
            });

            if (settings.sliderTab) {
                sliderInstance.on("slideChange", function() {
                    var index = sliderInstance.realIndex;
                    var $activeButton = $tabButtons.eq(index);
                    $activeButton.addClass("active").siblings().removeClass("active");
                    updateIndicatorPosition($activeButton);
                    $activeButton.prevAll(settings.tabButton).addClass("list-active");
                    $activeButton.nextAll(settings.tabButton).removeClass("list-active");
                });

                var initialIndex = sliderInstance.activeIndex;
                var $initialButton = $tabButtons.eq(initialIndex);
                $initialButton.addClass("active").siblings().removeClass("active");
                updateIndicatorPosition($initialButton);
                $initialButton.prevAll(settings.tabButton).addClass("list-active");
                $initialButton.nextAll(settings.tabButton).removeClass("list-active");
            }

            function updateIndicatorPosition($button) {
                var position = $button.position();
                var marginTop = parseInt($button.css("margin-top")) || 0;
                var marginLeft = parseInt($button.css("margin-left")) || 0;
                $indicator.css("--height-set", $button.outerHeight() + "px");
                $indicator.css("--width-set", $button.outerWidth() + "px");
                $indicator.css("--pos-y", position.top + marginTop + "px");
                $indicator.css("--pos-x", position.left + marginLeft + "px");
            }
        });
    };

    if ($(".hero-thumb").length) {
        $(".hero-thumb").activateSliderThumbs({
            sliderTab: true,
            tabButton: ".tab-btn"
        });
    }
})(jQuery);
