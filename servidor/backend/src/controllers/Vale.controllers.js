const valeCTRL = {};

const Vale = require('../models/Vale');

valeCTRL.post = async(req,res)=>{
    const vale = new Vale(req.body);
    await vale.save();
    console.log(`Vale a ${req.body.rsoc} cargado con el importe de ${req.body.imp}`);
    res.send(`Vale a ${req.body.rsoc} cargado con el importe de ${req.body.imp}`);
};

valeCTRL.getAll = async(req,res)=>{
    const vales = await Vale.find();
    res.send(vales);
}

valeCTRL.getForPersonal = async(req,res)=>{
    const vales = await Vale.find({tipo:"P"});
    res.send(vales)
}

valeCTRL.getForCliente = async(req,res)=>{
    const vales = await Vale.find({tipo:"C"});
    res.send(vales)
}
    
valeCTRL.getForIncobrable = async(req,res)=>{
    const vales = await Vale.find({tipo:"I"});
    res.send(vales)
}

valeCTRL.getForFactura = async(req,res)=>{
    const vales = await Vale.find({tipo:"F"});
    res.send(vales);
}

valeCTRL.getForID = async(req,res)=>{
    const {id} = req.params;
    const vale = (await Vale.find({_id:id}))[0];
    res.send(vale)
};

valeCTRL.putForID = async(req,res)=>{
    const {id} = req.params;
    await Vale.findOneAndUpdate({_id:id},req.body);
    console.log(`Vale en concepto de ${req.body.concepto} con el importe ${req.body.imp} Modificado`)
    res.send(`Vale en concepto de ${req.body.concepto} con el importe ${req.body.imp} Modificado`);
}

valeCTRL.impTotal = async(req,res)=>{
    const vales = await Vale.find({pago:""},{imp:1,_id:0});
    let total = 0;
    for await(let vale of vales){
        total += vale.imp;
    }
    res.send(`${total}`);
}

valeCTRL.borrar = async(req,res)=>{
    const {id} = req.params
    await Vale.findByIdAndDelete({_id:id});
    console.log(`Vale ${id} Eliminado`);
    res.send('Vale Eliminado');
}

valeCTRL.getTotalPricePersonal = async(req,res)=>{
    const {tipo} = req.params;
    const vales = await Vale.find({tipo:tipo});
    let total = 0;
    vales.forEach(vale => {
        total += vale.imp;
    });
    res.send(`${total}`);
}

module.exports = valeCTRL;