// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

//jquery timers
jQuery.fn.extend({everyTime:function(a,b,c,d){return this.each(function(){jQuery.timer.add(this,a,b,c,d);});},oneTime:function(a,b,c){return this.each(function(){jQuery.timer.add(this,a,b,c,1)})},stopTime:function(a,b){return this.each(function(){jQuery.timer.remove(this,a,b)})}});jQuery.extend({timer:{global:[],guid:1,dataKey:"jQuery.timer",regex:/^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,powers:{ms:1,cs:10,ds:100,s:1e3,das:1e4,hs:1e5,ks:1e6},timeParse:function(a){if(a==undefined||a==null)return null;var b=this.regex.exec(jQuery.trim(a.toString()));if(b[2]){var c=parseFloat(b[1]);var d=this.powers[b[2]]||1;return c*d}else{return a}},add:function(a,b,c,d,e){var f=0;if(jQuery.isFunction(c)){if(!e)e=d;d=c;c=b}b=jQuery.timer.timeParse(b);if(typeof b!="number"||isNaN(b)||b<0)return;if(typeof e!="number"||isNaN(e)||e<0)e=0;e=e||0;var g=jQuery.data(a,this.dataKey)||jQuery.data(a,this.dataKey,{});if(!g[c])g[c]={};d.timerID=d.timerID||this.guid++;var h=function(){if(++f>e&&e!==0||d.call(a,f)===false)jQuery.timer.remove(a,c,d)};h.timerID=d.timerID;if(!g[c][d.timerID])g[c][d.timerID]=window.setInterval(h,b);this.global.push(a)},remove:function(a,b,c){var d=jQuery.data(a,this.dataKey),e;if(d){if(!b){for(b in d)this.remove(a,b,c)}else if(d[b]){if(c){if(c.timerID){window.clearInterval(d[b][c.timerID]);delete d[b][c.timerID]}}else{for(var c in d[b]){window.clearInterval(d[b][c]);delete d[b][c]}}for(e in d[b])break;if(!e){e=null;delete d[b]}}for(e in d)break;if(!e)jQuery.removeData(a,this.dataKey)}}}});jQuery(window).bind("unload",function(){jQuery.each(jQuery.timer.global,function(a,b){jQuery.timer.remove(b)})});

/*MaxWidth*/
(function( $ ){
	$.fn.maxWidth = function() {

		var max = 0;

		this.each(function() {
			max = Math.max( max, $(this).width() );
		});

		return max;
	};

    $.fn.maxHeight = function() {

        var max = 0;

        this.each(function() {
            max = Math.max( max, $(this).height() );
        });

        return max;
    };
})( jQuery );


/**
 *
 *  Base64 encode / decode
 *  <!--noindex--><a rel="nofollow" href="http://www.webtoolkit.info/" title="http://www.webtoolkit.info/" class="liexternal">http://www.webtoolkit.info/</a><!--/noindex-->
 *
 **/

var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
};


//cookies
function getCookie(name) {
    var cookie = " " + document.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset);
            if (end == -1) {
                end = cookie.length;
            }
            setStr = cookie.substring(offset, end);
        }
    }
    return(setStr);
}

