import express from 'express'
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger.json'

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use('/docs',swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/movies', async (req, res) => {
  const movies = await prisma.movie.findMany({
   
    

    orderBy: {
      title: 'asc'

    },

    include: {
      genres: true,
      languages: true
   

    },
  });

  console.log(movies);

  res.json(movies);
});

app.post('/movies', async (req, res) => {

  const { title, genre_id, language_id, realese_data, oscar_count } = req.body;

  try {

    const movieRepeat = await prisma.movie.findFirst({
      where: { title: { equals: title, mode: "insensitive" } }
    });

    if (movieRepeat) {
      return res.status(409).send({ menssage: "Esse filme já esta cadastrado" });

    }


    await prisma.movie.create({

      data: {
        title,
        genre_id,
        language_id,
        realese_data: new Date(realese_data),
        oscar_count
      }
    });

    res.status(201).send({message:"Filme adicionado com sucesso"});
  }

  catch (error) {
    return res.status(500).send({ message: 'Falha ao cadastrar um filme' });
  }

});



app.put('/movies/:id', async (req, res) => {


      try {

        const id = Number(req.params.id)
        
        const updateData = await prisma.movie.update({

       

          where: {
            id
          },
      

        data: {
          realese_data: new Date(req.body.realese_data)
        }

      });

      if(!updateData){
        res.status(404).send({message: "Erro ao encontrar o filme"})
      }

      res.status(200).send({message: "Filme atualizado com sucesso"});



  }
   catch (error) {
    res.status(500).send({message: "Erro ao atualizar filme"})      
  }



});



app.delete('/movies/:id', async (req, res) => {

  const id = Number(req.params.id)

  try {

    const moviee = await prisma.movie.findUnique({
      where: { id },
    })

    if (!moviee) {
      return res.status(404).send({ message: "filme não encontrado" });
    }


    await prisma.movie.delete({
      where: {
        id
      }
    });

    res.send({ message: "Filme deletado com sucesso" });


  }

  catch (error) {

    return res.status(500).send({ message: "Erro ao deletar o filme" })

  }

});


app.get('/movies/:genreName', async (req, res) => {

  const genreReq = req.params.genreName

  try {
    
  const moviesFilter = await prisma.movie.findMany({

    where:{
      genres:{
        name:{
          equals:genreReq,
          mode:"insensitive"
        }
      }
    },

    include:{
      genres:true,
    }
});


res.status(200).send(moviesFilter);
  }
  
  catch (error) {
    
   return res.status(500).send({message: 'Erro ao filtrar gênero'})
  }


})


app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);

})