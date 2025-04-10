const express = require('express')
const router = express.Router();
const User = require('../models/user.js');

//INDEX - Show all quotes
router.get('/', async (req, res) => {
try {
    const currentUser = await User.findById(req.session.user._id)
    res.render('quotes/index', {
      savedQuotes: currentUser.savedQuotes,
      user: currentUser,
      currentQuote: { 
      content: "Your daily dose of inspiration!",
      author: "system"
      }
    });
    } catch (error) {
  res.redirect('/');
}

});

//NEW - show form to create a quote
router.get('/new', (req, res) => {
  res.render('quotes/new')
})

//CREATE - save new quote
router.post('/', async (req,res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
        currentUser.savedQuotes.push({
            content: req.body.content,
            author: req.body.author || 'Anonymous',
        });
    await currentUser.save();
    res.redirect('/quotes');
 }  catch (error) {
    res.redirect('/quotes/new');
 }

});

//DELETE: Remove a Quote
router.delete('/:quoteId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id) 
        currentUser.savedQuotes.id(req.params.quoteId).deleteOne();
        await currentUser.save();
        res.redirect('/quotes');
    }   catch (error) {
        res.redirect('/quotes')
    }     
})

//EDIT: Show Edit Form
router.get('/:quoteId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const quote = currentUser.savedQuotes.id(req.params.quoteId);
        res.render('quotes/edit', {
            quote: quote,
            user: currentUser
        });
    }  catch (error) {
       res.redirect('/quotes');
    }
});

//UPDATE: Save edited quote
router.put('/:quoteId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const quote = currentUser.savedQuotes.id(req.params.quoteId);
        quote.set(req.body); //Update content/author
        await currentUser.save();
        res.redirect(`/quotes/${req.params.quoteId}`);
    }   catch (error) {
        res.redirect(`/quotes/${req.params.quoteId}/edit`);
    }
    
})

//SHOW: Display Quote
router.get('/:quoteId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const quote = currentUser.savedQuotes.id(req.params.quoteId)
            res.render('quotes/show', {
            quote: quote,
            user: currentUser,
    });
    }   catch (error) {
        res.redirect('/quotes');
    }   

})



module.exports = router;