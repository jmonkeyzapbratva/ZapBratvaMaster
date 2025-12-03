const chalk = require('chalk');
const moment = require('moment-timezone');

const timezone = 'America/Sao_Paulo';

const getTime = () => {
    return moment().tz(timezone).format('DD/MM/YYYY HH:mm:ss');
};

const logger = {
    info: (message) => {
        console.log(
            chalk.bgBlue.white(' INFO ') + 
            chalk.gray(` [${getTime()}] `) + 
            chalk.white(message)
        );
    },
    
    success: (message) => {
        console.log(
            chalk.bgGreen.white(' OK ') + 
            chalk.gray(` [${getTime()}] `) + 
            chalk.green(message)
        );
    },
    
    warn: (message) => {
        console.log(
            chalk.bgYellow.black(' WARN ') + 
            chalk.gray(` [${getTime()}] `) + 
            chalk.yellow(message)
        );
    },
    
    error: (message) => {
        console.log(
            chalk.bgRed.white(' ERROR ') + 
            chalk.gray(` [${getTime()}] `) + 
            chalk.red(message)
        );
    },
    
    command: (user, command, group = 'Privado') => {
        console.log(
            chalk.bgMagenta.white(' CMD ') + 
            chalk.gray(` [${getTime()}] `) + 
            chalk.cyan(`${user}`) +
            chalk.white(' usou ') +
            chalk.yellow(`${command}`) +
            chalk.white(' em ') +
            chalk.green(`${group}`)
        );
    },
    
    connection: (status) => {
        const colors = {
            'open': chalk.green,
            'close': chalk.red,
            'connecting': chalk.yellow
        };
        const color = colors[status] || chalk.white;
        console.log(
            chalk.bgCyan.white(' CONN ') + 
            chalk.gray(` [${getTime()}] `) + 
            color(`Status: ${status.toUpperCase()}`)
        );
    },
    
    divider: () => {
        console.log(chalk.gray('═'.repeat(60)));
    },
    
    banner: () => {
        console.log(chalk.cyan(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ██████╗ ██████╗  █████╗ ████████╗██╗   ██╗ █████╗     ║
║   ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║   ██║██╔══██╗    ║
║   ██████╔╝██████╔╝███████║   ██║   ██║   ██║███████║    ║
║   ██╔══██╗██╔══██╗██╔══██║   ██║   ╚██╗ ██╔╝██╔══██║    ║
║   ██████╔╝██║  ██║██║  ██║   ██║    ╚████╔╝ ██║  ██║    ║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝     ╚═══╝  ╚═╝  ╚═╝    ║
║                                                          ║
║              🤖 BOT WHATSAPP PROFISSIONAL 🤖             ║
║                     Versão 2.0.0                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
        `));
    }
};

module.exports = logger;
