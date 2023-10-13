const setData = require("../../data/setData");
const themeData = require("../../data/themeData");

let sets = [];

const initialize = () => {
    return new Promise((resolve,reject) => { 
        try {
            setData.forEach((set, index ) => {
                const theme = themeData.find(theme => theme.id == set.theme_id);
                if(theme)
                {
                    const modifiedSet = { ...set, theme: theme.name };
                    sets.push(modifiedSet);
                }
            });
            resolve();
        } catch(err) {
            reject(err.message);
        }
    });
}

const getAllSets = () => {
    return new Promise((resolve,reject) => { 
        if(sets.length) {
            resolve(sets);
        } else {
            reject("No Sets Available");
        }
    });
}

const getSetByNum = (setNum) => {
    return new Promise((resolve,reject) => {
        if (typeof setNum !== 'string')
        {
            setNum = setNum.toString();
        }
        const found = sets.find(current => current.theme_id === setNum);
        if(found) {
            resolve(found);
        }
        else {
            reject("Unable to find requested set");
        }
    });
}

const getSetsByTheme = (theme) => {
    return new Promise((resolve, reject) => {
        const found = sets.filter(current => current.theme.toLowerCase().includes(theme.toLowerCase())
        || current.theme.toLowerCase() === theme.toLowerCase());

        if(found.length) {
            resolve(found);
        } else {
            reject("Unable to find requested sets");
        }
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };