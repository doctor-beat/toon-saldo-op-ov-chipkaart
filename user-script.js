if ('undefined' == typeof window.jQuery) {
	alert("ERROR: Geen jquery gevonden.");
} else {
	$(function(){
		console.log(window.location.pathname);
		//let regex = ;
		
		//only run on home page:
		if (/^\/(my|mijn)\-ov\-chip\.htm/.test(window.location.pathname)) {
			
		    var firstContainer = $('div#content div.translink-mf-container').first();
		
		    var reisHistorieButton = $(firstContainer).find('div.tls-button').first();
		    reisHistorieButton.after('<br/><div class="flex-cell-content tls-button  xc-edit" style="background:orange; box-shadow:none">' +
		            '<a href="/mijn-ov-chip/kaartinformatie/check-je-saldo.htm" class="" title="Check je saldo">Saldo checken</a>' +
		            '</div>');
		            
		            
		    $.get( "/mijn-ov-chip/kaartinformatie/check-je-saldo.htm", function( data ) {
				//console.log( "Data Loaded: " + data );
				
				var saldoInfo = $("#ol_cardselector", data);
				console.log(saldoInfo);
				
				saldoInfo.css("visibility", "visible");
				//$("li", saldoInfo).addClass("active");		//?????
				$( saldoInfo ).prependTo("div#content > div");
				
				$("ol#ol_cardselector li.list-group-item").each(function(index, element ) {
					//parse the card info:
					var hashed = $("span.cs-card-number", element).data("hashed");
					console.log("hashed: ", hashed);
					if (!hashed) {
						console.warn("No hashed value found for entry " + index);
					} else {
						$("dl.cs-card-details", element).show();
						$.post( 
							"/web/medium_information", 
							{hashedMediumId: hashed, languagecode: "nl-NL"},
							function( data ) {
								console.log(data);
								//console.log($("dd.cs-card-details-profile", element).text());
								//console.log(data.mediumTypeDescription);
								
								$("dd.cs-card-details-profile", element).text(data.mediumTypeDescription);
								$("dd.cs-card-details-valid", element).text(data.expiryDate);
								$("dd.cs-card-details-status", element).text(data.mediumStatusDescription);
								$("dd.cs-card-details-saldo", element).text(data.localeEPurseRemainingAmount)
								$("dd.cs-card-details-saldo", element).parent().css("background-color", "#FFFFA8");
								$("dd.cs-card-details-saldodate", element).text(data.lastActivityTime);
								//cs-card-details-status
							},
							"json"
						);
					}
				});
			});
		}
	});
}
