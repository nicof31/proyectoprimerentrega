

import productManager from "../components/productManager.js"
import { Router } from "express";

const routerProdructs = Router();
const productList = new productManager("./files/products.json");


//http://localhost:8080
routerProdructs.get("/", async (req, res) => {
    return res.status(200).send(`Gestor de productos`);
  });
  
  //ENDPOINTS
   //---------------------GET---------------------
  
  routerProdructs.get("/api/products", async (req, res) => {
    const filterLimit = await productList.Products();    
     if (req.query.limit) {
       const productsFilter = filterLimit.slice(0, req.query.limit);
       return res.status(200).send({status:"success", message: { productsFilter }});
     } else {
       res.status(200).send({status:"success", message: {filterLimit}});
     };   
   });

  //filtro de productos por id
  //http://localhost:8080/products/1
  routerProdructs.get("/api/products/:pid", async (req, res) => {
    const idProducts = req.params.pid;
    console.log(idProducts);
    const busquedaIdProd = await productList.ProductById(idProducts);
    if (!busquedaIdProd) {
      return res.status(409).send({status:"error",message: "Este id buscado no existe, cargue un nuevo id"});
    }
    return res.status(200).send({status:"success, el id buscado es:",message:{ busquedaIdProd }});
  });
  
  //---------------------POST---------------------
  //POST Crear un nuevo producto
  routerProdructs.post("/api/crearproducto", async (req, res) => {
    const crearProducto = req.body;
    if (!crearProducto.title || !crearProducto.description || !crearProducto.code || !crearProducto.price || !crearProducto.status || !crearProducto.category || !crearProducto.stock) {
      return res.status(400).send({status:"error",message:"Incomplete values"});
    } 
    const findCode = await productList.Products();
    const codeVerf = findCode.find(({ code })=> code == crearProducto.code);
    console.log(codeVerf);
    if (codeVerf != null) {
      return res.status(409).send({status:"error",message: "Este producto ya existe, cargue un nuevo codigo"});
    } else {
      await productList.addProduct(crearProducto.title, crearProducto.description, crearProducto.code, crearProducto.price, crearProducto.status, crearProducto.category, crearProducto.thumbnail,crearProducto.stock);
      return res.status(200).send({status:"success, Products created",message:{ crearProducto }});
    };
  });
  
  //---------------------PUT---------------------
  //PUT update elementos
  routerProdructs.put("/api/actulizarproducto/:pid", async (req, res) => {
    const actualizarProducto = req.body;
    const idUpdate = req.params.pid;
    //console.log(actualizarProducto);
    //console.log(idUpdate);
    if (!actualizarProducto.title || !actualizarProducto.description || !actualizarProducto.code || !actualizarProducto.price || !actualizarProducto.status || !actualizarProducto.category || !actualizarProducto.stock) {
      return res.status(400).send({status:"error",message:"Incomplete values"});
    };
    const findCodeUpC = await productList.Products();
    const idFindUpdate = findCodeUpC.find(({ id })=> id == idUpdate);
    //console.log(JSON.stringify(idfindUpdate));
    const filterId = findCodeUpC.filter( id => id !== idFindUpdate);
    const newArrUpId = filterId;
    //console.log("array por id");
    //console.log(newArrUpId);
    if (idFindUpdate != null) { 
      const codDeProdBuscadoId = newArrUpId.find(({ code })=> code === actualizarProducto.code);
        if (codDeProdBuscadoId !=null){
        //console.log("el codigo existe cargue uno nuevo")
        return res.status(409).send({status:"error",message: "El código de producto cargado ya existe en otro producto, cargue un nuevo código"});
        } else{
        //console.log("codigo no encontrado, se puede utilizar el que viene en la api");
      let readThumbnail = JSON.stringify(idFindUpdate.thumbnail);
      //console.log("read" + readThumbnail)
      let passThumbnail;
      if(actualizarProducto.thumbnail != null){
        passThumbnail = actualizarProducto.thumbnail;
        //console.log("pass ok" + passThumbnail);
      } else {
        passThumbnail = JSON.parse(readThumbnail) ; 
        //console.log("pass else if" + passThumbnail);
      };          
        await productList.UpdateProduct(idUpdate, actualizarProducto.title, actualizarProducto.description, actualizarProducto.code, actualizarProducto.price, actualizarProducto.status, actualizarProducto.category, passThumbnail ,actualizarProducto.stock);
        return res.status(200).send({status:"success, Products actualizado en base",message:{ actualizarProducto }}); 
      };
    }
    });
    
    //---------------------PATCH---------------------
    //PACHT para actualizar valores en particular
    routerProdructs.patch("/api/actulizarparametro/:pid", async (req, res) => { 
      const updateParamPatch = req.body;
      const idUpdatePatch = req.params.pid;
      //console.log(updateParamPatch);
        
      const findCodeUpdatePatch = await productList.Products();
      const idVerfUpdatePatch = findCodeUpdatePatch.find(({ id })=> id == idUpdatePatch);
      //console.log(idVerfUpdatePatch);

      const filterIdPacht = findCodeUpdatePatch.filter( id => id !== idVerfUpdatePatch);
      const newArrUpIdPacht = filterIdPacht;
      
          
      if (idVerfUpdatePatch != null) {
        const codDeProdPatchId = newArrUpIdPacht.find(({ code })=> code === req.body.code);
        if (codDeProdPatchId  !=null){
        return res.status(409).send({status:"error",message: "El código de producto cargado ya existe en otro producto, cargue un nuevo código"});
        } else {
        const newObjUpdate = Object.assign(idVerfUpdatePatch,updateParamPatch);
        //console.log (newObjUpdate);
        await productList.UpdateParam(newObjUpdate);
        return res.status(200).send({status:"success, el producto existe en base y se puede cambiar los parametros",message: { newObjUpdate }});
        }
      } else {
        return res.status(409).send({status:"error",message: "Este id de prodcuto buscado no existe, cargue un nuevo id"});
      };
    });
    
  //---------------------DELETE---------------------
  //DELETE  booro elemento
  routerProdructs.delete("/api/eliminarproducto/:pid", async (req, res) => {
  
    const idProdDelet = req.params.pid;
    console.log(idProdDelet);
    const busqIdProdDelet = await productList.DeleteProduct(idProdDelet);
    if (!busqIdProdDelet) {
      return res.status(404).send({status:"error",message: "Este producto buscado no existe, cargue un nuevo id"});
    }
    return res.status(200).send({status:"success, el producto eliminado es:", message:{ busqIdProdDelet }});
  });

  export default routerProdructs;
