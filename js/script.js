// Fetch after document loads
// Script is deferred on the header
fetch('http://localhost:3008/films')
    .then(response => response.json())
    .then(data => {
        console.log(data)

        const filmsList = document.querySelector('#films')

        data.forEach((filmItem, index) => {

            let item = document.createElement('li')
            item.className = 'film item'

            let deleteIcon = document.createElement('i')
            deleteIcon.className = 'film-delete fa-solid fa-trash'
            deleteIcon.addEventListener('click', (e) => {
                e.stopImmediatePropagation()
                e.stopPropagation()
                e.preventDefault()
                deleteFilm(filmItem)
            })

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
            let ticketsAvailable = filmItem.capacity - filmItem.tickets_sold
            ticketInfo.innerText = (ticketsAvailable > 0) ? `${filmItem.capacity - filmItem.tickets_sold} tickets` : 'SOLD OUT'

            itemInfo.appendChild(titleInfo)
            itemInfo.appendChild(showtimeInfo)
            itemInfo.appendChild(ticketInfo)

            item.appendChild(deleteIcon)
            item.appendChild(poster)
            item.appendChild(itemInfo)

            filmsList.appendChild(item)

            item.addEventListener('click', (e) => {
                populateSummary(filmItem, item)
            })

            // Deliverable - See the first movie's details when the page loads
            if (index === 0) {
                populateSummary(filmItem, item)
            }

        });

    })

/**
 * Populate summary with film details
 * 
 * @param {object} filmItemData Film object containing film details
 * @param {element} linkToFilmItemOnList List item on film list
 */
function populateSummary(filmItemData, linkToFilmItemOnList) {
    const title = filmItemData.title
    const poster = filmItemData.poster
    const description = filmItemData.description
    const runtime = filmItemData.runtime
    const showtime = filmItemData.showtime
    const availableTickets = filmItemData.capacity - filmItemData.tickets_sold
    const availableTicketsMessage = (availableTickets === 0) ? 'sold out' : 'buy ticket '

    let filmTitle = document.querySelector('.film-title')
    filmTitle.innerText = title

    let filmPoster = document.querySelector('.film-poster')
    filmPoster.src = poster

    let filmDescription = document.querySelector('.film-synopsis')
    filmDescription.innerText = description

    let filmShowtime = document.querySelector('.film-showtime')
    filmShowtime.innerText = showtime

    let filmRuntime = document.querySelector('.film-runtime')
    filmRuntime.innerText = `${runtime} minutes`

    let filmTickets = document.querySelector('.film-tickets')
    filmTickets.innerText = availableTickets

    let ticketButton = document.querySelector('.purchase')
    ticketButton.innerText = availableTicketsMessage

    if (availableTickets > 0) {
        // code to add right chevron arrow on ticket button shown on button if tickets aren't sold out
        let icon = document.createElement('i')
        icon.className = 'fa-solid fa-chevron-right'
        ticketButton.appendChild(icon)

        // code to handle buy ticket triggered by 'BUY TICKET' button click
        ticketButton.addEventListener('click', (e) => {
            e.preventDefault()

            if (filmItemData.tickets_sold < filmItemData.capacity) {

                filmItemData.tickets_sold += 1

                let totalTicketSold = { "tickets_sold": filmItemData.tickets_sold }

                let fetchOptions = {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(totalTicketSold)
                }
                fetch(`http://localhost:3008/films/${filmItemData.id}`, fetchOptions)
                    .then(res => res.json())
                    .then(data => console.log(data))
                    .catch(err => console.error(err))

                // Update UI
                filmTickets.innerText = filmItemData.capacity - filmItemData.tickets_sold
                ticketButton.innerText = ((filmItemData.capacity - filmItemData.tickets_sold) === 0) ? 'sold out' : 'buy ticket '
                if (filmItemData.tickets_sold < filmItemData.capacity) ticketButton.appendChild(icon)
                linkToFilmItemOnList.querySelector('.tickets').innerText = ((filmItemData.capacity - filmItemData.tickets_sold) > 0) ? `${filmItemData.capacity - filmItemData.tickets_sold} tickets` : 'SOLD OUT'
            }
        })
    }
}

/**
 * Delete selected film
 * 
 * @param {object} film Film object containing film data
 */
function deleteFilm(film) {
    let filmInfo = { id: film.id }

    let fetchOptions = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filmInfo)
    }

    fetch(`http://localhost:3008/films/${film.id}`, fetchOptions)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))

    // Refresh page to update UI, functionality to be added later
    location.reload()
}