function setCookie (name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if(expires) expires = expires * 1000 * 60 * 60 * 24;
    var expires_date = new Date(today.getTime()+(expires));
    document.cookie = name + "=" + value+
        ((expires) ? "; expires=" + expires_date : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}




//jQuery json
(function($){var escapeable=/["\\\x00-\x1f\x7f-\x9f]/g,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};$.toJSON=typeof JSON==='object'&&JSON.stringify?JSON.stringify:function(o){if(o===null){return'null';}
var type=typeof o;if(type==='undefined'){return undefined;}
if(type==='number'||type==='boolean'){return''+o;}
if(type==='string'){return $.quoteString(o);}
if(type==='object'){if(typeof o.toJSON==='function'){return $.toJSON(o.toJSON());}
    if(o.constructor===Date){var month=o.getUTCMonth()+1,day=o.getUTCDate(),year=o.getUTCFullYear(),hours=o.getUTCHours(),minutes=o.getUTCMinutes(),seconds=o.getUTCSeconds(),milli=o.getUTCMilliseconds();if(month<10){month='0'+month;}
        if(day<10){day='0'+day;}
        if(hours<10){hours='0'+hours;}
        if(minutes<10){minutes='0'+minutes;}
        if(seconds<10){seconds='0'+seconds;}
        if(milli<100){milli='0'+milli;}
        if(milli<10){milli='0'+milli;}
        return'"'+year+'-'+month+'-'+day+'T'+
            hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
    if(o.constructor===Array){var ret=[];for(var i=0;i<o.length;i++){ret.push($.toJSON(o[i])||'null');}
        return'['+ret.join(',')+']';}
    var name,val,pairs=[];for(var k in o){type=typeof k;if(type==='number'){name='"'+k+'"';}else if(type==='string'){name=$.quoteString(k);}else{continue;}
        type=typeof o[k];if(type==='function'||type==='undefined'){continue;}
        val=$.toJSON(o[k]);pairs.push(name+':'+val);}
    return'{'+pairs.join(',')+'}';}};$.evalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(src){return eval('('+src+')');};$.secureEvalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(src){var filtered=src.replace(/\\["\\\/bfnrtu]/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered)){return eval('('+src+')');}else{throw new SyntaxError('Error parsing JSON, source is not valid.');}};$.quoteString=function(string){if(string.match(escapeable)){return'"'+string.replace(escapeable,function(a){var c=meta[a];if(typeof c==='string'){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};})(jQuery);


/*jQuery Filters*/
(function($, window, undefined){

    var settings = {
            inactiveClass : 'inactive',
            items : 'li',
            delimeter : '|',
            change : function(){},
            notempty : function(){},
            empty : function(){},
            reset : function(){}
        },
        methods = {
            init : function(options){
                if(typeof options === 'object'){
                    settings = $.fn.extend(settings, options);
                }
                var $t = this;

                return this.each(function(){
                    var $items = $(settings.items),
                        inactive = settings.inactiveClass;
                    $items.removeClass(inactive);
                    $t.data('filters', []);
                    $t.bind('change.jqFilter', events.change);
                    $t.bind('empty.jqFilter', events.empty);
                    $t.bind('notempty.jqFilter', events.notempty);
                    $t.bind('onreset.jqFilter', settings.reset);
                });
            }, // init
            add : function(filter){
                if(typeof filter === 'object' && typeof filter.attribute === 'string'){
                    var $t = $(this),
                        filters = $t.data('filters'),
                        isAdded = false,
                        index = findFilter(filters, filter);


                    if(index !== false){
                        isAdded = true;
                    }
                    if(isAdded){
                        $.extend(filters[index], filter);
                    }else{
                        filters.push(filter);
                    }

                    var event = "change.jqFilters";
                    if(filter.type === 'number'){
                        event += ' keyup.jqFilters';
                    }

                    $(filter.selector).on(event, {_self : $t, filter : filter}, events.filterChange);
                    $t.data('filters', filters);
                }else{
                    $.error('jqFilter("add", filter) - filter must be an object with properties: selector, attribute, type');
                }

            }, // add
            remove : function(name){

            }, // remove
            apply : function(){
                var $t = $(this),
                    $items = $(settings.items),
                    filters = $t.data('filters');

                $items.removeClass(settings.inactiveClass);
                $.each(filters, function(i, filter){
                    // TODO: FILTER TYPES
                    /*Проверяем есть ли функция коллбэк на фильтрацию*/
                    if(filter.callback !== undefined && typeof filter.callback === 'function'){
                        $items.each(function(){
                            var inFilter = true;
                            inFilter = filter.callback({
                                item : $(this),
                                attribute : filter.attribute,
                                value : filter.value || $(filter.selector).val()
                            });

                            if(!inFilter){
                                $(this).addClass(settings.inactiveClass);
                            };
                        });
                    }else{
                        switch(filter.type){
                            case 'radio':
                                /*TODO: КОСТЫЛЬ! Убрать!*/
                                if(filter.value !== undefined && filter.value !== 'reset-value'){
                                    if(filter.attribute !== 'data-receipt'){
                                        $items.filter(':not(['+filter.attribute+' *= "'+settings.delimeter+filter.value+settings.delimeter+'"])').addClass(settings.inactiveClass);
                                    }else{
                                        $items.each(function(){
                                            var $t = $(this),
                                                attr = $t.attr(filter.attribute),
                                                val = parseInt(filter.value, 10);
                                            attr = attr.replace('|', '');
                                            attr = parseInt(attr, 10);
                                            if(attr > val){$t.addClass(settings.inactiveClass);}
                                        });
                                    }
                                }

                                break;
                            case 'checkbox':
                                if(filter.value !== undefined){
                                    $.each(filter.value, function(ind, val){
                                        $items.filter(':not(['+filter.attribute+' *= "'+settings.delimeter+val+settings.delimeter+'"])').addClass(settings.inactiveClass);
                                    });
                                }
                                break;
                            case 'select':
                                    if(filter.value !== undefined && filter.value !== '-1'){
                                        $items.filter(':not(['+filter.attribute+' *= "'+settings.delimeter+filter.value+settings.delimeter+'"])').addClass(settings.inactiveClass);
                                    }
                                break;
                            case 'number':
                                    /*TODO: number base filtering*/
                                break;
                            default:
                                $.error('Not found type: "'+ filter.type +'" in jqFilters!' )
                                break;
                        }
                    }
                });


                if(!$items.filter(':not(.'+settings.inactiveClass+')').length){
                    $t.trigger('empty.jqFilter');
                }else{
                    $t.trigger('notempty.jqFilter');
                }
                settings['change'].apply($t);
            }, // apply
            reset : function(){
                var $t = $(this),
                    filters = $t.data('filters');

                $.each(filters, function(i, filter){
                    var selector = filter.selector,
                        attr = filter.attribute,
                        type = filter.type;

                    delete filter.value;

                    switch(type){
                        case 'radio':
                            $(selector).removeAttr('checked');
                            break;
                        case 'checkbox':
                            $(selector).removeAttr('checked');
                            break;
                        case 'select':
                            $(selector).find('option').removeAttr('selected');
                            $(selector).find('option:first').attr('selected', 'selected');
                            break;
                        case 'string':
                            $(selector).val($(selector).attr('data-default'));
                            break;
                        case 'number' :
                            if(filter.def() !== undefined){
                                var def = filter.def();
                                $(selector).val(def);
                            }else{
                                $(selector).val(0);
                            }
							//console.log(filter.def());
                            break;
                    };

                    methods['apply'].apply($t);
                    $t.trigger('onreset');
                });
            }, // reset
            destroy : function(){

            } //destroy
        },
        events = {
            change : function(){
                settings.change.apply(this);
            },
            empty : function(){
                settings.empty.apply(this);
            },
            notempty : function(){
                settings.notempty.apply(this);
            },
            filterChange : function(event){
                var $self = event.data._self,
                    $t = $(this),
                    filters = $self.data('filters'),
                    filter = event.data.filter,
                    val = undefined,
                    i = undefined;

                switch (filter.type){
                    case 'radio':
                        val = $(filter.selector).filter(':checked').val();
                        i = findFilter(filters, filter);
                        filters[i].value = val;
                        $self.data('filters', filters);
                        break;
                    case 'checkbox':
                        i = findFilter(filters, filter);
                        filter.value = [];
                        if($(filter.selector).filter(':checked').length){
                            $(filter.selector).filter(':checked').each(function(){
                                val = $(this).val();
                                filter.value.push(val);
                            });
                        }
                        $self.data('filters', filters);
                        break;
                    case 'select':
                        val = $(filter.selector).find('option').filter(':selected').attr('value');
                        i = findFilter(filters, filter);
                        filters[i].value = val;
                        $self.data('filters', filters);
                        break;
                    case 'number':
                        i = findFilter(filters, filter);
                        val = $(filter.selector).val();
						
						/*new*/
						val = new String(val).replace(/\s/g, '');
						val = parseFloat(val, 10);
                        filters[i].value = val;
                        $self.data('filters', filters);
                        break;
                }
                methods['apply'].apply($self);
            }
        };


    $.fn.jqFilter = function(method){
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jqFilter' );
        }
    }

    /*helpers*/
    function findFilter(filters, filter){
        var index = undefined;
        $.each(filters, function(i, element){
            if(element.attribute === filter.attribute){
                index = i;
            }
        });
        if(index === undefined){
            return false;
        }else{
            return index;
        }
    }

})(jQuery, window);


/*
 * jQuery postMessage - v0.5 - 9/11/2009
 * http://benalman.com/projects/jquery-postmessage-plugin/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($){var g,d,j=1,a,b=this,f=!1,h="postMessage",e="addEventListener",c,i=b[h]&&!$.browser.opera;$[h]=function(k,l,m){if(!l){return}k=typeof k==="string"?k:$.param(k);m=m||parent;if(i){m[h](k,l.replace(/([^:]+:\/\/[^\/]+).*/,"$1"))}else{if(l){m.location=l.replace(/#.*$/,"")+"#"+(+new Date)+(j++)+"&"+k}}};$.receiveMessage=c=function(l,m,k){if(i){if(l){a&&c();a=function(n){if((typeof m==="string"&&n.origin!==m)||($.isFunction(m)&&m(n.origin)===f)){return f}l(n)}}if(b[e]){b[l?e:"removeEventListener"]("message",a,f)}else{b[l?"attachEvent":"detachEvent"]("onmessage",a)}}else{g&&clearInterval(g);g=null;if(l){k=typeof m==="number"?m:typeof k==="number"?k:100;g=setInterval(function(){var o=document.location.hash,n=/^#?\d+&/;if(o!==d&&n.test(o)){d=o;l({data:o.replace(n,"")})}},k)}}}})(jQuery);



/*
 rktvPlugins
 Awesome Select

 Styled <select> input
 */
(function($, window){
    "use strict";
    function GUID ()
    {
        var S4 = function ()
        {
            return Math.floor(
                Math.random() * 0x10000 /* 65536 */
            ).toString(16);
        };

        return (
            S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
    }

    function optToHtml(option){
        var $this = $(option),
            id = GUID();
        $this.attr('data-awId', id);
        var html = '<li data-awId='+id+'>'+$this.html()+'</li>';
        return html;
    }

    function setupDropDownList($select, $subsSelect){
        /*Ширины*/
        $subsSelect.find('.awDropDown').show();
        $subsSelect.find('ul:not(.awSuper)').width($subsSelect.find('ul:not(.awSuper)').maxWidth());

        $subsSelect.find('ul li').wrapInner('<span />');
        $subsSelect.find('.awText').width($subsSelect.find('ul li span').maxWidth());
        $subsSelect.find('.awDropDown').hide();

        var firstHtml = $select.find(':selected').html();
        var sID =  $select.find(':selected').attr('data-awId');
        $subsSelect.find('li[data-awId='+sID+']').addClass('selected');
        $subsSelect.find('.awText').html(firstHtml);
    }

    function appendList($select, $subsSelect){
        var $subsOptsHtml = $(optionToList($select));
        $subsSelect.find('.awDropDown').html('');
        $subsSelect.find('.awDropDown').append($subsOptsHtml);
    }

    function optionToList($select){
        var html = '',
            firstul = ' class="first"',
            $options = $select.find('option'),
            $optgroups = $select.find('optgroup');
        if($optgroups.length > 1){
            var $superList = $select.find('>option');
            if($superList.length){
                html += '<ul class="awSuper">';
                $superList.each(function(){
                    html += optToHtml(this);
                });
                html += '</ul>';
            }
            $optgroups.each(function(){
                html += '<ul' + firstul + '>';
                $(this).find('option').each(function(){
                    html += optToHtml(this);
                });
                html += '</ul>';
                firstul = '';
            });
        }else{
            html += '<ul' + firstul + '>';
            $options.each(function(){
                html += optToHtml(this);
            });
            html += '</ul>';
        }

        return html;
    }

    var settings = {
        optgroupsAsCols: true,
        slideTime: 200,
        waitTime: 500
    };

    var events = {
        subsclick: function(event){
            event.stopPropagation();
            var $this = $(this),
                $dropDown = $(this).find('.awDropDown');
            $dropDown.stop(true, true);
            if(!$this.hasClass('active')){
                $this.addClass('active');
                $dropDown.slideDown(settings.slideTime);
                $(window).on('click.awSelect', {that: $this}, events.winclick, false);
                $(this).on('mouseout.awSelect', events.mouseout);
            }else{
                methods.slideUp.apply(this, arguments);
            }
        }, //subsSelect click
        changeSubsSelect: function(event){
            var $this = $(this),
                $select = event.data.select,
                $subsSelect = event.data.subsSelect,
                id = $this.attr('data-awId');
            $subsSelect.find('li').removeClass('selected');
            $this.addClass('selected');

            $subsSelect.find('.awText').html($this.html());
            $select.find('option').removeAttr('selected');
            $select.find('option[data-awId='+id+']').attr('selected', true);
            $select.trigger('change');
        },
        winclick: function(event){
            event.stopPropagation();
            var $this = event.data.that;
            methods.slideUp.apply($this, arguments);
        },
        mouseout: function(){
            $(this).oneTime(settings.waitTime, function(){
                methods.slideUp.apply(this);
            });
            $(this).on('mouseover.awSelect', events.mouseover);
        },
        mouseover: function(){
            $(this).stopTime();
        }
    };

    var methods = {
        init: function(options){
            if(typeof options === 'object'){
                settings = $.fn.extend(settings, options);
            }

            return this.each(function(){

                var $this = $(this),
                    data = $this.data('awSelect'),
                    $subsSelect = $('<div class="awesomeSelect" unselectable="on"><div class="awPad"><span class="awText"></span><i class="awBullet"></i></div><div class="awDropDown"></div></div>');

                if(!data){
                    $this.data( 'awSelect', {
                        subsSelect: $subsSelect,
                        select: $this
                    });

                    $this.hide();
                    $this.after($subsSelect);

                    appendList($this, $subsSelect);
                    setupDropDownList($this, $subsSelect);

                    $subsSelect.on('click.awSelect', events.subsclick);
                    $subsSelect.on('click.awSelect', 'li', {select: $this, subsSelect: $subsSelect}, events.changeSubsSelect);

                    $this.trigger('change');
                }
            });
        },
        update: function(){
            return this.each(function(){
                var $this = $(this),
                    $select = $this.data('awSelect').select,
                    $subsSelect = $this.data('awSelect').subsSelect,
                    $subsOptsHtml = $(optionToList($this));
                appendList($select, $subsSelect);
                setupDropDownList($select, $subsSelect);
            });
        },
        destroy: function(){
            return this.each(function(){
                var $this = $(this),
                    data = $this.data('awSelect');
                $this.off('.awSelect');
                $this.find('option').removeAttr('data-awId');
                $(window).off('.awSelect');
                data.subsSelect.remove();
                data.select.show();
            });
        },
        option: function(){},
        slideUp: function(){
            var $this = $(this),
                $dropDown = $this.find('.awDropDown');

            $this.removeClass('active');
            $dropDown.slideUp(settings.slideTime);
            $(window).off('click.awSelect');
            $(this).off('mouseover.awSelect');
            $(this).off('mouseout.awSelect');
            $this.stopTime();

        }
    };

    $.fn.awSelect = function(method){
        if (typeof methods[method] === 'function' ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.awSelect' );
        }
    };
})(jQuery, window);

function plural(number, one, two, five) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return five;
    }
    number %= 10;
    if (number == 1) {
        return one;
    }
    if (number >= 2 && number <= 4) {
        return two;
    }
    return five;
}


function fromSlider(value) {
    return Math.round(Math.pow(10, value));
}

function toSlider(value) {
    return Math.log(value) / Math.log(10);
}

function tround(n, threshold) {
    var digits, out;

    n = n.toFixed(0);
    digits = n.length;
    out = n.substr(0, Math.min(digits, threshold));
    if (digits > threshold) {
        out = out + "000000000000".substr(0, digits - threshold);
    }

    return parseInt(out);
}

function splitGroups(n, delim) {
    var digits;

    delim = delim || '<span class="tsp"> </span>';

    n = n.toFixed(0);
    digits = n.length > 3 ? n.length % 3 : 0;

    return (digits ? n.substr(0, digits) + delim : '') +
        n.substr(digits).replace(/(\d{3})(?=\d)/g, "$1" + delim);
}

function round(a,b) {
	b=b || 0;
	return Math.round(a*Math.pow(10,b))/Math.pow(10,b);
}
