
const {response} = require('express');

const usuariosGet=(req=request, res=response) => {
    //res.send('Hello World');

    //const query =req.query; //query = query params
    //si no se manda un parametro express hace que no se muestre en el response
    const {q,nombre='No name',apikey,page=1,limit} =req.query; //query = query params

    res.json({            
    //    ok: true,
        msg:  'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
  }

  const usuariosPost=(req, res=response) => {

    //const body= req.body;
    const {nombre,edad}= req.body;

    //res.status(201).json({            
      res.json({            
        msg:  'post API',
        nombre,edad
    });
  }

  const usuariosPut=(req, res=response) => {

    //const id = req.params.id; //id: el nombre que va en routes -> (router.put('/:id', usuariosPut );)
    const {id} = req.params;
    //res.status(500).json({            
      res.json({            
        msg:  'put API',
        id
    });
  }
  
  const usuariosPatch= (req, res=response) => {
    res.json({            
        msg:  'patch API'
    });
  }

  const usuariosDelete= (req, res=response) => {
    res.json({            
        msg:  'delete API'
    });
  }


  module.exports={
      usuariosGet,usuariosPost,usuariosPatch,usuariosDelete,usuariosPut
  }