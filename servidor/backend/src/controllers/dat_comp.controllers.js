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

    let hastaMes = parseInt(hasta.split('-',2)[1]) + 1;
    const hastaYear = hasta.split('-',3)[0];

    hastaMes = hastaMes < 10 ? `0${hastaMes}` : hastaMes;
    hastaMes = hastaMes === 13 ? '01' : hastaMes;

    const auxMesSig = hastaYear + '-' + hastaMes;
    const mes = new Date(desde + "-01T00:00:00.000Z");
    const mesSig = new Date(auxMesSig + "-01T00:00:00.000Z")
    let compras
    try {
        compras = await DatComp.find({$and:[
            {fecha_imput:{$gte:mes}},
            {fecha_imput:{$lt:mesSig}}
        ]});
    } catch (error) {
        console.log(mesSig)
        console.log(error)
    }

    res.send(compras)
}

datCompCTRL.getForNumeroCompAndProv = async(req,res)=>{
    const {numero,codProv} = req.params;
    const datComp = await DatComp.find({$and:[
        {nro_comp:numero},
        {codProv:codProv}
    ]},{total:1,tipo_comp:1,codProv:1,nro_comp:1});
    res.send(datComp)
}
module.exports = datCompCTRL;