$('.menu-top-level').find('ul a').attr('href', 'javascript:void(0)');

var isMobile,
    isWebkit;
(function () {
	"use strict";
	var ua = navigator.userAgent.toLowerCase(),
		isAndroid = ua.indexOf("android") > -1,
		isIOS =  !!(navigator.userAgent.match(/(iPad|iPhone|iPod)/i)), // ? true : false );
        iswebkit = ua.indexOf('webkit') > -1;
	isMobile = isAndroid || isIOS;
    isWebkit = iswebkit || false;
}());


/*Mobile polyfills*/
$(function () {
	"use strict";
	if (!isMobile) {

	}
});

/* page resizer */
$(function(){
    var $header = $('.page-header'),
        $footer = $('.page-footer'),
        $page = $('.page-layout'),
        hHeight = $header.outerHeight(true),
        fHeight = $footer.outerHeight(true),
        wHeight = $(window).height();

    $page.css('min-height', wHeight - (hHeight + fHeight));

    $(window).resize(function(){
        hHeight = $header.outerHeight(true);
        fHeight = $footer.outerHeight(true);
        wHeight = $(window).height();
        $page.css('min-height', wHeight - (hHeight + fHeight));
    });

});


/*files*/
$(function(){
    "use strict";

    files();

    function files(){
        $('a.file').each(function(){
            var $t = $(this),
                href= $t.attr('href'),
                ext = href.substr(href.lastIndexOf('.'), href.length),
                str = 'href='+encodeURIComponent(href);

			ext = ext.split('?');
			ext = ext[0];
			ext = ext.split('#');
			ext = ext[0];
			
            $t.attr('target', '_blank');

            if(!$t.parent('p').length){
                $t.wrap('<p class="file"/>');
            }else{
                $t.parent('p').addClass('file');
            }
            if(href.match(/\.pdf/gi)){
                $t.parent('p').addClass('pdf');
            }else
            if(href.match(/\.doc/gi) || href.match(/\.docx/gi)){
                $t.parent('p').addClass('doc');
            }else
            if(href.match(/\.xls/gi) || href.match(/\.xlsx/gi)){
                $t.parent('p').addClass('xls');
            }else
            if(href.match(/\.rar/gi) || href.match(/\.zip/gi)){
                $t.parent('p').addClass('zip');
            }else{
                $t.parent('p').addClass('pdf');
            }
            $.post('/ajax/filesize/', str, function(data){
                var filesize = data;
                var spanHtml = ' <span>('+ext+', '+filesize+')</span>';
                $t.after(spanHtml);
            });
        });
    }
});


/*Плавающие листья*/
$(window).load(function(){
    var $lc = $('.leafs-container');
    if($lc.length){
        var $c = $('.leafs-close'),
            $m = $('.leafs-middle'),
            $f = $('.leafs-far');


        var $leafs = $lc.find('.leaf');
        setupLeafs();

        $(window).resize(function(){
            setupLeafs();
        });

        /*$lc.click(function(){
            setupLeafs();
        })*/
    }

    function setupLeafs(){
        var w = $c.width(),
            h = $c.height();
        $c.css({left :0});
        $m.css({left :0});
        $f.css({left :0});
        $leafs.stop(true);
        $leafs.each(function(){
            var $t = $(this),
                pos = $t.attr('data-pos'),
                anim = 'fast';

            switch(pos){
                case 'c':
                    anim = 'fast';
                    break;
                case 'm':
                    anim = 'normal';
                    break;
                case 'f':
                    anim = 'slow';
                    break;
            }
            var x = getRand(-100, w+100),
                y = getRand(0, h-$t.height());
            $t.animate({left: x, top: y}, anim, function(){
                $(window).off('mousemove.leafs');
                $(window).on('mousemove.leafs', function(event){
                    moveLeafs(event);
                });
            });
        });
    }

    var mX = 0;

    function moveLeafs(event){
       var nX = event.pageX,
           delta = mX - nX;
        if(mX !== 0){
            $c.css({left: '+=' + delta/4});
            $m.css({left: '+=' + delta/6});
            $f.css({left: '+=' + delta/8});
        }

        mX = nX;
    }

    function getRand(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});


/*menu 2 level*/
$(function(){
    var $menu = $('#MainMenu'),
        $fmenu = $('#FloatMenu'),
        $over = $('#Overlay'),
        $header = $('.page-header');
    if($menu.length && $fmenu.length){
        var $fcnt = $fmenu.find('.float-menu-container'),
            isOpen = false,
            opRel = -1;


        var showMenu = function(t, event){
                var $t = $(t),
                    rel = $t.attr('data-rel'),
                    $cnt = $fcnt.filter('[data-rel='+rel+']' );

                if($cnt.length){
                    $menu.find('a, span').removeClass('hover');
                    $t.addClass('hover');
                    $header.addClass('floated');
                    if(!isOpen){
                        isOpen = true;
                        $fcnt.hide();
                        $cnt.show();
                        $fmenu.slideDown(250, function(){
                            setupColHeight($cnt);
                        });
                        $over.show();
                        $over.addClass('ov-menu');
                        opRel = rel;
                    }else{
                        if(isOpen && opRel == rel){
                            $fmenu.slideUp();
                            $t.removeClass('hover');
                            opRel = -1;
                            isOpen = false;
                            $over.hide();
                            $over.removeClass('ov-menu');
                        }else{
                            opRel = rel;
                            $fcnt.hide();
                            $cnt.show();
                            $over.show();
                            $over.addClass('ov-menu');
                            setupColHeight($cnt);
                        }
                    }

                }
            };

        $over.click(function(){
            $fmenu.slideUp(350);
            isOpen = false;
            opRel = -1;
            $over.hide().removeClass('ov-menu');

			//скрытие попапов
			$('.popup').hide();
        });

        $menu.on('click', 'a, span', function(event){
            event.preventDefault();
            var t = this;
            showMenu(t, event);
        });

        function setupColHeight($cnt){
            var $ul = $cnt.find('ul');
            $ul.css('min-height','auto');
            var height = $ul.maxHeight();
            $ul.css('min-height', height);

        }
    }
});



/*feedbackForm*/
$(function(){
    if($('.js-feedback-trigger').length){
        var $trigger = $('.cardseq'),
            $over = $('#Overlay'),
            $popup = $('#cardsEqual'),
            $form = $popup.find('form'),
            $close = $popup.find('.close');

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.removeClass('error').removeClass('error').removeClass('success');
            $form.find('input, textarea').val('');
            $popup.stopTime();
        });

        $trigger.click(function(){
            $popup.show();
            $over.show();
        });
    }
});


/*vklad-order Form*/
//$(function(){
//    if($('.js-vklad-order-trigger').length){
//        var $trigger = $('.js-vklad-order-trigger'),
//            $over = $('#Overlay'),
//            $popup = $('#vklad-order'),
//            $form = $popup.find('form'),
//            $close = $popup.find('.close');
//
//        $close.hover(function(){
//            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
//        }, function(){
//            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
//        });
//
//        $close.click(function(){
//            $popup.hide();
//            $over.hide();
//            $popup.removeClass('error').removeClass('error').removeClass('success');
//            $form.find('input, textarea').val('');
//            $popup.stopTime();
//        });
//
//        $trigger.click(function(){
//            $popup.show();
//            $over.show();
//        });
//    }
//});
//




/*vkladForm*/
$(function(){
	if($('.js-vklad-order-trigger').length){
		var $trigger = $('.js-vklad-order-trigger'),
			$over = $('#Overlay'),
			$popup = $('#vklad-order'),
			$form = $popup.find('form'),
			$close = $popup.find('.close');

		$close.hover(function(){
			$(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
		}, function(){
			$(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
		});

		$close.click(function(){
			$popup.hide();
			$over.hide();
			$popup.removeClass('error').removeClass('error').removeClass('success');
			$form.find('input, textarea').val('');
			$popup.stopTime();
		});

		$trigger.click(function(){
			$form.find('.vkladName').val($(this).attr('data-name'))
			$form.find('.vkladPeriod').val($(this).attr('data-period'))
			$form.find('.vkladSumm').val($(this).attr('data-summ'))
			$form.find('.vkladCurrency').val($(this).attr('data-currency'))
			$popup.show();
			$over.show();
		});

		$form.submit(function(e){
			e.preventDefault();
			var $inp = $form.find('input, textarea');
			var error = 0;
			var focus = false;
			$inp.parents('div.inpC').removeClass('invalid');

			/*Проверяем поля*/
			$inp.each(function(){
				var $field = $(this);
				if(focus){return $(this);}
				if($field.attr('type')!='hidden' && $field.val().length < 1){
					error++;
					$field.parents('div.inpC').addClass('invalid');
					focus = true;
					$field.focus();
				}else{
					$field.parents('div.inpC').removeClass('invalid');
				}
			});

			if(!error){
				$popup.addClass('loading');
				$.post("/ajax/vklad/", $form.serialize(), function(data){
					$popup.removeClass('loading');
					if(data != 0){
						$popup.removeClass('success').addClass('error');
					}else{
						$popup.removeClass('error').addClass('success');
					}
				}).error(function(){
						$popup.removeClass('loading').removeClass('success').addClass('error');
					});
			}


		});
	}
});




/*feedbackForm*/
$(function(){
    if($('.js-feedback-trigger').length){
        var $trigger = $('.js-feedback-trigger'),
            $over = $('#Overlay'),
            $popup = $('#feedback'),
            $form = $popup.find('form'),
            $close = $popup.find('.close');

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.removeClass('error').removeClass('error').removeClass('success');
			$form.find('input, textarea').val('');
            $popup.stopTime();
        });

        $trigger.click(function(){
			$popup.show();
			$over.show();
        });

        $form.submit(function(e){
            e.preventDefault();
//            $popup.addClass('loading');
//            $popup.oneTime(3000, function(){
//               $popup.removeClass('loading').addClass('error');
//               $popup.oneTime(3000, function(){
//                    $popup.removeClass('error').addClass('success');
//                    $popup.oneTime(3000, function(){
//                        $popup.removeClass('success');
//                        $popup.hide();
//                        $over.hide();
//                    });
//               });
//            });
			var $inp = $form.find('input, textarea');
			var error = 0;
			var focus = false;
			$inp.parents('div.inpC').removeClass('invalid');

			/*Проверяем поля*/
			$inp.each(function(){
				var $field = $(this);
				if(focus){return $(this);}
				if($field.val().length < 1){
					error++;
					$field.parents('div.inpC').addClass('invalid');
					focus = true;
					$field.focus();
				}else{
					$field.parents('div.inpC').removeClass('invalid');
				}
			});

			if(!error){
				$popup.addClass('loading');
				$.post("/ajax/feedback/", $form.serialize(), function(data){
					$popup.removeClass('loading');
					if(data != 0){
						$popup.removeClass('success').addClass('error');
					}else{
						$popup.removeClass('error').addClass('success');
					}
				}).error(function(){
					$popup.removeClass('loading').removeClass('success').addClass('error');
				});
			}


        });
    }
});

