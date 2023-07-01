fetch('http://localhost:3008/films') //http://localhost:3008/films
    .then(response => response.json())
    .then(data => {
        console.log(data)

        const filmsList = document.querySelector('#films')

        data.forEach(filmItem => {

            let item = document.createElement('li')
            item.className = 'film item'

            let poster = document.createElement('img')
            poster.className = 'poster'
            poster.src = filmItem.poster

            let itemInfo = document.createElement('div')
            itemInfo.className = 'film-info'

            let titleInfo = document.createElement('p')
            titleInfo.className = 'title'
            titleInfo.innerText = filmItem.title

            let showtimeInfo = document.createElement('p')
            showtimeInfo.className = 'showtime'
            showtimeInfo.innerText = `${filmItem.runtime} minutes`

            let ticketInfo = document.createElement('p')
            ticketInfo.className = 'tickets'
            ticketInfo.innerText = `${filmItem.capacity - filmItem.tickets_sold} tickets`

            itemInfo.appendChild(titleInfo)
            itemInfo.appendChild(showtimeInfo)
            itemInfo.appendChild(ticketInfo)

            item.appendChild(poster)
            item.appendChild(itemInfo)

            filmsList.appendChild(item)
        });

    })
