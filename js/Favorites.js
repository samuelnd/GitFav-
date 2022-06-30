import { GithubUsers } from "./GithubUsers.js"

export class Favorites {
    constructor(root) { 
        this.root = document.querySelector(root)
        this.load()
    }

    load() { 
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:'))  || []
        
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) { 
         try {
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) { 
                throw new Error('Usuário já cadastrado! Tente novamente!')
            }

            const user = await GithubUsers.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não existe no Github')
            }

            this.entries =[user, ...this.entries]
            this.update()
            this.save()

         } catch(error) {
            alert(error.message)
         }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries

        this.update()
        this.save()
    }
}

export class FavoritesNew extends Favorites { 
    constructor(root) {
        super(root)


        this.tbody = this.root.querySelector('table tbody')
        this.span = this.root.querySelector('main span')

        this.onadd()
        this.update()
        this.deleteMessage()

        
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update() {
        this.deleteTr()
        this.deleteMessage()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers'). textContent = user.followers

            row.querySelector('.remove').addEventListener('click', () => {
                const isOk = confirm('Deseja realmente excluir este usuário? ')

                if(isOk) {
                    this.delete(user)
                }
            })

            this.tbody.append(row)

        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <tr>
        <td class="user">
          <img src="https://github.com/diego3g.png" alt="Imagem de maykbrito">
          <a href="https://github.com/maykbrito" target="_blank">
            <p>Mayk Brito</p>
            <span>maykbrito</span>
          </a>
        </td>
        <td class="repositories">
          76
        </td>
        <td class="followers">
          9589
        </td>
        <td>
          <button class="remove">Remover</button>
        </td>
      </tr>
        `
        return tr
    }

    deleteTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

    deleteMessage() {
        const userExists = this.entries

        const verify = userExists.length

        if(verify > 0 ) {
            this.span.querySelectorAll('svg').forEach((svg) => {
                svg.remove()
            })
            
            this.span.querySelectorAll('h1').forEach((h1) => {
                h1.remove()
            })
        } 
    }
}