$(function(){
    if($('.js-accordeon').length){
        var $accordeon = $('.js-accordeon');

        $accordeon.find('.trigger').click(function(){
            var $t = $(this),
                $acc = $t.parents('.js-accordeon'),
                $text = $acc.find('.list-text');
            $text.stop(true, true);
            if(!$acc.hasClass('open')){
                $acc.addClass('open');
                $text.slideDown('normal');
            }else{
                $acc.removeClass('open');
                $text.slideUp('normal');
            }

        });

    }
});

/*Форма поиска*/
$(function(){
    if($('.search-form').length){
        var $form = $('.search-form'),
            $label = $form.find('label'),
            $inp = $('#HeaderSearchString');

        if($inp.val() !== ''){
            $label.hide();
        }else{
            $label.show();
        }



        $inp.on('focus', function(){
            $label.hide();
        });

        $inp.on('blur', function(){
            if($inp.val() !== ''){
                $label.hide();
            }else{
                $label.show();
            }
        });
    }
});


/*Список вкладов/карт*/

$(function(){
    if($('.list-item').length){
        var $li = $('.list-item'),
            $bt = $li.find('button');

        $li.click(function(event){

            if(event.target.tagName === 'BUTTON'){
                event.preventDefault();
            }
        });

        /*$bt.click(function(event){
            var $t = $(this),
                href = $t.attr('data-href');

            //console.log(href);
            //TODO: document.location = href;
        });*/
    }
});

/*Заказ карты*/
$(function(){
    if($('.offerCardForm').length){
        var $trigger = $('.offerCardForm'),
            $popup = $('#offerCardForm'),
            $over = $('#Overlay'),
            $close = $popup.find('.close'),
            $h2 = $popup.find('h2.headline');

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.stopTime();
        });

        /*
             https://service.ecoprombank.ru:443/credit112
             https://service.ecoprombank.ru:443/creditmagic
             https://service.ecoprombank.ru:443/credit100500
         */

        $trigger.live('click', function(){
            var id = $(this).attr('data-id');
            var src = "https://service.ecoprombank.ru:443/credit100500";
            if(id === '4') src = "https://service.ecoprombank.ru:443/credit112";
            if(id === '5') src = "https://service.ecoprombank.ru:443/credit112";
            if(id === '6') src = "https://service.ecoprombank.ru:443/creditmagic"
            if(id === '47') src = "https://service.ecoprombank.ru:443/credit100500"

            if(id === '47'){
                $h2.html('Оформить заявку на кредит')
            }else{
                $h2.html('Оформить заявку на карту')
            }

            $popup.find('iframe').attr('src', src);
            $('html, body').animate({scrollTop : 150}, 300);

            $popup.show();
            $over.show();
        });

    }
});


/*Рассчет кредита*/
$(function(){
    if($('#calculateCredit').length){
        var $trigger = $('.calculateCredit'),
            $popup = $('#calculateCredit'),
            $over = $('#Overlay'),
            $close = $popup.find('.close');

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.stopTime();
        });

        /*
         https://service.ecoprombank.ru:443/credit112
         https://service.ecoprombank.ru:443/creditmagic
         https://service.ecoprombank.ru:443/credit100500
         */

        $trigger.live('click', function(){
            $popup.show();
            $over.show();
        });

    }
});


/*Турпакет все включено +*/

$(function(){
    if($('#GetTourCard').length){
        var $trigger = $('.getTourCard'),
            $popup = $('#GetTourCard'),
            $over = $('#Overlay'),
            $close = $popup.find('.close');

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.stopTime();
        });

        /*
         https://service.ecoprombank.ru:443/credit112
         https://service.ecoprombank.ru:443/creditmagic
         https://service.ecoprombank.ru:443/credit100500
         */

        $trigger.live('click', function(){
            $popup.show();
            $over.show();
        });

    }
});




/*Вклад/Карта*/
$(function(){
    if($('.list-page').length){
        var $lp = $('.list-page'),
            $card = $lp.find('.card-order'),
            $hTrigger = $lp.find('.hidden-text-link a'),
            $hText = $lp.find('.hidden-text'),
            $desc = $lp.find('.list-description');

        var opentext = 'Подробнее',
            closetext = 'Свернуть';

        var end = {
                w : 25,
                t : 0
            },
            start = {
                w : 17,
                t : 6
            },
            $pagenav = $('.page-prev a, .page-next a');


        $pagenav.hover(function(){
            var $t = $(this),
                $img = $t.find('img');
            $img.stop(true, true);
            $img.animate({width: end.w, top: end.t}, 150);
        }, function(){
            var $t = $(this),
                $img = $t.find('img');
            $img.stop(true, true);
            $img.animate({width: start.w, top: start.t}, 150);
        });


        $hTrigger.click(function(){
            var $t = $(this);
            if(!$t.hasClass('open')){
                $t.addClass('open');
                $t.html(closetext);
                $hText.slideDown();
            }else{
                $t.removeClass('open');
                $t.html(opentext);
                $hText.slideUp();
            }
        });

        fixButton();

        $(window).scroll(function(){
            fixButton();
        });

        $(window).resize(function(){
            fixButton();
        })

    }

    function fixButton(){
        $card.removeClass('fixed-bottom').removeClass('fixed');
        $card.css('left', 'auto');
        $card.width('auto');
        var wtop = $(window).scrollTop(),
            ctop = $card.offset().top - 20,
            cleft = $card.offset().left,
            cwidth = $card.width(),
            dtop = $desc.offset().top + $desc.height() - $card.outerHeight(true) - 20;

        if(wtop > ctop && wtop <= dtop){
            $card.removeClass('fixed-bottom');
            $card.addClass('fixed');
            $card.css('left', cleft);
            $card.width(cwidth);
        }else if(wtop >= dtop){
            $card.removeClass('fixed');
            $card.addClass('fixed-bottom');
        }
    }
});

$(function(){
    $('.slider-rows .slider select').awSelect();
});

/*popup hint*/
$(function(){
    if($('.popup-hint').length){
        var $hint = $('.popup-hint'),
            $elements = $('[data-hint]');
        var mouseenter = function(event){
                if(!$(this).hasClass('inactive')){
                    $hint.stop(true, true);
                    var $t = $(this),
                        hint = $t.attr('data-hint'),
                        x = event.pageX,
                        y = event.pageY;
                    $hint.html(hint);
                    $hint.css({left: x + 30, top : y - 30});
                    $hint.fadeIn(150);
                }
            },
            mouseleave = function(event){
                $hint.stop(true, true);
                $hint.fadeOut(150);
            },
            mousemove = function(event){
                var $t = $(this),
                    x = event.pageX,
                    y = event.pageY;
                $hint.css({left: x + 30, top : y - 30});
            };

        $elements.on('mousemove', mousemove);
        $elements.on('mouseenter', mouseenter);
        $elements.on('mouseleave', mouseleave);
    }
});


/*Высота и скролл таблиц*/
$(function(){
    if($('.scrollTable').length){
        var $list = $('.filter-list'),
            $table = $list.find('.scrollTable'),
            $tableL = $list.find('.table-left'),
            $tableR = $list.find('.table-right'),
            $cL = $('.ctrlLeft'),
            $cR = $('.ctrlRight'),
            $arrL = $cL.find('span'),
            $arrR = $cR.find('span'),
            $ovf = $list.find('.ovf');


        setupHeight();
        assignScroll();
        checkScrollTop();
        $(window).resize(function(){
            setupHeight();
            assignScroll();
            $arrL.attr('style', '');
            $arrR.attr('style', '');
            $arrL.removeClass('fixed').removeClass('fixedBottom');
            $arrR.removeClass('fixed').removeClass('fixedBottom');
            checkScrollTop();
        });



        $table.on('heightChange', function(){
            setupHeight();
			assignScroll();
        });

        $(window).load(function(){
            setupHeight();
        });
    }

    function checkScrollTop(){
        var fixTop = $arrL.offset().top,
            fixL = $arrL.offset().left,
            fixR = $arrR.offset().left;

        if($cL.hasClass('visuallyhidden')){
            $cL.removeClass('visuallyhidden');
            fixL = $arrL.offset().left;
            $cL.addClass('visuallyhidden');
        }

        if($cR.hasClass('visuallyhidden')){
            $cR.removeClass('visuallyhidden');
            fixR = $arrR.offset().left;
            $cR.addClass('visuallyhidden');
        }

        onScroll();
        $(window).scroll(function(){onScroll();})

        function onScroll(){
            if($(window).scrollTop() > fixTop){
                if($(window).scrollTop()+$arrL.outerHeight(true) + 20 > $cL.offset().top + $cL.height()){
                    $arrL.removeClass('fixed');
                    $arrR.removeClass('fixed');
                    $arrL.attr('style', '');
                    $arrR.attr('style', '');
                    $arrL.addClass('fixedBottom');
                    $arrR.addClass('fixedBottom');
                }else{
                    $arrL.removeClass('fixedBottom');
                    $arrR.removeClass('fixedBottom');
                    $arrL.css('left', fixL);
                    $arrR.css('left', fixR);
                    $arrL.addClass('fixed');
                    $arrR.addClass('fixed');
                }
            }else{
                $arrL.attr('style', '');
                $arrR.attr('style', '');
                $arrL.removeClass('fixed').removeClass('fixedBottom');
                $arrR.removeClass('fixed').removeClass('fixedBottom');
            }
        }
    }

    function setupHeight(){
        var i = 0,
            isF = false,
            isL = $table.find('tr').length - 1,
            $rows = $('.filter-list tr td, .filter-list tr th');
		
		$rows.height('auto');

        $table.find('tr').each(function(){
            var $t = $(this),
                id = $t.attr('data-id'),
                h = $rows.filter('tr[data-id='+id+'] th, tr[data-id='+id+'] td').maxHeight();
            if((isWebkit || $('html').hasClass('lt-ie10')) && $t.find('td').length > 0 && (!isF || i == isL)){
                h = h - 1;
                isF = true;
            }
			if( $.browser.opera ){
				h = h+33;
			}
            $rows.filter('[data-id='+id+'] th, [data-id='+id+'] td').height(h);
            i++;
        });
    }

    function assignScroll(){
        var maxScroll = $ovf.width() - $table.width();
		$table.css('left', 0);
        $cL.height($list.height());
        $cR.height($list.height());
        checkArrows();
        $(window).resize(function(){
            maxScroll = $ovf.width() - $table.width();
            $cL.height($list.height());
            $cR.height($list.height());
            checkArrows();
        });



        $cL.off('mousedown touchstart');
        $cR.off('mousedown touchstart');
        $cL.off('mouseup touchend');
        $cR.off('mouseup touchend');
        /*Обработчики стрелок*/
        $cL.on('mousedown touchstart', function(){
            $tableR.addClass('wShadow');
            $cR.removeClass('visuallyhidden');
            $table.animate({left : 0}, function(){
                $cL.addClass('visuallyhidden');
                $tableL.removeClass('wShadow');
            });
        });

        $cR.on('mousedown touchstart', function(){
            $tableL.addClass('wShadow');
            $cL.removeClass('visuallyhidden');
            $table.animate({left : maxScroll}, function(){
                $cR.addClass('visuallyhidden');
                $tableR.removeClass('wShadow');
            });
        });

        $cL.on('mouseup touchend', function(){
            $table.stop(true);
        });

        $cR.on('mouseup touchend', function(){
            $table.stop(true);
        });

        function checkArrows(){
            if(maxScroll < 0){
                $table.css('left', 0);
                $tableL.removeClass('wShadow');
                $tableR.addClass('wShadow');
                $cL.addClass('visuallyhidden');
                $cR.removeClass('visuallyhidden');
            }else{
                $table.css('left', 0);
                $tableL.removeClass('wShadow');
                $tableR.removeClass('wShadow');
                $cL.addClass('visuallyhidden');
                $cR.addClass('visuallyhidden');
            }
        };
    }//assignScroll
});


