const { generateBotCode } = require('./backend/src/utils/codeGenerator.js');

const nodes = [
  { id: 'slashCommand_1', type: 'slashCommand', data: {} },
  { id: 'getUserInfo_1776383037928', type: 'getUserInfo', data: { infoType: 'vc', user: 'slashCommand_1' } },
  { id: 'playMusic_2', type: 'playMusic', data: { channel: 'getUserInfo_1776383037928' } }
];

const edges = [
  { source: 'slashCommand_1', target: 'getUserInfo_1776383037928', sourceHandle: 'interaction', targetHandle: 'user' },
  { source: 'slashCommand_1', target: 'playMusic_2', sourceHandle: 'action', targetHandle: 'action' },
  { source: 'getUserInfo_1776383037928', target: 'playMusic_2', sourceHandle: 'channel', targetHandle: 'channel' }
];

const code = generateBotCode(nodes, edges, 'my-bot');
console.log(code.indexJs);
