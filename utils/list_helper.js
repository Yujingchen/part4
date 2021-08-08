const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    const result = blogs.reduce(reducer, 0)
    return result
}

const favouriteBlogs = (blogs) => {
    const favourite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
    let formattedResult = { title: favourite.title, author: favourite.author, likes: favourite.likes }
    return formattedResult
}

let mostBlogs = (blogs) => {
    let orderByAuthor = _.sortBy(blogs, [function (o) { return o.author }])
    let most = 0
    let mostpopularauthor
    let curr = 0
    for (let i = 0; i < orderByAuthor.length; i++) {
        if (i === 0) {
            mostpopularauthor = orderByAuthor[i].author
            most++
            curr++
        }
        else if (i > 0) {
            if (orderByAuthor[i].author === orderByAuthor[i - 1].author) {
                curr++
                if (curr > most) {
                    most = curr
                    mostpopularauthor = orderByAuthor[i].author
                }
            }
            else {
                curr = 1
            }
        }
    }
    return mostpopularauthor ? {
        author: mostpopularauthor,
        blogs: most
    } : {}
}


let mostLikes = (blogs) => {
    let orderByAuthor = _.sortBy(blogs, [function (o) { return o.author }])
    let most = 0
    let mostpopularauthor
    let curr = 0
    for (let i = 0; i < orderByAuthor.length; i++) {
        if (i === 0) {
            mostpopularauthor = orderByAuthor[i].author
            most = orderByAuthor[i].likes
            curr = orderByAuthor[i].likes
        }
        else if (i > 0) {
            if (orderByAuthor[i].author === orderByAuthor[i - 1].author) {
                curr += orderByAuthor[i].likes
                if (curr > most) {
                    most = curr
                    mostpopularauthor = orderByAuthor[i].author
                }
            }
            else {
                curr = 0
            }
        }
    }
    return mostpopularauthor ? {
        author: mostpopularauthor,
        likes: most
    } : {}
}


module.exports = {
    dummy,
    totalLikes,
    favouriteBlogs,
    mostBlogs,
    mostLikes
}