/*Фильтр по картам*/
$(function(){
    var $filter = $('.card-filter');

        if($filter.length){
            var $inp = $filter.find('input'),
                $table = $('.scrollTable'),
                $tableL = $('.table-left'),
                $tableR = $('.table-right'),
                $empty = $('.empty-filter'),
                $reset = $('.js-filter-reset'),
                $ovf = $('.filter-list .ovf'),
                $scroll = $('.table-scroll'),
                $firstly = {},
                $firstlyL = {},
                $firstlyR = {},
                $close = $('.filter-close a');

            var $nav = $('.js-navigator a');


            $close.click(function(e){
                /*$filter.toggle();
                $close.toggleClass('hidden');
                return false;*/


                var $this = $(this);
                if(!$this.hasClass('lock')){
                    $close.addClass('lock').toggleClass('hidden');
                    if(!$this.hasClass('active')){
                        $close.addClass('active');
                        $filter.animate({"opacity":"0"},600,function(){
                            $filter.animate({"height":"0"},600,function(){
                                $filter.hide();
                                $close.removeClass('lock');
                            });
                        });
                    }else{
                        $close.removeClass('active');
                        $filter.show();
                        $filter.animate({"height":$filter.find('.filter-pad').outerHeight()},600,function(){
                            $filter.css('height', 'auto');
                            $filter.animate({"opacity":"1"},600,function(){
                                $close.removeClass('lock');
                            });
                        });
                    }
                }
                return false;
            });

            $nav.click(function(e){
                var $t = $(this),
                    cT = $t.attr('data-cardtype');

                if(!$t.parents('li').hasClass('active')){

					switch(cT){
						case '0':
							$('.debit_show').removeClass('hidden');
							$('.credit_show').removeClass('hidden');
                            $('.storage_show').removeClass('hidden');
                            $('.pension_show').removeClass('hidden');
                            $('.salary_show').removeClass('hidden');
                            $('.div_debit').addClass('hidden');
                            $('.div_credit').addClass('hidden');
                            $('.div_storage').addClass('hidden');
                            $('.div_pension').addClass('hidden');
                            $('.div_salary').addClass('hidden');
							break;
						case 'doc_40':
							$('.debit_show').removeClass('hidden');
							$('.debit_hide').addClass('hidden');
                            $('.div_debit').removeClass('hidden');
                            $('.div_credit').addClass('hidden');
                            $('.div_storage').addClass('hidden');
                            $('.div_pension').addClass('hidden');
                            $('.div_salary').addClass('hidden');
							break;
						case 'doc_41':
							$('.credit_show').removeClass('hidden');
							$('.credit_hide').addClass('hidden');
                            $('.div_debit').addClass('hidden');
                            $('.div_credit').removeClass('hidden');
                            $('.div_storage').addClass('hidden');
                            $('.div_pension').addClass('hidden');
                            $('.div_salary').addClass('hidden');
							break;
                        case 'doc_110':
                            $('.storage_show').removeClass('hidden');
                            $('.storage_hide').addClass('hidden');
                            $('.div_debit').addClass('hidden');
                            $('.div_credit').addClass('hidden');
                            $('.div_storage').removeClass('hidden');
                            $('.div_pension').addClass('hidden');
                            $('.div_salary').addClass('hidden');
                            break;
                        case 'doc_111':
                            $('.pension_show').removeClass('hidden');
                            $('.pension_hide').addClass('hidden');
                            $('.div_debit').addClass('hidden');
                            $('.div_credit').addClass('hidden');
                            $('.div_storage').addClass('hidden');
                            $('.div_pension').removeClass('hidden');
                            $('.div_salary').addClass('hidden');
                            break;
                        case 'doc_112':
                            $('.salary_show').removeClass('hidden');
                            $('.salary_hide').addClass('hidden');
                            $('.div_debit').addClass('hidden');
                            $('.div_credit').addClass('hidden');
                            $('.div_storage').addClass('hidden');
                            $('.div_pension').addClass('hidden');
                            $('.div_salary').removeClass('hidden');
                            break;
					}
                    $filter.find('.col:visible').find('.filter-block:visible:first').css({marginTop:'20px'});
                    $filter.find('.col:visible').find('.filter-block:visible:first').css({marginTop:0});
					
					if(cT == 'doc_40'){
						
                    }else{
						
                    }

                    if(cT == 'doc_41'){
                        $('#plusPercents').addClass('hidden');
                    }else{
                        $('#plusPercents').removeClass('hidden');
                    }


                    $t.parents('ul').find('li').removeClass('active');
                    $t.parents('li').addClass('active');
                    $table.jqFilter('reset');
                    $isDebt = $('.section-navigator.js-navigator li.active a').data('cardtype') === 'doc_40';
                    $('input[name="cardfilter[features]"]').each(function(){
                        if ($isDebt === true && this.value == 35) {
                            $(this).attr('checked', true);
                        }
                        if (this.value == 36) {
                            $(this).attr('checked', true);
                        }
                    });

                    $table.find('tbody tr:not(.js-FilterHead)').addClass('hidden');
                    if(cT !== '0'){
                        $table.find('tbody tr.'+cT).removeClass('hidden');
                    }else{
                        $table.find('tbody tr').removeClass('hidden');
                    }
                    $tableL.find('tbody tr').removeClass('hidden');
                    $tableR.find('tbody tr').removeClass('hidden');
                    $table.find('.hidden').each(function(){
                        var $t = $(this),
                            id = $t.attr('data-id');
                        $tableR.find('tr[data-id='+id+']').addClass('hidden');
                        $tableL.find('tr[data-id='+id+']').addClass('hidden');
                    });
                    $table.trigger('heightChange');
                    $inp.change();
                    $filter.removeClass('active');
                }
            });


            $table.jqFilter({
                items : $table.find('tr:not(.js-FilterHead)'),
                change : function(){
                    var $cont, $contl, $contr;
                    $tableR.find('tr').removeClass('inactive');
                    $tableL.find('tr').removeClass('inactive');
                    $table.find('tr.inactive').each(function(){
                        var $t = $(this),
                            id = $t.attr('data-id');
                        $tableL.find('tr[data-id='+id+']').addClass('inactive');
                        $tableR.find('tr[data-id='+id+']').addClass('inactive');
                    });
                    $cont = $table.find('.inactive').detach();
                    $contl = $tableL.find('.inactive').detach();
                    $contr = $tableR.find('.inactive').detach();
                    $table.find('tbody').append($cont);
                    $tableL.find('tbody').append($contl);
                    $tableR.find('tbody').append($contr);
                    $filter.addClass('change');
                },
                empty : function(){
                    $empty.show();
                },
                notempty : function(){
                    $empty.hide();
                },
                reset : function(){
                    $filter.removeClass('active');
                    $table.find('tbody tr').remove();
                    $tableL.find('tbody tr').remove();
                    $tableR.find('tbody tr').remove();
                    $table.find('tbody').append($firstly);
                    $tableL.find('tbody').append($firstlyL);
                    $tableR.find('tbody').append($firstlyR);
                }
            });

            $table.jqFilter('add', {
                selector : $filter.find('[name="cardfilter[receipt]"]'),
                attribute : 'data-receipt',
                type : 'radio'
            });

            $table.jqFilter('add', {
                selector : $filter.find('[name="cardfilter[duration]"]'),
                attribute : 'data-duration',
                type : 'radio'
            });

            $table.jqFilter('add', {
                selector : $filter.find('[name="cardfilter[currency]"]'),
                attribute : 'data-currency',
                type : 'checkbox'
            });

            $table.jqFilter('add', {
                selector : $filter.find('[name="cardfilter[limit]"]'),
                attribute : 'data-limit',
                type : 'radio'
            });

            $table.jqFilter('add', {
                selector : $filter.find('[name="cardfilter[type]"]'),
                attribute : 'data-type',
                type : 'radio'
            });

            $table.jqFilter('add', {
                selector : $filter.find('[name="cardfilter[features]"]'),
                attribute : 'data-features',
                type : 'checkbox'
            });

            $inp.change(function(){
                var $t = $(this);
                if($t.is(':checked')){
                    $filter.addClass('active');
                }
            });
            $reset.click(function(){
                $table.jqFilter('reset');
                $isDebt = $('.section-navigator.js-navigator li.active a').data('cardtype') === 'doc_40';
                $('input[name="cardfilter[features]"]').each(function(){
                    if ($isDebt === true && this.value == 35) {
                        $(this).attr('checked', true);
                    }
                    if (this.value == 36) {
                        $(this).attr('checked', true);
                    }
                });
                $inp.change();
                $filter.removeClass('active');
            });

        $firstly = $table.find('tbody tr').detach();
        $firstlyL = $tableL.find('tbody tr').detach();
        $firstlyR = $tableR.find('tbody tr').detach();

        $table.find('tbody').append($firstly);
        $tableL.find('tbody').append($firstlyL);
        $tableR.find('tbody').append($firstlyR);

        if(document.location.hash == "#creditcards"){
            $nav.filter('a[data-cardtype="doc_41"]').trigger('click');
        }else if(document.location.hash == "#debetcards"){
            $nav.filter('a[data-cardtype="doc_40"]').trigger('click');
        } else if(document.location.hash == "#storagecards"){
            $nav.filter('a[data-cardtype="doc_110"]').trigger('click');
        } else if(document.location.hash == "#pensioncards"){
            $nav.filter('a[data-cardtype="doc_111"]').trigger('click');
        } else if(document.location.hash == "#salarycards"){
            $nav.filter('a[data-cardtype="doc_112"]').trigger('click');
        } else {
            $("input[value='36']").attr('checked', true);
        }

        $inp.change();
        $filter.removeClass('active');
    }
});



