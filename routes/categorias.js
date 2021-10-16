const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, tieneRole,esAdminRole } = require('../middlewares');
const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');

const router= Router();

/**
 *  {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
 router.get('/', obtenerCategorias);

//Obtener una categorias por id -publico
//middleware para ver si id existe
router.get('/:id',[
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria);

//Crear categoria - private - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),   
    validarCampos
], crearCategoria);

//Actualizar categoria - private - cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('id').custom( existeCategoria ),
    check('nombre','El nombre es obligatorio').not().isEmpty(),   
    validarCampos
], actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE','VENTAS_ROLE','OTRO_ROLE'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria );


module.exports = router;