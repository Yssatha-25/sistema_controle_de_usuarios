const authService = require('../services/authService');

async function cadastrarUsuario(req, res) {
    try {
        const usuario = await authService.cadastrarUsuario(req.body);

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso.',
            usuario
        });
    } catch (error) {
        return res.status(error.status || 500)({
            erro: error.mensagem
        });
    }
}

async function login(req, res) {
    try {
        const { email, senha } = req.body;
        const response = await authService.login(email, senha);
        
        return res.status(200).json(response);
    } catch (error) {
        return res.status(error.status || 500)({
            erro: error.mensagem
        });
    }
}