/*Фильтр по вкладам*/
$(function(){
    var $filter = $('.new-deposit-filter');

    if($filter.length){
        var $inp = $filter.find('input'),
            $selects = $filter.find('select'),
            $currencySlider = $filter.find('[name="deposit[currency]"]'),
            $table = $('.scrollTable'),
            $tableL = $('.table-left'),
            $tableR = $('.table-right'),
            $empty = $('.empty-filter'),
            $reset = $('.js-filter-reset'),
            $ovf = $('.filter-list .ovf'),
            $firstly = {},
            $firstlyL = {},
            $firstlyR = {},
            $slider = $filter.find('.deposit-slider-input'),
            $summ = $filter.find('#summ');




        /*Параметры вкладов*/
        var minVal = 5000;

        $table.jqFilter({
            items : $table.find('tr:not(.js-FilterHead)'),
            change : function(){
                var $cont, $contl, $contr;
                $tableR.find('tr').removeClass('inactive');
                $tableL.find('tr').removeClass('inactive');
                $table.find('tr.inactive').each(function(){
                    var $t = $(this),
                        id = $t.attr('data-id');
                    $tableL.find('tr[data-id='+id+']').addClass('inactive');
                    $tableR.find('tr[data-id='+id+']').addClass('inactive');
                });
                $cont = $table.find('.inactive').detach();
                $contl = $tableL.find('.inactive').detach();
                $contr = $tableR.find('.inactive').detach();
                $table.find('tbody').append($cont);
                $tableL.find('tbody').append($contl);
                $tableR.find('tbody').append($contr);
                $filter.addClass('change');
                $filter.find('select').awSelect('update');
                $filter.addClass('active');
                recalculate();
            },
            empty : function(){
                $empty.show();
            },
            notempty : function(){
                $empty.hide();
            },
            reset : function(){
                $filter.removeClass('active');
                $table.find('tbody tr').remove();
                $tableL.find('tbody tr').remove();
                $tableR.find('tbody tr').remove();
                $table.find('tbody').append($firstly);
                $tableL.find('tbody').append($firstlyL);
                $tableR.find('tbody').append($firstlyR);
            }
        });

        $table.jqFilter('add', {
            selector : $filter.find('[name="deposit[percents]"]'),
            attribute : 'data-percents',
            type : 'radio'
        });

        $table.jqFilter('add', {
            selector : $filter.find('[name="deposit[currency]"]'),
            attribute : 'data-currency',
            type : 'select'
        });

        $table.jqFilter('add', {
            selector : $filter.find('[name="deposit[period]"]'),
            attribute : 'data-period',
            type : 'select',
	        value: 370
        });

        $table.jqFilter('add', {
            selector : $filter.find('[name="deposit[options]"]'),
            attribute : 'data-options',
            type : 'checkbox'
        });

        $table.jqFilter('add', {
            selector : $summ,
            type : 'number',
            attribute : 'data-min',
            def: function(){
                var currency = $currencySlider.find(':selected').val();
                if(currency === 'rur'){
                    return splitGroups(350000, ' ');
                }
                if(currency === 'usd'){
                    return 200;
                }
                if(currency === 'eur'){
                    return 200;
                }
            },
            callback : function(data){
                var $item = $(data.item),
                    currency = $currencySlider.find(':selected').val(),
                    attribute = "data-minrur";

                switch(currency){
                    case 'rur':
                        attribute = "data-minrur"
                        break;
                    case 'usd':
                        attribute = "data-minusd"
                        break;
                    case 'eur':
                        attribute = "data-mineur"
                        break;
                }
				
				/*new*/
				var val = data.value;
				val = new String(val).replace(/\s/g, '');
				data.value = parseFloat(val, 10);
				/*new*/
				
                var attrval = parseFloat($item.attr(attribute), 10);
                if(data.value === undefined){
                    data.value = this.def();
                }
                if(data.value >= attrval){
                    return true
                }else{
                    return false;
                }
            }
        });

        $inp.change(function(){
            var $t = $(this);
            if($t.is(':checked')){
                $filter.addClass('active');
            }
        });
        $selects.change(function(){
            var $t = $(this);
            $filter.addClass('active');
        });

        $reset.click(function(){
            $table.jqFilter('reset');
        });


        initSlider();
        $currencySlider.change(function(){
            initSlider();
        });
	    $table.jqFilter('apply');



        $summ.on('change', function(){
            var $t = $(this),
                val = $t.val().replace(/\s/g, '');
            val = parseInt(val, 10);
            if(isNaN(val)){
                $t.val(0);
            }else{
				$t.val(splitGroups(val, ' '));
			}
            $slider.slider('option', 'value', toSlider(val));
        });

        $firstly = $table.find('tbody tr').detach();
        $firstlyL = $tableL.find('tbody tr').detach();
        $firstlyR = $tableR.find('tbody tr').detach();

        $table.find('tbody').append($firstly);
        $tableL.find('tbody').append($firstlyL);
        $tableR.find('tbody').append($firstlyR);


			recalculate();

	}

    function recalculate(){
		var s = $filter.find('[name="deposit[period]"]').get(0);
        var summ = parseFloat($('#summ').val().replace(/\s/g, ''), 10),
            period =  $filter.find('[name="deposit[period]"] :selected').val()  || s.options[s.selectedIndex].value,
            currency = $currencySlider.find(':selected').val(),
            settings = DEPOSIT_PERCENTS,
            $pTable = $('.scrollTable'),
            $items = $('.scrollTable tr');
	    $('.js-vklad-order-trigger').attr('data-currency', currency);
	    $('.js-vklad-order-trigger').attr('data-summ', summ);
	    $('.js-vklad-order-trigger').attr('data-period', $filter.find('[name="deposit[period]"] :selected').html());

		
        if(period !== '-1'){
            // Есть срок вклада, считаем %
            //Нет срока вклада, выводим базовую ставку
			// + 'и итоговый % годовых'
            $items.each(function(){
                var $t = $(this),
                    id = $t.attr('data-id');

                if(id !== '-1'){
                    if(!$t.hasClass('inactive')){
                        /*Считаем доход*/
                        var days, p,pviwe , s, array, dep, curr;
                        dep = settings['deposit' + id];
                        days = parseInt(period, 10);
                        if(dep.trigger === 'period'){
                            array = settings['deposit'+id].periods[currency];
                        }
                        if(dep.trigger === 'summ'){
                            if(summ >= dep.summ){
                                array = dep.periodsMore[currency];
                            }else{
                                array = dep.periodsLess[currency];
                            }
                        }


                        $.each(array, function(i, element){
                            //console.log(element.period || 'error');
                            if(element.period === days){
                                p = element.percents;
                                pviwe = element.percents_viwe;
                            }
                        });

                        if(currency === 'rur'){
                            curr = 'руб.';
                        }
                        if(currency === 'usd'){
                            curr = '$';
                        }
                        if(currency === 'eur'){
                            curr = '&euro;'
                        }

                        /*Главная формула*/
                        //s = (((p/100)/365) * days)*summ;
                        var m = 1;

                        switch(id){
                            case '18':
                                m = 1;
                                break;
                            case '19':
                                m = 4;
                                break;
                            case '20':
                                m = 12;
                                break;
                            case '21':
                                m = 365;
                                break;
                            case '22':
                                m = 12;
                                break;
                            case '23':
                                m = 12;
                                break;
                        }

                        /*if($('input[name="deposit[percents]"][value="38"]').is(':checked')){
                            s = summ * (1 + (p/100)*days/365) - summ;

                        }else{
                            var new_p = parseFloat((Math.pow(1 + (p /100) / m, m * days/365) - 1)/(m * days/365)*m, 10);
                            s = summ * new_p * (days/365);
                            new_p = (new_p*100).toFixed(2);
                        }*/
                        /*console.log(p);
                        console.log(new_p);*/
                        //console.log(s);

                        s = summ * (1 + (p/100)*days/365) - summ;

                        var html = splitGroups(Math.round(s), '&nbsp;') + ' ' + curr,
                            full_summ = splitGroups(Math.round(summ+s), '&nbsp') + ' ' + curr;
                        //+ '<br> ' + (new_p || p) + '%';
                        if(!isNaN(p)){
                            $t.find('td.table-deposit-percents').html(pviwe + '%');
                        }else{
                            $t.find('td.table-deposit-percents').html('—');
                        }
                        if(!isNaN(s)){
                            $t.find('td.table-deposit-percents').html(pviwe + '%');
                            $t.find('td.table-deposit-income').html(html);
                            $t.find('td.table-deposit-summ').html(full_summ);
                        }else{
                            $t.find('td.table-deposit-percents').html('—');
                            $t.find('td.table-deposit-income').html('—');
                            $t.find('td.table-deposit-summ').html('—');
                        }

                    }else{
                        $t.find('td.table-deposit-income').html('—');
                        $t.find('td.table-deposit-summ').html('—');
                        $t.find('td.table-deposit-percents').html('—');
                    }
                }
            });
            $table.trigger('heightChange');
        }else{
            //Нет срока вклада, выводим базовую ставку
            $items.each(function(){
                var $t = $(this),
                    id = $t.attr('data-id');
                if(id !== '-1'){
                    var p = settings['deposit'+id].percentsMin;
                    $t.find('td.table-deposit-percents').html(p);
	                $t.find('td.table-deposit-income').html('—');
	                $t.find('td.table-deposit-summ').html('—');
                }
            });
            $table.trigger('heightChange');
        }




    }

    function initSlider(){
        var currency = $currencySlider.find(':selected').val();

        if(currency == 'rur'){
	        $filter.find('.start-range').html('5&nbsp;000');
	        $filter.find('.range2').html('100&nbsp;000');
	        $filter.find('.range3').html('1&nbsp;000&nbsp;000');
	        $filter.find('.range4').html('10&nbsp;000&nbsp;000');
            $slider.slider({
                min : toSlider(5000),
                max : toSlider(100000000),
                value : toSlider(350000),
                step : 0.01,
	            range: "min",
                slide: function(event, ui){
                    $summ.val(splitGroups(tround(fromSlider(ui.value), 2), ' '));
                },
                change : function(event, ui){
                    //$summ.val(splitGroups(tround(fromSlider(ui.value), 2), ' '));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }

        if(currency == 'eur'){
	        $filter.find('.start-range').html(200);
	        $filter.find('.range2').html('10&nbsp;000');
	        $filter.find('.range3').html('200&nbsp;000');
	        $filter.find('.range4').html('4&nbsp;000&nbsp;000');
            $slider.slider({
                min : toSlider(200),
                max : toSlider(100000000),
                value : toSlider(7500),
	            step : 0.01,
	            range: "min",
                slide: function(event, ui){
                    $summ.val(splitGroups(tround(fromSlider(ui.value), 1), ' '));
                },
                change : function(event, ui){
                    //$summ.val(splitGroups(tround(fromSlider(ui.value), 1), ' '));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }

        if(currency == 'usd'){
	        $filter.find('.start-range').html(200);
	        $filter.find('.range2').html('10&nbsp;000');
	        $filter.find('.range3').html('200&nbsp;000');
	        $filter.find('.range4').html('4&nbsp;000&nbsp;000');
            $slider.slider({
                min : toSlider(200),
                max : toSlider(100000000),
                value : toSlider(7500),
	            step : 0.01,
	            range: "min",
                slide: function(event, ui){
                    $summ.val(splitGroups(tround(fromSlider(ui.value), 1), ' '));
                },
                change : function(event, ui){
                    //$summ.val(splitGroups(tround(fromSlider(ui.value), 1), ' '));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }
    };
});

/*Переводы*/
$(function(){
    var $filter = $('.transfer-filter');

    if($filter.length){
        var $inp = $filter.find('input'),
            $currencySlider = $filter.find('[name="transfer[currency]"]'),
            $slider = $filter.find('.slider-input'),
            $summ = $('#summ');




        /*Параметры вкладов*/
        var minVal = 5000;


        initSlider();
        $currencySlider.change(function(){
            initSlider();
        });
        $summ.on('change', function(){
            var $t = $(this),
                val = $t.val();
            if(val != ''){
				val = parseInt(val, 10);
				if(isNaN(val)){
					val = minVal;
				}
			}
            /*$slider.slider('option', 'value', val);*/
        });
		
		$summ.on('keyup', function(){
			var $t = $(this),
                val = $t.val();
			if(val != ''){
				val = parseInt(val, 10);
				if(isNaN(val)){
					val = minVal;
				}
				
				if(val > fromSlider($slider.slider('option', 'max'))){
					val = fromSlider($slider.slider('option', 'max'));
				}
				$t.val(val);
			}
			recalculate();
		});
    }

    function recalculate(){
		var summ = $('#summ').val();
        if(summ !== ''){
		var summ = parseFloat($('#summ').val(), 10),
            currency = $currencySlider.find(':selected').val();

        var transferComissions = {
            rur : [
                {
                    min : 0,
                    max : 2000,
                    com : 30,
					type: 'fix'
                },
                {
                    min : 2000,
                    max : 150000,
                    com : 1.5,
					type : '%'
                },
                {
                    min : 150000,
                    max : 250000,
                    com : 1.2,
					type : '%'
                },
                {
                    min : 250000,
                    max : 350000,
                    com : 0.7,
					type : '%'
                },
                {
                    min : 350000,
                    max : 500000,
                    com : 0.6,
					type: '%'
                },
                {
                    min : 500000,
                    max : 590000,
                    com : 0.4,
					type: '%'
                }
            ],
            eur : [
                {
                    min : 0,
                    max : 300,
                    com : 7,
					type: 'fix'
                },
                {
                    min : 300,
                    max : 5000,
                    com : 2,
					type: '%'
                },
                {
                    min : 5000,
                    max : 15000,
                    com : 99,
					type: 'fix'
                }
            ],
            usd : [
                {
                    min : 0,
                    max : 300,
                    com : 7,
					type: 'fix'
                },
                {
                    min : 300,
                    max : 5000,
                    com : 2,
					type: '%'
                },
                {
                    min : 5000,
                    max : 15000,
                    com : 99,
					type: 'fix'
                }
            ]
        };
		
		
			var array = transferComissions[currency];

			var com = 0,
				comType = '';

			$.each(array, function(i, el){
				if(summ > el.min && summ <= el.max){
					com = el.com;
					comType = el.type;
				}
			});
			
			if(comType === '%'){
				com = Math.round(summ * (com/100));
			}

			switch(currency){
				case 'rur':
					com = com + ' руб.'
					break;
				case 'usd':
					com = '$' + com;
					break;
				case 'eur':
					com = '&euro;' + com;
					break;
			}

		   $('#comission').html(com);
	   }else{
			$('#comission').html('—');
	   }
    }

    function initSlider(){
        var currency = $currencySlider.find(':selected').val();

        if(currency == 'rur'){
            $slider.slider({
                min : toSlider(1),
                max : toSlider(590000),
                value : toSlider(10000),
                step: 0.01,
                slide: function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 2));
                },
                change : function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 2));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }

        if(currency == 'eur'){
            $slider.slider({
                min : toSlider(1),
                max : toSlider(15000),
                value : toSlider(150),
                step : 0.01,
                slide: function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 2));
                },
                change : function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 2));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }

        if(currency == 'usd'){
            $slider.slider({
                min : toSlider(1),
                max : toSlider(15000),
                value : toSlider(150),
                step : 0.01,
                slide: function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 2));
                },
                change : function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 2));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }
    };
});

/*Курсы валют*/

$(function(){
    var $filter = $('.exchange-filter');

    if($filter.length){
        var $inp = $filter.find('input'),
            $currencySelect = $filter.find('[name="exchange[currency]"]'),
            $operationSelect = $filter.find('[name="exchange[operation]"]'),
            $slider = $filter.find('.slider-input'),
            $summ = $('#summ');


        initSlider();
        $currencySelect.change(function(){
            initSlider();
        });
        $summ.on('change', function(){
            var $t = $(this),
                val = $t.val();
            val = parseFloat(val, 10);

            if(isNaN(val)){
                val = 1;
            }
            /*$slider.slider('option', 'value', val);*/
        });
		
		$summ.on('keyup', function(){
			var $t = $(this),
                val = $t.val();
            val = parseFloat(val, 10);

            if(isNaN(val)){
                val = 1;
            }
			recalculate();
		});

        $operationSelect.change(function(){
            recalculate();
        });

        recalculate();
    }

    function recalculate(){
        var $summ = $('#summ'),
            summ = parseFloat($('#summ').val(), 10),
            currency = $currencySelect.find(':selected').val(),
            operation = $operationSelect.find(':selected').val(),
            $result = $('#result'),
            result = '',
            course = 0;

        //data-buy-usd="30" data-sell-usd="31" data-buy-eur="40" data-sell-eur="41"
		if(!isNaN(summ)){
			if(operation === 'buy' && currency === 'usd'){
				course = parseFloat($summ.attr('data-sell-usd'), 10);
				result = 'Вам необходимо ' + (course*summ).toFixed(2)  + ' руб';
			}
			if(operation === 'sell' && currency === 'usd'){
				course = parseFloat($summ.attr('data-buy-usd'), 10);
				result = 'Вы получите ' + (course*summ).toFixed(2) + ' руб.';
			}

			if(operation === 'buy' && currency === 'eur'){
				course = parseFloat($summ.attr('data-sell-eur'), 10);
				result = 'Вам необходимо ' + (course*summ).toFixed(2) + ' руб';
			}
			if(operation === 'sell' && currency === 'eur'){
				course = parseFloat($summ.attr('data-buy-eur'), 10);
				result = 'Вы получите ' + (course*summ).toFixed(2) + ' руб.';
			}
		}else{
			result = 'Укажите правильную сумму';
		}

        $('#result').html(result);
    }

    function initSlider(){
        var currency = $currencySelect.find(':selected').val();
        if(currency == 'eur'){
            $slider.slider({
                min : toSlider(1),
                max : toSlider(100000),
                value : toSlider(200),
                step : 0.01,
                slide: function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 1));
                },
                change : function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 1));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }

        if(currency == 'usd'){
            $slider.slider({
                min : toSlider(1),
                max : toSlider(100000),
                value : toSlider(200),
                step : 0.01,
                slide: function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 1));
                },
                change : function(event, ui){
                    $summ.val(tround(fromSlider(ui.value), 1));
                    $summ.trigger('keyup');
                    recalculate();
                }
            });
        }
    };
});

