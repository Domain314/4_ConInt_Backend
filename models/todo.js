const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Todo = sequelize.define('todo', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        done: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date: {
            allowNull: false,
            type: DataTypes.STRING
        }
    });

    Todo.associate = () => {
        const User = sequelize.models.user;
        Todo.belongsTo(User, { foreignKey: { allowNull: false } });
    };

    return Todo;
};
