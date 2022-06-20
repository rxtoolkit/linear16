const {Command} = require('commander');

const audioFileToLinear16 = require('../src/lib/audioFileToLinear16');
const wavFileToMulaw = require('./lib/wavFileToMulaw');
const mulawFileToWav = require('./lib/mulawFileToWav');
const mulawFileToLinear16 = require ('./lib/mulawFileToLinear16')

const program = new Command();

const run = pipeline => (...params) => pipeline(...params).subscribe(
  console.log,
  console.error,
  () => console.log('Complete')
);

// node ./bin/code-generators/generateScaffold --help
program
  .command('from-file <inputFilePath> <outputFilePath>')
  .description('converts input file (like MP3 or M4A) to LINEAR16 format')
  .option('-d, --debug', 'output extra debugging')
  // .option('--plural-form <pluralForm>', 'the plural form of the resource name (defaults to adding an "s")')
  // .option('--dry-run', 'write output to console instead of files')
  // .option('-w --without', 'model, create, remove, delete, update')
  // .option('-f --force', 'overwrite existing files')
  .action((inputFilePath, outputFilePath) => run(audioFileToLinear16)(
    inputFilePath,
    outputFilePath
  ));

program
  .command('wav2mulaw <inputFilePath> <outputFilePath>')
  .description('converts input file (LINEAR16) to raw Mulaw format (no headers)')
  .option('-d, --debug', 'output extra debugging')
  // .option('--plural-form <pluralForm>', 'the plural form of the resource name (defaults to adding an "s")')
  // .option('--dry-run', 'write output to console instead of files')
  // .option('-w --without', 'model, create, remove, delete, update')
  // .option('-f --force', 'overwrite existing files')
  .action((inputFilePath, outputFilePath) => run(wavFileToMulaw)({
    inputFilePath,
    outputFilePath
  }));

program
  .command('mulaw2wav <inputFilePath> <outputFilePath>')
  .description('converts input file (raw MULAW@8000Hz, 8-bit depth, 1 channel) to WAV format (no headers)')
  .option('-d, --debug', 'output extra debugging')
  // .option('--plural-form <pluralForm>', 'the plural form of the resource name (defaults to adding an "s")')
  // .option('--dry-run', 'write output to console instead of files')
  // .option('-w --without', 'model, create, remove, delete, update')
  // .option('-f --force', 'overwrite existing files')
  .action((inputFilePath, outputFilePath) => run(mulawFileToWav)({
    inputFilePath,
    outputFilePath
  }));

program
  .command('mulaw2linear16 <inputFilePath> <outputFilePath>')
  .description('converts input file (raw MULAW@8000Hz, 8-bit depth, 1 channel) to raw LINEAR format')
  .option('-d, --debug', 'output extra debugging')
  // .option('--plural-form <pluralForm>', 'the plural form of the resource name (defaults to adding an "s")')
  // .option('--dry-run', 'write output to console instead of files')
  // .option('-w --without', 'model, create, remove, delete, update')
  // .option('-f --force', 'overwrite existing files')
  .action((inputFilePath, outputFilePath) => run(mulawFileToLinear16)({
    inputFilePath,
    outputFilePath
  }));

program.parse(process.argv);
