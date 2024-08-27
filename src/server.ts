import express from 'express'
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.get('/movies', async (req,res)=>{
  const movies = await prisma.movie.findMany({
    orderBy:{
        title:'asc'
    },

    include:{
        genres:true,
        language_movie: true
    },
  });

    res.json(movies);
});




app.listen(port, ()=>{
    console.log(`Servidor em execução ${port}`);
    
});