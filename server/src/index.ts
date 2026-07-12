import { createCollabServer } from './wsServer.js';

const port = Number(process.env.PORT ?? 4310);

createCollabServer(port);
