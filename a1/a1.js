/*********************************************************************************
* WEB322 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Farbod Moayeri Student ID: 134395227 Date: 2023-09-11
*
********************************************************************************/

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface(process.stdin, process.stdout);

rl.question("Do you wish to process a File (f) or Directory (d):  ", function(choice) {
    if(choice.toLocaleLowerCase() == "f") {
        fs.readFile('./post.txt', (err, fileContents) => {
            if(err) {
                console.log(err.message);
            } else {
                let fileContentsString = fileContents.toString().replace(/\s+/g, ' ');
                let fileContentsArray = fileContentsString.replace(/[^\w\s\']/g, "").split(" ");
                console.log(`Number of Characters (including spaces): ${fileContentsString.length}`);
                console.log(`Number of Words: ${fileContentsArray.length}`);
                let i;
                let savedIndex = 0;
                for(i = 0; i < fileContentsArray.length; i++) {
                    if(fileContentsArray[savedIndex].length < fileContentsArray[i].length)
                    {
                        savedIndex = i;
                    }
                }
                console.log(`Longest Word: ${fileContentsArray[savedIndex]}`);
                
            }
        })
    } else if (choice.toLocaleLowerCase() == "d") {
        fs.readdir('./files', (err, fileContents) => {
            if(err) {
                console.log(err.message);
            } else {
                console.log(`Files (reverse alphabetical order): ${fileContents.reverse()}`);
                for(let i = 0; i < fileContents.length; i++) {
                    fs.readFile(path.join(__dirname, 'files' , fileContents[i]), (err, textFile) => {
                        if(err)
                        {
                            console.log(err.message);
                        } else {
                            console.log(`${fileContents[i]}: ${Buffer.byteLength(textFile, 'uft8')}`);
                        }
                    });
                }
            }
        })
        if('./files')
        console.log("end");
    } else {
        console.log("Invalid Selection.");
    }
    rl.close();
})
