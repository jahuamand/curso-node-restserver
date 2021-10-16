const { response } = require("express");
const {Producto} = require('../models');

// obtenerProductos - paginado - total - populate
const obtenerProductos= async (req=request, res=response) => {
   
    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true}


    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        //.populate('usuario')
        .populate('usuario','nombre')
        .populate('categoria','nombre')
    ]);

    res.json({
      total,
      productos
    });

 
  }


// obtenerProducto - populate {}
const obtenerProducto= async (req=request, res=response) => {
   
    const {id} = req.params;
  
    const producto = await  Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre');

    // const [Producto] = await Promise.all([
    //     Producto.findById(id)
    //     .populate('usuario','nombre')
    // ]);

    res.json({ producto});

 
  }


const crearProducto = async (req,res=response) =>{

  //  const nombre= req.body.nombre.toUpperCase();
    // const precio= req.body.precio;
    // const categoria=req.body.categoria;
    // const categoria=req.body.categoria;

  const {estado,usuario, ...body} =req.body;

  //  const {precio,categoria,descripcion}=req.body;
   
    const productoDB = await Producto.findOne({nombre: body.nombre});

    if (productoDB){
        return res.status(400).json({
            msg:`El producto ${ productoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        // nombre,
        // precio,
        // categoria,
        // descripcion,
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario: req.usuario._id //se obtiene por el middleware
    }

   const producto = new Producto(data);
 
   // Guardar en BD
   await producto.save();

   //res.status(201).json({            
     res.status(201).json({ producto});


}

// actualizarProducto
const actualizarProducto= async (req, res=response) => {

    const {id} = req.params;

    //const {_id,nombre, ... resto} = req.body;
    const {estado,usuario, ... resto} = req.body;

    //resto.nombre=nombre.toUpperCase();
    if (resto.nombre){
      resto.nombre=resto.nombre.toUpperCase();
    }
    
    resto.usuario= req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id,resto, {new: true});
        
      //res.json({Producto});
      res.json(producto);
  }


// borrarProducto - estado:false
const borrarProducto= async (req, res=response) => {
    
    const {id} = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    const producto = await Producto.findByIdAndUpdate(id,{ estado : false}, {new: true});

    res.json( producto );
  }

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}