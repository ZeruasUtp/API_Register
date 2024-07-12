const Evento = require('../models/eventModel');
const RegistroEv = require('../models/registroEvModel'); 

const registerEventController = {
    listAvailableEvents: async (req, res) => {
        try {
            const eventos = await Evento.findAll({
                attributes: [
                    'nombre',
                    'fecha_inicio',
                    'fecha_termino',
                    'hora',
                    'tipo_evento_id',
                    'organizador_id',
                    'categoria_id',
                    'ubicacion',
                    'max_per',
                    'estado'
                ],
                where: { estado: 'Approved' } 
            });
            res.status(200).json(eventos);
        } catch (error) {
            console.error('Error al listar los eventos disponibles:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    registerToEvent: async (req, res) => {
        const { evento_id } = req.params;
        const usuario_id = req.user.usuario_id;

        try {
            const evento = await Evento.findOne({ where: { evento_id } });
            if (!evento) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            const registros = await RegistroEv.count({ where: { evento_id } });
            if (registros >= evento.max_per) {
                return res.status(400).json({ error: 'No hay espacio disponible en el evento' });
            }

            await RegistroEv.create({ evento_id, usuario_id });
            res.status(201).json({ message: 'Registro exitoso' });
        } catch (error) {
            console.error('Error al registrarse en el evento:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    listRegisteredEvents: async (req, res) => {
        const usuario_id = req.user.usuario_id;

        try {
            const registros = await RegistroEv.findAll({
                where: { usuario_id },
                include: [{
                    model: Evento,
                    attributes: ['nombre', 'fecha_inicio', 'fecha_termino', 'hora', 'tipo_evento_id', 'organizador_id', 'categoria_id', 'ubicacion', 'max_per', 'estado']
                }]
            });

            const eventos = registros.map(registro => registro.Evento);

            res.status(200).json(eventos);
        } catch (error) {
            console.error('Error al listar los eventos registrados:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = registerEventController;
