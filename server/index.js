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

app.post('/fs/rename', async (req, res) => {
    const { filePath, newFileName } = req.query;
    const newFilePath = path.resolve(path.dirname(filePath), newFileName)

    await fs.rename(filePath, newFilePath)

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

class ShellSession {
    inputBuffer = ''
    outputBuffer = ''

    constructor() {
        console.log('new shell session created')
        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env,
            handleFlowControl: true
        });

        this.ptyProcess.on('data', (data) => {
            console.log({ data })
            this.outputBuffer += data;
        });
    }
}

const sessions = new Map()

app.post('/shell/init', (req, res) => {
    const { session } = req.query

    if (!sessions.has(session)) {
        sessions.set(session, new ShellSession())
    }

    res.send()
})

app.get('/shell', (req, res) => {
    const { session } = req.query
    const shellSession = sessions.get(session)

    if (shellSession == null) {
        res.sendStatus(500)
        return
    }
    // if (shellSession.outputBuffer) {
        console.log('sent back: ' + JSON.stringify(shellSession.outputBuffer))
    // }
    res.send(shellSession.outputBuffer)
    shellSession.outputBuffer = ''
})

app.post('/shell', (req, res) => {
    const { session, input } = req.query
    const shellSession = sessions.get(session)

    if (shellSession == null) {
        res.sendStatus(500)
        return
    }

    shellSession.ptyProcess.write(input)

    // shellSession.inputBuffer += input;

    // console.log('current input buffer: ' + JSON.stringify(shellInputBuffer))

    // if (/[\n\r]/.test(shellSession.inputBuffer)) {
    //     const commands = shellSession.inputBuffer.split(/[\n\r]/);
    //     shellSession.inputBuffer = commands[commands.length - 1]
    //     // console.log('writing to shell: ' + commands.slice(0, commands.length - 1).map(cmd => cmd + '\r').join(''))
    //     shellSession.ptyProcess.write(commands.slice(0, commands.length - 1).map(cmd => cmd + '\r\n').join(''));
    // }
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