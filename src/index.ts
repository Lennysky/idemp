/*
import express, {Request, Response} from 'express';
import bodyParser from 'body-parser'

//create express app
const app = express()

const port = process.env.PORT || 3005

type Player = {
    id: number;
    name: string;
    pokemons: string[];
};

type PatchOperation = {
    op: "add" | "remove" | "replace";
    path: string;
    value?: string;
};

let players: Player[] = [
    {id: 1, name: 'Kurt', pokemons: ['Pika', 'Squirtle'] }
];

const bodyParserMiddleware = bodyParser({})
app.use(bodyParserMiddleware)
/!*
type Player = {
    id: number;
    name: string;
    pockemons: string[];
};

type PatchOperation = {
    op: "add";
    path: string;
    value?: any;
};

app.get('/players', (req: Request, res: Response) => {
    res.send(players)
} )


function applyPatch(patch: PatchOperation) {
    const {op, path, value} = patch;

app.patch('/players/:id', (req: Request, res: Response) => {
    let player = players.find(p => p.id ===+req.params.id);
    if (client) {
        players.pokemons.push(value)

        res.send(client)
    } else {
        res.send(404)
    }
   // console.log("Updated players:", players);
})
}*!/

// Define the Client type



app.patch("/players/:id", (req: Request, res: Response) => {
    const patch = req.body as PatchOperation;

    // Apply the patch
    const { op, path, value } = patch;
    players.pokemons.push(value);
    res.send()

});



//start app
app.listen(port, () => {
    console.log(`Example app listening on port  ${port}`);
})
*/


import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";

// Define the Player type
type Player = {
    id: number;
    name: string;
    pokemons: string[];
};

// Define the PatchOperation type
type PatchOperation = {
    op: "add" | "remove" | "replace";
    path: string;
    value?: string;
};

// Sample players array
let players: Player[] = [
    { id: 1, name: "Kurt", pokemons: ["Pika", "Squirtle"] },
];

const app: Application = express();
app.use(bodyParser.json());

app.get('/players', (req: Request, res: Response) => {
    res.send(players);
})

/**
 * Apply a PATCH operation to a player's pokemons array.
 * @param player The player object to modify.
 * @param patch The patch operation details.
 * @returns A message indicating the result of the operation.
 */
function applyPatch(player: Player, patch: PatchOperation): { modified: boolean; message: string } {
    const { op, path, value } = patch;

    // Validate the path
    if (path !== "/players.pokemons/-") {
        return { modified: false, message: `Invalid path: ${path}` };
    }

    switch (op) {
        case "add":

            if (!value) {
                return { modified: false, message: "Value must be provided for 'add' operation" };
            }
            // Check idempotence: Add only if the value doesn't already exist
/*            if (!player.pokemons.includes(value)) {
                player.pokemons.push(value);
                return { modified: true, message: "Pokemon added successfully" };
            }
            return { modified: false, message: "Operation is idempotent. Pokemon already exists" };*/
            // Directly add the value, no check for duplicates
            player.pokemons.push(value);
            return { modified: true, message: "Pokemon added successfully" };

        default:
            return { modified: false, message: `Unsupported operation: ${op}` };
    }
}

// PATCH endpoint
app.patch("/players/:id", (req: Request, res: Response) => {
    const playerId = parseInt(req.params.id, 10);
    const patch = req.body as PatchOperation;

    // Find the target player
    const player = players.find(p => p.id === playerId);
    if (!player) {
        return res.status(404).json({ success: false, message: "Player not found" });
    }

    // Apply the patch operation
    const { modified, message } = applyPatch(player, patch);

    return res.status(200).json({
        success: true,
        modified,
        message,
        player,
    });
});

// Start the server
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});