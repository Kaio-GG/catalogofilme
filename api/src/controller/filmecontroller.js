import { inserirfilmes , alterarimagem , buscartodosfilmes , buscarporid,buscarpornome, removerFilme, alterarfilme } from "../repository/filmesrepository.js";
import { Router } from "express";
import multer from 'multer'


const server= Router()
const upload = multer({dest: 'storage/capasfilmes'})

server.post ('/filme', async (req,resp) =>{
    try {
        const novoFilme = req.body

        if (!novoFilme.nome) {
            throw new Error ('campo do nome é obrigatorio')
        }
        if (!novoFilme.sinopse) {
            throw new Error ('campo da sinopse é obrigatorio')
        }
        if (!novoFilme.avaliacao) {
            throw new Error ('campo da avaliacao é obrigatorio')
        }
        if (!novoFilme.lancamento) {
            throw new Error ('campo do lancamento é obrigatorio')
        }
        if (!novoFilme.disponivel) {
            throw new Error ('campo da disponibilidade é obrigatorio')
        }
        if (!novoFilme.usuario) {
            throw new Error ('campo do usuario é obrigatorio')
        }

        const filme = await inserirfilmes(novoFilme)

        resp.send(filme)
        
    } catch (err) {
         resp.status(404).send({
             erro: err.message
         })
    }
})



server.put ('/filme/:id/capa', upload.single('capa') , async (req,resp) => {
    try {
        const { id } = req.params
        const imagem = req.file.path

        const resposta = await alterarimagem( imagem , id )
        if(resposta != 1)
            throw new Error ('imagem nao pode ser inserida')

        resp.status(200).send()

    } catch (err) {
        resp.status(404).send({
            erro: err.message
        })
    }
})

server.get ('/filme', async (req,resp) => {
    try {
        const resposta = await buscartodosfilmes()

        resp.send(resposta)

    } catch (err) {
        resp.status(404).send({
            erro:err.message
        }) 
    }
})

server.get ('/filme/buscar', async (req,resp) => {
    try {
        const {nome} =req.query

        const resposta = await buscarpornome(nome)
        if (resposta.length == 0) 
            resp.status (404).send([])
        else
            resp.send(resposta)

    } catch (err) {
        resp.status(404).send({
            erro:err.message
        }) 
    }
})

server.get ('/filme/:id', async (req,resp) => {
    try {
        const {id} =req.params

        const resposta = await buscarporid (id)
        if (!resposta) 
            resp.status (404).send([])
        else
            resp.send(resposta)

    } catch (err) {
        resp.status(404).send({
            erro:err.message
        }) 
    }
})


server.delete('/filme/:id', async (req, resp) => {
    try{
        const { id } = req.params 

        const resposta = await removerFilme(id);
        if(resposta != 1)
            throw new Error ('Filme não pode ser removido.');

        resp.status(204).send();
    }catch(err){
        resp.status(404).send({
            erro:err.message
        })
    
    }
})

server.put('/filme/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const filme =  req.body;

        if (!filme.nome) {
            throw new Error ('campo do nome é obrigatorio')
        }
        if (!filme.sinopse) {
            throw new Error ('campo da sinopse é obrigatorio')
        }
        if (!filme.avaliacao == undefined  || filme.avaliacao < 0) {
            throw new Error ('campo da avaliacao é obrigatorio')
        }
        if (!filme.lancamento) {
            throw new Error ('campo do lancamento é obrigatorio')
        }
        if (!filme.disponivel == undefined) {
            throw new Error ('campo da disponibilidade é obrigatorio')
        }
        if (!filme.usuario) {
            throw new Error ('campo do usuario é obrigatorio')
        }

        const resposta = await alterarfilme(id, filme );
        if (resposta != 1) 
            throw new Error ('Filme não pode ser alterado ')
        else 
            resp.status(204).send();

    }catch(err){
        resp.status(404).send({
            erro:err.message

        })
    }
})


export default server