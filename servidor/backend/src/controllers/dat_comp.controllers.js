const datCompCTRL = {};

const DatComp= require('../models/Dat_comp');

datCompCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.fecha = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
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

datCompCTRL.deleteForId = async(req,res)=>{
    const {id} = req.params;
    await DatComp.findByIdAndDelete({_id:id});
    console.log(`Comprobante ${id} Eliminado`);
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

datCompCTRL.getFechaImpt = async(req,res)=>{
    const {desde,hasta} = req.params;
    const desdeSim = desde.split('-',2);
    const hastaSim = hasta.split('-',2);
    const mes = new Date(desde + "-01T00:00:00.000Z")
    const mesSig = new Date(hastaSim[0],parseFloat(hastaSim[1]),1,0,0,0);
    const compras = await DatComp.find({$and:[
        {fecha_imput:{$gte:mes}},
        {fecha_imput:{$lte:mesSig}}
    ]});
    res.send(compras)
}

datCompCTRL.getForNumeroCompAndProv = async(req,res)=>{
    const {numero,codProv} = req.params;
    const datComp = await DatComp.findOne({$and:[
        {nro_comp:numero},
        {codProv:codProv}
    ]},{total:1,tipo_comp:1,codProv:1,nro_comp:1});
    res.send(datComp)
}
module.exports = datCompCTRL;