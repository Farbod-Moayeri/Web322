require('dotenv').config();
const Sequelize = require('sequelize');

let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
    ssl: { rejectUnauthorized: false },
    },
    query: { raw: false },
});


const Theme = sequelize.define(
    'Themes',
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
    'Sets',
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


const initialize = () => 
{   return new Promise ((resolve, reject) => {
    sequelize.sync().then(() => {
        resolve();
    })
    .catch(err => {
        reject(err.message);
    });
})
    
};

const getAllSets = () => {
    return new Promise ((resolve, reject) => {
        sequelize.sync().then(() => {
            Set.findAll({ include: [Theme] })
            .then(sets => {
                if (sets && sets.length > 0) {
                    const setsJson = sets.map(set => set.get({ plain: true }));
                    resolve(setsJson);
                } else {
                    const err = new Error("No Sets Available");
                    reject(err);
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    });
};


const getSetByNum = (setNum) => {
    return new Promise ((resolve, reject) => {
        Set.findOne({ 
            where: { set_num: setNum },
            include: [Theme]
        })
        .then(set => {
            resolve(set);
        })
        .catch(err => {
            reject(err);
        });
    });
    
};


const getSetsByTheme = (theme) => {
    return new Promise ((resolve, reject) => {
        Set.findAll({include: [Theme], where: { 
            '$Theme.name$': {
            [Sequelize.Op.iLike]: `%${theme}%`
            }
           }})
        .then(sets => {
            resolve(sets);
        })
        .catch(err => {
            reject(err);
        });
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

const deleteSet = (set_num) => {
    return new Promise((resolve, reject) => {
        Set.destroy({ 
            where: { set_num: set_num },
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err.errors[0].message);
        });
    });
};


module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet, deleteSet };

