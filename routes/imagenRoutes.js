const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');
const upload = require('../middleware/multerConfig');

// Ruta para subir imagen
router.put('/upload/:id', upload.single('image'), imagenController.uploadImage);

module.exports = router;