/*Схемы лайт офиссов*/
$(function(){
    if($('.colsScheme').length){
        var $trigger = $('a.colsScheme, a.colsPhoto'),
            $popup = $('#colSchemes'),
            $over = $('#Overlay'),
            $close = $popup.find('.close');

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.stopTime();
        });

        $trigger.click(function(){
            $popup.find('.item').hide();
            var id = $(this).attr('data-id'),
                rel = $(this).attr('data-rel');

            $popup.find('.item[data-id='+id+']').show();
            $popup.find('.item[data-id='+id+'] a[data-rel='+rel+']').trigger('click');
            $popup.show();
            $over.show();
        });

        var $items = $popup.find('.item');
        $items.find('.scheme-navigator a').click(function(){
            if(!$(this).parents('li').hasClass('active')){
                var $t = $(this),
                    $nav = $t.parents('ul'),
                    $item = $(this).parents('.item');

                $nav.find('li').removeClass('active');
                $t.parent('li').addClass('active');

                var rel = $t.attr('data-rel');
                $item.find('.imgpage').hide();
                $item.find('.'+rel).show();
            }
        });
    }
})

$(function(){
    var $trigger = $('.worktimeTrigger');
    if($trigger.length){
        var $wt = $('.worktime');

        $trigger.click(function(){
            $wt.stop(true, true);
            if(!$trigger.hasClass('active')){
                $trigger.addClass('active');
                $wt.slideDown();
            }else{
                $trigger.removeClass('active');
                $wt.slideUp();
            }
        });
    }
});

