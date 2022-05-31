import { inserirfilmes , alterarimagem , buscartodosfilmes } from "../repository/filmesrepository.js";
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





export default server