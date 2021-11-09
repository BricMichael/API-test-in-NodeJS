import mongoose, { ConnectOptions } from 'mongoose';


interface ISettings extends ConnectOptions {
    useNewUrlParser: boolean
    useUnifiedTopology: boolean
}

const options: ISettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const uri = process.env.URI || '';
mongoose.connect(uri, options)
    .then(() => console.log(`DB is connected`))
    .catch((error) => console.log(error.message));

