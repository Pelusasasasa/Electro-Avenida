const chequesCTRL = {};

const Cheque = require('../models/Cheques');

chequesCTRL.post = async(req,res)=>{
    const now = new Date();
    req.body.f_recibido = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
    const cheque = new Cheque(req.body);
    await cheque.save();
    console.log(`Cheque nro ${req.body.n_cheque} cargado a la hora ${req.body.f_recibido}`);
    res.end();
};

chequesCTRL.getsAll = async(req,res)=>{
    const cheques = await Cheque.find({},{_id:1,__v:0});
    res.send(cheques);
};

chequesCTRL.putOne = async(req,res)=>{
    const {numero} = req.params;
    await Cheque.findOneAndUpdate({n_cheque:numero},req.body);
    console.log(`Cheque ${numero} Modificado`);
    res.send(`Cheque ${numero} Modificado`);
};

chequesCTRL.getForId = async(req,res)=>{
    const {id} = req.params;
    const cheque = (await Cheque.findOne({_id:id})); 
    res.send(cheque)
}

chequesCTRL.putForId = async(req,res)=>{
    const {id} = req.params;
    await Cheque.findByIdAndUpdate({_id:id},req.body);
    console.log(`Cheque con numero ${req.body.n_cheque} modificado`)
    res.end();
}

chequesCTRL.deleteforId = async(req,res)=>{
    const {id} = req.params;
    await Cheque.findByIdAndDelete({_id:id});
    console.log(`Chueque con el id ${id} Eliminado`)
    res.end()
}

chequesCTRL.getForNumero = async(req,res)=>{
    const {numero} = req.params;
    const cheque = await Cheque.findOne({n_cheque:numero},{entreg_a:1,i_cheque:1,banco:1,f_cheque:1});
    res.send(cheque);
}

module.exports = chequesCTRL;