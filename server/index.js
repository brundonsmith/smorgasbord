const path = require('path')

const fs = require('fs-extra')
const express = require('express')
const os = require('os');
const pty = require('node-pty');

const app = express()

app.use(express.static('./static'))
app.use(express.json())

// filesystem access
app.get('/fs/:path', async (req, res) => {
    const dir = req.params.path;

    const files = await fs.readdir(dir)

    const withMeta = await Promise.all(files.map(async file => {
        const fullPath = path.resolve(dir, file);
        let kind;
        try {
            const lstat = await fs.stat(fullPath);
            kind = lstat.isDirectory() ? 'directory' : path.extname(file).substr(1);
        } catch {
            console.warn("Failed getting stats for file " + fullPath)
            kind = path.extname(file).substr(1);
        }

        return {
            name: file,
            fullPath,
            kind,
        }
    }))

    res.json(withMeta)
})

app.post('/fs/move', async (req, res) => {
    const { src, dest } = req.params;

    await fs.move(src, dest)

    res.send()
})

app.get('/fs/download/:path', async (req, res) => {
    const path = req.params.path;
    console.log({ path })
    res.sendFile(path);
})


// commands
// const shellProcess = cp.spawn('cmd')
// shellProcess.stdout.setEncoding('utf8')

// var data_line = '';

// shellProcess.stdout.on("data", function(data) {
//   data_line += data;
//   if (data_line[data_line.length-1] == '\n') {
//     // we've got new data (assuming each individual output ends with '\n')
//     const output = data_line // do something with data_line
//     data_line = ''; // reset the line of data

//     console.log('Result #', k, ': ', res);

//     k++;
//     // do something else now
//     if (k < 5) {
//       // double the previous result
//       shellProcess.stdin.write('2 * + ' + res + '\n');
//     } else {
//       // that's enough
//       shellProcess.stdin.end();
//     }
//   }
// });


// shellProcess.stdin.write('1 + 0\n');

const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
});

let shellInputBuffer = ''

let shellOutputBuffer = ''
ptyProcess.on('data', function (data) {
    shellOutputBuffer += data;
});



app.get('/shell', (req, res) => {
    // if (shellOutputBuffer) {
    //     console.log('sent back: ' + shellOutputBuffer)
    // }
    res.send(shellOutputBuffer)
    shellOutputBuffer = ''
})

app.post('/shell', (req, res) => {
    const { input } = req.query
    shellInputBuffer += input;

    // console.log('current input buffer: ' + JSON.stringify(shellInputBuffer))

    if (/[\n\r]/.test(shellInputBuffer)) {
        const commands = shellInputBuffer.split(/[\n\r]/);
        shellInputBuffer = commands[commands.length - 1]
        // console.log('writing to shell: ' + commands.slice(0, commands.length - 1).map(cmd => cmd + '\r').join(''))
        ptyProcess.write(commands.slice(0, commands.length - 1).map(cmd => cmd + '\r').join(''));
    }
})


// text editing
app.get('/text-file/:path', async (req, res) => {
    try {
        res.send(await fs.readFile(req.params.path));
    } catch {
        res.send('');
    }
})

app.post('/text-file/:path', async (req, res) => {
    try {
        await fs.writeFile(req.params.path, req.body.contents);
        res.send();
    } catch {
        res.send();
    }
})

app.listen(3000, () => console.log('Listening'))