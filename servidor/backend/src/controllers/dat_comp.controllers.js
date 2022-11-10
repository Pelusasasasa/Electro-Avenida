const datCompCTRL = {};

const DatComp= require('../models/Dat_comp');

datCompCTRL.post = async(req,res)=>{
    const datComp = new DatComp(req.body);
    await datComp.save();
    res.send(`Dato de Comprobante a la empresa ${req.body.empresa} con el importe $${req.body.total} cargado`);
}

datCompCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const comprobante = await DatComp.findOne({_id:id});
    res.send(JSON.stringify(comprobante))
}

datCompCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await DatComp.findByIdAndUpdate({_id:id},req.body);
    console.log(`Comprobante de ${req.body.provedor} con el Importe ${req.body.total} Modificado`);
    res.end();
}

datCompCTRL.getBetween = async(req,res)=>{
    const {desde,hasta} = req.params;

    const datComps = await DatComp.find({$and:[
        {fecha_comp: {$gte:desde}},
        {fecha_comp: {$lte:hasta}}
    ]});
    res.send(datComps);
}


module.exports = datCompCTRL;