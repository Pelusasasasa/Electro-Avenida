const prestamoCTRL = {};

const Prestamo = require('../models/Prestamo');
const movProducto = require('../models/movProducto');

prestamoCTRL.post = async(req,res)=>{
    const now = new Date();
    const p = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    req.body.fecha = new Date(req.body.fecha.slice(0,10) + "T" + p.slice(11));
    const prestamo = new Prestamo(req.body);
    await prestamo.save();
    console.log(`Prestamo de ${req.body.cliente} cargado por el vendedor ${req.body.vendedor} en la maquina ${req.body.maquina} con la hora y fecha ${(new Date()).toLocaleString()}`);
    res.end();
};

prestamoCTRL.get = async(req,res) =>{
    const prestamos = await Prestamo.find();
    res.send(prestamos);
}

prestamoCTRL.anularVarios = async(req,res)=>{
    const arreglo = req.body;
    const {numero} = req.params;
    for(let elem of arreglo){
        await Prestamo.findOneAndUpdate({nro_comp:elem},{$set:{anulado:true,nroPresupuesto:numero}});
        console.log(`Prestamos anulados y su presupuesto es ${numero}`);
    };
    res.end();
}

prestamoCTRL.getForNumber = async(req,res)=>{
    const {numero} = req.params;
    const prestamo = await Prestamo.findOne({nro_comp:numero});
    res.send(JSON.stringify(prestamo));
};

prestamoCTRL.putForNumber = async(req,res)=>{
    const {numero} = req.params;
    await Prestamo.findOneAndUpdate({nro_comp:numero},req.body);
    console.log(`Prestamo con el numero ${numero} modificado a la hora ${new Date()}`)
    res.end();
};

prestamoCTRL.getNoAnulados = async(req,res)=>{
    const prestamos = await Prestamo.find({anulado:false});
    res.send(prestamos);
};

prestamoCTRL.getAnuladosBetweenDate = async(req,res)=>{
    const {desde,hasta} = req.params;
    const prestamos = await Prestamo.find({
        $and:[
            {fecha: {$gte: new Date(desde + "T00:00:00.000Z")}},
            {fecha: {$lte: new Date(hasta + "T23:59:59.000Z")}},
            {anulado:true}
        ]
    });
    res.send(prestamos)
}

prestamoCTRL.getConMovimientos = async(req, res) => {
    try {
        const prestamos = await Prestamo.find({anulado: false});
        const movimientos = await movProducto.find({ tipo_comp: 'Prestamo' });

        const prestamosConMovimientos = prestamos.map(p => {
            const prestamoObj = p.toObject();
            prestamoObj.movimientos = movimientos.filter(m => m.nro_comp === p.nro_comp);
            return prestamoObj;
        });

        res.status(200).json(prestamosConMovimientos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error del servidor al enviar prestamos con movimientos'
        })
    }
}

module.exports = prestamoCTRL;