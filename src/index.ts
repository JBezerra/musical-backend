import fs from "fs";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import { Track } from "./interfaces";

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
  {
    name: "A Praieira",
    artist: "Chico Science e Nação Zumbi",
    id: "92914095-0596-47d8-83f2-dea92d63b70f",
    url: "https://www.youtube.com/watch?v=jE6p22nz7CU",
  },
  {
    name: "Californication",
    artist: "Red Hot Chili Peppers",
    id: "9a635b65-7d7f-40d2-a68b-6e712f0937dc",
    url: "https://www.youtube.com/watch?v=YlUKcNNmywk",
  },
  {
    name: "Believer",
    artist: "Imagine Dragons",
    id: "2d2aee41-6f5e-448c-a185-b6a6e903ade7",
    url: "https://www.youtube.com/watch?v=7wtfhZwyrcc",
  },
  {
    name: "Dance Monkey",
    artist: "Tones And I",
    id: "38dfe4f1-06cc-49ad-abc2-ab57b59ed605",
    url: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
  },
  {
    name: "See You Again",
    artist: "Wiz Khalifa",
    id: "58674266-5a52-4707-b54e-b9e01905f813",
    url: "https://www.youtube.com/watch?v=RgKAFK5djSk",
  },
];

const app: Express = express();
const port = 3001;

app.use(express.static("database"));

const allowedOrigins = ["http://localhost:3000, https://stemgame.netlify.app"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

// Functions
const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

// GET RANDOM track
app.get("/track", async (req: Request, res: Response) => {
  const randomLibraryIndex = Math.floor(Math.random() * library.length) + 0;
  const randomLibrary = library[randomLibraryIndex];
  res.json(randomLibrary);
});

// GET track data by $id
app.get("/track/:id", async (req: Request, res: Response) => {
  const trackId = req.params.id;
  const findTrack = library.find((track: Track) => track.id === trackId);

  if (!findTrack) {
    res.status(404).send("File not found");
  }

  res.json(findTrack);
});

// GET tracks options including $id
app.get("/tracks/:id", async (req: Request, res: Response) => {
  const trackId = req.params.id;
  const libraryIds = library
    .filter((track: Track) => track.id !== trackId)
    .map((track: Track) => track.id);
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

  res.json(shuffle(choosenTracks));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
