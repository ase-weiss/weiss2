
	let gnbToggling = false;
	
	function gnbMenu(){
    let $dim = $('.gnb-dim');
    let $gnbSub = $('.n-gnb-sub');
    let $gnbSubUl = $gnbSub.children('ul');
    let $gnbSubItems = $gnbSubUl.children('li');

    $gnbSub.find('> ul > li section').each(function(){
      let menuNum = $(this).find('dl').length;
      $(this).addClass('n-menu-'+menuNum);
    });

    function slidein(index) {
      $gnbSub.addClass('on');
      $dim.fadeIn();
      $gnbSubItems.hide();
      $gnbSubItems.eq(index).show();
      $gnbSubUl.slideDown();
    }

    function slideout() {
      $gnbSubUl.slideUp(function () {
        $gnbSub.removeClass('on');
        $gnbSubItems.hide();
        $dim.fadeOut();
      });
    }

		$('.n-gnb li').on('mouseover', function(e) {
   
        let index = $(this).index();

        clearTimeout(gnbToggling);
        gnbToggling = setTimeout(slidein, 300, index);
		});
		$('.n-gnb, .n-gnb-sub').on('mouseleave', function(e) {
      const toElement = e.relatedTarget;
      if ($(toElement).closest('.n-gnb').length || $(toElement).closest('.n-gnb-sub').length) return;

			clearTimeout(gnbToggling);
			setTimeout(slideout, 300);
		});
		$('.n-gnb > li > a').on('focus', function(e) {
        let index = $(this).parent().index();
        clearTimeout(gnbToggling);
        gnbToggling = setTimeout(slidein, 300, index);
		});
		$('.n-gnb > li > a').on('keydown', function(e) {
        if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            let index = $(this).parent().index();

            let $subMenu = $gnbSub.children('ul').children('li').eq(index);
            let $firstSubItem = $subMenu.find('a').first();
            let $lastSubItem = $subMenu.find('a').last();

            if ($firstSubItem.length) $firstSubItem.focus();

            $lastSubItem.off('keydown').on('keydown', function(e) {
                if (e.key === "Tab" && !e.shiftKey) {
                    e.preventDefault();

                    let $nextMain = $('.n-gnb > li > a').eq(index + 1);
                    if ($nextMain.length) {
                        $nextMain.focus();
                    } else {
                        $('.n-user-info button').focus();
                    }
                }
            });
        }
    });

		$('.n-gnb-sub li:last a').on('focusout', function(e) {
			clearTimeout(gnbToggling);
			setTimeout(slideout, 300);
		});

	}


  function tabEvt(){
  let tabs = [];
  $('[data-tab-id]').on('click', function(e){
		e.stopPropagation();
    let tabid = $(this).data('tab-id');

    tabs = [];
    tabs.push(tabid);

    $(this).parents('li').addClass('on');
    $(this).parents('li').siblings().find('[data-tab-id]').each(function(){
      $(this).parents('li').removeClass('on');
      tabs.push($(this).data('tab-id'));
    });

    tabs.forEach(function(v){
      $('#'+v).hide();
    });
    $('#'+tabid).show();

		if($(this).parents('.tab-condition').length > 0){
			let $selectd = $(this).parents('.tab-condition').find('.selected');
			$selectd.find('button').text($(this).text())
		}
  })

}

function jqxTooltip(id, text, position){
    let $id = $(id);
    $id.append('<span class="n-hidden">'+text+'</span>')
    $id.jqxTooltip({ content: text, position: position});
    // $id.bind('open', function () { 
    //     $('.jqx-tooltip').last().attr('data-id', 'jqx-tooltip-custom');
    //   }); 
    $id.bind('opening', function () { 
        const $tooltip = $('.jqx-tooltip');
        $tooltip.removeClass('tooltip-left tooltip-right tooltip-top tooltip-bottom');
        const position = $id.jqxTooltip('position');
        
        $tooltip.addClass('custom-class');
        if (position === 'left') $tooltip.addClass('tooltip-left');
        else if (position === 'right') $tooltip.addClass('tooltip-right');
        // else if (position === 'top') $tooltip.addClass('tooltip-top');
        // else if (position === 'bottom') $tooltip.addClass('tooltip-bottom');
      }); 
}



function popClose(popup){
  let $popup = $(popup);
  $popup.fadeOut();
  $('body, html').css('overflow', '');
  $('body').removeClass('n-pop-open');
}