$(function(){
    var $trigger = $('.reqTrigger');
    if($trigger.length){
        var $wt = $('.req');

        $trigger.click(function(){
            $wt.stop(true, true);
            if(!$trigger.hasClass('active')){
                $trigger.addClass('active');
                $wt.slideDown();
            }else{
                $trigger.removeClass('active');
                $wt.slideUp();
            }
        });
    }
});

/*Контакты*/
$(function(){
    if($('.js-contacts-filter').length){
        var $trigger = $('.js-contacts-filter'),
            $over = $('#Overlay'),
            $popup = $('#atmsFilter'),
            $form = $popup.find('form'),
            $close = $popup.find('.close'),
            $submit = $popup.find('.submit .btn');

        $over.click(function(){
            $popup.hide();
            $over.hide();
        });

        $submit.click(function(){
            $popup.hide();
            $over.hide();
            $('html, body').animate({scrollTop: $('#PermATMS').offset().top - 70});
        });

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.removeClass('error').removeClass('error').removeClass('success');
            $form.find('input, textarea').val('');
            $popup.stopTime();
        });

        $trigger.click(function(){
            $popup.show();
            $over.show();
        });
    }
});



$(function(){
    var $filter = $('.filter-contacts');
    if($('.atms-table').length){
        var $inp = $filter.find('input'),
            $table = $('.atms-table'),
            $table2 = $('#regionTable'),
            $empty = $('.empty-filter'),
            $reset = $('.js-filter-reset'),
            $firstly = {},
            $firstly2 = {},
            $rinput = $filter.find('.row>label input'),
            $input = $filter.find('input');
			$('#RegionTerminals').hide();

        var atmMap,
            colMap,
            atmMapReady = false,
            colMapReady = false,
            atmObjects,
            colObjects,
            isAtmMapInit = false,
            isColMapInit = false;

        var $atmFilterLink = $('.atmFilterLink'),
            $region = $('.permRegBankomats');


        var $regSelector = $('.region-selector a');

        $regSelector.click(function(){
            var $t = $(this);
            var id = $t.attr('data-id');
            $('html,body').stop(true, true);
            $('html,body').animate({scrollTop: $('#'+id).offset().top - 70}, 300);
        });

        $region.click(function(){
            $('html, body').animate({scrollTop: $('#PermReg').offset().top - 50});
        });

        var $geoInput = $filter.find('input[name="contacts[geocoder]"]'),
	        $geoHouse = $filter.find('input[name="contacts[geocoderHouse]"]'),
            $geoBtn = $filter.find('.geocoder button'),
            geocoords = [],
            $geoInactiveObjects = [];


        $firstly = $table.find('tbody tr:not(.js-FilterHead)');
        $firstly2 = $table2.find('tbody tr:not(.js-FilterHead)');

        $table.jqFilter({
            items : $table.find('tbody tr:not(.js-FilterHead)').add($table2.find('tbody tr:not(.js-FilterHead)')),
            change : function(){
                var $cont, $cont2;
                $cont = $table.find('tbody .inactive').detach();
                $cont2 = $table2.find('tbody .inactive').detach();
                $table.find('tbody').append($cont);
                $table2.find('tbody').append($cont2);
                $filter.addClass('change');
                $filter.addClass('active');
                if(!isAtmMapInit){
                    mapInit('atms');
                    isAtmMapInit = true;
                }else{
                    atmRedraw();
                }
            },
            empty : function(){
                $empty.show();
            },
            notempty : function(){
                $empty.hide();
            },
            reset : function(){
                $filter.removeClass('active');
                $filter.find('.sub-row').hide();
                $filter.find('label').removeClass('checked');
                $table.find('tbody tr').remove();
                $table.find('tbody').append($firstly);
                $table2.find('tbody tr').remove();
                $table2.find('tbody').append($firstly2);
                geocoords = [];
                $geoInput.val('');
                $geoHouse.val('');
                /*if(!isAtmMapInit){
                    mapInit('atms');
                    isAtmMapInit = true;
                }else{
                    atmRedraw();
                }*/
            }
        });

        $table.jqFilter('add', {
            selector : $filter.find('[name="contacts[options]"]'),
            attribute : 'data-options',
            type : 'checkbox'
        });

       /* $table.jqFilter('add', {
            selector : $filter.find('[name="contacts[getcashcurrency]"]'),
            attribute : 'data-getcashcurrency',
            type : 'checkbox'
        });*/

        $table.jqFilter('add', {
            selector : $filter.find('[name="contacts[rechargecard]"]'),
            attribute : 'data-rechargecard',
            type : 'checkbox'
        });

        /*$table.jqFilter('add', {
            selector : $filter.find('[name="contacts[payservices]"]'),
            attribute : 'data-payservices',
            type : 'checkbox'
        });*/

        $table.jqFilter('add', {
            selector : $filter.find('[name="contacts[payservicescash]"]'),
            attribute : 'data-payservicecash',
            type : 'checkbox'
        });




        $inp.change(function(){
            var $t = $(this);
            if($t.is(':checked')){
                $filter.addClass('active');
            }
        });

        $reset.click(function(){
            $table.jqFilter('reset');
        });

        $rinput.change(function(){
            var $t = $(this);
            if($t.is(':checked')){
                $t.parents('.row').find('.sub-row').show();
            }else{
                $t.parents('.row').find('.sub-row').hide();
                $t.parents('.row').find('.sub-row input').removeAttr('checked');
                $t.parents('.row').find('.sub-row input').trigger('change');
            }
        });

        $input.change(function(){
            var $t = $(this);
            if($t.is(':checked')){
                $t.parents('label').addClass('checked');
            }else{
                $t.parents('label').removeClass('checked');
            }
        });

        hashCheck();
        $(window).hashchange(function(){
            hashCheck();
        });

        var $legend = $('.legend');
        $legend.find('a').click(function(){
            var $t = $(this);
            if(!$t.hasClass('active')){
                $legend.find('a').removeClass('active');
                $t.addClass('active');
            }else{
                $legend.find('a').removeClass('active');
            }
            atmRedraw();
        });

        $geoBtn.click(function(){
            if($geoInactiveObjects.length){
                $.each($geoInactiveObjects, function(i, elem){
                    $(elem).removeClass('inactive');
                });
                $geoInactiveObjects = [];
            }

            if(!$geoInput.val().length){
                $geoInput.parents('.geocoder').find('label[for="GeocoderInput"]').addClass('lerror');
            }else{
	            $('#atmsFilter').hide();
	            $('.overlay').hide();
	            $('html, body').animate({scrollTop: $('#PermATMS').offset().top - 70}, 300);
                $geoInput.parents('.geocoder').find('label').removeClass('lerror');
                var string = 'Пермь, ' + $geoInput.val()+ ', ' + $geoHouse.val(),
                    myGeocoder = ymaps.geocode(string);
                    myGeocoder.then(
                        function(res){
                            if(res.geoObjects.get(0) !== null){
                                geocoords = res.geoObjects.get(0).geometry.getCoordinates();
                                if(!isAtmMapInit){
                                   mapInit('atms');
                                   isAtmMapInit = true;
                                }else{
                                    atmRedraw();
                                }

                            }else{
                                alert('К сожалению мы не смогли определить Ваше местоположение, проверьте введенный адрес')
                            }

                        },
                        function(err){
                            alert('К сожалению произошел технический сбой, попробуйте повторить поиск позже, или обратитесь в банк.');
                        }
                    )
            }
        });
    }



    function hashCheck(){
        var hash = document.location.hash,

        hash = hash.replace('#', '');


        var hashArr = hash.split('/');

        var lvl1, lvl2, cls;

        if(hashArr[0] === undefined || hashArr[0] === ''){
            hashArr[0] = 'atms';
        }
        if(hashArr.length > 1){
            lvl1 = hashArr[0];
            lvl2 = hashArr[1];
        }else{
            lvl1 = hashArr[0];
            lvl2 = 'list';
        }

        if(lvl1 !== 'atms'){
            $('.filter-contacts').hide();
			$('#RegionTerminals').hide();
        }else{
            $('.filter-contacts').show();
			$('#RegionTerminals').show();
        }

        cls = lvl1 + '-' + lvl2;


        $('.js-page').hide();
        $('.js-page.'+lvl1).show();

        $('.js-sub-page').hide();
        $('.js-sub-page.'+cls).show();

        var $nav = $('.js-navigator');
        $nav.find('li').removeClass('active');
        $nav.find('a[href="#'+lvl1+'"]').parents('li').addClass('active');
        $nav.find('a[href="#'+lvl1+'/'+lvl2+'"]').parents('li').addClass('active');

        if(lvl1 === 'atms' && lvl2 === 'list'){
            scrollStripe();
        }

        if(lvl2 === 'map'){
            if(lvl1 === 'atms'){
                if(!isAtmMapInit){
                    mapInit('atms', hashArr[2]);
                    $filter.find('input').change(function(){
                        atmRedraw(hashArr[2]);
                    });
                    isAtmMapInit = true;
                }else{

                    atmRedraw(hashArr[2]);
                }
            }else{
                if(!isColMapInit){
                    mapInit('cols', hashArr[2]);
                    $filter.find('input').change(function(){
                        colRedraw(hashArr[2]);
                    });
                    isColMapInit = true;
                }else{
                    colRedraw(hashArr[2]);
                }
            }
        }
    }

    function scrollStripe(){
        var $stripe = $('.scrollable-stripe');
        $stripe.removeClass('fixed');
        var st = $stripe.offset().top;
        var $sp = $('#stripePosition');

        if($stripe.length){
            $(window).unbind('scroll.Stripe');
            $(window).on('scroll.Stripe', function(){
                checkScroll();
            });
        }

        function checkScroll(){
            if($(window).scrollTop() > st){
                $stripe.css({left: $sp.offset().left, width: $sp.width() - 40});
                $stripe.addClass('fixed');
            }else{
                $stripe.removeClass('fixed');
                $stripe.css({left: 0, width: 'auto'});
            }
        }
    }

    function mapInit(type, id){
        var atmSelector = 'atmMap',
            colSelector = 'colMap',
            string = 1,
            $container,
            isVisible;


        if(type == 'atms'){
            $container = $('#'+atmSelector).parents('.js-sub-page');
        }else{
            $container = $('#'+colSelector).parents('.js-sub-page');
        }

        isVisible = $container.is(':visible');

        ymaps.ready(mapRender);

        function mapRender(){
            if(!isVisible){
                $container.show();
            }
            /*ATM*/
            if(type == 'atms'){
                /*atms*/
                if(!atmMapReady){
                    atmMap = new ymaps.Map(atmSelector, {
                        center: [55.76, 37.64],
                        zoom: 7
                    });
                    atmObjects =  new ymaps.GeoObjectCollection();
                    atmMap.geoObjects.add(atmObjects);
                    atmMap.controls.add(
                        new ymaps.control.ZoomControl()
                    );
                    atmMapReady = true;
                }
                atmRedraw(id);
            }else{
                /*cols*/
                if(!colMapReady){
                    /*COLS*/
                    colMap = new ymaps.Map(colSelector, {
                        center: [55.76, 37.64],
                        zoom: 7
                    });
                    colMap.controls.add(
                        new ymaps.control.ZoomControl()
                    );
                    colObjects =  new ymaps.GeoObjectCollection();
                    colMap.geoObjects.add(colObjects);
                    colMapReady = true;
                }
                colRedraw(id);
            }

            if(!isVisible){
                $container.hide();
            }
        }
    }

    function atmRedraw(id){
        var $items = $('.atms-table').find('tr:not(.js-FilterHead):not(.inactive)');


        if($items.length){
            var min = [{
                id: -1,
                dist: 10000000
            },{
                id: -1,
                dist: 10000000
            },{
                id: -1,
                dist: 10000000
            }];

            atmObjects.removeAll();

            var cId = id,
                curLat,
                curLon,
                curPm,
                $legend = $('.legend');
            var radCounter  = 0;

            if($legend.find('.active').length){
                var dType = $legend.find('.active').attr('data-type');
                if(dType!=undefined && dType!=''){
                    $items = $items.filter('[data-type="'+dType+'"], [data-type2="'+dType+'"]');
                }
            }

			$($items.get().reverse()).each(function(){
                var $t = $(this),
                    id = $t.attr('data-id'),
                    lat = $t.attr('data-lat'),
                    lon = $t.attr('data-lon'),
                    icon = $t.attr('data-icon'),
                    title = $t.attr('data-title'),
                    placemark;


                if(lat != '' && lon != ''){
                    placemark = new ymaps.Placemark([lat, lon], {
                        content: 'Банкоматы и терминалы',
                        balloonContent: title
                    },{
                        iconImageHref: icon, // картинка иконки
                        iconImageSize: [38, 36], // размеры картинки
                        iconImageOffset: [-14, -36] // смещение картинки
                    });

                    placemark.tView = $t;

                    if(geocoords.length){
                        var distance = ymaps.coordSystem.geo.getDistance(geocoords,[lat, lon]);
                        if((min[0].dist > distance || min[1].dist > distance || min[2].dist > distance) && distance > 1000){
                            if(min[0].dist > distance){
                                min[0] = {
                                    id: id,
                                    dist: distance,
                                    placemark : placemark
                                };
                            }else if (min[1].dist > distance){
                                min[1] = {
                                    id: id,
                                    dist: distance,
                                    placemark : placemark
                                };
                            }else if(min[2].dist > distance){
                                min[2] = {
                                    id: id,
                                    dist: distance,
                                    placemark : placemark
                                };
                            }
                        }
                    }



                    if(cId !== undefined && cId === id){
                        curLat = lat;
                        curLon = lon;
                        curPm = placemark;
                    }
                    if(!geocoords.length){
                        atmObjects.add(placemark);
                    }else{
                        if(distance < 1000){
                            atmObjects.add(placemark);
                            radCounter ++;
                        }else{
                            $geoInactiveObjects.push($t);
                            $t.addClass('inactive');
                        }
                    }
                }
                /*1*/
            });


            if(radCounter < 3){
                var endP = 3 - radCounter;
                for(var cn = 0; cn < endP; cn++){
                    if(min[cn] !== undefined && min[cn].id !== -1){
                        atmObjects.add(min[cn].placemark);
                        $(min[cn].placemark.tView).removeClass('inactive');
                        radCounter ++;
                    }
                }
            }


            if(geocoords.length){
	            var house = $geoHouse.val();
	            if(house.length){
		            house = ', ' + house;
	            }
                var youPlacemark = new ymaps.Placemark(geocoords, {
                    content: 'Это Вы',
                    iconContent: '<span style="font-size:12px; line-height:12px;">Вы</span>',
                    balloonContent: '<strong>Это Вы!</strong><br> ' + $geoInput.val() + house
                },{
                    preset: 'twirl#redIcon'
                });
                atmObjects.add(youPlacemark);
            }

            if(!geocoords.length || radCounter > 0){
                atmMap.setBounds(atmObjects.getBounds());
                if(cId !== undefined){
                   curPm.balloon.open();
                   atmMap.setCenter([curLat, curLon], 15);
                   $('html, body').animate({scrollTop: 150}, 300);
                }

                var $cont;
                $cont = $table.find('tbody').find('.inactive').detach();
                $table.find('tbody').append($cont);
                $filter.addClass('change');
                $filter.addClass('active');

                var zoom = atmMap.getZoom();
                if(zoom > 16){
                    zoom = 16;
                }
                atmMap.setZoom(zoom);
            }else{
                alert('К сожалению, мы не смогли найти ни одного банкомата по близости');
            }
        }else{
            atmMap.setCenter([58.007732, 56.232569], 16);
        }
    }

    function colRedraw(id){
        var $items = $('.cols-table').find('tr:not(.js-FilterHead):not(.inactive)');

        colObjects.removeAll();
        var cId = id,
            curLat,
            curLon,
            curPm;

        $items.each(function(){
            var $t = $(this),
                id = $t.attr('data-id'),
                lat = $t.attr('data-lat'),
                lon = $t.attr('data-lon'),
                icon = $t.attr('data-icon'),
                title = $t.attr('data-title'),
                placemark;

            placemark = new ymaps.Placemark([lat, lon], {
                content: 'Центры оперативного кредитования',
                balloonContent: title
            },{
                iconImageHref: icon, // картинка иконки
                iconImageSize: [38, 36], // размеры картинки
                iconImageOffset: [-14, -36] // смещение картинки
            });

            if(cId !== undefined && cId === id){
                curLat = lat;
                curLon = lon;
                curPm = placemark;
            }

            colObjects.add(placemark);
        });


        colMap.setBounds(colObjects.getBounds());
        if(cId !== undefined){
            curPm.balloon.open();
            colMap.setCenter([curLat, curLon], 15);
            $('html, body').animate({scrollTop: 150}, 300);
        }

        var zoom = colMap.getZoom();
        if(zoom > 16){
            zoom = 16;
        }

        colMap.setZoom(zoom);
    }
});

