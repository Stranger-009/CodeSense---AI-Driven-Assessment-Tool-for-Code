// backend/routes/executeCodeRouter.js
import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.post('/execute-code', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const filename = `temp-${uuid()}.${language === 'python' ? 'py' : 'txt'}`;
  fs.writeFileSync(filename, code);

  let command = '';
  if (language === 'python') {
    command = `python ${filename}`;
  } else {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  exec(command, (error, stdout, stderr) => {
    fs.unlinkSync(filename); // delete file after execution

    if (error) {
      return res.status(200).json({ output: stderr || 'Execution error' });
    }

    return res.status(200).json({ output: stdout });
  });
});

export default router;
