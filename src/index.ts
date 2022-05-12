import fs from "fs";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import { Track } from "./interfaces";

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

// Read library from local json file
const rawLibrary = fs.readFileSync("./database/library.json", {
  encoding: "utf8",
  flag: "r",
});
const library = JSON.parse(rawLibrary);

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