/*Карта главного офиса*/
$(function(){
    if($('#mainOfficeMap').length) {
        var $map = $('#mainOfficeMap');
        $map.before('<a href="javascript:void(0)" id="showMap" class="onPage">Показать на карте</a>');
        var $trigger = $('#showMap');
        $map.hide();
        $trigger.click(function(){
            $map.stop(true, true);
            if(!$trigger.hasClass('active')){
                $trigger.addClass('active');
                $map.show();
                ymaps.ready(mapRender);

                function mapRender(){
                    var map = new ymaps.Map('mainOfficeMap', {
                        center: [58.007732, 56.232569],
                        zoom: 15
                    });

                    var placemark = new ymaps.Placemark([58.007732, 56.232569], {
                        content: 'Экопромбанк',
                        balloonContent: '<strong>Экопромбанк</strong><br>Пермь, Екатериненская, 120'
                    },{
                        iconImageHref: '/pics/i/maps/mainoffice.png', // картинка иконки
                        iconImageSize: [38, 36], // размеры картинки
                        iconImageOffset: [-14, -36] // смещение картинки
                    });

                    map.geoObjects.add(placemark);
                }
            }else{
                $trigger.removeClass('active');
                $map.hide();
            }

        });
    }

});


/*Сейфы*/
$(function(){
    var $table = $('.safe-table'),
        $slider = $('.slider-input'),
        $safes = $table.find('.safe'),
        $input = $table.find('[name=creditSumm]'),
        $checkbox = $table.find('#checbuy');

    $checkbox.on('change', function(){
        recalculate()
    });


    if($table.length){
        $slider.slider({
            min:1,
            max: 360,
            step: 1,
            value: 31,
            slide: function(event, ui){
                $input.val(ui.value);
                recalculate();
            }
        });

        $input.on('keyup change', function(){
            var val = $(this).val();
            val = parseInt(val, 10);
            if(isNaN(val)){
                val = 0;
            }
            if(val > 360){
                val = 360;
            }
            $(this).val(val);
            $slider.slider('option', 'value', val);
            recalculate();
        });

        $safes.click(function(){
            if(!$(this).hasClass('active')){
                var rel = $(this).attr('data-rel');
                $safes.removeClass('active');
                $(this).addClass('active');
                $table.find('tbody td').removeClass('line');
                $table.find('tbody td[data-rel='+rel+']').addClass('line');
                recalculate();
            }
        });

    }

    function recalculate(){
        var period = parseInt($input.val(), 10),
            $rows = $table.find('tbody tr'),
            $cur = 0,
            $days = $('.days'),
            $label = $('.label'),
            $summ = $('.summ');

        $rows.find('td').removeClass('current');


        $rows.each(function(){
            var min = parseInt($(this).attr('data-min'), 10),
                max = parseInt($(this).attr('data-max'), 10);
            if((period >= min) && (period <= max)){
                $cur = $(this);
                return false;
            }
        });

        if($cur !== 0){
            $cur.find('.line').addClass('current');
        }

        var day = period,
            label = plural(day, 'день', 'дня', 'дней'),
            summ = $cur.find('.current').html();


        if ($("#checbuy").prop("checked")) {
            var $sum = parseFloat(summ);
            $sum = $sum + 300;
            summ = String($sum);
            summ = summ + " руб.";
        }

        $days.html(day);
        $label.html(label);
        $summ.html(summ);


    };
});

