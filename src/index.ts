import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import express, { Express, Request, Response } from "express";
import cors from "cors";

const getStat = require("util").promisify(fs.stat);

const app: Express = express();
const port = 3001;

app.use(express.static("public"));

const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

const library = [
  {
    name: "Happy",
    artist: "Pharrel Williams",
    id: "3336668d-4db8-4775-af97-5228ebf88561",
    url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
  },
  {
    name: "How Deep Is Your Love",
    artist: "Calvin Harris & Disciples",
    id: "f7e3deea-4f85-4261-ae35-ee325ee417b5",
    url: "https://www.youtube.com/watch?v=XpqqjU7u5Yc",
  },
  {
    name: "Counting Stars",
    artist: "One Republic",
    id: "294d3591-1c61-412d-8093-52c55b0bae1f",
    url: "https://www.youtube.com/watch?v=hT_nvWreIhg",
  },
  {
    name: "Bad Guy",
    artist: "Billie Ellish",
    id: "88289763-c9a6-4ad9-a171-68e5b33b46ce",
    url: "https://www.youtube.com/watch?v=DyDfgMOUjCI",
  },
  {
    name: "Pump It",
    artist: "The Black Eyed Peas",
    id: "9c398df8-8f24-4847-acef-e2ad711fa64f",
    url: "https://www.youtube.com/watch?v=ZaI2IlHwmgQ",
  },
  {
    name: "good 4 u",
    artist: "Olivia Rodrigo",
    id: "a6d617be-ef32-424d-9fa2-04c760ded920",
    url: "https://www.youtube.com/watch?v=gNi_6U5Pm_o",
  },
  {
    name: "Shallow",
    artist: "Lady Gaga, Bradley Cooper",
    id: "d93999be-09dd-4221-8a2e-96d34ec5324d",
    url: "https://www.youtube.com/watch?v=bo_efYhYU2A",
  },
  {
    name: "Ai Se Eu Te Pego",
    artist: "Michel Teló",
    id: "7fc2a2eb-7ac5-461a-bdcb-26270fca8db6",
    url: "https://www.youtube.com/watch?v=hcm55lU9knw",
  },
];

app.get("/generate", async (req: Request, res: Response) => {
  const ROOT_PATH = "./public";
  const files: string[] = [];
  fs.readdirSync(ROOT_PATH).forEach((file) => {
    if (file !== ".DS_Store") {
      files.push(file);
    }
  });

  for (const fileIndex in files) {
    const fileName = files[fileIndex];
    const fileNameWithoutEncoding = fileName.split(".")[0];
    const filePath = `./public/${fileNameWithoutEncoding}.m4a`;
    console.log(fileNameWithoutEncoding);
    ffmpeg(filePath)
      .setStartTime(61)
      .setDuration(26)
      .format("mp3")
      .saveToFile(`./assets/${fileNameWithoutEncoding}.mp3`)
      .on("end", (output) => {
        console.log("done!");
      });
  }
});

app.get("/track/:id", async (req: Request, res: Response) => {
  const trackId = req.params.id;
  const findTrack = library.find((track) => track.id === trackId);

  if (!findTrack) {
    res.status(404).send("File not found");
  }

  res.json(findTrack);
});

app.get("/track", async (req: Request, res: Response) => {
  const randomLibraryIndex = Math.floor(Math.random() * library.length) + 0;
  const randomLibrary = library[randomLibraryIndex];
  res.json(randomLibrary);
});

app.get("/play/:id/:stem", async (req: Request, res: Response) => {
  const trackId = req.params.id;
  const stem = req.params.stem;
  const findTrack = library.find((track) => track.id === trackId);

  if (!findTrack) {
    res.status(404).send("File not found");
  }

  const ROOT_PATH = "./assets";
  const filePath = `${ROOT_PATH}/${trackId}-${stem}.mp3`;

  try {
    const stat = await getStat(filePath);
    res.writeHead(200, {
      "Content-Type": "audio/mp3",
      "Content-Length": stat.size,
    });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    res.status(500).send("Error while getting file");
  }
});

app.get("/tracks/:id", async (req: Request, res: Response) => {
  const trackId = req.params.id;
  const libraryIds = library
    .filter((track) => track.id !== trackId)
    .map((track) => track.id);
  const choosenTracks: string[] = [];
  while (choosenTracks.length < 3) {
    const randomLibraryIndex =
      Math.floor(Math.random() * libraryIds.length) + 0;
    const randomLibrary = libraryIds[randomLibraryIndex];
    if (!choosenTracks.includes(randomLibrary)) {
      choosenTracks.push(randomLibrary);
    }
  }
  choosenTracks.push(trackId);
  console.log(trackId);
  res.json(choosenTracks);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
