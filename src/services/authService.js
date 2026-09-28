const bycript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../model/usuario');

async function cadastrarUsuario(dados){
    const { nome, email, senha } = dados;

    // verificar se os dados froam registrados
    if (!nome || !email || !senha) {
        const erro = new Error('Os campos de nome, email e senha são obrigatórios.');
        erro.status = 400; // Bad Request - a requisação possui algum problema
        throw erro;
    }

    // verificar se o usuário já se cadastrou com aquele email
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
        const erro = new Error('O email informado já está em uso.');
        erro.status = 409;
        throw erro;
    }

    // criptografar a senha do usuário
    const senhaHash = await bycript.hash(senha, 10);

    // criar o usuário no banco de dados
    const usuario = await Usuario.create({
        nome: nome,
        email: email,
        senha: senhaHash
    });
    return usuario;
}

async function login(email, senha) {

    if (!email || !senha) {
        const erro = new Error('Os campos de email e senha são obrigatórios.');
        erro.status = 400;
        throw erro;
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
        const erro = new Error('O usuário informado não existe.');
        erro.status = 401;
        throw erro;
    }

    const senhaCorreta = await bycript.compare(senha, usuario.senha);

    if (!senhaCorreta) {
        const erro = new Error('A senha informada está incorreta.');
        erro.status = 401;
        throw erro;
    }

    // tempo de expiração do token: 4 hora (tempo que o usuário pode permanecer logado)
    const token = jwt.sign(
        { id: usuario.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '4h' }
    );
    return token;
}

module.exports = {
    cadastrarUsuario,
    login
};
