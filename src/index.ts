import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import express, { Express, Request, Response } from 'express';
const getStat = require('util').promisify(fs.stat);

const app: Express = express();
const port = 3000;

app.use(express.static('public'));

const library = ['1f9a2a33-ee65-431b-9495-d254b3b7bbce', '163aa61e-7802-4973-986e-842267acdc97', 'ff00a1e2-29a2-4560-b094-379408c40c6f'];

app.get('/generate', async (req: Request, res: Response) => {
    for(let i=0; i<10; i++){
        const fileName = library[2];
        const filePath = `./public/${fileName}.mp3`;
        const randomStartTime = Math.floor(Math.random() * 120) + 1;
        ffmpeg(filePath).setStartTime(randomStartTime).setDuration(15).format('mp3')
        .saveToFile(`./assets/${fileName}-${randomStartTime}.mp3`).on('end', (output) => {
            console.log('done!');
        })
    }
});

app.get('/:fileName', async (req: Request, res: Response) => {
    const ROOT_PATH = './assets';
    const fileName = req.params.fileName;
    const files: string[] = [];
    fs.readdirSync(ROOT_PATH).forEach(file => {
        if(file.startsWith(fileName)){
            files.push(file);
        }
    });

    const randomFilesIndex = Math.floor(Math.random() * files.length) + 0;
    const choosenFileName = files[randomFilesIndex];
    const filePath = `${ROOT_PATH}/${choosenFileName}`;
    const stat = await getStat(filePath);
    res.writeHead(200, {
        'Content-Type': 'audio/mp3',
        'Content-Length': stat.size
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});