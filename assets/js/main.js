$(document).ready(function() {
	$(".btn-buy").click(function() {
		$(this).prev().prev().removeAttr('disabled');
		var num = $(this).prev().val();
		num++;
		$(this).prev().val(num);
		setTotalPrice();
		checkBuyButton($(this));
		addCheckout();
	});
	$(".btn-sell").click(function() {
		var num = $(this).next().val();
		if(parseInt(num) > 0) {
			num--;
			$(this).next().val(num);
			setTotalPrice();
			checkBuyButton($(this));
			addCheckout();
		} 

		if(num == 0) {
			$(this).attr('disabled','disabled');
		}
	});

	$(".product-amount").keydown(function() {
		var price = parseInt($(this).parent().prev().attr('data-val'));
		var total_price = parseInt($("#total_amount").attr('data-val'));
		var max = total_price / price;
		if(parseInt($(this).val()) < 1) {
			$(this).val(0);
			$(this).prev().attr('disabled', 'disabled');
		} else if ($(this).val() <= max) {
			$(this).val(parseInt($(this).val()));
			setTotalPrice();
			checkBuyButton($(this));
			addCheckout();
			$(this).prev().removeAttr('disabled');
		} else {
			$(this).val(parseInt(max));
			setTotalPrice();
			checkBuyButton($(this));
			addCheckout();
			$(this).prev().removeAttr('disabled');
		}
	});

	$("#total_amount").text(parseInt($("#total_amount").attr('data-val')).toLocaleString());

	appearCheckout();
});

function setTotalPrice() {
	var product_amounts = $('.product-list .product-item .product-amount');
	var select_price = 0;
	for(var i=0; i< product_amounts.length; i++) {
		var amount = $(product_amounts[i]);
		if(amount.val() > 0) {
			var price = parseInt(amount.parent().prev().attr('data-val'));
			var amount = amount.val();
			select_price = select_price + (price * amount);
		}
	}

	var total_price = parseInt($("#total_amount").attr('data-default'));
	var result_price = total_price - select_price;
	$("#total_amount").attr('data-val', result_price);
	$('#total_amount').animateNumbers(result_price);

}

function checkBuyButton(el) {
	var pro_price = parseInt(el.parent().prev().attr('data-val'));
	var total_price = parseInt($("#total_amount").attr('data-val'));
	var product_items = $('.product-list .product-item .product-price');
	for(var i=0; i< product_items.length; i++) {
		if(parseInt($(product_items[i]).attr('data-val')) > total_price) {
			$(product_items[i]).next().find('.btn-buy').attr('disabled','disabled');
		} else {
			$(product_items[i]).next().find('.btn-buy').removeAttr('disabled');
		}
	}
}

function addCheckout() {
	var product_amounts = $('.product-list .product-item .product-amount');
	var html = '';
	var total_price = 0;
	for(var i=0; i< product_amounts.length; i++) {
		var amount = $(product_amounts[i]);
		if(amount.val() > 0) {
			var title = amount.parent().prev().prev().text();
			var price = parseInt(amount.parent().prev().attr('data-val'));
			var amount = amount.val();
			var select_price = currency(price * amount);
			var html = html + '<div class="product-name">'+title+'</div><div class="product-amount">x'+amount+'</div><div class="product-price">'+select_price+'</div>';

			total_price = total_price + (price * amount);
		}
	}

	$(".checkout-list").html(html);
	$("#checkout_total").text('£'+total_price.toLocaleString());

	appearCheckout();
}

function appearCheckout() {
	if($(".checkout-list div").length < 1) {
		if(!$(".checkout-panel").hasClass('hidden')) {
			$(".checkout-panel").addClass('hidden');
		}
	} else {
		$(".checkout-panel").removeClass('hidden');
	}
}

function currency(tpr) {
	if(999999999 < tpr && tpr < 1000000000000) {
		if(tpr%1000000 != 0) {
			return '£'+ parseFloat(tpr/1000000000).toFixed(1) + 'b'; 
		} else {
			return '£'+ (tpr/1000000000) + 'b'; 
		}
	} else if(99999 < tpr && tpr < 1000000000) {
		if(tpr%1000000 != 0) {
			return '£'+ parseFloat(tpr/1000000).toFixed(1) + 'm'; 
		} else {
			return '£'+ (tpr/1000000) + 'm'; 
		}
	} else if(999 < tpr && tpr < 1000000) {
		if(tpr%1000 != 0) {
			return '£'+ parseFloat(tpr/1000).toFixed(1) + 'k'; 
		} else {
			return '£'+ (tpr/1000) + 'k'; 
		}
	} else if(tpr < 1000) {
		return '£'+tpr;
	}
}

(function($) {
    $.fn.animateNumbers = function(stop, commas, duration, ease) {
        return this.each(function() {
            var $this = $(this);
            var isInput = $this.is('input');
            var start = parseInt(isInput ? $this.val().replace(/,/g, "") : $this.text().replace(/,/g, ""));
            var regex = /(\d)(?=(\d\d\d)+(?!\d))/g;
            commas = commas === undefined ? true : commas;
            
            // number inputs can't have commas or it blanks out
            if (isInput && $this[0].type === 'number') {
                commas = false;
            }
            
            $({value: start}).animate({value: stop}, {
                duration: duration === undefined ? 1000 : duration,
                easing: ease === undefined ? "swing" : ease,
                step: function() {
                    isInput ? $this.val(Math.floor(this.value)) : $this.text(Math.floor(this.value));
                    if (commas) {
                        isInput ? $this.val($this.val().replace(regex, "$1,")) : $this.text($this.text().replace(regex, "$1,"));
                    }
                },
                complete: function() {
                    if (parseInt($this.text()) !== stop || parseInt($this.val()) !== stop) {
                        isInput ? $this.val(stop) : $this.text(stop);
                        if (commas) {
                            isInput ? $this.val($this.val().replace(regex, "$1,")) : $this.text($this.text().replace(regex, "$1,"));
                        }
                    }
                }
            });
        });
    };
})(jQuery);