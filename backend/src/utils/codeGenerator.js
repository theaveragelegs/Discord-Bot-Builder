/**
 * Code Generator — Traverses the node graph and generates discord.js v14 code.
 * Walks from event nodes (entry points) through connected action/logic/variable nodes.
 */

// Map node types to their code generation templates
const NODE_CODE_MAP = {
  // Events
  'readyEvent': { event: 'clientReady', once: true },
  'messageCreate': { event: 'messageCreate' },
  'reactionAdd': { event: 'messageReactionAdd' },
  'memberJoin': { event: 'guildMemberAdd' },
  'memberLeave': { event: 'guildMemberRemove' },
  'slashCommand': { event: 'interactionCreate', filter: 'slash' },
  'buttonClick': { event: 'interactionCreate', filter: 'button' },
  'modalSubmit': { event: 'interactionCreate', filter: 'modal' },
  'selectMenu': { event: 'interactionCreate', filter: 'selectMenu' },
  'voiceStateUpdate': { event: 'voiceStateUpdate' },
  'guildCreate': { event: 'guildCreate' },
  'channelCreate': { event: 'channelCreate' },
  'messageDelete': { event: 'messageDelete' },
  'interactionCreate': { event: 'interactionCreate' },
};

function getEventParam(eventType) {
  const paramMap = {
    'ready': 'client',
    'messageCreate': 'message',
    'messageReactionAdd': 'reaction, user',
    'guildMemberAdd': 'member',
    'guildMemberRemove': 'member',
    'interactionCreate': 'interaction',
    'voiceStateUpdate': 'oldState, newState',
    'guildCreate': 'guild',
    'channelCreate': 'channel',
    'messageDelete': 'message',
  };
  return paramMap[eventType] || 'args';
}

function rID(id) {
  if (!id) return 'null';
  if (typeof id === 'string' && id.startsWith('!RAW!')) return id.replace('!RAW!', '');
  // Node IDs look like "getUserInfo_17763..."
  if (typeof id === 'string' && /^[a-zA-Z]+_\d/.test(id)) {
    const fixedId = id.replace(/-/g, '_');
    return `res_${fixedId}`;
  }
  return JSON.stringify(id);
}

function resolveValue(val) {
  if (typeof val === 'string' && val.startsWith('!RAW!')) return val.replace('!RAW!', '');
  if (typeof val === 'string' && val.includes('_') && val.split('_').length >= 2 && !val.includes(' ')) {
    return `res_${val.replace(/-/g, '_')}`;
  }
  return JSON.stringify(val !== undefined ? val : '');
}

function getTarget(d, type, fallback, clientPrefix = 'client.') {
  if (type === 'channel' && (d.channelId || d.channel)) return `${clientPrefix}channels.cache.get(${rID(d.channelId || d.channel)})`;
  if (type === 'user' && (d.userId || d.user)) return `${clientPrefix}users.cache.get(${rID(d.userId || d.user)})`;
  if (type === 'guild' && (d.guildId || d.serverId || d.server)) return `${clientPrefix}guilds.cache.get(${rID(d.guildId || d.serverId || d.server)})`;
  if (type === 'member' && (d.userId || d.user || d.member)) {
    const g = (d.guildId || d.serverId || d.server) ? `${clientPrefix}guilds.cache.get(${rID(d.guildId || d.serverId || d.server)})` : 'message.guild';
    return `${g}?.members.cache.get(${rID(d.userId || d.user || d.member)})`;
  }
  return fallback;
}

