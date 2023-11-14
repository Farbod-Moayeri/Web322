require('dotenv').config();
const Sequelize = require('sequelize');

let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: console.log,
    dialectOptions: {
    ssl: { rejectUnauthorized: false },
    },
    query: { raw: false },
});
// holy moly the query having raw as true led me on a wild goose chase


const Theme = sequelize.define(
    'Theme',
    {
        id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true, 
    },
        name: Sequelize.STRING,
    },
    {
    tableName: 'Themes',
    createdAt: false, 
    updatedAt: false, 
    freezeTableName: true,
    }
);

const Set = sequelize.define(
    'Set',
    {
        set_num: {
        type: Sequelize.STRING,
        primaryKey: true, 
        autoIncrement: false, 
    },
        name: Sequelize.STRING,
        year: Sequelize.INTEGER,
        num_parts: Sequelize.INTEGER,
        theme_id: Sequelize.INTEGER,
        img_url: Sequelize.STRING,
    },
    {
    tableName: 'Sets',
    createdAt: false, 
    updatedAt: false, 
    freezeTableName: true,
    }
);
  
Set.belongsTo(Theme, {foreignKey: 'theme_id'});


const initialize = () => {
    return sequelize.sync().then(() => {
        
        
    })
    .catch(err => {
        
        throw err.message; 
    });
};

const getAllSets = () => {
    return sequelize.sync().then(() => {
        return Set.findAll({ include: [Theme] })
        .then(sets => {
            if (sets && sets.length > 0) {
                const setsJson = sets.map(set => set.get({ plain: true }));
                return setsJson;
            } else {
                throw new Error("No Sets Available");
            }
        })
        .catch(err => {
            console.error("Error in getAllSets: ", err);
            throw err;
        });
    });
};




const getSetByNum = (setNum) => {
    return Set.findOne({ 
        where: { set_num: setNum },
        include: [Theme]
    })
    .then(set => {
        if (set) {
            return set;
        } else {
            throw new Error("Unable to find requested set");
        }
    })
    .catch(err => {
        throw err;
    });
};


const getSetsByTheme = (theme) => {
    return Set.findAll({include: [Theme], where: { 
        '$Theme.name$': {
        [Sequelize.Op.iLike]: `%${theme}%`
        }
       }})
    .then(sets => {
        if (sets && sets.length > 0) {
            return sets;
        } else {
            throw new Error("Unable to find requested sets");
        }
    })
    .catch(err => {
        throw err;
    });
};

const addSet = (setData) => {
    return new Promise((resolve, reject) => {
        Set.create(setData)
        .then(() => resolve())
        .catch(err => {
            reject(err.errors[0].message);
        });
    });
};

const getAllThemes = () => {
    return new Promise((resolve, reject) => {
        Theme.findAll()
        .then(themes => resolve(themes))
        .catch(err => reject(err.message));
    });
};


const editSet = (set_num, setData) => {
    return new Promise((resolve, reject) => {
        Set.update(setData, { where: { set_num: set_num } })
        .then( () => {
            resolve();
        })
        .catch(err => { 
            reject(err.errors[0].message);
           
        });
    });
};



module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet };

