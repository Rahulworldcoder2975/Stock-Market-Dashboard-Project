document.addEventListener('DOMContentLoaded', () => {
    const stockSymbolInput = document.getElementById('stockSymbol');
    const timeFrameSelect = document.getElementById('timeFrame');
    const addToWatchlistButton = document.getElementById('addToWatchlist');
    const watchlistContainer = document.getElementById('watchlist');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');

    const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY'
    const apiUrl = 'https://www.alphavantage.co/query';
    const watchlist = [];
    addToWatchlistButton.addEventListener('click', addToWatchlist);
    function addToWatchlist() {
        const stockSymbol = stockSymbolInput.value.toUpperCase();
        const timeFrame = timeFrameSelect.value;

        if (stockSymbol && timeFrame) {
            // Fetch stock data from Alpha Vantage
            fetch(`${apiUrl}?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=5min&apikey=${apiKey}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    const stock = { symbol: stockSymbol, timeFrame: timeFrame, data: data };

                    watchlist.push(stock);
                    displayStockCard(stock);
                })
                .catch(error => {
                    console.error('Error fetching stock data:', error);
                    alert('Error fetching stock data. Please try again.');
                });
        }
    }
    function displayStockCard(stock) {
        const card = document.createElement('div');
        card.className = 'stock-card';
        card.innerHTML = `${stock.symbol} - ${stock.timeFrame} <span class="delete-button" onclick="deleteStock('${stock.symbol}')">&times;</span>`;
        card.addEventListener('click', () => openModal(stock));
        watchlistContainer.appendChild(card);
    }

     window.deleteStock=(symbol)=> {
        const index = watchlist.findIndex(stock => stock.symbol === symbol);
        if (index !== -1) {
            watchlist.splice(index, 1);
            updateWatchlist();
        }
    }

    function updateWatchlist() {
        watchlistContainer.innerHTML = '';
        watchlist.forEach(stock => displayStockCard(stock));
    }

function openModal(stock) {
    console.log(stock.data.Information)
    if (stock.data.Information) {
        modalContent.innerHTML = `<p>${stock.data.Information}</p>`;
    } else {
        modalContent.innerHTML = `<p>Stock Symbol: ${stock.symbol}</p>`;
        modalContent.innerHTML += `<p>Time Frame: ${stock.timeFrame}</p>`;
        
        const table = document.createElement('table');
        table.className = 'json-table';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const firstDataKey = Object.keys(stock.data['Time Series (5min)'])[0];
        if (firstDataKey) {
            for (const key in stock.data['Time Series (5min)'][firstDataKey]) {
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            const tbody = document.createElement('tbody');
            
            for (const date in stock.data['Time Series (5min)']) {
                const dataRow = document.createElement('tr');
                const data = stock.data['Time Series (5min)'][date];
                
                for (const key in data) {
                    const td = document.createElement('td');
                    td.textContent = data[key];
                    dataRow.appendChild(td);
                }
                
                tbody.appendChild(dataRow);
            }
            
            table.appendChild(tbody);
            modalContent.appendChild(table);
        } else {
            modalContent.innerHTML += '<p>No data available for the specified time frame.</p>';
        }
    }

    modal.style.display = 'block';
}

    window.closeModal = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});
