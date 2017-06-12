const app = {
    init(selectors) {
        this.max = 0
        this.listEmpty = true
        this.list = document.querySelector(selectors.listSelector)
        this.movies = []

        document.querySelector('#res').setAttribute('onClick', 'app.clearMem()')
        document.querySelector('#help').setAttribute('onClick', 'app.help()')

        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addMovie.bind(this))

        this.load()
    },

    help() {
        alert('Enter a Jeff Goldblum movie and the year it was released')
    },

    addMovie(ev) {
        ev.preventDefault()

        const f = ev.target

        const movie = {
            id: this.max,
            name: f.movieName.value,
            year: f.movieYear.value,
            isProm: false,
        }

        this.loadMovie(movie)

        f.reset()
    },

    loadMovie(movie) {
        const listItem = this.buildListItem(movie)
        this.list.appendChild(listItem)

        this.movies.unshift(movie)
        this.save()

        if (this.listEmpty === false) {
            this.list.insertBefore(listItem, this.list.childNodes[0])
        } else {
            this.list.appendChild(listItem)
            this.listEmpty = false
        }

        if (movie.isProm) {
            const ed = '#el' + movie.id
            const pm = 'prmB' + movie.id
            const dm = 'demB' + movie.id
            document.querySelector(ed).style.color = 'crimson'
            // document.getElementById(pm).innerHTML = '&nbsp ─ &nbsp'
            document.getElementById(pm).setAttribute('class', 'warning button')
            document.getElementById(pm).style.color = 'crimson'
        }

        this.max++
    },

    load() {
        const moviesJSON = JSON.parse(localStorage.getItem('movies'))

        if (moviesJSON) {
            moviesJSON.reverse().map(this.loadMovie.bind(this))
        }
    },

    save() {
        localStorage.setItem('movies', JSON.stringify(this.movies))
    },

    clearMem() {
        console.log('clearing list')

        localStorage.removeItem('movies')
        this.movies.splice(0, this.movies.length)
        $('li').remove()
    },

    buildListItem(movie) {
        const item = document.createElement('li')
        item.setAttribute('id', 'el' + movie.id)
        item.textContent = movie.name + ' ~ (' + movie.year + ') '
        item.setAttribute('contentEditable', 'true')
        item.setAttribute('class', 'movie')
        movie.el = item.id

        const downButton = document.createElement('button')
        downButton.setAttribute('id', 'dwnB' + movie.id)
        downButton.setAttribute('type', 'button')
        downButton.setAttribute('class', 'primary button down')
        downButton.setAttribute('contentEditable', 'false')
        // downButton.innerHTML = '&nbsp ↓ &nbsp'
        downButton.style.color = 'gold'
        downButton.style.fontSize = '1.6rem'
        movie.down = downButton
        const o = document.createElement('i')
        o.setAttribute('class', 'fa fa-arrow-down')
        downButton.appendChild(o)
        item.appendChild(downButton)
        item.querySelector('#dwnB' + movie.id).addEventListener('click', this.downItem.bind(this, downButton.id))

        const upButton = document.createElement('button')
        upButton.setAttribute('id', 'upB' + movie.id)
        upButton.setAttribute('type', 'button')
        upButton.setAttribute('class', 'primary button up')
        upButton.setAttribute('contentEditable', 'false')
        // upButton.innerHTML = '&nbsp ↑ &nbsp'
        upButton.style.color = 'gold'
        upButton.style.fontSize = '1.6rem'
        movie.up = upButton
        const u = document.createElement('i')
        u.setAttribute('class', 'fa fa-arrow-up')
        upButton.appendChild(u)
        // this.movies[this.movies.indexOf(movie) - 1].upButton.disabled = false
        item.appendChild(upButton)
        item.querySelector('#upB' + movie.id).addEventListener('click', this.upItem.bind(this, upButton.id))

        const deleteButton = document.createElement('button')
        deleteButton.setAttribute('id', 'delB' + movie.id)
        deleteButton.setAttribute('onClick', 'app.deleteItem(this.id)')
        deleteButton.setAttribute('type', 'button')
        deleteButton.setAttribute('class', 'alert button')
        deleteButton.setAttribute('contentEditable', 'false')
        // deleteButton.innerHTML = '&nbsp X &nbsp'
        deleteButton.style.color = 'whitesmoke'
        deleteButton.style.fontSize = '1.6rem'
        movie.del = deleteButton
        const i = document.createElement('i')
        i.setAttribute('class', 'fa fa-trash-o')
        deleteButton.appendChild(i)
        item.appendChild(deleteButton)

        const promoteButton = document.createElement('button')
        promoteButton.setAttribute('id', 'prmB' + movie.id)
        promoteButton.setAttribute('onClick', 'app.promoteItem(this.id)')
        promoteButton.setAttribute('type', 'button')
        promoteButton.setAttribute('class', 'success button')
        promoteButton.setAttribute('contentEditable', 'false')
        // promoteButton.innerHTML = '&nbsp + &nbsp'
        promoteButton.style.color = 'blue'
        promoteButton.style.fontSize = '1.6rem'
        movie.prm = promoteButton
        const a = document.createElement('i')
        a.setAttribute('class', 'fa fa-star-o')
        promoteButton.appendChild(a)
        item.appendChild(promoteButton)

        const saveButton = document.createElement('button')
        saveButton.setAttribute('id', 'savB' + movie.id)
        saveButton.setAttribute('onClick', 'app.saveItem(this.id)')
        saveButton.setAttribute('type', 'button')
        saveButton.setAttribute('class', 'secondary button')
        saveButton.setAttribute('contentEditable', 'false')
        // saveButton.innerHTML = '&nbsp $ &nbsp'
        saveButton.style.color = 'whitesmoke'
        saveButton.style.fontSize = '1.6rem'
        movie.sav = saveButton
        const e = document.createElement('i')
        e.setAttribute('class', 'fa fa-floppy-o')
        saveButton.appendChild(e)
        item.appendChild(saveButton)

        return item
    },

    promoteItem(clicked_id) {
        for (let j = 0; j < this.movies.length; j++) {
            const nm = 'prmB' + this.movies[j].id
            const dm = 'demB' + this.movies[j].id
            const pm = 'prmB' + this.movies[j].id
            const ed = '#el' + this.movies[j].id

            if (nm === clicked_id && this.movies[j].isProm === false) {
                console.log('promoting item')
                this.movies[j].isProm = true
                document.querySelector(ed).style.color = 'crimson'
                // document.getElementById(pm).innerHTML = '&nbsp ─ &nbsp'
                const a = document.createElement('i')
                a.setAttribute('class', 'fa fa-star-o')
                document.getElementById(pm).setAttribute('class', 'warning button')
                document.getElementById(pm).style.color = 'crimson'
                this.save()
            } else if (nm === clicked_id && this.movies[j].isProm === true) {
                console.log('demoting item')
                this.movies[j].isProm = false
                document.querySelector(ed).style.color = 'black'
                // document.getElementById(pm).innerHTML = '&nbsp + &nbsp'
                document.getElementById(pm).setAttribute('class', 'success button')
                document.getElementById(pm).style.color = 'blue'
                this.save()
            }
        }
    },

    demoteItem(clicked_id) {
        // This method is no longer in use

        console.log('demoting item')

        for (let j = 0; j < this.movies.length; j++) {
            const nm = 'demB' + this.movies[j].id
            const dm = 'demB' + this.movies[j].id
            const pm = 'prmB' + this.movies[j].id
            const ed = '#el' + this.movies[j].id

            if (nm === clicked_id) {
                this.movies[j].isProm = false
                document.querySelector(ed).style.color = 'black'
                document.getElementById(dm).disabled = true
                document.getElementById(pm).disabled = false
                this.save()
            }
        }
    },

    deleteItem(clicked_id) {
        console.log('deleting item')

        for (let j = 0; j < this.movies.length; j++) {
            const nm = '#el' + this.movies[j].id

            if (clicked_id === this.movies[j].del.id) {
                $(nm).remove()

                for (let i = 0; i < this.movies.length; i++) {
                    const nd = '#el' + this.movies[i].id
                    if (nm === nd) {
                        this.movies.splice(i, 1)
                        this.save()
                        break
                    }
                }
            }
        }
    },

    upItem(clicked_id, ev) {
        ev.preventDefault()

        this.list.insertBefore(ev.target.closest('li'), ev.target.closest('li').previousElementSibling)

        console.log('upping item')

        for (let j = 0; j < this.movies.length; j++) {
            if (clicked_id === this.movies[j].up.id) {
                const movie = this.movies[j]
                const prev = this.movies[j - 1]
                this.movies[j - 1] = movie
                this.movies[j] = prev
                this.save()
                break
            }
        }
    },

    downItem(clicked_id, ev) {
        ev.preventDefault()

        this.list.insertBefore(ev.target.closest('li'), ev.target.closest('li').previousElementSibling)

        console.log('downing item')

        for (let j = 0; j < this.movies.length; j++) {
            if (clicked_id === this.movies[j].up.id) {
                const movie = this.movies[j]
                const prev = this.movies[j + 1]
                this.movies[j + 1] = movie
                this.movies[j] = prev
                this.save()
                break
            }
        }
    },

    saveItem(clicked_id) {
        console.log('saving edited item')

        for (let j = 0; j < this.movies.length; j++) {
            const nm = 'savB' + this.movies[j].id
            const ed = '#el' + this.movies[j].id

            if (nm === clicked_id) {
                const split = document.querySelector(ed).textContent.split('')
                this.movies[j].name = document.querySelector(ed).textContent.substring(0, split.indexOf('~'))
                this.movies[j].year = document.querySelector(ed).textContent.substring(split.indexOf('(') + 1, split.indexOf(')'))
                localStorage.setItem('movies', JSON.stringify(this.movies))
                location.reload()
                break
            }
        }
    },
}

app.init({
    formSelector: '#movie-form',
    listSelector: '#movie-list',
})