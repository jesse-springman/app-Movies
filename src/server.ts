import express from 'express'

const app = express();
const port = 3000;

app.get('/movies', (req,res)=>{
    console.log('Lista fimes');
    
})

app.listen(port, ()=>{
    console.log(`Servidor em execução ${port}`);
    
})