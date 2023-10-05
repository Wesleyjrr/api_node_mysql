const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const ProdutosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function(req, file,cb) {
        cb(null,'./uploads'); },
    filename: function(req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname );
        }
})

const fileFilter= (req, file, cb) => {
    if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {  
        cb(null, true);
    } else  cb(null, false);

}

const upload = multer({
    storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Retorna todos os produtos
router.get('/',ProdutosController.getProdutos);
// Insere um produto
router.post('/',
login.obrigatorio,
upload.single('produto_imagem'),
ProdutosController.postProdutos
);
// Retorna os dados de um produto
router.get('/:id_produto',ProdutosController.getUmProduto);
// Atualiza um produto
router.patch('/',login.obrigatorio,ProdutosController.updateProduto);
// Deleta um produto
router.delete('/',login.obrigatorio,ProdutosController.deleteProduto);


module.exports = router;

      