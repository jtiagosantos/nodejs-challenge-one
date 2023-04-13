import fs from 'node:fs';
import { parse } from 'csv-parse';

const csvPath = new URL('./tasks.csv', import.meta.url);

async function main() {
  try {
    const parser = fs.createReadStream(csvPath).pipe(parse());

    let line = 0;

    for await (const chunk of parser) {
      if (line > 0) {
        const [title, description] = chunk;

        fetch('http://localhost:3333/tasks', {
          method: 'POST',
          body: JSON.stringify({ title, description }),
        });
      }
      line++;
    }
  } catch (error) {
    console.log(error);
  }
}

main();