WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight
BODY = document.getElementsByTagName('body')[0]


document.addEventListener('DOMContentLoaded', function() {
	// Fancybox
	Fancybox.defaults.tpl = {
		closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg><use xlink:href="https://expertmoving.com/wp-content/themes/raten/images/sprite.svg#ic_close"></use></svg></button>',

		main: `<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">
			<div class="fancybox__backdrop"></div>
			<div class="fancybox__carousel"></div>
			<div class="fancybox__footer"></div>
		</div>`,
	}

	$('.js-more').click(function(e) {
		e.preventDefault()
		$(".reviews .review.hide").removeClass("hide");
		$(this).hide();
	})

	$('header .menu a').each(function() {
        var $link = $(this);
        var originalText = $link.html(); // Получаем текущий HTML (текст)

        // Создаем SVG-элемент как строку
        var svgElement = '<svg class="arr"><use xlink:href="https://expertmoving.com/wp-content/themes/raten/images/sprite.svg#ic_arr_hor"></use></svg>';

        // Обертываем текст в <span>
        var wrappedText = '<span>' + originalText + '</span>';

        // Объединяем SVG и обернутый текст
        var newContent = svgElement + wrappedText;

        // Заменяем старый контент ссылки на новый
        $link.html(newContent);
    });  


	// Modals
	$('.modal_btn').click(function(e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show([{
			src: document.getElementById(e.target.getAttribute('data-modal')),
			type: 'inline'
		}])
	})


	// Zoom images
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false
		},
		Thumbs: {
			autoStart: false
		}
	})


	// Mob. menu
	$('.mob_header .mob_menu_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').toggleClass('active')
		$('body').toggleClass('lock')
		$('header').toggleClass('show')

		$('.mob_header .mob_menu_btn').hasClass('active')
			? $('.overlay').fadeIn(300)
			: $('.overlay').fadeOut(300)
	})


	// Feedback
	/*$('.feedback form').submit(function(e) {
		e.preventDefault()

		const feedback = $(this).closest('.feedback')

		feedback.find('.success').addClass('show')
	})*/

	$('.feedback .success .btn').click(function(e) {
		e.preventDefault()

		const success = $(this).closest('.success')

		success.removeClass('show')
	})


	// Modal form
	/*$('.modal form').submit(function(e) {
		e.preventDefault()

		const feedback = $(this).closest('.data')

		feedback.find('.success').addClass('show')
	})*/

	$('.modal .success .btn').click(function(e) {
		e.preventDefault()

		const success = $(this).closest('.success')

		success.removeClass('show')
	})

	const phoneInputs = document.querySelectorAll('input[type=tel]')

	if (phoneInputs) {
		phoneInputs.forEach(el => {
			IMask(el, {
				mask: '(000) 000-0000',
				lazy: true
			})
		})
	}
	$('header .menu a').on('click', function(event){
		$('.mob_header .mob_menu_btn').removeClass('active')
		$('body').removeClass('lock')
		$('header').removeClass('show')

		$('.overlay').fadeOut(300)   
	});
	


	$(document).on('change', '.error', function() {
        $(this).removeClass('error').parent().next().hide();
    })


    $('.form button').on('click', function(event){
        event.preventDefault();
        const success = $(this).closest('form').next()

        var dataForAjax = "action=form&";
        var addressForAjax = myajax.url;
        var valid = true;
        
        $(this).closest('form').find('input:not([type=submit]),textarea, select').each(function(i, elem) {
            if (this.value.length < 3 && $(this).hasClass('required')) {
                valid = false;
                $(this).addClass('error').parent().next().show();
            }
            if ($(this).attr('name') == 'email' && $(this).hasClass('required')) {
                var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
                if (!pattern.test($(this).val())) {
                    valid = false;
                    $(this).addClass('error');
                }
            }
            if ($(this).attr('name') == 'agree' && !$(this).prop("checked")) {
                $(this).addClass('error');
                valid = false;
            }

            if($(this).attr('name') == 'phone' && $(this).hasClass('required')) {            
                if (this.value.replace(/[_-]/g, '').length!=13)
                {
                    valid = false;
                    $(this).addClass('error');
                }
            }             

            if (i > 0) {
                dataForAjax += '&';
            }            
            dataForAjax += this.name + '=' + encodeURIComponent(this.value);
            
        })       

        if (!valid) {
            return false;
        }  

        $.ajax({
            type: 'POST',
            data: dataForAjax,
            url: addressForAjax,
            beforeSend: function(response) {            	
				success.addClass('show')

				$('.mob_header .mob_menu_btn').removeClass('active')
				$('body').removeClass('lock')
				$('header').removeClass('show')

				$('.overlay').fadeOut(300)        

            },
            success: function(response) {
                $("form").trigger("reset");     


            }
        });  

        var formData = formToJson($(this).closest('form'));
		console.log('Ready to submit!', formData);
		var url = 'https://api.smartmoving.com/api/leads/from-provider?providerKey=';
		var providerKey = 'a9941adb-497a-4030-a368-b1150026fa6a';

		$.ajax({
            url: url + providerKey, 
            type : "POST",
            dataType : 'text',
            data : formData,
            contentType: "application/json",
            success : function(result) {
              console.log('Your information has been received!')
            },
            error: function(xhr, resp, text) {
                console.log(xhr, resp, text);
                console.log('There was a problem submitting your information.')
            }
        });
    }); 
})

function formToJson(form$) {
    var array = form$.serializeArray();
    var json = {};
    
    jQuery.each(array, function() {
    	if(this.name=="name")
    	{
    		json["fullName"] = this.value || null;
    	}
    	if(this.name=="phone")
    	{
    		json["phoneNumber"] = this.value || null;
    	}
    	if(this.name=="email")
    	{
    		json["email"] = this.value || null;
    	}
    	if(this.name=="text")
    	{
    		json["notes"] = this.value || null;
    	}
    	if(this.name=="ref")
    	{
    		json["ReferralSource"] = this.value || null;
    	}
        
    });
    
    return JSON.stringify(json);
}


window.addEventListener('load', function () {

	// Gallery
	let gallery = $('.gallery .masonry'),
		galleryGap = parseInt(gallery.css('--gap'))

	if(gallery.length>0)
	{
		gallery.masonry({
			gutter: galleryGap,
			itemSelector: '.item',
			columnWidth: gallery.find('.item').outerWidth()
		})
	}
})



window.addEventListener('resize', function () {
	WH = window.innerHeight || document.clientHeight || BODY.clientHeight

	let windowW = window.outerWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Overwrite window width
		WW = window.innerWidth || document.clientWidth || BODY.clientWidth


		// Mob. version
		if (!fakeResize) {
			fakeResize = true
			fakeResize2 = false

			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'
		}

		if (!fakeResize2) {
			fakeResize2 = true

			if (windowW < 360) document.getElementsByTagName('meta')['viewport'].content = 'width=360, user-scalable=no'
		} else {
			fakeResize = false
			fakeResize2 = true
		}
	}
})