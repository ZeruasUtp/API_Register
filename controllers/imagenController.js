const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier'); // Para convertir un buffer a stream si es necesario
const User = require('../models/userModel'); // Importa tu modelo de usuario si es necesario

// Configurar Cloudinary
cloudinary.config({ 
    cloud_name: 'dkdapj1br', 
    api_key: '894354184461489', 
    api_secret: 'u17smQXEPFgtovjbwyTPRjRSyPQ'
});

// Función para cargar una imagen a Cloudinary y actualizar la URL en la base de datos
const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Cargar la imagen a Cloudinary
        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                console.error('Error uploading to Cloudinary:', error);
                return res.status(500).json({ error: 'Failed to upload image' });
            }

            // Guardar la URL de la imagen en la base de datos (ejemplo con Sequelize)
            User.update(
                { fotoPerfil: result.secure_url }, // Actualiza el campo de fotoPerfil en tu modelo de usuario
                { where: { usuario_id: req.params.id } } // Condición para actualizar el usuario específico
            )
            .then(() => {
                res.json({ message: 'Image uploaded successfully', url: result.secure_url });
            })
            .catch(err => {
                console.error('Error saving image URL in database:', err);
                res.status(500).json({ error: 'Failed to save image URL in the database' });
            });
        });

        // Convertir el buffer del archivo a stream y luego pipe al stream de Cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
};

module.exports = {
    uploadImage
};
