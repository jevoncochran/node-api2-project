const express = require('express');

const blog = require('../data/db');

const router = express.Router();

router.post('/', (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
    } else {
        blog.insert(newPost)
            .then(({id}) => {
                blog.findById(id)
                .then(blogPost => {
                    console.log(blogPost);
                    res.status(201).json(blogPost);
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'There was an error while saving the post to the database' });
            })
    }
})

router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const newComment = { ...req.body, post_id: id };
    if (!newComment.text) {
        res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
    } else {
        blog.insertComment(newComment)
            .then(blogPost => {
                if (!blogPost) {
                    res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
                } else {
                    blog.findCommentById(blogPost)
                        .then(comment => {
                            console.log(comment);
                            res.status(201).json(blogPost);
                        })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'There was an error while saving the comment to the database' });
            })
    }
})

router.get('/', (req, res) => {
    blog.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'The posts information could not be retrieved.' });
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    blog.findById(id)
        .then(blogPost => {
            if (!blogPost) {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
            } else {
                res.status(200).json(blogPost);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'The post information could not be retrieved.' });
        })
})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    blog.findPostComments(id)
        .then(blogPost => {
            if (!blogPost) {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
            } else {
                res.status(200).json(blogPost);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'The comments information could not be retrieved.' });
        })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    blog.remove(id)
        .then(deleted => {
            if (!deleted) {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
            } else {
                res.status(200).json(deleted)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'The post could not be removed' });
        })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const editedPost = req.body;
    if (!editedPost.title || !editedPost.contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'});
    } else {
        blog.update(id, editedPost)
            .then(blogPost => {
                if (!blogPost) {
                    res.status(404).json({ errorMessage: 'The post with the specified ID does not exist.' });
                } else {
                    blog.findById(id)
                        .then(blogPost => {
                            console.log(blogPost);
                            res.status(200).json(blogPost);
                        })
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'The post information could not be modified.' });
            })
    }
})

module.exports = router;