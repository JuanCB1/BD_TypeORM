const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define(
    'User',  // Nome do modelo (usado internamente pelo Sequelize)
    {
        // Campo ID - chave primária da tabela
        id: {
            type: DataTypes.INTEGER,  // Tipo: número inteiro
            autoIncrement: true,      // Incrementa automaticamente (1, 2, 3, ...)
            primaryKey: true          // Define como chave primária (identificador único)
        },

        // Campo Nome - obrigatório
        name: {
            type: DataTypes.STRING(120),  // Tipo: texto com no máximo 120 caracteres
            allowNull: false              // Não permite valores nulos (campo obrigatório)
        },

        // Campo Email - obrigatório, único e validado
        email: {
            type: DataTypes.STRING(180),  // Tipo: texto com no máximo 180 caracteres
            allowNull: false,             // Não permite valores nulos
            unique: true,                 // Garante que não haverá emails duplicados
            validate: {
                isEmail: true             // Valida se o formato é de email válido (ex: usuario@email.com)
            }
        },

        // Campo Role (papel/função) - pode ser 'admin' ou 'user'
        role: {
            type: DataTypes.ENUM('admin', 'user'),  // Tipo: enum (só aceita 'admin' ou 'user')
            defaultValue: 'user'                     // Valor padrão é 'user' se não for informado
        }
    },
    {
        // Opções adicionais do modelo
        tableName: 'users',      // Nome da tabela no banco (em minúsculo e plural)
        underscored: true        // Converte nomes de campos de camelCase para snake_case
        // Ex: createdAt vira created_at no banco
    }
);

module.exports = User;