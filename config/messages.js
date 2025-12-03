const messages = {
    welcome: {
        title: '👋 BEM-VINDO(A)!',
        text: 'Olá {user}! Seja bem-vindo(a) ao grupo *{group}*!\n\n📜 Leia as regras e respeite os membros.\n\n🤖 Use *!menu* para ver meus comandos!'
    },
    
    goodbye: {
        title: '👋 ATÉ LOGO!',
        text: '{user} saiu do grupo. Até mais! 👋'
    },
    
    errors: {
        notOwner: '❌ Apenas o *DONO DO BOT* pode usar este comando!',
        notBotAdmin: '❌ Apenas *ADMINS DO BOT* podem usar este comando!',
        notGroupAdmin: '❌ Apenas *ADMINS DO GRUPO* podem usar este comando!',
        notInGroup: '❌ Este comando só funciona em *GRUPOS*!',
        botNotAdmin: '❌ O bot precisa ser *ADMIN* do grupo para executar esta ação!',
        userNotFound: '❌ Usuário não encontrado! Marque ou mencione alguém.',
        invalidNumber: '❌ Número inválido! Use o formato: 5511999999999',
        commandError: '❌ Erro ao executar o comando. Tente novamente!',
        cooldown: '⏰ Aguarde {time} segundos para usar este comando novamente!'
    },
    
    success: {
        banned: '✅ {user} foi *BANIDO* do grupo!',
        kicked: '✅ {user} foi *REMOVIDO* do grupo!',
        promoted: '✅ {user} foi *PROMOVIDO* a admin!',
        demoted: '✅ {user} foi *REBAIXADO* de admin!',
        muted: '🔇 Grupo *SILENCIADO*! Apenas admins podem falar.',
        unmuted: '🔊 Grupo *ABERTO*! Todos podem falar.',
        antiLinkOn: '🔗 *Anti-link* ATIVADO!',
        antiLinkOff: '🔗 *Anti-link* DESATIVADO!',
        antiFloodOn: '🌊 *Anti-flood* ATIVADO!',
        antiFloodOff: '🌊 *Anti-flood* DESATIVADO!',
        nukeStarted: '💥 *NUKE INICIADO*! Removendo todos os membros...',
        nukeComplete: '💥 *NUKE COMPLETO*! {count} membros removidos.',
        broadcastSent: '📢 Broadcast enviado para {count} grupos!',
        botAdminAdded: '✅ {user} agora é *ADMIN DO BOT*!',
        botAdminRemoved: '✅ {user} não é mais admin do bot!',
        backupComplete: '💾 *BACKUP* realizado com sucesso!'
    },
    
    info: {
        processingCommand: '⏳ Processando comando...',
        waitingQR: '📱 Escaneie o QR Code com seu WhatsApp...',
        connected: '✅ Bot conectado com sucesso!',
        reconnecting: '🔄 Reconectando...',
        disconnected: '❌ Bot desconectado!'
    }
};

module.exports = messages;
