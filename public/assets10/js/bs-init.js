$(document).ready(function(){
	$('[data-bs-hover-animate]')
		.mouseenter( function(){ var elem = $(this); elem.addClass('animated ' + elem.attr('data-bs-hover-animate')) })
		.mouseleave( function(){ var elem = $(this); elem.removeClass('animated ' + elem.attr('data-bs-hover-animate')) });
});
		$(document).ready(function(){
		    $('.count123').prop('disabled', true);
   			$(document).on('click','.plus',function(){
				$(this).prev().val(parseInt($(this).prev().val()) + 1 );
				var length = $(".Seq").length;
                money = 0;
                for(var i=0; i<length; i++){
                  money = money + (parseInt($(".count123").eq(i).val())*parseInt($(".Price").eq(i).val()))
                }
                $("#money").text("가격: "+ money)
    		});
        	$(document).on('click','.minus',function(){
    			$(this).next().val(parseInt($(this).next().val()) - 1 );
    				if ($(this).next().val() == 0) {
						$(this).next().val(1);
					}
					var length = $(".Seq").length;
                    money = 0;
                    for(var i=0; i<length; i++){
                      money = money + (parseInt($(".count123").eq(i).val())*parseInt($(".Price").eq(i).val()))
                    }

                $("#money").text("가격: "+ money)
    	    	});
			$('.menu').click(function(){
				var name = $(this).next().children("h4").text()
				var price = $(this).next().children("strong").text()
				var price2 = $(this).next().children("input").val()
				var orderNum = $(this).next().children("input").next().val()
				console.log(name)
				console.log(price)
				console.log(price2)
				console.log(orderNum)
				var html = '<div style="border: thin solid  black; width: 250px;margin-right:30px;float: left;" ><p style="font-size: 20px; height: 30px;"><strong style="margin-left: 10px;">'+name+'</strong> <span style="margin-right:10px;float: right;">'+price+'</span></p>'+
						'<div style = "float:right" class="plusMinus qty mt-2">'+
						'<input type="hidden" class="Price" name = "Price" value="'+price2+'"/>'+
						'<input type="hidden" class="Seq" name="Seq" value="'+orderNum+'"/>'+
						'<span class="minus bg-dark">-</span>'+
						'<input type="number" class="count123" name="qty" value="1">'+
						'<span class="plus bg-dark">+</span>'+
					'</div>'+
					'</div>';
				$("#orders").append(html);
				
				var length = $(".Seq").length;
				money = 0 ;
				console.log(length)
					for(var i=0; i<length; i++){
						console.log(parseInt($(".count123").eq(i).val()))
						console.log(parseInt($(".Price").eq(i).val()))
						money = money + (parseInt($(".count123").eq(i).val())*parseInt($(".Price").eq(i).val()))
					  }
  
				  $("#money").text("가격: "+ money)
				
			})
			$("#cencel").click(function(){
				$("#orders").empty();
				$("#money").text("가격: "+ 0);
			})
			$(".menu3").click(function(){
				var boolean = confirm("부재료에 알레르기 성분이 있습니다 빼고 주문하시겠습니까?")
				if(boolean == true){
					var name = $(this).next().children("h4").text()
					var price = $(this).next().children("strong").text()
					var price2 = $(this).next().children("input").val()
					var orderNum = $(this).next().children("input").next().val()
					console.log(name)
					console.log(price)
					console.log(price2)
					console.log(orderNum)
					var html = '<div style="border: thin solid  black; width: 250px;margin-right:30px;float: left;" ><p style="font-size: 20px; height: 30px;"><strong style="margin-left: 10px;">'+name+'</strong> <span style="margin-right:10px;float: right;">'+price+'</span></p>'+
							'<div style = "float:right" class="plusMinus qty mt-2">'+
							'<input type="hidden" class="Price" name = "Price" value="'+price2+'"/>'+
							'<input type="hidden" class="Seq" name="Seq" value="'+orderNum+'"/>'+
							'<span class="minus bg-dark">-</span>'+
							'<input type="number" class="count123" name="qty" value="1">'+
							'<span class="plus bg-dark">+</span>'+
						'</div>'+
						'</div>';
					$("#orders").append(html);
					
					var length = $(".Seq").length;
					money = 0 ;
					console.log(length)
						for(var i=0; i<length; i++){
							console.log(parseInt($(".count123").eq(i).val()))
							console.log(parseInt($(".Price").eq(i).val()))
							money = money + (parseInt($(".count123").eq(i).val())*parseInt($(".Price").eq(i).val()))
						}
	
					$("#money").text("가격: "+ money)
					
				}
				else{
					alert("취소하셨습니다.")
				}
			})
			$("#QRCODE").click(function(){
				$("#QRModal").modal("show")

			})
 		});