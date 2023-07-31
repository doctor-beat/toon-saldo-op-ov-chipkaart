if ('undefined' == typeof window.jQuery) {
	alert("ERROR: Geen jquery gevonden.");
} else {
	$(function(){
		console.log("OV chip versie 2023: " + window.location.pathname);
		//let regex = ;
		
		//only run on home page:
		if (/\/(my|mijn)\-ov\-chip(\.htm)?/.test(window.location.pathname)) {
			//first get the bearer token:
		    $.get( "/api/auth/session", function( data ) {
				//console.log( "Data Loaded (session): ", data );
				var idToken = data.id_token;
				console.log( " - id token: ", idToken);

				//get the card-list:
				$.ajax({
					url: "/backend/moc/cards/retrieve",
					type: 'GET',
					contentType: 'application/json',
					headers: {
						'Authorization': 'Bearer ' + idToken
					},
					success: function( data ) {
						console.log( "Cards data Loaded: ", data );

						//add the card div to html
						$('<div class="cards"><h3>Kaarten</h3><ol id="cardList"></ol></div>')
							.prependTo("main:first section:first");
						$(data.cards).each(function(index, element ) {
							var hashed = element.hashedMediumId;
							//console.log("hashed: ", hashed);
							if (!hashed) {
								console.warn("No hashed value found for entry " + index);
							} else {
								//get the card details:
								$.ajax({ 
									url: "/backend/moc/cards/retrievedetails", 
									data: {hashedMediumId: hashed, languagecode: "nl-NL"},
									type: 'GET',
									contentType: 'application/json',
									headers: {
										'Authorization': 'Bearer ' + idToken
									},
									success: function( data ) {
										console.log("card details: ", data);
										console.log(" - saldo: ", data.cardStatus.amount);

										var lastActivityTime = data.cardStatus.lastActivityTime.replace('T', ' ');
										var cardId = data.mediumId.replace(/.{4}/g, '$& ');
										var html = `<li><div>\
											<span class="alias">${data.alias}</span>\
											<span class="id">${cardId}</span>\
											<span class="saldo">Saldo: &euro; ${data.cardStatus.amount} </span>\
											<span class="lasttime">(${lastActivityTime})</span>\
											<span class="valid">Geldig tot ${data.cardStatus.expiryDate}</span>\
											<span class="status">${data.cardStatus.status}</span>\
											</div></li>`;
										$(html).appendTo("#cardList");
									}
								});
							}
						});
					},
				});
			});

		}
	});
}
