import express from 'express'
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.get('/movies', async (req, res) => {
  const movies = await prisma.movie.findMany({

    orderBy: {
      title: 'asc'

    },

    include: {
      genres: true,
      // language_movie: true

    },
  });

  res.json(movies);
});

app.post('/movies', async (req, res) => {

  const { title, genre_id, language_id, realese_data, oscar_count } = req.body;

try{

  const movieRepeat = await prisma.movie.findFirst({
    where:{title : { equals : title, mode:"insensitive" }}
  });

  if(movieRepeat){
    return res.status(409).send({menssage: "Esse filme já esta cadastrado"});

  }


  await prisma.movie.create({

    data: {
      title,
      genre_id,
      language_id,
      realese_data: new Date( realese_data),
      oscar_count
    }
  });

  res.status(201).send();
}

catch(error){
  return res.status(500).send({message : 'Falha ao cadastrar um filme'});
}

});


app.listen(port, () => {
  console.log(`Servidor em execução ${port}`);

});