import {config} from 'dotenv'

config()

export default function validateKey(key){
    if (!key) return false
    return key === process.env.API_KEY ? true : false;
}