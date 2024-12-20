const dircompare = require('dir-compare');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const options = { compareSize: true };
// Multiple compare strategy can be used simultaneously - compareSize, compareContent, compareDate, compareSymlink.
// If one comparison fails for a pair of files, they are considered distinct.
const path1 = path.resolve(__dirname, './jhbase');
const path2 = path.resolve(__dirname, './silverlake-customer-poc');

// Synchronous
// const res = dircompare.compareSync(path1, path2, options)
// print(res)

const capitalized =
args.app.charAt(0).toUpperCase()
  + args.app.slice(1)

console.log(args.app);
console.log(capitalized);



// Asynchronous
dircompare.compare(path1, path2, options)
  .then(res => print(res))
  .catch(error => console.error(error));

function print(result) {
  console.log('Directories are %s', result.same ? 'identical' : 'different')

  console.log('Statistics - equal entries: %s, distinct entries: %s, left only entries: %s, right only entries: %s, differences: %s',
    result.equal, result.distinct, result.left, result.right, result.differences)

  result.diffSet.forEach(dif => console.log('Difference - path: %s, name1: %s, type1: %s, name2: %s, type2: %s, state: %s',
    dif.relativePath, dif.name1, dif.type1, dif.name2, dif.type2, dif.state))
}