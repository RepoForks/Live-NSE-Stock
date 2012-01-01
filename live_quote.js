// URL - http://www.nseindia.com/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?symbol=INFY
/**
 *	Nifty Application that can be used for creating any virtual stock market apps that needs live NSE Stock rates
 *
 *	@author Ashwanth Kumar <ashwanth@ashwanthkumar.in>
 *	@date	01/01/2012
 */

var express = require('express');

var app = express.createServer(express.logger());

// Only possible part that needs to be executed
app.get('/', function(request, response) {
	if(request.query.symbol && request.query.symbol.length > 0) {
		console.log(request.query.symbol);
		
		var http = require('http');

		var symbol = request.query.symbol;
		var options = {
		  host: 'www.nseindia.com',
		  method: 'GET',
		  path: '/live_market/dynaContent/live_watch/get_quote/ajaxGetQuoteJSON.jsp?symbol=' + symbol,
		  headers: {
		  	"User-Agent": "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)",
		  	"Referer": "http://www.nseindia.com/",
		  	"Accept": '*/*'
		  }
		};

		var resp = "";	// Hold the servers response

		var req = http.request(options, function(res) {
			res.on('error', function(e) {
				console.log("Got error: " + e.message);
			});
			res.on('data', function(data) {
				resp += data;
			});
			res.on('end', function() {
				resp = resp.trim();
				data = JSON.parse(resp);

				// Cleaning up the feeds
				delete data.otherSeries;
				delete data.optLink;
				delete data.futLink;
				
				// Now send the data
				response.send(data);
			});
		});
		req.end();
	} else {
		// Invalid request
		response.send(invalidRequest(), { 'X-Created-By' : "Ashwanth Kumar <ashwanth@ashwanthkumar.in>" }, 400);
	}
});

// Map all other request
app.get('/**', function(req, res) {
	res.send(invalidRequest(),
			{ 'X-Created-By' : "Ashwanth Kumar <ashwanth@ashwanthkumar.in>" },
			400);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

function invalidRequest() {
	return "<h1>INVALID REQUEST</h1><p>Request must be of the form:\r\n <strong>http://live-nse.herokuapp.com/?symbol=INFY</strong></p>\r\n";
}

