const { response } = require("express");
const {ObjectId} = require('mongoose').Types;
const {Usuario,Categoria,Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuario =  async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE
    
    if (esMongoID){
        const usuario = await Usuario.findById(termino);
        res.json({
            result: (usuario) ? [usuario] : []
        });
        
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({
        $or: [{nombre: regex},{correo: regex}],
        $and: [{estado:true}]
    });

    res.json({
        result: usuarios
    });

}

const buscarCategorias =  async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE
    
    if (esMongoID){
        const categoria = await Categoria.findById(termino);
        res.json({
            result: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({nombre: regex,estado:true});

    res.json({
        result: categorias
    });

}

const buscarProductos =  async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE
    
    if (esMongoID){
        const producto = await Producto.findById(termino)
                                .populate('categoria','nombre');
        res.json({
            result: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({nombre: regex,estado:true})
                            .populate('categoria','nombre');

    res.json({
        result: productos
    });

}

const buscar = (req,res=response) =>{

    const {coleccion,termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}` 
        })
    }

   

    switch (coleccion) {
        case 'usuarios':
            // res.status(200).json({
            //     msg: 'Exitoso.'
            // });
            buscarUsuario(termino,res);
            break;
        case 'categorias':
            buscarCategorias(termino,res);
            break;
        case 'productos':
            buscarProductos(termino,res);
            break;

        default:
            res.status(500).json({
                msg:'Se le olvido hacer esta búsqueda'
            })
    }

}


module.exports = {
    buscar
}