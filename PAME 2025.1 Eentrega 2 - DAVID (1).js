import inquirer from 'inquirer';
let contadorReserva = 0; // Adicione no escopo global

class Reserva {
  constructor(cliente, quarto, checkin, checkout) {
    this.id = contadorReserva++;
    this.cliente = cliente;
    this.quarto = quarto;
    this.checkin = checkin;
    this.checkout = checkout;
    this.status = 'Pendente'; 
    this.avaliacao = null;
  }
 }


class hotel { constructor(id, checkin, checkout){
      this.id = ++id.contador;
      this.checkin = checkin;
      this.checkout = checkout;
}
}
class pessoa { constructor(CPF, nome, email, senha ) {
      this.id = ++id.contador;
      this.CPF = CPF;
      this.nome = nome;  
      this.email = email;
      this.senha = senha;
}
}
class funcionario {  
    constructor(usuário) {
    this.usuário = usuário;
    this.id = ++id.contador;
}
}
class cliente {
    constructor(datadenascimento) {
      this.datadenascimento = datadenascimento;
      
}
}
class quarto {
      constructor(cama, preço, disponivel, nome, descrição) {
      this.cama = cama;
      this.preço = preço;
      this.disponivel = disponivel;
      this.nome = nome;
      this.descrição = descrição;
}
}
class sistema {
    constructor() {
        this.cliente = [];
        this.funcionario = [];
        this.quarto = [];
        this.reserva = [];
    }
    adicionarcliente(cliente) {
        this.cliente.push(cliente);
    }
    adicionarfuncionario(funcionario) {
        this.funcionario.push(funcionario);
    }
    adicionarquarto(quarto) {
        this.quarto.push(quarto);
    }
    adicionarreserva(reserva) {
        this.reserva.push(reserva);
    }
    listarclient() {
        return this.cliente;
    }
    reservarquarto(cliente, quartoId, checkin, checkout) {
        const quarto = this.quarto.find(q => q.id === quartoId && q.disponivel);
        if (quarto) {
            const reserva = new Reserva(cliente, quarto, checkin, checkout);
            this.adicionarreserva(reserva);
            quarto.disponivel = false;
            return reserva;
        }
        
        return null;
    }
    listarQuartosDisponiveis() {
        return this.quarto.filter(q => q.disponivel);
    }
    buscarClientePorEmailSenha(email, senha) {
        return this.cliente.find(c => c.email === email && c.senha === senha);
    }
    buscarFuncionarioPorEmailSenha(email, senha) {
        return this.funcionario.find(f => f.usuário.email === email && f.usuário.senha === senha);
    }
    mudarStatusReserva(idReserva, novoStatus) {
        const reserva = this.reserva[idReserva];
        if (reserva) reserva.status = novoStatus;
}
}   
     function cancelarReservaCliente(idReserva) {
     const reserva = sistema.reserva.find(r => r.id === idReserva);
     if (reserva && reserva.status === 'Pendente') {
     reserva.status = 'Cancelada';
     reserva.quarto.disponivel = true;
     console.log("Reserva cancelada!");
     } else {
     console.log("Reserva não encontrada ou não pode ser cancelada.");
  }
}


const sistema = new sistema();

async function login() {
  const { tipo } = await inquirer.prompt({
    type: 'list',
    name: 'tipo',
    message: 'Você é:',
    choices: ['Cliente', 'Funcionário']});

    const { email, senha } = await inquirer.prompt([
    { name: 'email', message: 'Email:' },
    { name: 'senha', message: 'Senha:' }]);

     if (tipo === 'Cliente') {
    const cliente = sistema.buscarClientePorEmailSenha(email, senha);
    if (cliente) await menuCliente(cliente);
    else console.log("Login inválido.");
 } 
    else {
    const funcionario = sistema.buscarFuncionarioPorEmailSenha(email, senha);
    if (funcionario) await menuFuncionario(funcionario);
    else console.log("Login inválido.");
 }
}

async function menuCliente(cliente) {
  const { acao } = await inquirer.prompt({
    type: 'list',
    name: 'acao',
    message: 'Menu do Cliente',
    choices: ['Ver quartos disponíveis', 'Reservar quarto', 'Sair'] });

if (acao === 'Ver quartos disponíveis') {
    const quartos = sistema.listarQuartosDisponiveis();
    console.table(quartos);
    await menuCliente(cliente);
 } 
    else if (acao === 'Reservar quarto') {
    const { quartoId, checkin, checkout } = await inquirer.prompt([
      { name: 'quartoId', message: 'ID do quarto:' },
      { name: 'checkin', message: 'Data de check-in:' },
      { name: 'checkout', message: 'Data de check-out:' }]);
    const reserva = sistema.reservarQuarto(cliente.id, parseInt(quartoId), checkin, checkout);
    console.log(reserva ? "Reserva realizada!" : "Quarto indisponível.");
    await menuCliente(cliente);
 } 
    else if (acao === 'Sair') {
    console.log('Saindo...');
    process.exit();
 }
      async function modificarDadosCliente(cliente) {
      const novos = await inquirer.prompt([
    { name: 'nome', message: 'Novo nome:' },
    { name: 'email', message: 'Novo email:' },
    { name: 'senha', message: 'Nova senha:' }]);
    cliente.nome = novos.nome;
     cliente.email = novos.email;
    cliente.senha = novos.senha;
    console.log("Dados atualizados!");
}

}   
  function verMinhasReservas(clienteId) {
  const reservas = sistema.reserva.filter(r => r.cliente === clienteId);
  console.table(reservas);
}


 async function menuFuncionario(funcionario) {
  const { acao } = await inquirer.prompt({
    type: 'list',
    name: 'acao',
    message: 'Menu do Funcionário',
    choices: ['Visualizar reservas', 'Alterar status de reserva', 'Sair']});

    if (acao === 'Visualizar reservas') {
        console.table(sistema.reserva);
        await menuFuncionario(funcionario);
    } 
        else if (acao === 'Alterar status de reserva') {
        const { idReserva, novoStatus } = await inquirer.prompt([
            { name: 'idReserva', message: 'ID da reserva:' },
            { name: 'novoStatus', message: 'Novo status:' }
        ]);
        sistema.mudarStatusReserva(parseInt(idReserva), novoStatus);
        console.log("Status atualizado.");
        await menuFuncionario(funcionario);
    }   
        else if (acao === 'Sair') {
        console.log('Saindo...');
        process.exit();
    }
}   
  function verDadosCliente(cliente) {
  console.table({
    ID: cliente.id,
    Nome: cliente.nome,
    Email: cliente.email,
    CPF: cliente.CPF,
    Nascimento: cliente.datadenascimento
  });
}

function verDadosFuncionario(funcionario) {
  console.table(funcionario.usuário);
}


login();
