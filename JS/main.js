var cardNames = [];

$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getCards(searchText);
    getCardNames();
    e.preventDefault();
  });

});

function getCardNames() {
  axios.get('https://api.scryfall.com/catalog/card-names').then((response) => {
    let cardName = response.data.data;
    var output = cardName;
    console.log(output);
  }).catch((err) => {
    console.log(err);
  });
}

function getCards(searchText) {
  axios.get('https://api.scryfall.com/cards/search?q=%22' + searchText + '%22').then((response) => {
    //console.log(response);
    let cards = response.data.data;
    let output = '';
    $.each(cards, (index, card) => {
      output += `
      <div class = "col-md-3">
        <div class = "well text-center">
          <img src = "${card.image_uris.png}">
          <h5> ${ card.name } </h5>
          <a onclick = "cardSelected('${card.uri}')" class="btn btn-primary" href="#">Card Details</a>
        </div>
      </div>
      `;
    });
    $('#cards').html(output);
  }).catch((err) => {
    console.log(err);
  });
}

function cardSelected(uri) {
  sessionStorage.setItem('cardURI', uri);
  window.location = 'card.html';
  return false;
}

function getCard() {
  let cardURI = sessionStorage.getItem('cardURI');
  axios.get(cardURI)
    .then((response) => {
      //console.log(response);
      let card = response;
      let output = `
            <div class="row">
              <div class="col-md-4">
                <img src="${card.data.image_uris.png}" class="thumbnail">
              </div>
              <div class="col-md-8">
                <h2>${card.data.name}</h2>
                <ul class="list-group">
                  <li class="list-group-item"><strong>Set:</strong> ${card.data.set_name}</li>
                  <li class="list-group-item"><strong>Set Short:</strong> ${card.data.set}</li>
                  <li class="list-group-item"><strong>Rarity:</strong> ${card.data.rarity}</li>
                  <li class="list-group-item"><strong>Card Affect:</strong ${card.data.oracle_text}</li>
                  <li class="list-group-item"><strong>Mana Coast:</strong> ${card.data.mana_cost}</li>
                  <li class="list-group-item"><strong>Type:</strong> ${card.data.type_line}</li>
                </ul>
              </div>
            </div>
            <div class="row">
              <div class="well">
                <h3>Card Affect</h3>
                ${card.data.oracle_text}
                <hr>
                <a href="${card.data.purchase_uris.tcgplayer}" target="_blank" class="btn btn-primary">TCG Buy $${card.data.prices.usd}</a>
                <a href="index.html" class="btn btn-default">Go Back To Search</a>
              </div>
            </div>
      `;
      $('#card').html(output);
    });
}