function generateNodeCode(node, indent = '    ', edgeMap = new Map()) {
  const d = node.data || {};
  const type = node.type;

  // Context-aware fallbacks
  const ctxChannel = '(typeof message !== "undefined" ? message.channel : (typeof interaction !== "undefined" ? interaction.channel : null))';
  const ctxUser = '(typeof message !== "undefined" ? message.author : (typeof interaction !== "undefined" ? interaction.user : null))';
  const ctxGuild = '(typeof message !== "undefined" ? message.guild : (typeof interaction !== "undefined" ? interaction.guild : null))';
  const ctxMember = '(typeof message !== "undefined" ? message.member : (typeof interaction !== "undefined" ? interaction.member : null))';
  const ctxReply = '(typeof interaction !== "undefined" ? interaction : (typeof message !== "undefined" ? message : null))';

  switch (type) {
    // Actions
    case 'sendMessage': {
      const componentsCode = (d.component || d.components) ? `, components: [res_${(d.component || d.components).replace(/-/g, '_')}_row]` : '';
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await ${getTarget(d, 'channel', ctxChannel)}?.send({ content: ${JSON.stringify(d.content || 'Hello!')}${componentsCode} });`;
    }
    case 'sendReply': {
      const componentsCode = (d.component || d.components) ? `, components: [res_${(d.component || d.components).replace(/-/g, '_')}_row]` : '';
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await ${ctxReply}?.reply({ content: ${JSON.stringify(d.content || 'Reply!')}${componentsCode} });`;
    }
    case 'sendEmbed': {
      const componentsCode = (d.component || d.components) ? `, components: [res_${(d.component || d.components).replace(/-/g, '_')}_row]` : '';
      const embedCode = [
        `${indent}const embed = new EmbedBuilder()`,
        (d.authorName || d.authorIcon || d.authorUrl) ? `${indent}  .setAuthor({ name: ${JSON.stringify(d.authorName || '')}, iconURL: ${JSON.stringify(d.authorIcon || undefined)}, url: ${JSON.stringify(d.authorUrl || undefined)} })` : '',
        d.title ? `${indent}  .setTitle(${JSON.stringify(d.title)})` : '',
        d.url ? `${indent}  .setURL(${JSON.stringify(d.url)})` : '',
        d.description ? `${indent}  .setDescription(${JSON.stringify(d.description)})` : '',
        d.color ? `${indent}  .setColor(${JSON.stringify(d.color)})` : `${indent}  .setColor('#5865F2')`,
        (d.footerText || d.footerIcon) ? `${indent}  .setFooter({ text: ${JSON.stringify(d.footerText || '')}, iconURL: ${JSON.stringify(d.footerIcon || undefined)} })` : '',
        d.thumbnail ? `${indent}  .setThumbnail(${JSON.stringify(d.thumbnail)})` : '',
        d.image ? `${indent}  .setImage(${JSON.stringify(d.image)})` : '',
        d.timestamp ? `${indent}  .setTimestamp()` : '',
        `;`,
        `${indent}const res_${node.id.replace(/-/g, '_')} = await ${getTarget(d, 'channel', ctxChannel)}?.send({ embeds: [embed]${componentsCode} });`,
      ].filter(Boolean).join('\n');
      return embedCode;
    }
    case 'editMessage':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.messages.cache.get(${rID(d.messageId)})?.edit(${JSON.stringify(d.content || 'Edited!')});`;
    case 'deleteMessage':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.messages.cache.get(${rID(d.messageId || 'message.id')})?.delete();`;
    case 'addReaction':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.messages.cache.get(${rID(d.messageId || 'message.id')})?.react(${JSON.stringify(d.emoji || '👍')});`;
    case 'clearMessages':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.bulkDelete(${d.count || 10});`;
    case 'pinMessage':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.messages.cache.get(${rID(d.messageId)})?.pin();`;
    case 'unpinMessage':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.messages.cache.get(${rID(d.messageId)})?.unpin();`;
    case 'createInvite':
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await ${getTarget(d, 'channel', ctxChannel)}?.createInvite({ maxAge: ${d.maxAge || 0}, maxUses: ${d.maxUses || 0} });`;
    case 'voiceKick':
      return `${indent}await ${getTarget(d, 'member', ctxMember)}?.voice.disconnect();`;
    case 'voiceMute':
      return `${indent}await ${getTarget(d, 'member', ctxMember)}?.voice.setMute(${d.mute !== false});`;
    case 'setChannelName':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.setName(${JSON.stringify(d.name || 'new-name')});`;
    case 'lockChannel':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.permissionOverwrites.edit(${ctxGuild}.id, { SendMessages: false });`;
    case 'unlockChannel':
      return `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.permissionOverwrites.edit(${ctxGuild}.id, { SendMessages: null });`;
    case 'createRole':
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await ${getTarget(d, 'guild', ctxGuild)}?.roles.create({ name: ${JSON.stringify(d.name || 'New Role')}, color: ${JSON.stringify(d.color || '#99aab5')}, mentionable: ${d.mentionable || false}, hoist: ${d.hoist || false}, permissions: ${d.admin ? '[PermissionFlagsBits.Administrator]' : '[]'} });`;
    case 'deleteRole':
      return `${indent}await ${getTarget(d, 'guild', ctxGuild)}?.roles.cache.get(${rID(d.roleId)})?.delete();`;
    case 'setServerName':
      return `${indent}await ${getTarget(d, 'guild', ctxGuild)}?.setName(${JSON.stringify(d.name || 'New Name')});`;
    case 'findServer': {
      const searchVal = d.search_value ? rID(d.search_value) : JSON.stringify(d.searchValue || '');
      const findBy = d.findBy || 'id';
      let findCode = '';
      if (findBy === 'id') findCode = `client.guilds.cache.get(${searchVal})`;
      else if (findBy === 'name') findCode = `client.guilds.cache.find(g => g.name === ${searchVal})`;
      else if (findBy === 'name_acronym') findCode = `client.guilds.cache.find(g => g.nameAcronym === ${searchVal})`;
      else if (findBy === 'owner') findCode = `client.guilds.cache.find(g => g.ownerId === ${searchVal})`;
      return `${indent}const res_${node.id.replace(/-/g, '_')} = ${findCode};`;
    }
    case 'findChannel': {
      const searchVal = d.search_value ? rID(d.search_value) : JSON.stringify(d.searchValue || '');
      const findBy = d.findBy || 'id';
      const cType = d.channelType || 'any';

      let typeFilter = '';
      if (cType === 'text') typeFilter = ' && c.type === 0';
      else if (cType === 'voice') typeFilter = ' && c.type === 2';
      else if (cType === 'category') typeFilter = ' && c.type === 4';
      else if (cType === 'forum') typeFilter = ' && c.type === 15';

      let guildSource = getTarget(d, 'guild', 'null');
      if (guildSource === 'null' || !guildSource) guildSource = 'client';

      let findCode = '';
      if (findBy === 'id') {
        findCode = `${guildSource}.channels.cache.get(${searchVal})`;
      } else if (findBy === 'name') {
        findCode = `${guildSource}.channels.cache.find(c => c.name === ${searchVal}${typeFilter})`;
      } else if (findBy === 'topic') {
        findCode = `${guildSource}.channels.cache.find(c => c.topic === ${searchVal}${typeFilter})`;
      } else {
        findCode = `${guildSource}.channels.cache.get(${searchVal})`;
      }
      return `${indent}const res_${node.id.replace(/-/g, '_')} = ${findCode};`;
    }
    case 'getServerInfo': {
      const prop = d.serverInfo || 'id';
      let valCode = `${getTarget(d, 'guild', ctxGuild)}?.${prop}`;
      if (prop === 'iconURL') valCode = `${getTarget(d, 'guild', ctxGuild)}?.iconURL()`;
      return `${indent}const res_${node.id.replace(/-/g, '_')} = ${valCode};`;
    }
    case 'createButton': {
      const isComponent = (edgeMap.get(node.id) || []).some(c => c.sourceHandle === 'component' || c.sourceHandle === 'components');
      const buttons = d.buttons || [{ customId: 'btn_1', label: 'Click Me', style: 'Primary' }];
      const buttonCode = buttons.map(btn => {
        return [
          `${indent}    new ButtonBuilder()`,
          `${indent}      .setCustomId(${JSON.stringify(btn.customId || 'btn_1')})`,
          `${indent}      .setLabel(${JSON.stringify(btn.label || 'Click Me')})`,
          `${indent}      .setStyle(ButtonStyle.${btn.style || 'Primary'})`,
          btn.emoji ? `${indent}      .setEmoji(${JSON.stringify(btn.emoji)})` : '',
          btn.style === 'Link' && btn.url ? `${indent}      .setURL(${JSON.stringify(btn.url)})` : '',
        ].filter(Boolean).join('\n');
      }).join(',\n');

      return [
        `${indent}const res_${node.id.replace(/-/g, '_')}_row = new ActionRowBuilder()`,
        `${indent}  .addComponents(`,
        buttonCode,
        `${indent}  );`,
        isComponent ? '' : `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.send({ content: ${JSON.stringify(d.content || 'Click the button!')}, components: [res_${node.id.replace(/-/g, '_')}_row] });`,
      ].filter(Boolean).join('\n');
    }
    case 'createSelectMenu': {
      const isComponent = (edgeMap.get(node.id) || []).some(c => c.sourceHandle === 'component' || c.sourceHandle === 'components');
      return [
        `${indent}const res_${node.id.replace(/-/g, '_')}_row = new ActionRowBuilder()`,
        `${indent}  .addComponents(`,
        `${indent}    new StringSelectMenuBuilder()`,
        `${indent}      .setCustomId(${JSON.stringify(d.customId || 'select_1')})`,
        `${indent}      .setPlaceholder(${JSON.stringify(d.placeholder || 'Select an option')})`,
        `${indent}      .addOptions(${JSON.stringify(d.options || [{ label: 'Option 1', value: 'opt1' }])})`,
        `${indent}  );`,
        isComponent ? '' : `${indent}await ${getTarget(d, 'channel', ctxChannel)}?.send({ components: [res_${node.id.replace(/-/g, '_')}_row] });`,
      ].filter(Boolean).join('\n');
    }
    case 'showModal': {
      const inputs = d.modalInputs || [{ customId: 'input_1', label: 'Enter text', type: 'TextInput', style: 'Short', placeholder: '', required: true }];
      const componentsCode = [];

      inputs.forEach((input, i) => {
        const type = input.type || 'TextInput';
        const customIdStr = JSON.stringify(input.customId || `input_${i + 1}`);
        const placeholderStr = input.placeholder ? `.setPlaceholder(${JSON.stringify(input.placeholder)})` : '';

        let builderCode = '';

        if (type === 'TextInput') {
          const style = input.style || 'Short';
          const labelStr = JSON.stringify(input.label || `Field ${i + 1}`);
          const requiredStr = input.required !== false ? '.setRequired(true)' : '.setRequired(false)';
          builderCode = [
            `${indent}    new TextInputBuilder()`,
            `${indent}      .setCustomId(${customIdStr})`,
            `${indent}      .setLabel(${labelStr})`,
            `${indent}      .setStyle(TextInputStyle.${style})`,
            placeholderStr ? `${indent}      ${placeholderStr}` : '',
            `${indent}      ${requiredStr}`
          ].filter(Boolean).join('\n');
        } else if (type === 'StringSelect') {
          const rawOpts = (input.optionsText || '').split(',').map(s => s.trim()).filter(Boolean);
          const optionsArray = rawOpts.length > 0 ? rawOpts.map(o => ({ label: o, value: o })) : [{ label: 'Option 1', value: 'opt1' }];
          builderCode = [
            `${indent}    new StringSelectMenuBuilder()`,
            `${indent}      .setCustomId(${customIdStr})`,
            placeholderStr ? `${indent}      ${placeholderStr}` : '',
            `${indent}      .addOptions(${JSON.stringify(optionsArray)})`
          ].filter(Boolean).join('\n');
        } else if (type === 'UserSelect') {
          builderCode = `${indent}    new UserSelectMenuBuilder().setCustomId(${customIdStr})${placeholderStr ? `\n${indent}      ${placeholderStr}` : ''}`;
        } else if (type === 'RoleSelect') {
          builderCode = `${indent}    new RoleSelectMenuBuilder().setCustomId(${customIdStr})${placeholderStr ? `\n${indent}      ${placeholderStr}` : ''}`;
        } else if (type === 'MentionableSelect') {
          builderCode = `${indent}    new MentionableSelectMenuBuilder().setCustomId(${customIdStr})${placeholderStr ? `\n${indent}      ${placeholderStr}` : ''}`;
        } else if (type === 'ChannelSelect') {
          builderCode = `${indent}    new ChannelSelectMenuBuilder().setCustomId(${customIdStr})${placeholderStr ? `\n${indent}      ${placeholderStr}` : ''}`;
        }

        if (builderCode) {
          componentsCode.push(
            `${indent}  new ActionRowBuilder().addComponents(\n${builderCode}\n${indent}  )`
          );
        }
      });

      return [
        `${indent}const modal = new ModalBuilder()`,
        `${indent}  .setCustomId(${JSON.stringify(d.customId || 'modal_1')})`,
        `${indent}  .setTitle(${JSON.stringify(d.title || 'Modal')});`,
        componentsCode.length > 0 ? `${indent}modal.addComponents(\n${componentsCode.join(',\n')}\n${indent});` : '',
        `${indent}await interaction.showModal(modal);`,
      ].filter(Boolean).join('\n');
    }
    case 'getInteractionOption': {
      const type = d.get || 'Text';
      // If optionName is a literal string, use it directly. If it's a node reference, resolve it.
      let nameStr;
      if (d.name && /^[a-zA-Z]+_\d/.test(d.name)) {
        nameStr = `res_${d.name.replace(/-/g, '_')}`; // wired node
      } else if (d.name) {
        nameStr = JSON.stringify(d.name); // literal string set in block settings
      } else {
        nameStr = JSON.stringify(d.optionName || 'argument');
      }
      let method = 'getString';
      if (type === 'Channel') method = 'getChannel';
      else if (type === 'User') method = 'getUser';
      else if (type === 'Member') method = 'getMember';
      else if (type === 'Role') method = 'getRole';
      else if (type === 'Number') method = 'getNumber';
      else if (type === 'Attachment') method = 'getAttachment';
      else if (type === 'Mentionable') method = 'getMentionable';
      else if (type === 'Boolean') method = 'getBoolean';
      else if (type === 'Message') method = 'getMessage';
      else if (type === 'Integer') method = 'getInteger';

      let fetchCode = `interaction.options.${method}(${nameStr}, false)`;
      if (type === 'Sub Command Group') fetchCode = `interaction.options.getSubcommandGroup(false)`;
      else if (type === 'Sub Command') fetchCode = `interaction.options.getSubcommand(false)`;
      else if (type === 'Custom ID') fetchCode = `interaction.customId`;
      else if (type === 'Anything') fetchCode = `interaction.options.get(${nameStr}, false)?.value ?? null`;
      else if (type === 'Anything_Raw') fetchCode = `interaction.options.get(${nameStr}, false) ?? null`;

      return `${indent}const res_${node.id.replace(/-/g, '_')} = (typeof interaction !== 'undefined' && interaction?.options) ? ${fetchCode} : null;`;
    }
    case 'getUserInfo': {
      const targetUser = d.user ? rID(d.user) : '(interaction?.member || message?.member || interaction?.user || message?.author)';
      const type = d.infoType || 'id';

      if (type === 'vc') {
        return `${indent}const res_${node.id.replace(/-/g, '_')} = ${targetUser}?.voice?.channel;`;
      }

      let fetchCode = targetUser;
      if (type === 'id') fetchCode = `${targetUser}?.id`;
      else if (type === 'username') fetchCode = `${targetUser}?.user?.username || ${targetUser}?.username`;
      else if (type === 'avatar') fetchCode = `${targetUser}?.user?.displayAvatarURL?.() || ${targetUser}?.displayAvatarURL?.()`;
      else if (type === 'bot') fetchCode = `${targetUser}?.user?.bot || ${targetUser}?.bot || false`;

      return `${indent}const res_${node.id.replace(/-/g, '_')} = ${fetchCode};`;
    }
    case 'getModalFieldValue': {
      const type = d.type || 'textinput';
      const nameStr = d.customid ? rID(d.customid) : JSON.stringify(d.customid || 'custom_id');

      let fetchCode = `interaction.fields.getTextInputValue(${nameStr})`;
      if (type === 'selectmenu') fetchCode = `interaction.fields.getStringSelectValues(${nameStr})`;
      else if (type === 'fileupload') fetchCode = `interaction.fields.getUploadedFiles(${nameStr}, false)?.toJSON()`;
      else if (type === 'userselect') fetchCode = `interaction.fields.getSelectedUsers(${nameStr}, false)?.toJSON()`;
      else if (type === 'roleselect') fetchCode = `interaction.fields.getSelectedRoles(${nameStr}, false)?.toJSON()`;
      else if (type === 'mentionableselect') fetchCode = `interaction.fields.getSelectedMentionables(${nameStr}, false)`;
      else if (type === 'channelselect') fetchCode = `interaction.fields.getSelectedChannels(${nameStr}, false)?.toJSON()`;

      return `${indent}const res_${node.id.replace(/-/g, '_')} = typeof interaction !== 'undefined' && interaction.fields ? ${fetchCode} : null;`;
    }
    case 'banMember':
      return `${indent}await ${getTarget(d, 'member', ctxMember)}?.ban({ reason: ${JSON.stringify(d.reason || 'Banned by bot')} });`;
    case 'kickMember':
      return `${indent}await ${getTarget(d, 'member', ctxMember)}?.kick(${JSON.stringify(d.reason || 'Kicked by bot')});`;
    case 'timeoutMember':
      return `${indent}await ${getTarget(d, 'member', ctxMember)}?.timeout(${d.duration || 60000}, ${JSON.stringify(d.reason || 'Timed out by bot')});`;
    case 'addRole':
      return `${indent}await ${getTarget(d, 'member', ctxMember)}?.roles.add(${JSON.stringify(d.roleId || 'ROLE_ID')});`;
    case 'removeRole':
      return `${indent}await ${getTarget(d, 'member', ctxMember)}?.roles.remove(${JSON.stringify(d.roleId || 'ROLE_ID')});`;
    case 'createChannel':
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await ${getTarget(d, 'guild', ctxGuild)}?.channels.create({ name: ${JSON.stringify(d.name || 'new-channel')}, type: ChannelType.${d.channelType || 'GuildText'}, topic: ${JSON.stringify(d.topic || '')}, parent: ${rID(d.categoryId) !== '""' ? rID(d.categoryId) : 'null'}, nsfw: ${d.nsfw || false} });`;
    case 'deleteChannel':
      return `${indent}await message.guild.channels.cache.get(${rID(d.channelId || 'CHANNEL_ID')})?.delete();`;
    case 'createSlashCommand':
      return ''; // Handled automatically on client ready
    case 'createThread':
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await message.startThread({ name: ${JSON.stringify(d.name || 'New Thread')}, autoArchiveDuration: ${d.archiveDuration || 60} });`;
    case 'sendWebhook':
      return [
        `${indent}const webhook = new WebhookClient({ url: ${JSON.stringify(d.webhookUrl || 'WEBHOOK_URL')} });`,
        `${indent}await webhook.send({ content: ${JSON.stringify(d.content || 'Webhook message')}, username: ${JSON.stringify(d.username || 'Bot')} });`,
      ].join('\n');
    case 'setNickname':
      return `${indent}await ${d.memberVar || 'message.member'}.setNickname(${JSON.stringify(d.nickname || 'New Nick')});`;
    case 'setStatus':
      return `${indent}client.user.setPresence({ activities: [{ name: ${JSON.stringify(d.text || 'a game')}, type: ActivityType.${d.activityType || 'Playing'} }], status: ${JSON.stringify(d.status || 'online')} });`;
    case 'sendDM':
      return `${indent}await ${d.userVar || 'message.author'}.send(${JSON.stringify(d.content || 'Hello via DM!')});`;
    case 'slashReply': {
      const replyFlags = d.ephemeral ? `, flags: ['Ephemeral']` : '';
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await interaction.reply({ content: ${JSON.stringify(d.content || 'Command executed!')}${replyFlags} });`;
    }

    // Logic
    case 'ifElse':
      return `${indent}if (${d.condition || 'true'}) {`;
    case 'equals':
      return `${indent}if (${resolveValue(d.valueA)} === ${resolveValue(d.valueB)}) {`;
    case 'switchNode':
      return `${indent}switch (${d.expression || 'value'}) {`;
    case 'compare':
      return `${indent}const compareResult = ${resolveValue(d.valueA)} ${d.operator || '==='} ${resolveValue(d.valueB)};`;
    case 'andGate':
      return `${indent}const andResult = (${d.conditionA || 'true'}) && (${d.conditionB || 'true'});`;
    case 'orGate':
      return `${indent}const orResult = (${d.conditionA || 'true'}) || (${d.conditionB || 'true'});`;
    case 'notGate':
      return `${indent}const notResult = !(${d.condition || 'true'});`;
    case 'cooldown':
      return [
        `${indent}const cooldowns = new Map();`,
        `${indent}const now = Date.now();`,
        `${indent}const cooldownAmount = ${d.duration || 5} * 1000;`,
        `${indent}if (cooldowns.has(message.author.id)) {`,
        `${indent}  const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;`,
        `${indent}  if (now < expirationTime) return;`,
        `${indent}}`,
        `${indent}cooldowns.set(message.author.id, now);`,
      ].join('\n');
    case 'timer':
      return `${indent}setTimeout(async () => {`;
    case 'loop':
      return `${indent}for (let i = 0; i < ${d.count || 5}; i++) {`;
    case 'breakNode':
      return `${indent}break;`;
    case 'tryCatch':
      return `${indent}try {`;
    case 'existsCheck':
      return `${indent}if (${d.variable || 'value'} !== undefined && ${d.variable || 'value'} !== null) {`;

    // Variables
    case 'setGlobalVar':
      return `${indent}globalVars.set(${JSON.stringify(d.key || 'myVar')}, ${d.value || "'value'"});`;
    case 'getGlobalVar':
      return `${indent}const ${d.varName || 'myVar'} = globalVars.get(${JSON.stringify(d.key || 'myVar')});`;
    case 'setGuildVar':
      return `${indent}guildVars.set(\`\${${ctxGuild}?.id}_${d.key || 'myVar'}\`, ${d.value || "'value'"});`;
    case 'getGuildVar':
      return `${indent}const ${d.varName || 'myVar'} = guildVars.get(\`\${${ctxGuild}?.id}_${d.key || 'myVar'}\`);`;
    case 'setUserVar':
      return `${indent}userVars.set(\`\${${ctxUser}?.id}_${d.key || 'myVar'}\`, ${d.value || "'value'"});`;
    case 'getUserVar':
      return `${indent}const ${d.varName || 'myVar'} = userVars.get(\`\${${ctxUser}?.id}_${d.key || 'myVar'}\`);`;
    case 'setChannelVar':
      return `${indent}channelVars.set(\`\${${ctxChannel}?.id}_${d.key || 'myVar'}\`, ${d.value || "'value'"});`;
    case 'getChannelVar':
      return `${indent}const ${d.varName || 'myVar'} = channelVars.get(\`\${${ctxChannel}?.id}_${d.key || 'myVar'}\`);`;
    case 'setTempVar':
      return `${indent}let ${d.varName || 'tempVar'} = ${d.value || "'value'"};`;
    case 'getTempVar':
      return `${indent}// Using temp variable: ${d.varName || 'tempVar'}`;

    // Discord Advanced
    case 'automodRule':
      return [
        `${indent}await message.guild.autoModerationRules.create({`,
        `${indent}  name: ${JSON.stringify(d.name || 'Auto Mod Rule')},`,
        `${indent}  creatorId: client.user.id,`,
        `${indent}  eventType: AutoModerationRuleEventType.MessageSend,`,
        `${indent}  triggerType: AutoModerationRuleTriggerType.${d.triggerType || 'Keyword'},`,
        `${indent}  triggerMetadata: { keywordFilter: ${JSON.stringify(d.keywords || ['badword'])} },`,
        `${indent}  actions: [{ type: AutoModerationActionType.BlockMessage }],`,
        `${indent}});`,
      ].join('\n');
    case 'leveling':
      return [
        `${indent}// Leveling system`,
        `${indent}const xp = userVars.get(\`\${message.author.id}_xp\`) || 0;`,
        `${indent}const newXp = xp + Math.floor(Math.random() * ${d.maxXp || 25}) + ${d.minXp || 15};`,
        `${indent}const level = Math.floor(newXp / ${d.xpPerLevel || 100});`,
        `${indent}userVars.set(\`\${message.author.id}_xp\`, newXp);`,
        `${indent}userVars.set(\`\${message.author.id}_level\`, level);`,
      ].join('\n');
    case 'economy':
      return [
        `${indent}// Economy system`,
        `${indent}const balance = userVars.get(\`\${message.author.id}_balance\`) || ${d.startingBalance || 0};`,
        `${indent}userVars.set(\`\${message.author.id}_balance\`, balance + ${d.amount || 0});`,
      ].join('\n');
    case 'ticketCreate':
      return [
        `${indent}const ticketChannel = await message.guild.channels.create({`,
        `${indent}  name: \`ticket-\${message.author.username}\`,`,
        `${indent}  type: ChannelType.GuildText,`,
        `${indent}  permissionOverwrites: [`,
        `${indent}    { id: message.guild.id, deny: [PermissionFlagsBits.ViewChannel] },`,
        `${indent}    { id: message.author.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },`,
        `${indent}  ],`,
        `${indent}});`,
        `${indent}await ticketChannel.send('Ticket created! Support will be with you shortly.');`,
      ].join('\n');
    case 'ticketClose':
      return [
        `${indent}if (message.channel.name.startsWith('ticket-')) {`,
        `${indent}  await message.channel.send('This ticket will be closed in 5 seconds...');`,
        `${indent}  setTimeout(() => message.channel.delete().catch(() => {}), 5000);`,
        `${indent}}`,
      ].join('\n');
    case 'reactionRole':
      return [
        `${indent}// Reaction Role setup`,
        `${indent}const roleMsg = await message.channel.send(${JSON.stringify(d.content || 'React to get a role!')});`,
        `${indent}await roleMsg.react(${JSON.stringify(d.emoji || '⭐')});`,
        `${indent}// Note: Requires messageReactionAdd event handler to assign roles`,
      ].join('\n');
    case 'pollCreate':
      return [
        `${indent}const pollEmbed = new EmbedBuilder()`,
        `${indent}  .setTitle(${JSON.stringify(d.question || 'Poll Question')})`,
        `${indent}  .setDescription(${JSON.stringify(d.options?.map((o, i) => `${['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]} ${o}`).join('\\n') || '1️⃣ Yes\\n2️⃣ No')})`,
        `${indent}  .setColor('#5865F2');`,
        `${indent}const pollMsg = await message.channel.send({ embeds: [pollEmbed] });`,
        ...(d.options || ['Yes', 'No']).map((_, i) => `${indent}await pollMsg.react('${['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'][i]}');`),
      ].join('\n');
    case 'stickerSend':
      return `${indent}await message.channel.send({ stickers: [${JSON.stringify(d.stickerId || 'STICKER_ID')}] });`;
    case 'auditLog':
      return [
        `${indent}const auditLogs = await message.guild.fetchAuditLogs({ limit: ${d.limit || 5} });`,
        `${indent}const logs = auditLogs.entries.map(e => \`\${e.action}: \${e.executor?.tag} → \${e.target?.tag || e.target?.name}\`);`,
      ].join('\n');
    case 'aiResponse':
      return [
        `${indent}// AI Response placeholder — requires external API (OpenAI, etc.)`,
        `${indent}// const response = await fetch('YOUR_AI_API', { method: 'POST', body: JSON.stringify({ prompt: message.content }) });`,
        `${indent}// const data = await response.json();`,
        `${indent}// await message.reply(data.message);`,
      ].join('\n');

    // Utilities
    case 'mathOp':
      return `${indent}const mathResult = ${d.expression || '1 + 1'};`;
    case 'textOp':
      return `${indent}const textResult = ${d.input || "'hello'"}.${d.operation || 'toUpperCase'}();`;
    case 'arrayOp':
      return `${indent}const arr = ${d.array || '[]'}; // Array operation: ${d.operation || 'push'}`;
    case 'jsonParse':
      return `${indent}const jsonData = JSON.parse(${d.input || "'{}'"});`;
    case 'httpRequest':
      return [
        `${indent}const httpResponse = await fetch(${JSON.stringify(d.url || 'https://api.example.com')}, {`,
        `${indent}  method: ${JSON.stringify(d.method || 'GET')},`,
        d.body ? `${indent}  body: JSON.stringify(${d.body}),` : '',
        d.headers ? `${indent}  headers: ${JSON.stringify(d.headers)},` : '',
        `${indent}});`,
        `${indent}const httpData = await httpResponse.json();`,
      ].filter(Boolean).join('\n');
    case 'randomOp':
      return `${indent}const randomResult = Math.floor(Math.random() * (${d.max || 100} - ${d.min || 0} + 1)) + ${d.min || 0};`;
    case 'delay':
      return `${indent}await new Promise(resolve => setTimeout(resolve, ${d.duration || 1000}));`;
    case 'dateTime':
      return `${indent}const dateResult = new Date().toLocaleString(${JSON.stringify(d.locale || 'en-US')});`;
    case 'logNode': {
      const logMsg = d.message ? JSON.stringify(d.message) : "'[Bot Log]'";
      return [
        `${indent}{ const _logMsg = ${logMsg};`,
        `${indent}  if (typeof interaction !== 'undefined' && interaction && !interaction.replied && !interaction.deferred) await interaction.reply({ content: String(_logMsg).slice(0,2000), flags: ['Ephemeral'] });`,
        `${indent}  else if (typeof interaction !== 'undefined' && interaction?.replied) await interaction.followUp({ content: String(_logMsg).slice(0,2000), flags: ['Ephemeral'] });`,
        `${indent}  else if (typeof message !== 'undefined' && message) await message.reply(String(_logMsg).slice(0,2000));`,
        `${indent}  else console.log('[Bot Log]', _logMsg); }`,
      ].join('\n');
    }
    case 'customJs':
      return `${indent}${d.code || '// Custom JavaScript code'}`;
    case 'regexOp':
      return `${indent}const regexMatch = ${d.input || "'text'"}.match(/${d.pattern || '\\w+'}/g${d.flags || ''});`;
    case 'formatString':
      return `${indent}const formatted = \`${d.template || '${value}'}\`;`;

    // ─── Music ───
    case 'playMusic': {
      const queryVal = resolveValue(d.query);
      const vcSource = d.channel ? `res_${d.channel.replace(/-/g, '_')}` : '(interaction?.member?.voice?.channel || message?.member?.voice?.channel)';
      return [
        `${indent}// Play music using discord-player`,
        `${indent}{ // music block scope`,
        `${indent}  const _voiceChannel = ${vcSource};`,
        `${indent}  if (!_voiceChannel) {`,
        `${indent}    if (interaction && !interaction.replied && !interaction.deferred) await interaction.reply({ content: '🔇 You must be in a voice channel!', flags: ['Ephemeral'] });`,
        `${indent}    else if (typeof message !== 'undefined' && message) await message.reply('🔇 You must be in a voice channel!');`,
        `${indent}  } else {`,
        `${indent}    // Defer first to avoid double-reply & interaction timeout`,
        `${indent}    if (interaction && !interaction.replied && !interaction.deferred) await interaction.deferReply();`,
        `${indent}    try {`,
        `${indent}      const _query = ${queryVal || "''"};`,
        `${indent}      const { track } = await player.play(_voiceChannel, _query, {`,
        `${indent}        nodeOptions: {`,
        `${indent}          metadata: { channel: interaction?.channel || message?.channel },`,
        `${indent}          onBeforeCreateStream: globalOnBeforeCreateStream`,
        `${indent}        }`,
        `${indent}      });`,
        `${indent}      const _queuedMsg = \`⏳ Added to queue: **\${track.title}**\`;`,
        `${indent}      if (interaction?.deferred && !interaction.replied) await interaction.editReply(_queuedMsg);`,
        `${indent}      else if (interaction?.replied) await interaction.followUp(_queuedMsg);`,
        `${indent}      else if (interaction) await interaction.reply(_queuedMsg);`,
        `${indent}      else if (typeof message !== 'undefined' && message) await message.reply(_queuedMsg);`,
        `${indent}    } catch(e) {`,
        `${indent}      console.error('[Bot Builder Music Error]', e);`,
        `${indent}      const _rawErr = (e?.message || String(e)).slice(0, 1900);`,
        `${indent}      const _errMsg = '❌ Could not play: ' + _rawErr;`,
        `${indent}      if (interaction?.deferred && !interaction.replied) await interaction.editReply({ content: _errMsg });`,
        `${indent}      else if (interaction?.replied) await interaction.followUp({ content: _errMsg });`,
        `${indent}      else if (interaction) await interaction.reply({ content: _errMsg, flags: ['Ephemeral'] });`,
        `${indent}      else if (typeof message !== 'undefined' && message) await message.reply(_errMsg);`,
        `${indent}    }`,
        `${indent}  }`,
        `${indent}}`,
      ].join('\n');
    }
    case 'stopMusic': {
      const stopGuildId = d.channel ? `res_${d.channel.replace(/-/g, '_')}?.guild?.id || res_${d.channel.replace(/-/g, '_')}?.id` : '(interaction?.guildId || message?.guild?.id)';
      return [
        `${indent}{ const _stopQueue = player.nodes.get(${stopGuildId});`,
        `${indent}  if (_stopQueue) { _stopQueue.delete(); await (interaction?.deferred || interaction?.replied ? interaction.editReply('⏹️ Stopped.') : (interaction ? interaction.reply('⏹️ Stopped.') : message?.reply('⏹️ Stopped.'))); }`,
        `${indent}  else { await (interaction?.deferred || interaction?.replied ? interaction.editReply('Nothing is playing.') : (interaction ? interaction.reply('Nothing is playing.') : message?.reply('Nothing is playing.'))); } }`,
      ].join('\n');
    }
    case 'skipMusic': {
      const skipGuildId = d.channel ? `res_${d.channel.replace(/-/g, '_')}?.guild?.id || res_${d.channel.replace(/-/g, '_')}?.id` : '(interaction?.guildId || message?.guild?.id)';
      return [
        `${indent}{ const _skipQueue = player.nodes.get(${skipGuildId});`,
        `${indent}  if (_skipQueue) { _skipQueue.node.skip(); await (interaction?.deferred || interaction?.replied ? interaction.editReply('⏭️ Skipped!') : (interaction ? interaction.reply('⏭️ Skipped!') : message?.reply('⏭️ Skipped!'))); }`,
        `${indent}  else { await (interaction?.deferred || interaction?.replied ? interaction.editReply('Nothing is playing.') : (interaction ? interaction.reply('Nothing is playing.') : message?.reply('Nothing is playing.'))); } }`,
      ].join('\n');
    }

    // ─── Data-only nodes (no action input, just output a value) ───
    case 'textLiteral':
      return `${indent}const res_${node.id.replace(/-/g, '_')} = ${JSON.stringify(d.value || '')};`;

    // ─── Missing action nodes ───
    case 'createCategory':
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await ${getTarget(d, 'guild', ctxGuild)}?.channels.create({ name: ${JSON.stringify(d.name || 'New Category')}, type: ChannelType.GuildCategory });`;
    case 'fetchUser':
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await client.users.fetch(${rID(d.userId || 'USER_ID')});`;
    case 'fetchMessage': {
      const chanTarget = d.channel ? `client.channels.cache.get(${rID(d.channel)})` : getTarget(d, 'channel', ctxChannel);
      return `${indent}const res_${node.id.replace(/-/g, '_')} = await ${chanTarget}?.messages.fetch(${rID(d.messageId || 'MESSAGE_ID')});`;
    }

    // ─── Event nodes (entry points, no code to generate) ───
    case 'readyEvent':
    case 'messageCreate':
    case 'reactionAdd':
    case 'memberJoin':
    case 'memberLeave':
    case 'slashCommand':
    case 'buttonClick':
    case 'modalSubmit':
    case 'selectMenu':
    case 'voiceStateUpdate':
    case 'guildCreate':
    case 'channelCreate':
    case 'messageDelete':
    case 'interactionCreate':
      return ''; // Event nodes are handled as entry points, no inline code needed

    default:
      return `${indent}console.log('[Bot Builder Warning] Unimplemented node type: ${type}');`;
  }
}

function buildEdgeMap(edges) {
  const map = new Map();
  for (const edge of edges) {
    if (!map.has(edge.source)) map.set(edge.source, []);
    map.get(edge.source).push({ target: edge.target, sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle });
  }
  return map;
}

function resolveIncomingEdges(targetNode, incomingEdges, nodeMap) {
  if (!targetNode.data) targetNode.data = {};
  for (const conn of incomingEdges) {
    if (conn.targetHandle) {
      const srcNode = nodeMap.get(conn.source);
      if (srcNode && (srcNode.type === 'slashCommand' || srcNode.type === 'interactionCreate')) {
        if (conn.sourceHandle === 'interaction') targetNode.data[conn.targetHandle] = '!RAW!interaction';
        else if (conn.sourceHandle === 'user') targetNode.data[conn.targetHandle] = '!RAW!(interaction.member || interaction.user)';
        else if (conn.sourceHandle === 'member') targetNode.data[conn.targetHandle] = '!RAW!interaction.member';
        else if (conn.sourceHandle === 'server') targetNode.data[conn.targetHandle] = '!RAW!interaction.guild';
        else if (conn.sourceHandle === 'channel') targetNode.data[conn.targetHandle] = '!RAW!interaction.channel';
        else targetNode.data[conn.targetHandle] = conn.source;
      } else if (srcNode && srcNode.type === 'messageCreate') {
        if (conn.sourceHandle === 'message') targetNode.data[conn.targetHandle] = '!RAW!message';
        else if (conn.sourceHandle === 'user' || conn.sourceHandle === 'author') targetNode.data[conn.targetHandle] = '!RAW!message.author';
        else if (conn.sourceHandle === 'member') targetNode.data[conn.targetHandle] = '!RAW!message.member';
        else if (conn.sourceHandle === 'server') targetNode.data[conn.targetHandle] = '!RAW!message.guild';
        else if (conn.sourceHandle === 'channel') targetNode.data[conn.targetHandle] = '!RAW!message.channel';
        else targetNode.data[conn.targetHandle] = conn.source;
      } else {
        targetNode.data[conn.targetHandle] = conn.source;
      }
    }
  }
}

function walkGraph(startNodeId, nodeMap, edgeMap, incomingEdgeMap, indent = '    ', visited = new Set()) {
  if (visited.has(startNodeId)) return '';
  visited.add(startNodeId);

  const node = nodeMap.get(startNodeId);
  if (!node) return '';

  // Inject incoming dependencies into node.data so parameter lookup finds them automatically
  const incoming = incomingEdgeMap.get(node.id) || [];
  resolveIncomingEdges(node, incoming, nodeMap);

  // Pre-generate code for any connected data-only nodes
  let dataCode = '';
  for (const conn of incoming) {
    if (conn.targetHandle && conn.targetHandle !== 'action' && conn.targetHandle !== 'components') {
      const srcId = conn.source;
      if (!visited.has(srcId)) {
        // Evaluate data dependencies first
        const buildDataCode = (id) => {
          if (visited.has(id)) return '';
          visited.add(id);

          const srcNode = nodeMap.get(id);
          if (!srcNode) return '';

          const srcIncoming = incomingEdgeMap.get(id) || [];
          resolveIncomingEdges(srcNode, srcIncoming, nodeMap);

          let nestedCode = '';
          for (const c of srcIncoming) {
            if (c.targetHandle && c.targetHandle !== 'action' && c.targetHandle !== 'components') {
              nestedCode += buildDataCode(c.source);
            }
          }

          return nestedCode + generateNodeCode(srcNode, indent, edgeMap) + '\n';
        };

        dataCode += buildDataCode(srcId);
      }
    }
  }

  let blockDebugCode = '';
  if (!['readyEvent', 'messageCreate', 'slashCommand', 'interactionCreate', 'reactionAdd', 'memberJoin', 'memberLeave', 'voiceStateUpdate'].includes(node.type)) {
    blockDebugCode = `\n${indent}debugLog('[Executing Block]', '${node.type} (${node.id})');\n`;
  }
  let code = dataCode + blockDebugCode + generateNodeCode(node, indent, edgeMap);
  const connections = edgeMap.get(startNodeId) || [];

  // Handle branching nodes
  const isVCCheck = node.type === 'getUserInfo' && node.data?.infoType === 'vc';
  const needsCloseBrace = ['ifElse', 'loop', 'tryCatch', 'existsCheck', 'timer', 'equals'].includes(node.type) || isVCCheck;

  // Walk child nodes
  if (node.type === 'ifElse' || node.type === 'equals' || isVCCheck) {
    const trueBranch = connections.find(c => c.sourceHandle === 'true' || c.sourceHandle === 'output-true');
    const falseBranch = connections.find(c => c.sourceHandle === 'false' || c.sourceHandle === 'output-false');

    if (isVCCheck) {
      code += `\n${indent}if (res_${node.id.replace(/-/g, '_')}) {`;
    }

    if (trueBranch) {
      code += '\n' + walkGraph(trueBranch.target, nodeMap, edgeMap, incomingEdgeMap, indent + '  ', visited);
    }
    code += `\n${indent}} else {`;
    if (falseBranch) {
      code += '\n' + walkGraph(falseBranch.target, nodeMap, edgeMap, incomingEdgeMap, indent + '  ', visited);
    }
    code += `\n${indent}}`;
  } else if (node.type === 'tryCatch') {
    const tryBranch = connections.find(c => c.sourceHandle === 'try' || c.sourceHandle === 'output-try');
    const catchBranch = connections.find(c => c.sourceHandle === 'catch' || c.sourceHandle === 'output-catch');

    if (tryBranch) {
      code += '\n' + walkGraph(tryBranch.target, nodeMap, edgeMap, incomingEdgeMap, indent + '  ', visited);
    }
    code += `\n${indent}} catch (error) {`;
    if (catchBranch) {
      code += '\n' + walkGraph(catchBranch.target, nodeMap, edgeMap, incomingEdgeMap, indent + '  ', visited);
    }
    code += `\n${indent}}`;
  } else if (node.type === 'timer') {
    for (const conn of connections) {
      code += '\n' + walkGraph(conn.target, nodeMap, edgeMap, incomingEdgeMap, indent + '  ', visited);
    }
    code += `\n${indent}}, ${node.data?.interval || 5000});`;
  } else if (needsCloseBrace) {
    for (const conn of connections) {
      code += '\n' + walkGraph(conn.target, nodeMap, edgeMap, incomingEdgeMap, indent + '  ', visited);
    }
    code += `\n${indent}}`;
  } else {
    for (const conn of connections) {
      code += '\n' + walkGraph(conn.target, nodeMap, edgeMap, incomingEdgeMap, indent, visited);
    }
  }

  return code;
}

export function generateBotCode(nodes, edges, settings = {}) {
  const nodeMap = new Map();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }
  const edgeMap = buildEdgeMap(edges);

  const incomingEdgeMap = new Map();
  for (const edge of edges) {
    if (!incomingEdgeMap.has(edge.target)) incomingEdgeMap.set(edge.target, []);
    incomingEdgeMap.get(edge.target).push({ source: edge.source, sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle });
  }

  // Find all event nodes (entry points)
  const eventNodes = nodes.filter(n => NODE_CODE_MAP[n.type]);
  const otherEventNodes = nodes.filter(n =>
    !NODE_CODE_MAP[n.type] &&
    n.type?.endsWith?.('Event') &&
    !edges.some(e => e.target === n.id)
  );

  // Determine required imports
  const usedTypes = new Set(nodes.map(n => n.type));
  const imports = ['Client', 'GatewayIntentBits'];
  if (usedTypes.has('sendEmbed') || usedTypes.has('embedBuilder') || usedTypes.has('pollCreate')) imports.push('EmbedBuilder');
  if (usedTypes.has('createButton')) { imports.push('ActionRowBuilder', 'ButtonBuilder', 'ButtonStyle'); }
  if (usedTypes.has('createSelectMenu')) { imports.push('ActionRowBuilder', 'StringSelectMenuBuilder'); }
  if (usedTypes.has('showModal') || usedTypes.has('modalBuilder')) { imports.push('ModalBuilder', 'TextInputBuilder', 'TextInputStyle', 'ActionRowBuilder', 'StringSelectMenuBuilder', 'UserSelectMenuBuilder', 'RoleSelectMenuBuilder', 'MentionableSelectMenuBuilder', 'ChannelSelectMenuBuilder'); }
  if (usedTypes.has('createChannel') || usedTypes.has('ticketCreate') || usedTypes.has('createCategory')) imports.push('ChannelType');
  if (usedTypes.has('ticketCreate') || usedTypes.has('createSlashCommand')) imports.push('PermissionFlagsBits');
  if (usedTypes.has('setStatus') || settings.activityText) imports.push('ActivityType');
  if (usedTypes.has('sendWebhook')) imports.push('WebhookClient');
  if (usedTypes.has('automodRule')) imports.push('AutoModerationRuleEventType', 'AutoModerationRuleTriggerType', 'AutoModerationActionType');

  const uniqueImports = [...new Set(imports)];

  // Build intents
  const intents = (settings.intents || ['Guilds', 'GuildMessages', 'MessageContent']).map(i => `GatewayIntentBits.${i}`);

  // Generate main index.js
  let indexJs = `// Generated by Discord Bot Builder
const { execSync } = require('child_process');
const fs = require('fs');

// Auto-dependency installer
try {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const deps = Object.keys(pkg.dependencies || {});
  let missingDeps = [];
  for (const dep of deps) {
    try { require.resolve(dep); } 
    catch (e) { missingDeps.push(dep); }
  }
  if (missingDeps.length > 0) {
    console.log(\`[Auto-Install] Missing dependencies detected: \${missingDeps.join(', ')}\`);
    console.log('[Auto-Install] Installing... This might take a moment.');
    execSync('npm install ' + missingDeps.join(' '), { stdio: 'inherit' });
    console.log('[Auto-Install] Installation complete! Restarting process...');
    execSync('node index.js', { stdio: 'inherit' });
    process.exit(0);
  }
} catch (e) {
  // Ignore errors reading package.json
}

require('dotenv').config();
const { ${uniqueImports.join(', ')} } = require('discord.js');

const client = new Client({
  intents: [${intents.join(', ')}],
});

// Debug Logger
const logFile = './bot-debug.log';
function debugLog(prefix, msg) {
  const timestamp = new Date().toISOString();
  const errStr = (msg && msg.stack) ? msg.stack : String(msg || '');
  const logStr = \`[\${timestamp}] \${prefix} \${errStr}\`;
  if (prefix !== '[Discord Debug]') console.log(logStr);
  try { fs.appendFileSync(logFile, logStr + '\\n'); } catch (e) {}
}
client.on('debug', m => debugLog('[Discord Debug]', m));
client.on('warn', m => debugLog('[Discord Warn]', m));
client.on('error', e => debugLog('[Discord Error]', e));
process.on('unhandledRejection', e => debugLog('[Unhandled Rejection]', e));
process.on('uncaughtException', e => debugLog('[Uncaught Exception]', e));

// Variable stores
const globalVars = new Map();
const guildVars = new Map();
const userVars = new Map();
const channelVars = new Map();

`;

  // Add discord-player setup if music blocks are used
  const hasMusic = usedTypes.has('playMusic') || usedTypes.has('stopMusic') || usedTypes.has('skipMusic');
  if (hasMusic) {
    indexJs += `const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const playdl = require('@vookav2/play-dl');
const ytdl = require('@distube/ytdl-core');

const player = new Player(client, {
  skipFFmpeg: false,
  connectionTimeout: 60000,
});
// Required: add error handlers or discord-player throws unhandled warnings
player.events.on('error', (queue, error) => {
  debugLog('[Player Error]', error);
  if (queue && queue.metadata && queue.metadata.channel) {
    queue.metadata.channel.send(\`❌ A player error occurred: \${String(error).slice(0, 500)}\`).catch(()=>{});
  }
});
player.events.on('playerError', (queue, error) => {
  debugLog('[Player Stream Error]', error);
  if (queue && queue.metadata && queue.metadata.channel) {
    queue.metadata.channel.send(\`❌ A stream error occurred: \${String(error).slice(0, 500)}\`).catch(()=>{});
  }
});
player.events.on('playerStart', (queue, track) => {
  if (queue && queue.metadata && queue.metadata.channel) {
    queue.metadata.channel.send(\`🎶 Now playing: **\${track.title}**\`).catch(()=>{});
  }
});
player.events.on('debug', (_, m) => debugLog('[Player Debug]', m));
// Silence noisy YOUTUBEJS warnings
process.on('warning', (w) => { if (String(w?.message || '').includes('YOUTUBEJS')) return; });

// Use ytdl-core to bypass broken extractors for youtube streams
const globalOnBeforeCreateStream = async (track, source, _queue) => {
  try {
    if (source === 'youtube' || track.url.includes('youtube.com') || track.url.includes('youtu.be')) {
      return ytdl(track.url, { filter: 'audioonly' });
    }
  } catch (e) {
    debugLog('[Player Bridge Error]', e);
  }
  return null;
};

(async () => {
  try {
    await player.extractors.loadMulti(DefaultExtractors);
    debugLog('[Music]', 'Extractors loaded (Spotify, SoundCloud, etc)');
  } catch(e) { debugLog('[Music] Extractor setup error:', e); }
})();

`;
  }


  // Generate event handlers
  const eventsGenerated = new Map();

  for (const eventNode of eventNodes) {
    const eventConfig = NODE_CODE_MAP[eventNode.type];
    if (!eventConfig) continue;

    const eventName = eventConfig.event;
    const param = getEventParam(eventName);
    const once = eventConfig.once ? 'once' : 'on';

    // Build handler body by walking the graph
    const visited = new Set();
    visited.add(eventNode.id);
    const connections = edgeMap.get(eventNode.id) || [];

    let handlerBody = '';
    for (const conn of connections) {
      handlerBody += walkGraph(conn.target, nodeMap, edgeMap, incomingEdgeMap, '    ', visited) + '\n';
    }

    // Add special handling for slash commands
    if (eventConfig.filter === 'slash' && eventNode.data?.commandName) {
      handlerBody = `    if (!interaction.isChatInputCommand()) return;\n    if (interaction.commandName !== ${JSON.stringify(eventNode.data.commandName)}) return;\n\n` + handlerBody;
    } else if (eventConfig.filter === 'button' && eventNode.data?.customId) {
      handlerBody = `    if (!interaction.isButton()) return;\n    if (interaction.customId !== ${JSON.stringify(eventNode.data.customId)}) return;\n\n` + handlerBody;
    } else if (eventConfig.filter === 'modal' && eventNode.data?.customId) {
      handlerBody = `    if (!interaction.isModalSubmit()) return;\n    if (interaction.customId !== ${JSON.stringify(eventNode.data.customId)}) return;\n\n` + handlerBody;
    } else if (eventConfig.filter === 'selectMenu' && eventNode.data?.customId) {
      handlerBody = `    if (!interaction.isStringSelectMenu()) return;\n    if (interaction.customId !== ${JSON.stringify(eventNode.data.customId)}) return;\n\n` + handlerBody;
    }

    // Check for message prefix filtering
    if (eventName === 'messageCreate' && eventNode.data?.command) {
      handlerBody = `    if (!message.content.startsWith(${JSON.stringify(eventNode.data.command)})) return;\n    const args = message.content.slice(${eventNode.data.command.length}).trim().split(/ +/);\n\n` + handlerBody;
    }

    // Special ready event
    if (eventName === 'clientReady') {
      handlerBody = `    console.log(\`✅ Bot is online as \${client.user.tag}!\`);\n` + handlerBody;
      if (settings.activityText) {
        handlerBody += `    client.user.setPresence({ activities: [{ name: ${JSON.stringify(settings.activityText)}, type: ActivityType.${settings.activityType || 'Playing'} }] });\n`;
      }
    }

    indexJs += `client.${once}('${eventName}', async (${param}) => {\n  try {\n${handlerBody}  } catch (error) {\n    console.error('[Bot Error]', error);\n  }\n});\n\n`;
  }

  // Automatically register all standalone slash command blocks
  const slashCmdNodes = nodes.filter(n => n.type === 'createSlashCommand');
  if (slashCmdNodes.length > 0) {
    let slashCmdCode = '';
    for (const node of slashCmdNodes) {
      const d = node.data || {};
      const cmds = d.slashCommands || [{ name: d.commandName || 'command', description: d.commandDesc || 'Description', options: [] }];
      const perm = d.permission && d.permission !== 'None' ? `, defaultMemberPermissions: [PermissionFlagsBits.${d.permission}]` : '';

      for (const cmd of cmds) {
        const optsJson = (cmd.options && cmd.options.length > 0) ? `, options: ${JSON.stringify(cmd.options)}` : '';
        slashCmdCode += `    await client.application?.commands.create({ name: ${JSON.stringify(cmd.name || 'command')}, description: ${JSON.stringify(cmd.description || 'A command')}${optsJson}${perm} });\n`;
      }
    }

    indexJs += `client.once('clientReady', async () => {\n  try {\n    console.log('🔄 Registering global slash commands...');\n${slashCmdCode}    console.log('✅ Slash commands registered!');\n  } catch (error) {\n    console.error('[Bot Error] Failed to register slash commands', error);\n  }\n});\n\n`;
  }

  // Login
  indexJs += `client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('[Login Error]', err.message);
  if (err.message.includes('disallowed intents')) {
    console.error('======================================================================');
    console.error('🚨 PRIVILEGED INTENTS MISSING 🚨');
    console.error('======================================================================');
    console.error('Your bot is missing Privileged Gateway Intents! To fix this:');
    console.error('1. Go to the Discord Developer Portal -> https://discord.com/developers/applications');
    console.error('2. Select your application and click "Bot" in the left sidebar.');
    console.error('3. Scroll down to the "Privileged Gateway Intents" section.');
    console.error('4. ENABLE all toggle switches (Presence Intent, Server Members Intent, Message Content Intent).');
    console.error('5. Click "Save Changes" and run your bot again.');
    console.error('======================================================================');
  }
});\n`;

  // Generate utils/variables.js
  const utilsJs = `// Variable persistence utility using file system
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const dataFile = path.join(dataDir, 'variables.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load data
let data = {};
if (fs.existsSync(dataFile)) {
  try {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    console.error('[Warning] Could not parse variables.json, starting fresh.', err);
  }
}

function save() {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Error] Could not save variables.json', err);
  }
}

module.exports = {
  get(scope, key) {
    if (!data[scope]) return undefined;
    return data[scope][key];
  },
  set(scope, key, value) {
    if (!data[scope]) data[scope] = {};
    data[scope][key] = value;
    save();
  },
  delete(scope, key) {
    if (data[scope] && data[scope][key] !== undefined) {
      delete data[scope][key];
      save();
    }
  },
};
`;

  return {
    indexJs,
    utilsJs,
    commands: [],
    events: [],
  };
}
