const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('user', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        }
    });

    User.associate = () => {
        const Todo = sequelize.models.todo;
        User.hasMany(Todo, { foreignKey: { allowNull: false } });
    };

    return User;
};
