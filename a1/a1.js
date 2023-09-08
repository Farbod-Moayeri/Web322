const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface(process.stdin, process.stdout);

rl.question("Do you wish to process a File (f) or directory (d):  ", function(choice) {
    if(choice.toLocaleLowerCase() == "f") {
        fs.readFile('./post.txt', (err, fileContents) => {
            if(err) {
                console.log(err.message);
            } else {
                let fileContentString = fileContents.toString(); //.replace(/\s+/g, ' ');
                console.log(fileContents);
            }
        })
        rl.close();
    } else if (choice.toLocaleLowerCase() == "d") {

    } else {
        console.log("Invalid Selection.");
    }
})