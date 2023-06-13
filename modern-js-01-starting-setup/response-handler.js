// const fs = require('fs');
// const fs = require('fs/promises');
import fs from 'fs/promises';
// import { join, dirname} from 'path';
import path, { dirname} from 'path';

import { fileURLToPath } from 'url';
// import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

// export const resHandler = (req, res, next) => {
const resHandler = (req, res, next) => {
    // fs.readFile('my-page.html', 'utf8', (err, data) => {
    //   res.send(data);
    // });
    fs.readFile('my-page.html', 'utf8').then((data) => {
      res.send(data);
    }).catch(err => console.log(err))
    // res.sendFile(path.join(__dirname, 'my-page.html'))
  }

// module.exports = resHandler;
export default resHandler;