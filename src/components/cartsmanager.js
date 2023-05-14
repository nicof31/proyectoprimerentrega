import { Console } from "console";
import fs from "fs";

export default class cartsManager {
  constructor(path) {
    this.path = path;
  }

  //--------------------GET CARTS---------------------

  carts = async () => {
    if (fs.existsSync(this.path)) {
      const dataCart = await fs.promises.readFile(this.path, "utf-8");
      const cartRta = JSON.parse(dataCart);
      return cartRta;
    } else {
      return [];
    }
  };

  //--------------------ADD CARTS---------------------

  addCarts = async (idCart, idProductAddCart = []) => {
    const busquedaCartAdd = await fs.promises.readFile(this.path, "utf-8");
    const cartRtaAdd = JSON.parse(busquedaCartAdd);
    const resultBusqCartAdd = cartRtaAdd.find(({ id }) => id == idCart);
    const indiceCartAdd = cartRtaAdd.indexOf(resultBusqCartAdd);

    if (resultBusqCartAdd != null) {
      console.log("CARRITO EXTISTE");
      //busco si el producto existe en el carrito
      const verifProductCart = resultBusqCartAdd.products;
      const searchFilteredProduct = verifProductCart.find(
        ({ product }) => product == idProductAddCart
      );
      const verifyProduct = searchFilteredProduct;
      const indexCartAdd = verifProductCart.indexOf(searchFilteredProduct);

      let productCart;
      if (verifyProduct != null) {
        const searchQuantityProduct = verifyProduct.quantity;
        let newQuantity = searchQuantityProduct + 1;

        productCart = {
          product: idProductAddCart,
          quantity: newQuantity,
        };

        const newQuantityProduct = productCart;
        const updateNewQuantity = verifProductCart.splice(
          indexCartAdd,
          1,
          newQuantityProduct
        );

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(cartRtaAdd, null, "\t")
        );
      } else {
        //include nico
        const include = verifProductCart.filter(
          ({ product }) => product == idProductAddCart
        );
        if (include != null) {
          //ACA REEMPLAZAO EL OBJETO ACTUAL YA CREADO POR ADDPRODUCT
          console.log("include ok pc");
          productCart = {
            product: idProductAddCart,
            quantity: 1,
          };
          //write carts.
          resultBusqCartAdd.products.push(productCart);
          JSON.stringify(resultBusqCartAdd);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(cartRtaAdd, null, "\t")
          );
        }
      }
    } else {
      let addCartPrO = [];
      try {
        const dataCart = await fs.promises.readFile(this.path, "utf-8");
        addCartPrO = JSON.parse(dataCart);
      } catch (error) {
        return error;
      } finally {
        // genero el id autoincremental
        const dataCart = await fs.promises.readFile(this.path, "utf-8");
        const addCartPrO = JSON.parse(dataCart);
        console.log(addCartPrO.length);
        const idAuto = addCartPrO.length + 1;
        //calculo cantidad
        let quantityProduct = 1;
        //busco si el producto existe
        const verifProductCart = addCartPrO.find(
          ({ product }) => product == idProductAddCart
        );
        // genero el producto a la base
        let productCartAdd = [];
        const cart = {
          product: idProductAddCart,
          quantity: quantityProduct,
        };
        productCartAdd.push(cart);
        const newObjCarts = {
          products: productCartAdd,
          id: idAuto,
        };
        addCartPrO.push(newObjCarts);
        // const writeJsoncarts = await fs.promises.writeFile(this.path,JSON.stringify(addNewCart, null, "\t"));
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(addCartPrO, null, "\t")
        );
      }
    }
  };

  //--------------------DELETE---------------------
  discountQuantityPro = async (
    idCartEnQuan,
    idProductsCartQuan,
    quantitySearchProduct
  ) => {
    let idCartQuan = idCartEnQuan;
    let idProducQuan = Number(idProductsCartQuan);
    let quanSearch = Number(quantitySearchProduct);
    const busquedaCartDisc = await fs.promises.readFile(this.path, "utf-8");
    const cartRtaDisc = JSON.parse(busquedaCartDisc);
    const resultBusqCartDisc = cartRtaDisc.find(({ id }) => id == idCartQuan);
    const verifProductQuan = resultBusqCartDisc.products;
    const searchFilteredQuan = verifProductQuan.find(
      ({ product }) => product == idProducQuan
    );
    const indexCartDisc = verifProductQuan.indexOf(searchFilteredQuan);
    let productCartDisc;
    const quanVerif = 1;
    if (quanSearch > quanVerif) {
      let newQuantityDisc = quanSearch - 1;
      productCartDisc = {
        product: idProducQuan,
        quantity: newQuantityDisc,
      };
      const newQuanProductDisc = productCartDisc;
      const updateNewQuantityDisc = verifProductQuan.splice(
        indexCartDisc,
        1,
        newQuanProductDisc
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartRtaDisc, null, "\t")
      );
    } else {
      let newQuantityDisc = 1;
      productCartDisc = {
        product: idProducQuan,
        quantity: newQuantityDisc,
      };
      const newQuanProductDisc = productCartDisc;
      const updateNewQuantityDisc = verifProductQuan.splice(
        indexCartDisc,
        1,
        newQuanProductDisc
      );
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(cartRtaDisc, null, "\t")
      );
    }
  };
}
