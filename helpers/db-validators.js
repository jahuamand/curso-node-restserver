const Producto  = require('../models/producto');
const Categoria  = require('../models/categoria');
const Role = require('../models/role');
const Usuario = require('../models/usuario');


 const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol}); // rol = rol
    if (!existeRol) {
        throw new Error(`El rol ${ rol} no está registrado en la BD`)
    }
}

const emailExiste = async (correo = '') => {

    const existeEmail = await Usuario.findOne({correo}) // Es redundante asignar correo : correo.
    if (existeEmail){
        throw new Error(`El email ${ correo} ya está registrado`)
    }

}


const existeUsuarioPorId = async (id) => {

    const existeUsuario = await Usuario.findById(id) // Es redundante asignar correo : correo.
    if (!existeUsuario){
        throw new Error(`El id no existe: ${ id} `)
    }

}

//existeCategoria
const existeCategoria = async (id) => {

    const existeCategoria = await Categoria.findById(id) // Es redundante asignar correo : correo.
    if (!existeCategoria){
        throw new Error(`El id no existe: ${ id} `)
    }

}

const nombreCategoriaExiste = async (nombre = '') => {

    const existeNombre = await Usuario.findOne({nombre}) // Es redundante asignar correo : correo.
    if (existeNombre){
        throw new Error(`El nombre ${ nombre} ya está registrado`)
    }

}

const existeProducto = async (id) => {

    const existeProducto = await Producto.findById(id) // Es redundante asignar correo : correo.
    if (!existeProducto){
        throw new Error(`El id no existe: ${ id} `)
    }

}

module.exports= {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    nombreCategoriaExiste,
    existeProducto
}