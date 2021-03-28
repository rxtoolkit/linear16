const {Command} = require('commander');
const audioFileToLinear16 = require('../src/lib/audioFileToLinear16');

const program = new Command();

// node ./bin/code-generators/generateScaffold --help
program
  .command('from-file <inputFilePath> <outputFilePath>')
  .description('converts input file (like MP3 or M4A) to LINEAR16 format')
  .option('-d, --debug', 'output extra debugging')
  // .option('--plural-form <pluralForm>', 'the plural form of the resource name (defaults to adding an "s")')
  // .option('--dry-run', 'write output to console instead of files')
  // .option('-w --without', 'model, create, remove, delete, update')
  // .option('-f --force', 'overwrite existing files')
  .action((inputFilePath, outputFilePath) => audioFileToLinear16(
    inputFilePath,
    outputFilePath
  ));

program.parse(process.argv);
