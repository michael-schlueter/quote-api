const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement, getIndexById, generateId } = require('./utils');

// Send back a random quote
app.get("/api/quotes/random", (req, res, next) => {
    const randomQuote = getRandomElement(quotes);
    res.send({
        quote: randomQuote
    });
}); 

// Send back all quotes from a specific person
app.get("/api/quotes", (req, res, next) => {
    // Check if a person has been specified
    if (req.query.person === undefined) {
        // Send back all quotes if no person has been specified in the request
        res.send({
            quotes: quotes
        });
    } else {
        const quotesByPerson = quotes.filter(quote => quote.person === req.query.person);
        if (quotesByPerson.length > 0) {
            res.send({
                quotes: quotesByPerson
            });
        } else {
            // Send back an empty array if no quote from the specified person exists
            res.send({
                quotes: []
            })
        }
    }
});

// Send back a single quote based on its id
app.get("/api/quotes/:id", (req, res, next) => {
    const quoteIndex = getIndexById(req.params.id, quotes);
    // Check if the quote exists based on its id
    if (quoteIndex === -1) {
        res.status(404).send("Quote not found");
    } else {
        res.send({
            quotes: quotes[quoteIndex]
        });
    }
}) 

// Add a quote
app.post("/api/quotes", (req, res, next) => {
    // Check if the necessary parameters are included in the request to create a new quote
    if (req.query.quote !== undefined && req.query.person !== undefined && req.query.year !== undefined) {
        quotes.push(req.query);
        res.status(201).send({
            quote: req.query
        });
    } else {
        res.status(400).send();
    }
});

// Create a new quote
app.post('/api/quotes', (req, res) => {
    let newQuotePerson = req.query.person;
    let newQuote = req.query.quote;
    if (newQuote && newQuotePerson) {
      quotes.push(req.query);
      // Generate a new id for the quote
      generateIds(quotes);
      res.status(201).send({quote: quotes[quotes.length-1]});
    } else {
      res.status(400).send('Quote not found with the id provided! 🤷‍♂️');
    }
  })

// Update a specific quote
app.put("/api/quotes/:id", (req, res, next) => {
    if (req.query.person && req.query.quote && req.query.year) {
        const quoteIndex = getIndexById(req.params.id, quotes);
        if (quoteIndex === -1) {
            res.status(404).send("Quote not found");
        } else {
            quotes[quoteIndex] = req.query;
            res.send({ quote: req.query });
        }
    } else {
        res.status(400).send("ID and/or quote and/or year not provided!")
    }
}) 

// Delete a specific quote
app.delete("/api/quotes/:id", (req, res, next) => {
    const quoteIndex = getIndexById(req.params.id, quotes);
    if (quoteIndex !== -1) {
        quotes.splice(quoteIndex, 1);
        res.send({ quote: quotes[quoteIndex] });
    } else {
        res.status(404).send('ID not found')
    }
}) 

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
})

app.use(express.static('public'));

