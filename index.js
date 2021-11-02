const PORT = 8000
const express = require('express')
const axios   = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')


const app = express()

const newspapers = [

    {
        name: 'The Times Of India',
        address: 'https://timesofindia.indiatimes.com/',
        base:''
    },
    {
        name: 'ndtv',
        address: 'https://www.ndtv.com/',
        base:''
    },
    {
        name: 'Hindustan Times',
        address: 'https://www.hindustantimes.com/',
        base:'https://www.hindustantimes.com'        
    },
    {

        name: 'Indian Epxress',
        address: 'https://indianexpress.com/',
        base:''

    },
    {

        name: 'News 18',
        address: 'https://www.news18.com/',
        base:''
    }


]
const articles = []

newspapers.forEach(newspaper => {

    axios.get(newspaper.address)
    .then(response => {
        const html  = response.data
        const $ = cheerio.load(html)
        $('a:contains("India")', html).each(function() {
            const title  = $(this).text()
            var url = ''
            if(newspaper.name==='Hindustan Times') {
                var aft = $(this).attr('href')
                if(aft.startsWith('http',0)) {
                    url = aft;
                } else {
                    url = newspaper.base +  aft
                }


            } else{

                url = $(this).attr('href')

            }

            articles.push({

                title,
                url,
                source: newspaper.name

            })

        })
    })

})


app.get('/', (req, res) => {

    res.json("Welcome to the News API")

})


app.get('/news',(req,res) => {

    res.json(articles)

})

app.get('/news/:newspaperId', (req,res) => {

    const newspaperId = req.params.newspaperId
    const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)
    console.log(newspaperBase)
    axios.get(newspaperBase[0].address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specart = []
            $('a:contains("India")',html).each(function() {

                const title = $(this).text()
                const  url =  $(this).attr('href')
                specart.push({
                    title,
                    url,
                    source: newspaperId 
                })
            })
            res.json(specart)
        }).catch(err => console.log(err))

})

app.get('/news/st/climate', (req,res) => {

    const spectoparticles = []
    newspapers.forEach(newspaper => {
        
        axios.get(newspaper.address)
        .then(response => {
            const html  = response.data
            const $ = cheerio.load(html)
            $('a:contains("climate")', html).each(function() {
                const title  = $(this).text()
                var url = ''
                if(newspaper.name==='Hindustan Times') {
                    var aft = $(this).attr('href')
                    if(aft.startsWith('http',0)) {
                        url = aft;
                    } else {
                        url = newspaper.base +  aft
                    }
    
    
                } else{
    
                    url = $(this).attr('href')
    
                }
    
                spectoparticles.push({
    
                    title,
                    url,
                    source: newspaper.name
    
                })
    
            })
        })
    
    })
    console.log(spectoparticles)

    res.json(spectoparticles)

})



app.listen(PORT,() => console.log(`Server running on port ${PORT}`))