function popOpen(popup, callback){
  let $popup = $(popup);
  scrollPosition = $(window).scrollTop();

  $popup.fadeIn();
  $('body, html').css('overflow', 'hidden');
  $('body').addClass('n-pop-open');

  $popup.find('.n-btn-close').on('click', function(){
    $popup.hide();
    $('body, html').css('overflow', '');
    $('body').removeClass('n-pop-open');
  });

  if(callback) callback();
}


function popOpenPos(e, id){
  let top = $(e.target).offset().top + $(e.target).outerHeight() + 10,
      left = $(e.target).offset().left;

  popOpen(id);
  $(id).css({top:top, left:left});
}

function datepicker(){
  if ($(".n-datepicker").length <= 0) return;

  $(".n-datepicker").each(function () {
    let $this = $(this);
    let opts = {};

    const optionData = $this.data("option");
    if (optionData)  opts = typeof optionData === 'string' ? JSON.parse(optionData) : optionData;

    let option = $.extend(true, {
      width: '120px',
      height: '38px',
      formatString: 'yyyy.MM.dd',
      showCalendarButton: true,
      readOnly: true,
      allowKeyboardDelete: false
    }, opts);

    $this.jqxDateTimeInput(option);
  });
}

function timepicker() {
  if ($(".n-timepicker").length <= 0) return;

  $(".n-timepicker").each(function () {
    let $this = $(this);
    let opts = {};

    const optionData = $this.data("option");
    if (optionData) {
      try {
        opts = typeof optionData === 'string' ? JSON.parse(optionData) : optionData;
      } catch (e) {
        console.warn("Invalid JSON in data-option:", optionData);
      }
    }

    let option = $.extend(true, {
      width: '80px',
      height: '38px',
      formatString: 'HH:mm',
      showTimeButton: true,
      showCalendarButton: false,
      readOnly: true,
      allowKeyboardDelete: false
    }, opts);

    $this.jqxDateTimeInput(option);
  });
}

function customAlert(title, message, type = "confirm") {
  return new Promise((resolve) => {
    $(".n-alert-popup").remove();

    const $popup = $(`
      <section class="n-alert-popup" role="alertdialog" style="display: block;">
        <div class="n-dim"></div>
        <div class="n-popup" role="document" tabindex="-1" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-desc">
          <button class="n-btn-close" aria-label="닫기" type="button"></button>
          <div class="n-pop-body">
            ${title ? `<h1 id="alert-title" class="n-alert-tit">${title}</h1>` : ""}
            <p id="alert-desc" class="n-alert-txt">${message}</p>
          </div>
          <div class="n-pop-footer"> 
            <div class="n-btn-wrap">
              ${
                type === "confirm" 
                ? `<button type="button" class="n-btn-alert n-st-gray-line btn-no">아니요</button>
                   <button type="button" class="n-btn-alert n-st-blue btn-yes">예</button>`
                : `<button type="button" class="n-btn-alert n-st-blue btn-yes">확인</button>`
              }
            </div>
          </div>
        </div>
      </section>
    `);

    $("body").append($popup);
    $popup.find(".n-popup").focus();

    $popup.on("click", ".n-btn-close, .btn-no", function () {
      $popup.remove();
      resolve(false);
    });

    $popup.on("click", ".btn-yes", function () {
      $popup.remove();
      resolve(true);
    });
  });
}

function drowmDown() {
  $('.n-dropdown .n-selected').on('click', function (e) {
    e.stopPropagation();
    const $dropdown = $(this).closest('.n-dropdown');
    const $menuLayer = $dropdown.find('.n-menu-layer');

    $('.n-dropdown .n-menu-layer').not($menuLayer).hide();
    $('.n-dropdown').not($dropdown).removeClass('active');

    $menuLayer.toggle();
    $dropdown.toggleClass('active', $menuLayer.is(':visible'));
  });

  $('.n-dropdown .n-menu-layer button').on('click', function () {
    const $dropdown = $(this).closest('.n-dropdown');
    const value = $(this).html();

    $dropdown.find('.n-value').html(value);
    $dropdown.find('.n-menu-layer').hide();
    $dropdown.removeClass('active');
  });

  $(document).on('click', function () {
    $('.n-dropdown .n-menu-layer').hide();
    $('.n-dropdown').removeClass('active');
  });
}


  // ready
  $(function(){
    gnbMenu();
    tabEvt();
    datepicker();
    timepicker();
    drowmDown();
  })