export class GithubUsers {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint).then(response => response.json()).then(({name, login, followers, public_repos}) => ({
            name,
            login,
            followers,
            public_repos
        }))
    }
}