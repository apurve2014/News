let apiKey = "571b146002fb4dafa8fe34ad8f185104";
let newsAccordion = document.getElementById("newsAccordion");
let newsDiv;
let news = {};
let navBarDiv = document.getElementById("navBar");
let url = "";
const sourcesMap = new Map();
window.onload = function () {
	//an AJEX GET Request//
	//url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;

	url = "http://127.0.0.1:5400/sources";
	getRequest(url);
};

function countryBreakingNews(evt) {
	let cutId = evt.id;
	console.log("cutId : ", cutId);
	url = `https://newsapi.org/v2/top-headlines?country=${cutId}&apiKey=${apiKey}`;
	console.log(url);
	getRequest(url);
}

function getRequest(url) {
	console.log(url);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url);
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState == 4) {
			news = JSON.parse(xmlhttp.response);
			if (news.status == "ok" && news.articles) {
				newsDiv = document.getElementById("newspanal");
				drowAccoridan(news);
			}
			if (news.status == "ok" && news.sources) {
				createMapOfSourcesByCountry(news);
			}
			if (news.status == "ok" && news.allCountries) {
				showingAllCountries(news.allCountries);
			}
		}
	};
	xmlhttp.send();
}

function showingAllCountries(news) {
	let frameToPut = "";
	news.forEach((element, index) => {
		let frameStr = `<div id="${element.id}" onclick="countryBreakingNews(this)">
							<img alt="${element.name} flag" class="icon" src="${element.link}" />
							<div title="${element.name}">${element.name}</div>
							<div title="${element.id}"><kbd title="id: ${element.id}">${element.id}</kbd></div>
						</div>`;
		frameToPut += frameStr;
	});
	newsAccordion.innerHTML = frameToPut;
}
function createMapOfSourcesByCountry(news) {
	let frameToPut = "";
	news.sources.forEach((element, index) => {
		let frameStr = `<div class="card" style="width: 18rem">
						<div class="card-body">
							<h5 class="card-title">${element.name}</h5>
							<p class="card-text">${element.description}</p>
							<a href="${element.url}" target="_blank" class="btn btn-primary">Go Source</a>
						</div>
					</div>`;
		frameToPut += frameStr;
		if (sourcesMap.has(element.country)) {
			sourcesMap.get(element.country).push(element);
		} else {
			sourcesMap.set(element.country, []);
			sourcesMap.get(element.country).push(element);
		}
	});
	newsAccordion.innerHTML = frameToPut;
	let sourceCatagoryDiv = document.getElementById("sourceId");
	sourceCatagoryDiv.innerHTML = `<table>
										<tr>
											<td><h3 style="margin-right: 5px">Catagories for news Sources</h3></td>
											<td><button onclick="getSourceByCatagory(this)">technology</button></td>
											<td><button onclick="getSourceByCatagory(this)">business</button></td>
											<td><button onclick="getSourceByCatagory(this)">entertainment</button></td>
											<td><button onclick="getSourceByCatagory(this)">general</button></td>
											<td><button onclick="getSourceByCatagory(this)">health</button></td>
											<td><button onclick="getSourceByCatagory(this)">science</button></td>
											<td><button>sports</button></td>
										</tr>
									</table>`;

	return sourcesMap;
}

function getAllSources() {
	url = `https://newsapi.org/v2/top-headlines/sources?apiKey=${apiKey}`;
	getRequest(url);
}

function getSourceByCatagory(evt) {
	url = `https://newsapi.org/v2/top-headlines/sources?category=${evt.innerHTML}&apiKey=${apiKey}`;
	getRequest(url);
}

async function drowAccoridan(news) {
	let newsHTML = "";
	if (news.articles) {
		news.articles.forEach((element, index) => {
			let newsStr = `
							<div class="accordion-item">
								<h2 class="accordion-header" id="headingOne">
									<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}"><b>Breaking News ${index} :</b>${element.title}</button>
								</h2>
								<div id="collapse${index}" class="accordion-collapse collapse hide" aria-labelledby="headingOne" data-bs-parent="#newsAccordion">
									<div class="accordion-body">
										${element.content}. <a href="${element.url}" target="_blank">Read Complete artical</a>
									</div>
								</div>
							</div>
						`;
			newsHTML += newsStr;
		});
	}
	if (news.sources) {
		news.articles.forEach((element, index) => {
			console.log(index + " : " + element);
		});
	}
	newsAccordion.innerHTML = newsHTML;
}
