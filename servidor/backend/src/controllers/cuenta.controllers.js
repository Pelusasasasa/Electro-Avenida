const cuentaCTRL = {};

const Cuenta = require('../models/Cuenta');

cuentaCTRL.post = async(req,res)=>{
    const cuenta = new Cuenta(req.body);
    await cuenta.save();
    console.log(`Cuenta ${req.body.desc} Cargado`)
    res.send(`Cuenta ${req.body.desc} Cargada`);
};

cuentaCTRL.getsAll = async(req,res)=>{
    const cuentas = await Cuenta.find();

    cuentas.sort((a,b)=>{
        if(a.desc>b.desc){
            return 1
        }else if(a.desc<b.desc){
            return -1
        }
        return 0
    });
    res.send(cuentas);
}

module.exports = cuentaCTRL;