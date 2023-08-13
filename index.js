import express from "express"
// import bodyParser from "body-parser"
import axios from "axios"
import 'dotenv/config'

const app = express()
const port = 3000
const ACCESS_TOKEN = process.env.API_READ_ACCESS_TOKEN
const baseURL = `https://api.themoviedb.org/3`
const config = {
    headers:{
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
}

app.use(express.static('public'))
app.use('/node_modules', express.static('node_modules'));

async function getMovieNowPlaying(){
    const response = await axios.get(`${baseURL}/movie/now_playing`,config)
    const result = response.data.results
    return result;
}

async function getMoviePopular(){
    const response = await axios.get(`${baseURL}/movie/popular`,config)
    const result = response.data.results
    return result;
}

async function getMovieTopRated(){
    const response = await axios.get(`${baseURL}/movie/top_rated`,config)
    const result = response.data.results
    return result;
}

async function getMovieUpcoming(){
    const response = await axios.get(`${baseURL}/movie/upcoming`,config)
    const result = response.data.results
    return result;
}

async function getGenreMovie(){
    const response = await axios.get(`${baseURL}/genre/movie/list`,config)
    const result = response.data.genres
    return result;
}

async function getGenreTv(){
    const response = await axios.get(`${baseURL}/genre/tv/list`,config)
    const result = response.data.genres
    return result;
}

app.get('/',async (req,res)=>{
    try {
    const nowPlayingMovie = await getMovieNowPlaying()
    const popularMovie = await getMoviePopular()
    const topRatedMovie = await getMovieTopRated()
    const upcomingMovie = await getMovieUpcoming()
    const genreMovie = await getGenreMovie()
    const genreTv = await getGenreTv()
    const data = {showCarousel : true ,nowPlayingMovie, popularMovie,topRatedMovie, upcomingMovie, genreMovie, genreTv, baseImg : "https://image.tmdb.org/t/p/w500"} 

    res.render('index.ejs', data )
    } catch (error) {
        console.error(`Error : ${error.message} `)
        res.render('error.ejs',{error: error.message})
    }
})

app.get("/:genre",async(req,res)=>{
    const genre = req.params.genre
    const response = await axios.get(`${baseURL}/movie/${genre}`,config)
    const result = response.data.results
    const data ={result,showCarousel:false,genre, baseImg : "https://image.tmdb.org/t/p/w500"}
        res.render('lists.ejs',data)
})

app.get("/movie/:id", async (req,res)=>{
    try {
        const movieId = req.params.id
        const response = await axios.get(`${baseURL}/movie/${movieId}`,config)
        const result = response.data
        const data ={result,showCarousel:false, baseImg : "https://image.tmdb.org/t/p/w500"}
        res.render('movie.ejs',data)
        } catch (error) {
            console.error(`Error : ${error.message} `)
            res.render('error.ejs',{error: error.message})
        }
})

app.listen(port,()=>{
    console.log(`Server Running on port ${port}`);
})