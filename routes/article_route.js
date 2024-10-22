const express = require("express");
const multer = require("multer");
const ArticleController = require("../controllers/article_controller");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/articles')
    },

    filename: function (req, file, cb) {
        cb(null, `article ${Date.now()} ${file.originalname}`);
    }
})

const uploads = multer({ storage: storage })



//Rutas de pruebas
router.get("/ruta-de-prueba", ArticleController.test);
router.get("/author", ArticleController.author);

//Ruta util
router.post("/create", ArticleController.create);
router.get("/articles/:ultimos?", ArticleController.read);
router.get("/article/:id", ArticleController.readById);
router.delete("/article/:id", ArticleController.deleteById);
router.put("/article/:id", ArticleController.update);
router.post("/upload-img/:id", [uploads.single("file0")], ArticleController.upload);
router.get("/imagen/:img", ArticleController.img);
router.get("/find/:find", ArticleController.finder);

module.exports = router;