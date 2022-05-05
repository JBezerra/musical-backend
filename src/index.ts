import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import express, { Express, Request, Response } from 'express';
const getStat = require('util').promisify(fs.stat);

const app: Express = express();
const port = 3000;

app.use(express.static('public'));

// const library = ['1f9a2a33-ee65-431b-9495-d254b3b7bbce', '163aa61e-7802-4973-986e-842267acdc97', 'ff00a1e2-29a2-4560-b094-379408c40c6f'];
const library = [
    {
        name: 'Happy',
        artist: 'Pharrel Williams',
        id: '3336668d-4db8-4775-af97-5228ebf88561',
        stem:{
            voice: '3336668d-4db8-4775-af97-5228ebf88561-voice',
            drums: '3336668d-4db8-4775-af97-5228ebf88561-drums',
            bass: '3336668d-4db8-4775-af97-5228ebf88561-bass',
            other: '3336668d-4db8-4775-af97-5228ebf88561-other',
        }
    },
    {
        name: 'How Deep Is Your Love',
        artist: 'Calvin Harris & Disciples',
        id: 'f7e3deea-4f85-4261-ae35-ee325ee417b5',
        stem:{
            voice: 'f7e3deea-4f85-4261-ae35-ee325ee417b5-voice',
            drums: 'f7e3deea-4f85-4261-ae35-ee325ee417b5-drums',
            bass: 'f7e3deea-4f85-4261-ae35-ee325ee417b5-bass',
            other: 'f7e3deea-4f85-4261-ae35-ee325ee417b5-other',
        }
    },
    {
        name: 'Counting Stars',
        artist: 'One Republic',
        id: '294d3591-1c61-412d-8093-52c55b0bae1f',
        stem:{
            voice: '294d3591-1c61-412d-8093-52c55b0bae1f-voice',
            drums: '294d3591-1c61-412d-8093-52c55b0bae1f-drums',
            bass: '294d3591-1c61-412d-8093-52c55b0bae1f-bass',
            other: '294d3591-1c61-412d-8093-52c55b0bae1f-other',
        }
    },
    {
        name: 'Bad Guy',
        artist: 'Billie Ellish',
        id: '88289763-c9a6-4ad9-a171-68e5b33b46ce',
        stem:{
            voice: '88289763-c9a6-4ad9-a171-68e5b33b46ce-voice',
            drums: '88289763-c9a6-4ad9-a171-68e5b33b46ce-drums',
            bass: '88289763-c9a6-4ad9-a171-68e5b33b46ce-bass',
            other: '88289763-c9a6-4ad9-a171-68e5b33b46ce-other',
        }
    },
];

app.get('/generate', async (req: Request, res: Response) => {
    const ROOT_PATH = './public';
    const files: string[] = [];
    fs.readdirSync(ROOT_PATH).forEach(file => {
        if(file !== '.DS_Store'){
            files.push(file);
        }
    });

    for(const fileIndex in files){
        const fileName = files[fileIndex];
        const fileNameWithoutEncoding = fileName.split('.')[0];
        const filePath = `./public/${fileNameWithoutEncoding}.m4a`;
        console.log(fileNameWithoutEncoding);
        ffmpeg(filePath).setStartTime(61).setDuration(26).format('mp3')
        .saveToFile(`./assets/${fileNameWithoutEncoding}.mp3`).on('end', (output) => {
            console.log('done!');
        })
    }
});

app.get('/track', async (req: Request, res: Response) => {
    const randomLibraryIndex = Math.floor(Math.random() * library.length) + 0;
    const randomLibrary = library[randomLibraryIndex];
    res.json(randomLibrary);
});

app.get('/play/:id/:stem', async (req: Request, res: Response) => {
    const trackId = req.params.id;
    const stem = req.params.stem;
    const findTrack = library.find(track => track.id === trackId);
    let choosenStemFile;
    if(findTrack){
        const findTrackStem = findTrack.stem;
        if(stem === 'voice'){
            choosenStemFile = findTrackStem.voice;
        }
        else if(stem === 'bass'){
            choosenStemFile = findTrackStem.bass;
        }
        else if(stem === 'other'){
            choosenStemFile = findTrackStem.other;
        }
        else if(stem === 'drums'){
            choosenStemFile = findTrackStem.drums;
        }
    }

    const ROOT_PATH = './assets';
    const filePath = `${ROOT_PATH}/${choosenStemFile}.mp3`;
    const stat = await getStat(filePath);
    res.writeHead(200, {
        'Content-Type': 'audio/mp3',
        'Content-Length': stat.size
    });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
});

app.get('/tracks/:id', async (req: Request, res: Response) => {
    const trackId = req.params.id;
    const libraryIds = library.filter(track => track.id !== trackId).map(track => track.id);
    const choosenTracks: string[] = [];
    while (choosenTracks.length != 3){
        const randomLibraryIndex = Math.floor(Math.random() * libraryIds.length) + 0;
        const randomLibrary = libraryIds[randomLibraryIndex];
        if(!choosenTracks.includes(randomLibrary)){
            choosenTracks.push(randomLibrary);
        }
    }
    choosenTracks.push(trackId);
    res.json(choosenTracks);
});

// app.get('/play/:fileName', async (req: Request, res: Response) => {
//     const ROOT_PATH = './assets';
//     const fileName = req.params.fileName;
//     const files: string[] = [];
//     fs.readdirSync(ROOT_PATH).forEach(file => {
//         if(file.startsWith(fileName)){
//             files.push(file);
//         }
//     });

//     const randomFilesIndex = Math.floor(Math.random() * files.length) + 0;
//     const choosenFileName = files[randomFilesIndex];
//     const filePath = `${ROOT_PATH}/${choosenFileName}`;
//     const stat = await getStat(filePath);
//     res.writeHead(200, {
//         'Content-Type': 'audio/mp3',
//         'Content-Length': stat.size
//     });

//     const stream = fs.createReadStream(filePath);
//     stream.pipe(res);
// });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});