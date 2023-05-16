import productManager from "../components/productManager.js";
const productList = new productManager("src/files/products.json");

import cartsManager from "../components/cartsmanager.js";
import { Router } from "express";

const routerCarts = Router();
const cartList = new cartsManager("src/files/carts.json");

//---------------------GET---------------------

routerCarts.get("/api/carts", async (req, res) => {
  const filterLimitCarts = await cartList.carts();
  if (req.query.limit) {
    const cartsFilter = filterLimitCarts.slice(0, req.query.limit);
    return res
      .status(200)
      .send({ status: "success", message: { cartsFilter } });
  } else {
    res.status(200).send({ status: "success", message: { filterLimitCarts } });
  }
});
    //Busco por ID

  //http://localhost:8080/products/1
  routerCarts.get("/api/carts/:pid", async (req, res) => {
    const idCarts = req.params.pid;
    console.log(idCarts);
    const busquedaIdCarts = await cartList.cartById(idCarts);
    if (!busquedaIdCarts) {
      return res.status(409).send({status:"error",message: "Este id buscado no existe, cargue un nuevo id"});
    }
    return res.status(200).send({status:"success, el id buscado es:",message:{ busquedaIdCarts }});
  });


//---------------------POST ADD CARTS / INCREMENT QUANTITY---------------------
routerCarts.post("/api/crearcarts/:cid/products/:pid", async (req, res) => {
  const idCart = req.params.cid;
  const idCartEn = Number(req.params.cid);
  const idProductsCart = req.params.pid;

  //busco id de carts si existe en carts.json
  const cartSearch = await cartList.carts();
  const searchIdCart = cartSearch.find(({ id }) => id == idCart);

  //busco id en products.json
  const findCartIdProduct = await productList.products();
  const idFindCartProduct = findCartIdProduct.find(
    ({ id }) => id == idProductsCart
  );
  if (!idFindCartProduct) {
    return res.status(409).send({
      status: "error",
      message:
        "Este id producto buscado no existe en bbdd, cargue un nuevo id producto bbdd ",
    });
  } else {
    if (idCartEn > 0) {
      if (!searchIdCart) {
        const product = idFindCartProduct.id;

        console.log("salog por add");
        await cartList.addCarts(idCart, product);
        return res
          .status(200)
          .send({ status: "success, Carts created", message: {} });
      } else {
        console.log("salog por addUP");
        console.log("search" + JSON.stringify(searchIdCart));
        console.log(idCart);
        let idProductAddCart = idFindCartProduct.id;

        await cartList.addCarts(idCart, idProductAddCart);
        return res.status(200).send({
          status:
            "success, el id carts existe en base y se puede agregar el producto",
          message: {},
        });
      }
    } else {
      return res.status(409).send({
        status: "error",
        message: "Ingrese un ID carts numerico mayor a 0",
      });
    }
  }
});

//---------------------POST DISCONUNT QUANTITY CARTS---------------------

routerCarts.post(
  "/api/deletequantitycarts/:cid/products/:pid",
  async (req, res) => {
    const idCartQuan = req.params.cid;
    const idCartEnQuan = Number(req.params.cid);
    const idProductsCartQuan = req.params.pid;

    //busco id de carts si existe en carts.json
    const cartSearchQuan = await cartList.carts();
    const searchIdCartQuan = cartSearchQuan.find(({ id }) => id == idCartQuan);

    //busco si el producto existe en el carrito
    const quanProductCart = searchIdCartQuan.products;
    const quanFilteredProduct = quanProductCart.find(
      ({ product }) => product == idProductsCartQuan
    );
    if (!searchIdCartQuan) {
      return res.status(409).send({
        status: "error",
        message: "Este id de carts buscado no existe, cargue un nuevo id carts",
      });
    } else {
      if (!quanFilteredProduct) {
        console.log("producto no existe");
        return res.status(409).send({
          status: "error",
          message: "El prducto buscado no existe, cargue un nuevo id producto",
        });
      } else {
        const quanVerif = 1;
        const verifyQuanProduct = quanFilteredProduct;
        const quantitySearchProduct = verifyQuanProduct.quantity;
        let quanRta = Number(quantitySearchProduct);
        if (quanRta > quanVerif) {
          await cartList.discountQuantityPro(
            idCartEnQuan,
            idProductsCartQuan,
            quantitySearchProduct
          );
          return res.status(200).send({
            status:
              "success, el id producto en carts existe en base y se puede descontar cantidad",
            message: {},
          });
        } else {
          return res.status(409).send({
            status: "error",
            message:
              "La cantidad de producto en carrito es = 1, no se puede descontar mas cantidad",
          });
        }
      }
    }
  }
);

export default routerCarts;