/*Визуалы*/
$(function(){
    if($('.visual').length){
        var $visual = $('.visual'),
            $ovf = $visual.find('.ovf'),
            $pages = $ovf.find('.visual-page'),
            $controls = $visual.find('.visual-controls a'),
            end = {
                w : 30,
                t : -11,
                l : -4
            },
            start = {
                w : 23,
                t : -8,
                l : 0
            },
            $pagenav = $('.visual-control-left a, .visual-control-right a'),
            $next = $('.visual-control-right a'),
            $prev = $('.visual-control-left a'),
            cur = 1,
            next = 2,
            time = 1000;

            $pages.css({left: '-100%'}).show();
            $pages.first().css({left: 0}).show();


        $pagenav.hover(function(){
            var $t = $(this),
                $img = $t.find('img');
            $img.stop(true, true);
            $img.animate({width: end.w, marginTop: end.t, marginLeft: end.l}, 150);
        }, function(){
            var $t = $(this),
                $img = $t.find('img');
            $img.stop(true, true);
            $img.animate({width: start.w, marginTop: start.t, marginLeft: start.l}, 150);
        });

        $controls.click(function(){
            if(!$(this).hasClass('active')){
                next = $(this).attr('data-page');
                $controls.removeClass('active');
                $(this).addClass('active');
                changeSlide();
            }
        });

        $next.click(function(){
            var $curMarker = $controls.filter('.active'),
                $nextMarker = {};
            if($curMarker.next('a').length){
                $nextMarker = $curMarker.next('a');
            }else{
                $nextMarker = $controls.first();
            }
            $curMarker.removeClass('active');
            $nextMarker.addClass('active');
            next = $nextMarker.attr('data-page');
            moveLeft();
        });
        $prev.click(function(){
            var $curMarker = $controls.filter('.active'),
                $nextMarker = {};
            if($curMarker.prev('a').length){
                $nextMarker = $curMarker.prev('a');
            }else{
                $nextMarker = $controls.last();
            }
            $curMarker.removeClass('active');
            $nextMarker.addClass('active');
            next = $nextMarker.attr('data-page');

            moveRight();
        });


        function changeSlide(){
            if(cur > next){
                moveRight();
            }else{
                moveLeft();
            }
        }

        function moveLeft(){
            $pages.stop(true, true);
            var $curPage = $pages.filter('[data-page=' + cur + ']'),
                $nextPage = $pages.filter('[data-page=' + next + ']');
            $curPage.css({left: 0});
            $nextPage.css({left: '100%'});
            $curPage.animate({left: '-100%'}, time, 'easeOutCubic');
            $nextPage.animate({left: '0'}, time-200, 'easeInCubic');
            cur = next;
        }
        function moveRight(){
            $pages.stop(true, true);
            var $curPage = $pages.filter('[data-page=' + cur + ']'),
                $nextPage = $pages.filter('[data-page=' + next + ']');
            $curPage.css({left: 0});
            $nextPage.css({left: '-100%'});
            $curPage.animate({left: '100%'}, time, 'easeOutCubic');
            $nextPage.animate({left: '0'}, time-200, 'easeInCubic');
            cur = next;
        }

        visualHeight();
        $(window).resize(function(){
            visualHeight();
        });
    }

    function visualHeight(){
        var paddings = 0,
            height = 333,
            $pages = $('.visual .visual-page');

        $pages.each(function(){
            var $t = $(this),
                $text = $t.find('.tcont'),
                $container = $t.find('.vtext'),
                margintop  = (height - paddings) / 2 - ($text.height() / 2);
            $container.css('padding-top', 0);
            $text.css('top', margintop);

        });
    }

});

$(function(){
    if($('#allServices').length){
        var $all = $('#allServices'),
            $list = $('.main-services-list'),
            open = 'Свернуть',
            close = 'Все услуги';

        $all.click(function(){
            var $t = $(this);
            if($t.hasClass('open')){
                $list.slideUp();
                $t.removeClass('open');
                $t.html(close);
            }else{
                $list.slideDown();
                $t.addClass('open');
                $t.html(open);
            }
        });

    }
});

/*helper*/
$(function(){
    if ($('div.helper').length) {
        var $pop =  $('div.helper .pop');
        $('div.helper a').hover(function(){
            $pop.fadeIn(300);
        },function(){
            $pop.fadeOut(300);
        })
    }
    if($('.js-helper-trigger').length){
        var $trigger = $('.js-helper-trigger'),
            $over = $('#Overlay'),
            $popup = $('#helper'),
            $close = $popup.find('.close'),
            $tabs = $popup.find('.helper-tabs'),
            $pads = $popup.find('.pads');

        if(document.location.href.indexOf('business') + 1) {
            $tabs.find('#t2').addClass('active');
            $pads.find('.t2').show().find('.column').hide().first().show();
        } else {
            $tabs.find('#t1').addClass('active');
            $pads.find('.t1').show().find('.column').hide().first().show();
        }

        $close.hover(function(){
            $(this).stop(true).animate({width: 50, height: 50, right: -60}, 200);
        }, function(){
            $(this).stop(true).animate({width: 36, height: 36, right: -50}, 200);
        });

        $close.click(function(){
            $popup.hide();
            $over.hide();
            $popup.removeClass('error').removeClass('error').removeClass('success');
            $popup.stopTime();
        });

        $trigger.click(function(){
            $popup.show();
            $over.show();
        });

        $tabs.find('a').click(function(){
            var $pad = $(this).data('t');
            $(this).parent().addClass('active').siblings().removeClass('active');

            $pads.find('.'+$pad).siblings().hide();
            $pads.find('.'+$pad).find('ul li span.active').removeClass('active');
            $pads.find('.'+$pad).show().find('.column').hide().first().show();
        });

        $pads.find('ul li a').click(function(){
            var $c = $(this).data('c'),
                $p = $(this).data('p');
            if ($c == 0) return true;
            $(this).parent().parent().parent().find('span.active').removeClass('active');
            $(this).parent().addClass('active');
            var $col = $pads.find('.column.'+$c);
            $col.find('ul').hide();
            $col.show();
            if ($c == 2) {
                $pads.find('.column').not('.1').find('span.active').removeClass('active')
                $pads.find('.column').not('.1,.2').hide();
            }
            if ($c == 3) {
                $pads.find('.column.3, .column.4').find('span.active').removeClass('active')
                $pads.find('.column.4').hide();
            }
            if ($tabs.find('.active a').data('t') == 't1') {
                $col.find('#c1_'+$c+'p'+$p).show();
            } else {
                $col.find('#c2_'+$c+'p'+$p).show();
            }
        });
    }
});

/* rktv */
var rktvFlag = false;

function ShowReaktiveStart() {
    rktvFlag = true;
    setTimeout("showRktv()",50);
}

function showRktv() {
    if ((rktvFlag) && ($("#reaktive_block").css('display')=='none')) {
        $("#reaktive_block").css({display: "block"});
        $("#reaktive_block img").css({width: 0, height: 0, left: 71, top: 0});
        $("#reaktive_block img").animate({width: 274, height: 131, left: 0, top: -125}, 200);
    }
}
function HideReaktiveStart() {
    rktvFlag = false; setTimeout("hideRktv()",50);
}

function hideRktv() {
    if ((!rktvFlag) && ($("#reaktive_block").css('display')!='none')) {
        if ($.browser.msie) $("#reaktive_block").css('display','none');
        else $("#reaktive_block").fadeOut(300);
    }
}

$(function () {
    $('#reaktive a, #reaktive_block').hover(function() {
        ShowReaktiveStart();
    }, function() {
        HideReaktiveStart();
    });
});
/* end rktv */

$(function(){
    if($('.hiddenVision').length){
        var $hv = $('.hiddenVision'),
            $hvt = $('.hiddenVisionTrigger');

        $hvt.click(function(){
            $hv.stop(true, true);
            if(!$hvt.hasClass('open')){
                $hvt.addClass('open');
                $hv.slideDown('fast');
            }else{
                $hvt.removeClass('open');
                $hv.slideUp('fast');
            }
        });
    }
});

//$(function(){
//	var if_header;
//	$.receiveMessage(function(e){
//		var h = Number( e.data.replace( /.*if_header=(\d+)(?:&|$)/, '$1' ) );
//		if ( !isNaN( h ) && h > 0 && h !== if_header ) {
//			if_header = h;
//			switch (h) {
//			   case 1:
//				  $('.popup:visible h2.headline').text('Оформить заявку на карту');
//				  break
//			   case 2:
//				  $('.popup:visible h2.headline').text('Оформить заявку на карту');
//				  break
//			   case 3:
//				  $('.popup:visible h2.headline').text('Оформить заявку на кредит');
//				  break
//			}
//		}
//	});
//});


$(function(){
    $('.opening_block a').click(function(){
        var $this = $(this);
        var $block = $this.parents('.opening_block').find('div');
        if(!$this.hasClass('lock')){
            $this.addClass('lock');
            if($this.hasClass('active')){
                $this.removeClass('active');
                $block.animate({"opacity":"0"},600,function(){
                    $block.animate({"height":"0"},600,function(){
                        $block.hide();
                        $this.removeClass('lock');
                    });
                });
            }else{
                $this.addClass('active');
                $block.show();
                $block.animate({"height":$block.find('p').height()},600,function(){
                    $block.animate({"opacity":"1"},600,function(){
                        $this.removeClass('lock');
                    });
                });
            }
        }
        return false;
    })
});