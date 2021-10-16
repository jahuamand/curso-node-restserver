const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, tieneRole,esAdminRole } = require('../middlewares');
const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const router= Router();

/**
 *  {{url}}/api/Productos
 */



//Obtener todos los Productos - publico
 router.get('/', obtenerProductos);

//Obtener una Productos por id -publico
//middleware para ver si id existe
router.get('/:id',[
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto);

//Crear Producto - private - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),   
    check('categoria','La categoría es obligatoria').not().isEmpty(),   
    check('categoria','No es un id de categoría válido').isMongoId(), 
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto);


//Actualizar Producto - private - cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('id').custom( existeProducto ),
    //validarCampos,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),   
    //check('categoria','La categoría es obligatoria').not().isEmpty(),   
   // check('categoria','No es un id de categoría válido').isMongoId(), 
  //  check('categoria').custom( existeCategoria ),
    validarCampos
], actualizarProducto);

//Borrar un Producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE','VENTAS_ROLE','OTRO_ROLE'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], borrarProducto );


module.exports = router;