const { response } = require("express");
const {Categoria} = require('../models');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias= async (req=request, res=response) => {
   
    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true}


    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        //.populate('usuario')
        .populate('usuario','nombre')
    ]);

    res.json({
      total,
      categorias
    });

 
  }


// obtenerCategoria - populate {}
const obtenerCategoria= async (req=request, res=response) => {
   
    const {id} = req.params;
  
    const categoria = await  Categoria.findById(id).populate('usuario','nombre');

    // const [categoria] = await Promise.all([
    //     Categoria.findById(id)
    //     .populate('usuario','nombre')
    // ]);

    res.json({ categoria});

 
  }


const crearCategoria = async (req,res=response) =>{

    const nombre= req.body.nombre.toUpperCase();
   
    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB){
        return res.status(400).json({
            msg:`La categoría ${ categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id //se obtiene por el middleware
    }

   const categoria = new Categoria(data);
 
   // Guardar en BD
   await categoria.save();

   //res.status(201).json({            
     res.status(201).json({ categoria});


}

// actualizarCategoria
const actualizarCategoria= async (req, res=response) => {

    const {id} = req.params;

    //const {_id,nombre, ... resto} = req.body;
    const {estado,usuario, ... resto} = req.body;

    //resto.nombre=nombre.toUpperCase();
    resto.nombre=resto.nombre.toUpperCase();
    resto.usuario= req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id,resto, {new: true});
        
      //res.json({categoria});
      res.json(categoria);
  }


// borrarCategoria - estado:false
const borrarCategoria= async (req, res=response) => {
    
    const {id} = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    const categoria = await Categoria.findByIdAndUpdate(id,{ estado : false}, {new: true});

    res.json( categoria );
  }

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}