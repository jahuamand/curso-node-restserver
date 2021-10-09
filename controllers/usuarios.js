
const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require ('../models/usuario');


const usuariosGet= async (req=request, res=response) => {
    //res.send('Hello World');

    //const query =req.query; //query = query params
    //si no se manda un parametro express hace que no se muestre en el response
 
    // const {q,nombre='No name',apikey,page=1,limit} =req.query; //query = query params
    const {limite = 5, desde = 0} = req.query;
    const query = { estado: true}

    // const usuarios = await Usuario.find(query)
    //   .skip(Number(desde))
    //   .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [total,usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
      //resp
      total,
      usuarios
    });

    /*res.json({            
    //    ok: true,
        msg:  'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });*/
  }

  const usuariosPost= async (req, res=response) => {
    //const body= req.body;
    const {nombre,correo,password,rol}= req.body;
     // const {nombre,edad}= req.body;
    //const usuario = new Usuario(body);
    const usuario = new Usuario({nombre,correo,password,rol});
  
    // Verificar si el correo existe
   /* const existeEmail = await Usuario.findOne({  correo}) // Es redundante asignar correo : correo.
    //const existeEmail = await Usuario.findOne({ correo : correo})
    if (existeEmail){
      return res.status(400).json({
        msg: 'El correo ya está registrado'
      })
    }*/

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // Por defecto son 10 vueltas
    usuario.password =  bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await usuario.save();

    //res.status(201).json({            
      res.json({            
       // msg:  'post API',
        usuario
        //body
       // nombre,edad
    });
  }

  const usuariosPut= async (req, res=response) => {

    //const id = req.params.id; //id: el nombre que va en routes -> (router.put('/:id', usuariosPut );)
    const {id} = req.params;

    const {_id, password,google,correo, ... resto} = req.body;

    //TODO validar contra base de datos.
    if (password){
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync(); // Por defecto son 10 vueltas
      resto.password =  bcryptjs.hashSync( password, salt ); //Agrego nuevo password al objecto a actualizar
    }

    const usuario = await Usuario.findByIdAndUpdate(id,resto, {new: true});

    //res.status(500).json({            
      res.json({usuario});
  }
  
  const usuariosPatch= (req, res=response) => {
    res.json({            
        msg:  'patch API'
    });
  }

  const usuariosDelete= async (req, res=response) => {
    
    const {id} = req.params;

    //Fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate(id,{ estado : false}, {new: true});

    res.json({            
        //msg:  'delete API'
        usuario
    });
  }


  module.exports={
      usuariosGet,usuariosPost,usuariosPatch,usuariosDelete,usuariosPut
  }