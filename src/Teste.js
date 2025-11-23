const readline = require('readline');
const { initializeDatabase, models } = require('./models');
const { error } = require('console');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise(resolve => rl.question(prompt, resolve));
}

function printMenu() {
    console.log('\n===============================');
    console.log('        BANCO DE DADOS');
    console.log('=================================');
    console.log('\n1 - Criar usuário');
    console.log('2 - Listar todos os usuários');
    console.log('3 - Buscar usuário por ID');
    console.log('4 - Buscar usuário por email');
    console.log('5 - Atualizar usuário');
    console.log('6 - Deletar usuário');
    console.log('7 - Contar usuários');
    console.log('0 - Sair\n');
}

async function criarUsuario() {
    console.log('\nCriar novo usuário');
    console.log('--------------------------------------');

    const name = await question('Nome: ');
    if (!name.trim()) return console.log('Nome é obrigatório!');

    const email = await question('Email: ');
    if (!email.trim()) return console.log('Email é obrigatório!');

    const role = await question('Role (admin/user) [padrão: user]: ') || 'user';

    try {
        const user = await models.User.create({
            name: name.trim(),
            email: email.trim(),
            role: role.trim() === 'admin' ? 'admin' : 'user'
        });

        console.log('\nUsuário criado com sucesso:');
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
    } catch (error) {
        console.log('\nErro ao criar usuário:', error.message);
    }
}

async function listarUsuarios() {
    console.log('\nListando todos os usuários...');
    console.log('--------------------------------------');

    try {
        const users = await models.User.findAll({ order: [['id', 'ASC']] });

        if (users.length === 0) return console.log('Nenhum usuário encontrado.');

        console.log(`\nTotal: ${users.length} usuário(s)\n`);

        users.forEach(user => {
            console.log(`ID: ${user.id} | Nome: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
        });
    } catch (error) {
        console.log('\nErro ao listar usuários:', error.message);
    }
}

async function buscarPorId() {
    console.log('\nBuscar usuário por ID');
    console.log('--------------------------------------');

    const id = await question('Digite o ID: ');

    try {
        const user = await models.User.findByPk(id);

        if (user) {
            console.log('\nUsuário encontrado:');
            console.log(`ID: ${user.id}`);
            console.log(`Nome: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
        } else {
            console.log('\nUsuário não encontrado.');
        }
    } catch (error) {
        console.log('\nErro ao buscar usuário:', error.message);
    }
}

async function buscarPorEmail() {
    console.log('\nBuscar usuário por Email');
    console.log('--------------------------------------');

    const email = await question('Digite o email: ');

    try {
        const user = await models.User.findOne({
            where: { email: email.trim() }
        });

        if (user) {
            console.log('\nUsuário encontrado:');
            console.log(`ID: ${user.id}`);
            console.log(`Nome: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
        } else {
            console.log('\nUsuário não encontrado.');
        }
    } catch (error) {
        console.log('\nErro ao buscar usuário:', error.message);
    }
}

async function atualizarUsuario() {
    console.log('\nAtualizar usuárip');
    console.log('--------------------------------------');

    const id = await question('Digite o ID do usuário: ');

    try {
        const user = await models.User.findByPk(id);
        if (!user) {
            console.log('Usuário não encontrado.');
            return;
        }

        console.log(`\nUsuário atual:`);
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log('\nDeixe em branco para manter o valor atual.\n');

        const name = await question(`Novo nome [${user.name}]:`);
        const email = await question(`Novo email [${user.email}]:`);
        const role = await question(`Novo role [${user.role}]:`);

        const updates = {};
        if (name.trim()) updates.name = name.trim();
        if (email.trim()) updates.email = email.trim();
        if (role.trim() == 'admin' || role.trim() == 'user') updates.role = role.trim();

        await models.User.update(updates, { where: { id } });

        const updatesUser = await models.User.findByPk(id);

        console.log(`\nUsuário atualizado:`);
        console.log(`ID: ${updatesUser.id}`);
        console.log(`Nome: ${updatesUser.name}`);
        console.log(`Email: ${updatesUser.email}`);
        console.log(`Role: ${updatesUser.role}`);
    } catch (error) {
        console.log(`Erro ao atualizar o usuário`);
    }
}

async function deletarUsuario() {
    console.log('\n Deletar usuário');
    console.log('--------------------------------------');

    const id = await question('Digite o ID do usuário para deletar: ');

    try {
        const user = await models.User.findByPk(id);
        if (!user) {
            console.log('Usuário não encontrado.');
            return;
        }

        console.log(`\nUsuário que será deletado:`);
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);

        const confirm = await question(`\n Tem certeza? (sim/não): `);

        if (confirm.toLowerCase() == 'sim' || confirm.toLowerCase() == 's') {
            await models.User.destroy({ where: { id } });
            console.log('\n Usuário deletado!');
        } else {
            console.log('\n Usuário não deletado!');
        }

    } catch (error) {
        console.log(`Erro ao deletar`);
    }

}

async function contarUsuarios() {
    console.log('\n Contando usuários');
    console.log('--------------------------------------');

    try {
        const total = await models.User.count();

        const admins = await models.User.count({ where: { role: 'admin' } });
        const users = await models.User.count({ where: { role: 'user' } });

        console.log('\n Estatísticas:');
        console.log(` Total: ${total}`);
        console.log(` Admins: ${admins}`);
        console.log(` Usuários: ${users}`);

    } catch (error) {
        console.log('\n Erro ao contar usuários.');
    }
}

async function main() {
    console.log('\nInicializando');
    console.log('--------------------------------------');

    while (true) {
        printMenu();

        const opcao = await question(`Escolha: `);
        switch (opcao.trim()) {
            case '1':
                await criarUsuario();
                break;
            case '2':
                await listarUsuarios();
                break;
            case '3':
                await buscarPorId();
                break;
            case '4':
                await buscarPorEmail();
                break;
            case '5':
                await atualizarUsuario();
                break;
            case '6':
                await deletarUsuario();
                break;
            case '7':
                await contarUsuarios();
                break;
            case '0':
                console.log('\n Até Logo my friendo');
                rl.close();
                process.exit(0);
                break;
            default:
                console.log('\n Opção inválida! Tente novamente my friendo.');
        }

    }
}

main().catch((error) => {
    console.error(`Erro`);
    rl.close();
    process.exit(1);
})