// Fake database
const users = [
    {
        id: '1',
        name: 'alex',
        email: 'alexlacasse24@gmail.com',
        age: 24
    },
    {
        id: '2',
        name: 'John',
        email: 'john4@gmail.com',
        age: 74
    },
    {
        id: '3',
        name: 'Sonia',
        email: 'Sonia22@gmail.com',
        age: 21
    }
]

const posts = [
    {
        id: '1',
        title: ' Quel est votre animal préféré?',
        body: 'Body #1',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'The legend of sakoma',
        body: 'Jambon',
        published: false,
        author: '1'
    },
    {
        id: '3',
        title: 'LA sorte de viande à ne pas manquer',
        body: 'Jambon',
        published: true,
        author: '2'
    }
]

const comments = [
    {
        id: '1',
        text: "Good job for the dog",
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: "What a beautiful cat",
        author: '1',
        post: '1'
    },
    {
        id: '3',
        text: "That's a good looking lasagna",
        author: '2',
        post: '2'
    },
    {
        id: '4',
        text: "Hold my beer",
        author: '3',
        post: '3'
    }
]

const db = {
    users,
    posts,
    comments
}

export { db as default }