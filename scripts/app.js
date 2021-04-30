const Form = {
    searchInput: document.getElementById('user'),
    submit: (event) => {
        event.preventDefault();

        let user = Form.searchInput.value;

        if (!user)
            return;

        App.returnRepositories(user);
    }
};

const App = {
    disableUserRepository: true,
    repositories: [],
    clearRepositories: () => {
        App.repositories = [];
    },
    returnRepositories: async (user) => {
        App.clearRepositories();

        try {
            const response = await fetch(`https://api.github.com/users/${user}/repos`)

            if (response.status == 404)
                return;

            const data = await response.json();
            const dataObjects = Object.keys(data);

            dataObjects.forEach(repo => {
                let repository = data[repo];

                if (App.disableUserRepository && repository.name == user)
                    return;

                console.log(repository);

                App.repositories.push({
                    name: repository.name,
                    description: repository.description || 'Não exisite descrição',
                    language: repository.language || 'Não definido',
                    url: repository.html_url
                })

                console.log(App.repositories);
            });
        } catch (error) {
            throw new Error(error);
        }

        DOM.innerHTML(document.querySelector('.container'));
    },

}

const DOM = {
    innerHTML: (element) => {
        const repositories = App.repositories;

        element.innerHTML = '';

        repositories.forEach(repository => {
            let {name, description, language} = repository;

            element.innerHTML +=
                `<div class="card" onclick="">
                    <h1>${name}</h1>
                    <span class="description">${description.length > 60 ? (description.slice(0, 60) + '...') : description}</span>
                    <span class="language">${language}</span>
                </div>`;
        });
    }
};