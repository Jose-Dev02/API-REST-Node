const { ArticleValidator } = require("../helpers/validator");
const Article = require('../models/Articles');
const fs = require('fs');
const path = require("path");

const test = (req, res) => {

    return res.status(200).json({
        mensaje: "Testing my controller"
    })
}

const author = (req, res) => {
    console.log("Se ha ejecutando el endpoint probando");

    return res.status(200).json({
        autor: "Jose_DEV"

    })
}

const create = async (req, res) => {

    //Recoger parametros por post a guardar
    let params = req.body;

    //Validar datos
    try {
        ArticleValidator(params);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        })
    }
    //Crear el objeto a guardar
    const article = new Article(params);

    //Asignar valores a objetos basado en el modelo(manual o automatico)
    //article.title = params.title;

    //Guardar el articulo en la base de datos
    try {
        articleSaved = await article.save();

        //Devolver resultado
        return res.status(200).json({
            status: "success",
            article: articleSaved
        })
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        })
    }
}

const read = async (req, res) => {

    let limit;
    if (req.params.ultimos) limit = req.params.ultimos
    try {
        let consulta = await Article.find({})
            .limit(limit)
            .sort({ date: -1 })
            .exec()
        if (consulta.isEmpty) throw new Error("Any articles were found !!");
        return res.status(200).json({
            status: "success",
            params: req.params.ultimos,
            count: consulta.length,
            consulta
        });
    } catch (error) {
        return res.status(404).json({
            status: "error",
            error: error.message
        });
    }

}

const readById = async (req, res) => {
    const id = req.params.id;
    try {
        let consulta = await Article.findById(id).exec()
        if (consulta.isEmpty) throw new Error("Any articles were found !!");
        return res.status(200).json({
            status: "success",
            params: req.params.id,
            count: consulta.length,
            consulta
        });
    } catch (error) {
        return res.status(404).json({
            status: "error",
            error: error.message

        })
    }

}

const deleteById = async (req, res) => {
    const id = req.params.id;
    try {
        let consulta = await Article.findByIdAndDelete(id)
        if (consulta.isEmpty) throw new Error("Any articles were found !!");
        return res.status(200).json({
            status: "success",
            params: req.params.id,
            count: consulta.length,
            consulta
        });
    } catch (error) {
        return res.status(404).json({
            status: "error",
            error: error.message

        })
    }
}


const update = async (req, res) => {
    const id = req.params.id;

    //Recoger datos del body
    let params = req.body;

    //Validar Datos
    try {
        ArticleValidator(params);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: error.message
        })
    }
    //Buscar y actualizar articulo
    try {
        let consulta = await Article.findByIdAndUpdate(id, params, { new: true })
        if (consulta.isEmpty) throw new Error("Any articles were found !!");
        return res.status(200).json({
            status: "success",
            consulta
        })

    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: error.message
        })
    }


}

const upload = async (req, res) => {

    //Configurar multer

    //Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            message: "Peticion Invalida"
        })
    }

    //Nombre del archivo
    let archive = req.file.originalname;

    //Extension del archivo
    let archive_split = archive.split("\.");
    let extension = archive_split[1];

    //Comprobar extension correcta
    if (extension != "png" && extension != "jpg" &&
        extension != "jpeg" && extension != "gif"
    ) {
        //Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                message: "Imagen invalida"
            })
        })
    } else {
        //Si todo va bien, actualizar el articulo

        const id = req.params.id;


        //Buscar y actualizar articulo
        try {
            let consulta = await Article.findByIdAndUpdate(id, { img: req.file.filename }, { new: true })

            return res.status(200).json({
                status: "success",
                consulta,
                uploadfile: req.file
            })

        } catch (error) {
            return res.status(500).json({
                status: "error",
                error: error.message
            })
        }

    }

}

const img = async (req, res) => {
    let file = req.params.img;
    let ruta_fisica = `./images/articles/${file}`;

    fs.stat(ruta_fisica, (error, exist) => {
        if (exist) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: "error",
                message: "Image NOT FOUND"
            })
        }
    })
}

const finder = async (req, res) => {
    //Sacar el string de busqueda
    let find = req.params.find;

    //Find OR
    try {
        let articles = await Article.find({
            "$or": [
                { "title": { "$regex": find, "$options": "i" } },
                { "content": { "$regex": find, "$options": "i" } },
            ]
        })
            .sort({ fecha: -1 })
            .exec()
        if (articles.length <= 0) throw new Error("Any Articles were found!!")

        return res.status(200).json({
            status: "success",
            count: articles.length,
            articles
        })
    } catch (error) {
        return res.status(404).json({
            status: "error",
            error: error.message
        })

    }

    //Ejecutar Consulta

    //Devolver resultado
}
module.exports = {
    test,
    author,
    create,
    read,
    readById,
    deleteById,
    update,
    upload,
    img,
    finder
}