const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log(process.env.mongodb_url);

mongoose.connect(process.env.mongodb_url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch(error => {
    const msg = 'Erro ao conectar ao MongoDB';
    console.log(msg);
});
