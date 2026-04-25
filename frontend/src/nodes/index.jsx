/**
 * Node Registry — Defines ALL node types, their metadata, settings, and default data.
 * Each node definition is used to:
 *   1. Register a React Flow nodeType (via BaseNode wrapper)
 *   2. Populate the node palette sidebar
 *   3. Provide settings for the properties panel
 *   4. Drive the code generator
 *
 * PORT SYSTEM:
 *   Each input/output has: { id, label, dataType }
 *   dataType determines the port color and connection validation.
 *   Types: action, text, user, member, channel, server, message, number, boolean, interaction, role, any, embed, component
 */
import React, { memo } from 'react';
import BaseNode from '../components/shared/BaseNode';
import {
  Zap, MessageSquare, SmilePlus, UserPlus, UserMinus, Terminal,
  MousePointerClick, FormInput, ListChecks, Mic, Server, Hash,
  Trash2, Crosshair, Radio,
  Send, Edit, Trash, Image, Reply, Heart, SquareStack, List,
  Eye, Ban, UserX, Clock, Shield, ShieldOff, PlusCircle, MinusCircle,
  MessageCircle, Webhook, UserCog, Activity, Mail, Command,
  GitBranch, Shuffle, Scale, Binary, CircleDot, CircleSlash,
  Timer, AlarmClock, Repeat, StopCircle, ShieldAlert, HelpCircle,
  Globe, Database, User, LayoutGrid, Thermometer, Variable,
  Palette, Columns, ShieldCheck, TrendingUp, Coins, Ticket, TicketX,
  Star, BarChart, Sticker, FileSearch, Bot,
  Calculator, Type, Brackets, Braces, Wifi, Dice6, Hourglass,
  Calendar, FileText, Code, Regex, TextCursorInput,
  Pin, PinOff, Search, Scissors, Volume2, VolumeX, PenTool, Unlock, Lock, FolderPlus, MessagesSquare, Settings,
} from 'lucide-react';

// ─── NODE DEFINITIONS ─────────────────────────────────────────

export const NODE_DEFINITIONS = {
  // ═══ EVENTS ═══════════════════════════════════════
  readyEvent: {
    label: 'Bot Ready',
    category: 'event',
    icon: Zap,
    description: 'Fires when the bot starts up',
    tooltip: 'Triggered once when the bot successfully connects to Discord.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  messageCreate: {
    label: 'Message Create',
    category: 'event',
    icon: MessageSquare,
    description: 'Fires when a message is sent',
    tooltip: 'Triggered whenever a message is sent in any channel the bot can see.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'command', label: 'Command Name', type: 'text', placeholder: 'ping', help: 'Leave empty to trigger on all messages' },
    ],
  },
  reactionAdd: {
    label: 'Reaction Add',
    category: 'event',
    icon: SmilePlus,
    description: 'Fires when a reaction is added',
    tooltip: 'Triggered when a user adds a reaction to a message.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'emoji', label: 'Filter Emoji', type: 'text', placeholder: '⭐ (leave empty for all)' },
    ],
  },
  memberJoin: {
    label: 'Member Join',
    category: 'event',
    icon: UserPlus,
    description: 'Fires when a member joins',
    tooltip: 'Triggered when a new member joins the server.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    settings: [],
  },
  memberLeave: {
    label: 'Member Leave',
    category: 'event',
    icon: UserMinus,
    description: 'Fires when a member leaves',
    tooltip: 'Triggered when a member leaves or is removed from the server.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    settings: [],
  },
  slashCommand: {
    label: 'Slash Command',
    category: 'event',
    icon: Terminal,
    description: 'Fires on slash command use',
    tooltip: 'Triggered when a user executes a slash command. Configure the command using the builder in the properties panel.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [
      { key: 'commandName', label: 'Command Name', type: 'text', placeholder: 'ping', help: 'The slash command name (matches this event to a registered command)' },
    ],
  },
  buttonClick: {
    label: 'Button Click',
    category: 'event',
    icon: MousePointerClick,
    description: 'Fires when a button is clicked',
    tooltip: 'Triggered when a user clicks a button component.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [
      { key: 'customId', label: 'Button Custom ID', type: 'text', placeholder: 'my_button' },
    ],
  },
  modalSubmit: {
    label: 'Modal Submit',
    category: 'event',
    icon: FormInput,
    description: 'Fires when a modal is submitted',
    tooltip: 'Triggered when a user submits a modal form.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [
      { key: 'customId', label: 'Modal Custom ID', type: 'text', placeholder: 'my_modal' },
    ],
  },
  selectMenu: {
    label: 'Select Menu',
    category: 'event',
    icon: ListChecks,
    description: 'Fires when a select menu is used',
    tooltip: 'Triggered when a user selects an option from a select menu.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'text', label: 'Selected', dataType: 'text' },
    ],
    settings: [
      { key: 'customId', label: 'Menu Custom ID', type: 'text', placeholder: 'my_select' },
    ],
  },
  voiceStateUpdate: {
    label: 'Voice State Update',
    category: 'event',
    icon: Mic,
    description: 'Fires on voice channel changes',
    tooltip: 'Triggered when a user joins, leaves, or switches voice channels.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [],
  },
  guildCreate: {
    label: 'Guild Create',
    category: 'event',
    icon: Server,
    description: 'Fires when bot joins a server',
    tooltip: 'Triggered when the bot is added to a new server.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    settings: [],
  },
  channelCreate: {
    label: 'Channel Create',
    category: 'event',
    icon: Hash,
    description: 'Fires when a channel is created',
    tooltip: 'Triggered when a new channel is created in the server.',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [],
  },
  messageDelete: {
    label: 'Message Delete',
    category: 'event',
    icon: Trash2,
    description: 'Fires when a message is deleted',
    tooltip: 'Triggered when a message is deleted (if cached).',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [],
  },
  interactionCreate: {
    label: 'Interaction Create',
    category: 'event',
    icon: Crosshair,
    description: 'Fires on any interaction',
    tooltip: 'Triggered on any interaction (commands, buttons, modals, etc.).',
    inputs: [],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [],
  },

  // ═══ ACTIONS ══════════════════════════════════════
  sendMessage: {
    label: 'Send Message',
    category: 'action',
    icon: Send,
    description: 'Send a message to a channel',
    tooltip: 'Sends a text message to the current or specified channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'content', label: 'Content', dataType: 'text' },
      { id: 'components', label: 'Components', dataType: 'component' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'content', label: 'Message Content', type: 'textarea', placeholder: 'Hello, World!', rows: 3 },
    ],
  },
  editMessage: {
    label: 'Edit Message',
    category: 'action',
    icon: Edit,
    description: 'Edit an existing message',
    tooltip: 'Edits a previously sent message.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
      { id: 'content', label: 'Content', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'content', label: 'New Content', type: 'textarea', placeholder: 'Edited message!' },
    ],
  },
  deleteMessage: {
    label: 'Delete Message',
    category: 'action',
    icon: Trash,
    description: 'Delete a message',
    tooltip: 'Deletes the triggering message or a specified message.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  sendEmbed: {
    label: 'Send Embed',
    category: 'action',
    icon: Image,
    description: 'Send a rich embed message',
    tooltip: 'Sends a rich embed with title, description, color, image, footer, and timestamps.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'title', label: 'Title', dataType: 'text' },
      { id: 'description', label: 'Description', dataType: 'text' },
      { id: 'components', label: 'Components', dataType: 'component' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'authorName', label: 'Author Name', type: 'text', placeholder: 'Bot Author' },
      { key: 'authorIcon', label: 'Author Icon URL', type: 'text', placeholder: 'https://...' },
      { key: 'authorUrl', label: 'Author URL', type: 'text', placeholder: 'https://...' },
      { key: 'title', label: 'Embed Title', type: 'text', placeholder: 'My Embed' },
      { key: 'url', label: 'Embed URL', type: 'text', placeholder: 'https://...' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Embed content here...', rows: 3 },
      { key: 'color', label: 'Color', type: 'color', default: '#5865f2' },
      { key: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...' },
      { key: 'thumbnail', label: 'Thumbnail URL', type: 'text', placeholder: 'https://...' },
      { key: 'footerText', label: 'Footer Text', type: 'text', placeholder: 'Footer content' },
      { key: 'footerIcon', label: 'Footer Icon URL', type: 'text', placeholder: 'https://...' },
      { key: 'timestamp', label: 'Include Timestamp', type: 'toggle', default: false },
    ],
  },
  sendReply: {
    label: 'Send Reply',
    category: 'action',
    icon: Reply,
    description: 'Reply to the triggering message',
    tooltip: 'Sends a reply directly to the message that triggered this flow.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
      { id: 'content', label: 'Content', dataType: 'text' },
      { id: 'components', label: 'Components', dataType: 'component' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Reply', dataType: 'message' },
    ],
    settings: [
      { key: 'content', label: 'Reply Content', type: 'textarea', placeholder: 'Reply message!' },
    ],
  },
  addReaction: {
    label: 'Add Reaction',
    category: 'action',
    icon: Heart,
    description: 'Add a reaction to a message',
    tooltip: 'Adds an emoji reaction to the triggering message.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
      { id: 'text', label: 'Emoji', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'emoji', label: 'Emoji', type: 'text', placeholder: '👍', help: 'Unicode emoji or custom emoji ID' },
    ],
  },
  createButton: {
    label: 'Create Buttons',
    category: 'action',
    icon: SquareStack,
    description: 'Build interactive buttons',
    tooltip: 'Builds up to 25 interactive buttons to be connected to a message or embed.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'component', label: 'Buttons', dataType: 'component' },
    ],
    settings: [
      { key: 'buttons', label: 'Buttons List', type: 'button_builder', default: [{ customId: 'btn_1', label: 'Click Me', style: 'Primary' }] },
    ],
  },
  createSelectMenu: {
    label: 'Create Select Menu',
    category: 'action',
    icon: List,
    description: 'Create a dropdown select menu',
    tooltip: 'Creates a select menu component to attach to a message or embed.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'component', label: 'Select Menu', dataType: 'component' },
    ],
    settings: [
      { key: 'customId', label: 'Custom ID', type: 'text', placeholder: 'select_1' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', placeholder: 'Choose an option...' },
      { key: 'minValues', label: 'Min Selections', type: 'number', default: 1 },
      { key: 'maxValues', label: 'Max Selections', type: 'number', default: 1 },
      { key: 'options', label: 'Options (Comma separated)', type: 'textarea', placeholder: 'Option 1, Option 2' },
    ],
  },
  showModal: {
    label: 'Show Modal',
    category: 'action',
    icon: Eye,
    description: 'Show a modal dialog',
    tooltip: 'Displays a modal form (up to 5 text inputs). Click "+ Add Input" to add more fields.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'customId', label: 'Modal Custom ID', type: 'text', placeholder: 'modal_1' },
      { key: 'title', label: 'Modal Title', type: 'text', placeholder: 'My Modal' },
      { key: 'modalInputs', label: 'Modal Inputs (up to 5)', type: 'modal_inputs', default: [{ customId: 'input_1', label: 'Enter text', style: 'Short', placeholder: '', required: true }] },
    ],
  },
  createSlashCommand: {
    label: 'Create Slash Cmd',
    category: 'event',
    icon: Crosshair,
    description: 'Registers slash commands globally',
    tooltip: 'Registers slash commands globally when the bot starts. Build your command structure in the properties panel.',
    inputs: [],
    outputs: [],
    settings: [
      { key: 'slashCommands', label: 'Slash Commands', type: 'slash_builder', default: [{ name: '', description: '', options: [] }] },
      { key: 'permission', label: 'Default Permission', type: 'select', default: 'None', options: [
        { value: 'None', label: 'None' },
        { value: 'Administrator', label: 'Administrator' },
        { value: 'ManageGuild', label: 'Manage Server' },
        { value: 'ManageMessages', label: 'Manage Messages' },
        { value: 'KickMembers', label: 'Kick Members' },
        { value: 'BanMembers', label: 'Ban Members' },
      ]},
    ],
  },
  banMember: {
    label: 'Ban Member',
    category: 'action',
    icon: Ban,
    description: 'Ban a member from the server',
    tooltip: 'Bans the mentioned or specified member.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'reason', label: 'Reason', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'reason', label: 'Ban Reason', type: 'text', placeholder: 'Banned by bot' },
    ],
  },
  kickMember: {
    label: 'Kick Member',
    category: 'action',
    icon: UserX,
    description: 'Kick a member from the server',
    tooltip: 'Kicks the mentioned or specified member.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'reason', label: 'Reason', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'reason', label: 'Kick Reason', type: 'text', placeholder: 'Kicked by bot' },
    ],
  },
  timeoutMember: {
    label: 'Timeout Member',
    category: 'action',
    icon: Clock,
    description: 'Timeout a member',
    tooltip: 'Temporarily mutes a member for a specified duration.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'duration', label: 'Duration', dataType: 'number' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'duration', label: 'Duration (ms)', type: 'number', default: 60000, help: '60000 = 1 minute' },
      { key: 'reason', label: 'Reason', type: 'text', placeholder: 'Timed out by bot' },
    ],
  },
  addRole: {
    label: 'Add Role',
    category: 'action',
    icon: Shield,
    description: 'Add a role to a member',
    tooltip: 'Adds a specified role to a member.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'role', label: 'Role', dataType: 'role' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'roleId', label: 'Role ID', type: 'text', placeholder: 'ROLE_ID' },
    ],
  },
  removeRole: {
    label: 'Remove Role',
    category: 'action',
    icon: ShieldOff,
    description: 'Remove a role from a member',
    tooltip: 'Removes a specified role from a member.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'role', label: 'Role', dataType: 'role' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'roleId', label: 'Role ID', type: 'text', placeholder: 'ROLE_ID' },
    ],
  },
  createChannel: {
    label: 'Create Channel',
    category: 'action',
    icon: PlusCircle,
    description: 'Create a new channel',
    tooltip: 'Creates a new text or voice channel in the server.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'name', label: 'Name', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [
      { key: 'name', label: 'Channel Name', type: 'text', placeholder: 'new-channel' },
      { key: 'channelType', label: 'Type', type: 'select', default: 'GuildText', options: [
        { value: 'GuildText', label: 'Text Channel' },
        { value: 'GuildVoice', label: 'Voice Channel' },
        { value: 'GuildCategory', label: 'Category' },
      ]},
      { key: 'topic', label: 'Topic (Text Only)', type: 'text', placeholder: 'Channel description' },
      { key: 'nsfw', label: 'NSFW?', type: 'toggle', default: false },
    ],
  },
  deleteChannel: {
    label: 'Delete Channel',
    category: 'action',
    icon: MinusCircle,
    description: 'Delete a channel',
    tooltip: 'Deletes a specified channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  createThread: {
    label: 'Create Thread',
    category: 'action',
    icon: MessageCircle,
    description: 'Create a thread from a message',
    tooltip: 'Starts a new thread from the triggering message.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
      { id: 'name', label: 'Name', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Thread', dataType: 'channel' },
    ],
    settings: [
      { key: 'name', label: 'Thread Name', type: 'text', placeholder: 'New Thread' },
      { key: 'archiveDuration', label: 'Auto-Archive (min)', type: 'select', default: '60', options: [
        { value: '60', label: '1 hour' },
        { value: '1440', label: '24 hours' },
        { value: '4320', label: '3 days' },
        { value: '10080', label: '1 week' },
      ]},
    ],
  },
  sendWebhook: {
    label: 'Send Webhook',
    category: 'action',
    icon: Webhook,
    description: 'Send a message via webhook',
    tooltip: 'Sends a message through a Discord webhook URL.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'content', label: 'Content', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://discord.com/api/webhooks/...' },
      { key: 'content', label: 'Message', type: 'textarea', placeholder: 'Webhook message' },
      { key: 'username', label: 'Username Override', type: 'text', placeholder: 'Bot' },
    ],
  },
  setNickname: {
    label: 'Set Nickname',
    category: 'action',
    icon: UserCog,
    description: "Change a member's nickname",
    tooltip: "Sets or changes a member's server nickname.",
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
      { id: 'text', label: 'Nickname', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'nickname', label: 'New Nickname', type: 'text', placeholder: 'Cool Nick' },
    ],
  },
  setStatus: {
    label: 'Set Bot Status',
    category: 'action',
    icon: Activity,
    description: 'Set the bot\'s presence status',
    tooltip: 'Changes the bot\'s activity status and type.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'text', label: 'Status Text', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'text', label: 'Status Text', type: 'text', placeholder: 'a game' },
      { key: 'activityType', label: 'Type', type: 'select', default: 'Playing', options: [
        { value: 'Playing', label: 'Playing' },
        { value: 'Streaming', label: 'Streaming' },
        { value: 'Listening', label: 'Listening' },
        { value: 'Watching', label: 'Watching' },
        { value: 'Competing', label: 'Competing' },
      ]},
      { key: 'status', label: 'Status', type: 'select', default: 'online', options: [
        { value: 'online', label: 'Online' },
        { value: 'idle', label: 'Idle' },
        { value: 'dnd', label: 'Do Not Disturb' },
        { value: 'invisible', label: 'Invisible' },
      ]},
    ],
  },
  sendDM: {
    label: 'Send DM',
    category: 'action',
    icon: Mail,
    description: 'Send a direct message',
    tooltip: 'Sends a direct message to the triggering user.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'content', label: 'Content', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'content', label: 'DM Content', type: 'textarea', placeholder: 'Hello via DM!' },
    ],
  },
  slashReply: {
    label: 'Slash Command Reply',
    category: 'action',
    icon: Command,
    description: 'Reply to a slash command',
    tooltip: 'Sends a reply to a slash command interaction.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'content', label: 'Content', dataType: 'text' },
      { id: 'components', label: 'Components', dataType: 'component' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'content', label: 'Reply Content', type: 'textarea', placeholder: 'Pong! 🏓' },
      { key: 'ephemeral', label: 'Ephemeral (hidden)', type: 'toggle', default: false },
    ],
  },
  clearMessages: {
    label: 'Clear Messages',
    category: 'action',
    icon: Trash2,
    description: 'Bulk delete messages',
    tooltip: 'Deletes a specified number of messages from a channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'count', label: 'Count', dataType: 'number' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'count', label: 'Message Count', type: 'number', default: 10, min: 1, max: 100 },
    ],
  },
  pinMessage: {
    label: 'Pin Message',
    category: 'action',
    icon: Pin,
    description: 'Pin a message',
    tooltip: 'Pins a message in the specified channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  unpinMessage: {
    label: 'Unpin Message',
    category: 'action',
    icon: PinOff,
    description: 'Unpin a message',
    tooltip: 'Unpins a message from the specified channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  createInvite: {
    label: 'Create Invite',
    category: 'action',
    icon: UserPlus,
    description: 'Create a channel invite',
    tooltip: 'Generates an invite link for a channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'text', label: 'Invite URL', dataType: 'text' },
    ],
    settings: [
      { key: 'maxAge', label: 'Max Age (seconds)', type: 'number', default: 86400, help: '0 = never expires' },
      { key: 'maxUses', label: 'Max Uses', type: 'number', default: 0, help: '0 = unlimited' },
    ],
  },
  voiceKick: {
    label: 'Voice Kick',
    category: 'action',
    icon: VolumeX,
    description: 'Kick member from voice',
    tooltip: 'Removes a member from their current voice channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  voiceMute: {
    label: 'Voice Mute',
    category: 'action',
    icon: VolumeX,
    description: 'Server mute member',
    tooltip: 'Server mutes or unmutes a member in voice.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'member', label: 'Member', dataType: 'member' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'mute', label: 'Mute?', type: 'toggle', default: true },
    ],
  },
  setChannelName: {
    label: 'Set Channel Name',
    category: 'action',
    icon: PenTool,
    description: 'Rename a channel',
    tooltip: 'Changes the name of a specified channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'name', label: 'Name', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'name', label: 'New Name', type: 'text', placeholder: 'new-name' },
    ],
  },
  lockChannel: {
    label: 'Lock Channel',
    category: 'action',
    icon: Lock,
    description: 'Disable channel messages',
    tooltip: 'Denies Send Messages permission for @everyone in the channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  unlockChannel: {
    label: 'Unlock Channel',
    category: 'action',
    icon: Unlock,
    description: 'Enable channel messages',
    tooltip: 'Resets Send Messages permission for @everyone in the channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  createCategory: {
    label: 'Create Category',
    category: 'action',
    icon: FolderPlus,
    description: 'Create a category',
    tooltip: 'Creates a new channel category in the server.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'name', label: 'Name', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Category', dataType: 'channel' },
    ],
    settings: [
      { key: 'name', label: 'Category Name', type: 'text', placeholder: 'ADMIN STUFF' },
    ],
  },
  createRole: {
    label: 'Create Role',
    category: 'action',
    icon: Shield,
    description: 'Create a new role',
    tooltip: 'Creates a new role with specific settings.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'name', label: 'Name', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'role', label: 'Role', dataType: 'role' },
    ],
    settings: [
      { key: 'name', label: 'Role Name', type: 'text', placeholder: 'New Role' },
      { key: 'color', label: 'Color', type: 'color', default: '#99aab5' },
      { key: 'mentionable', label: 'Mentionable?', type: 'toggle', default: false },
      { key: 'hoist', label: 'Display Separately? (Hoist)', type: 'toggle', default: false },
      { key: 'admin', label: 'Give Administrator Perms?', type: 'toggle', default: false },
    ],
  },
  deleteRole: {
    label: 'Delete Role',
    category: 'action',
    icon: Trash2,
    description: 'Delete a role',
    tooltip: 'Deletes a specified role from the server.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'role', label: 'Role', dataType: 'role' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  findServer: {
    label: 'Find Server',
    category: 'action',
    icon: Search,
    description: 'Find a server by ID, name, or owner',
    tooltip: 'Searches for a server (guild) the bot is in by ID, name, name acronym, or owner.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'search_value', label: 'Search Value', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    settings: [
      { key: 'findBy', label: 'Find Server By', type: 'select', default: 'id', options: [
        { value: 'id', label: 'Server ID' },
        { value: 'name', label: 'Server Name' },
        { value: 'name_acronym', label: 'Server Name Acronym' },
        { value: 'owner', label: 'Server Owner' },
      ]},
      { key: 'searchValue', label: 'Search Value', type: 'text', placeholder: 'Server ID or Name', help: 'The value to search for (overridden by port if connected)' },
    ],
  },
  getServerInfo: {
    label: 'Get Server Info',
    category: 'action',
    icon: Search,
    description: 'Get properties of a server',
    tooltip: 'Extracts specific information (like member count, owner, ID, name, etc.) from a Server object.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'any' },
    ],
    settings: [
      { key: 'serverInfo', label: 'Value to Extract', type: 'select', default: 'id', options: [
        { value: 'id', label: 'Server ID' },
        { value: 'name', label: 'Server Name' },
        { value: 'name_acronym', label: 'Server Name Acronym' },
        { value: 'icon', label: 'Server Icon Hash' },
        { value: 'iconURL', label: 'Server Icon URL' },
        { value: 'ownerId', label: 'Server Owner ID' },
        { value: 'memberCount', label: 'Member Count (Total)' },
        { value: 'humanMemberCount', label: 'Member Count (Humans)' },
        { value: 'botMemberCount', label: 'Member Count (Bots)' },
        { value: 'description', label: 'Server Description' },
        { value: 'premiumTier', label: 'Boost Level' },
        { value: 'premiumSubscriptionCount', label: 'Boost Count' },
        { value: 'afkChannelId', label: 'AFK Channel ID' },
        { value: 'afkTimeout', label: 'AFK Timeout (Sec)' },
        { value: 'verificationLevel', label: 'Verification Level' },
      ]},
    ],
  },
  findChannel: {
    label: 'Find Channel',
    category: 'action',
    icon: Search,
    description: 'Find a channel by ID, name, or topic',
    tooltip: 'Searches for a channel in a server by ID, name, topic, or position. Optionally filter by channel type.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'search_value', label: 'Search Value', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    settings: [
      { key: 'channelType', label: 'Channel Type', type: 'select', default: 'any', options: [
        { value: 'any', label: 'Any Channel' },
        { value: 'dm', label: 'DM Channel' },
        { value: 'text', label: 'Text Channel' },
        { value: 'voice', label: 'Voice Channel' },
        { value: 'forum', label: 'Forum Channel' },
        { value: 'publicthread', label: 'Public Thread' },
        { value: 'privatethread', label: 'Private Thread' },
        { value: 'category', label: 'Category' },
      ]},
      { key: 'findBy', label: 'Find Channel By', type: 'select', default: 'id', options: [
        { value: 'id', label: 'Channel ID' },
        { value: 'name', label: 'Channel Name' },
        { value: 'topic', label: 'Channel Topic' },
        { value: 'position', label: 'Channel Position' },
        { value: 'recipient', label: 'DM User' },
      ]},
      { key: 'searchValue', label: 'Search Value', type: 'text', placeholder: 'Channel ID or Name', help: 'The value to search for (overridden by port if connected)' },
    ],
  },
  setServerName: {
    label: 'Set Server Name',
    category: 'action',
    icon: Settings,
    description: 'Rename the server',
    tooltip: 'Changes the name of the current server (Requires Manage Server).',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'name', label: 'Name', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'name', label: 'New Server Name', type: 'text', placeholder: 'My Awesome Server' },
    ],
  },

  // ═══ LOGIC ════════════════════════════════════════
  ifElse: {
    label: 'If / Else',
    category: 'logic',
    icon: GitBranch,
    description: 'Conditional branching',
    tooltip: 'Executes different paths based on a condition.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'condition', label: 'Condition', dataType: 'boolean' },
    ],
    outputs: [
      { id: 'true', label: 'True', dataType: 'action' },
      { id: 'false', label: 'False', dataType: 'action' },
    ],
    settings: [
      { key: 'condition', label: 'Condition', type: 'text', placeholder: "message.content === 'hello'", help: 'JavaScript expression that evaluates to true/false' },
    ],
  },
  switchNode: {
    label: 'Switch',
    category: 'logic',
    icon: Shuffle,
    description: 'Multi-way branching',
    tooltip: 'Routes to different outputs based on a value.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'text' },
    ],
    outputs: [
      { id: 'case1', label: 'Case 1', dataType: 'action' },
      { id: 'case2', label: 'Case 2', dataType: 'action' },
      { id: 'default', label: 'Default', dataType: 'action' },
    ],
    settings: [
      { key: 'expression', label: 'Expression', type: 'text', placeholder: 'message.content' },
    ],
  },
  compare: {
    label: 'Compare',
    category: 'logic',
    icon: Scale,
    description: 'Compare two values',
    tooltip: 'Compares two values with a specified operator.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'valueA', label: 'Value A', dataType: 'any' },
      { id: 'valueB', label: 'Value B', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'boolean' },
    ],
    settings: [
      { key: 'operator', label: 'Operator', type: 'select', default: '===', options: [
        { value: '===', label: '=== (Strict Equal)' },
        { value: '!==', label: '!== (Not Equal)' },
        { value: '>', label: '> (Greater Than)' },
        { value: '<', label: '< (Less Than)' },
        { value: '>=', label: '>= (Greater or Equal)' },
        { value: '<=', label: '<= (Less or Equal)' },
        { value: 'includes', label: 'includes' },
        { value: 'startsWith', label: 'startsWith' },
      ]},
    ],
  },
  andGate: {
    label: 'AND',
    category: 'logic',
    icon: Binary,
    description: 'Both conditions must be true',
    tooltip: 'Returns true only if both conditions are true.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'a', label: 'A', dataType: 'boolean' },
      { id: 'b', label: 'B', dataType: 'boolean' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'boolean' },
    ],
    settings: [],
  },
  orGate: {
    label: 'OR',
    category: 'logic',
    icon: CircleDot,
    description: 'Either condition can be true',
    tooltip: 'Returns true if at least one condition is true.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'a', label: 'A', dataType: 'boolean' },
      { id: 'b', label: 'B', dataType: 'boolean' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'boolean' },
    ],
    settings: [],
  },
  notGate: {
    label: 'NOT',
    category: 'logic',
    icon: CircleSlash,
    description: 'Invert a condition',
    tooltip: 'Returns the opposite of the condition.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'boolean' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'boolean' },
    ],
    settings: [],
  },
  equals: {
    label: 'Equals',
    category: 'logic',
    icon: Scale,
    description: 'Check if two values match',
    tooltip: 'Branches logic based on whether Value A equals Value B.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'valueA', label: 'Value A', dataType: 'any' },
      { id: 'valueB', label: 'Value B', dataType: 'any' },
    ],
    outputs: [
      { id: 'true', label: 'True', dataType: 'action' },
      { id: 'false', label: 'False', dataType: 'action' },
    ],
    settings: [],
  },
  cooldown: {
    label: 'Cooldown',
    category: 'logic',
    icon: Timer,
    description: 'Rate limit per user',
    tooltip: 'Prevents the flow from executing again within the cooldown period.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
    ],
    outputs: [
      { id: 'pass', label: 'Allowed', dataType: 'action' },
      { id: 'fail', label: 'Blocked', dataType: 'action' },
    ],
    settings: [
      { key: 'duration', label: 'Cooldown (seconds)', type: 'number', default: 5, min: 1 },
    ],
  },
  timer: {
    label: 'Timer',
    category: 'logic',
    icon: AlarmClock,
    description: 'Execute after a delay',
    tooltip: 'Delays execution by a specified amount of time.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'After Delay', dataType: 'action' },
    ],
    settings: [
      { key: 'interval', label: 'Delay (ms)', type: 'number', default: 5000, min: 100 },
    ],
  },
  loop: {
    label: 'Loop',
    category: 'logic',
    icon: Repeat,
    description: 'Repeat actions N times',
    tooltip: 'Executes the connected nodes a specified number of times.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'count', label: 'Count', dataType: 'number' },
    ],
    outputs: [
      { id: 'each', label: 'Each', dataType: 'action' },
      { id: 'index', label: 'Index', dataType: 'number' },
      { id: 'done', label: 'Done', dataType: 'action' },
    ],
    settings: [
      { key: 'count', label: 'Iterations', type: 'number', default: 5, min: 1, max: 100 },
    ],
  },
  breakNode: {
    label: 'Break',
    category: 'logic',
    icon: StopCircle,
    description: 'Break out of a loop',
    tooltip: 'Stops the current loop immediately.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [],
    settings: [],
  },
  tryCatch: {
    label: 'Try / Catch',
    category: 'logic',
    icon: ShieldAlert,
    description: 'Error handling',
    tooltip: 'Catches errors and runs fallback logic.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'try', label: 'Try', dataType: 'action' },
      { id: 'catch', label: 'Catch', dataType: 'action' },
      { id: 'error', label: 'Error', dataType: 'text' },
    ],
    settings: [],
  },
  existsCheck: {
    label: 'Exists Check',
    category: 'logic',
    icon: HelpCircle,
    description: 'Check if a value exists',
    tooltip: 'Checks if a variable is defined and not null.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    outputs: [
      { id: 'exists', label: 'Exists', dataType: 'action' },
      { id: 'notExists', label: 'Not Exists', dataType: 'action' },
    ],
    settings: [
      { key: 'variable', label: 'Variable', type: 'text', placeholder: 'value', help: 'JS expression to check' },
    ],
  },

  // ═══ VARIABLES ════════════════════════════════════
  setGlobalVar: {
    label: 'Set Global Variable',
    category: 'variable',
    icon: Globe,
    description: 'Set a global variable',
    tooltip: 'Stores a value in a global variable (persists across servers).',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
      { key: 'value', label: 'Value', type: 'text', placeholder: "'hello'" },
    ],
  },
  getGlobalVar: {
    label: 'Get Global Variable',
    category: 'variable',
    icon: Globe,
    description: 'Get a global variable',
    tooltip: 'Retrieves the value of a global variable.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
    ],
  },
  setGuildVar: {
    label: 'Set Guild Variable',
    category: 'variable',
    icon: Database,
    description: 'Set a server-specific variable',
    tooltip: 'Stores a value scoped to the current server.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
      { key: 'value', label: 'Value', type: 'text', placeholder: "'hello'" },
    ],
  },
  getGuildVar: {
    label: 'Get Guild Variable',
    category: 'variable',
    icon: Database,
    description: 'Get a server-specific variable',
    tooltip: 'Retrieves the value of a server-scoped variable.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
    ],
  },
  setUserVar: {
    label: 'Set User Variable',
    category: 'variable',
    icon: User,
    description: 'Set a user-specific variable',
    tooltip: 'Stores a value scoped to the triggering user.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
      { key: 'value', label: 'Value', type: 'text', placeholder: "'hello'" },
    ],
  },
  getUserVar: {
    label: 'Get User Variable',
    category: 'variable',
    icon: User,
    description: 'Get a user-specific variable',
    tooltip: 'Retrieves the value of a user-scoped variable.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
    ],
  },
  setChannelVar: {
    label: 'Set Channel Variable',
    category: 'variable',
    icon: LayoutGrid,
    description: 'Set a channel-specific variable',
    tooltip: 'Stores a value scoped to the current channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
      { key: 'value', label: 'Value', type: 'text', placeholder: "'hello'" },
    ],
  },
  getChannelVar: {
    label: 'Get Channel Variable',
    category: 'variable',
    icon: LayoutGrid,
    description: 'Get a channel-specific variable',
    tooltip: 'Retrieves the value of a channel-scoped variable.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    settings: [
      { key: 'key', label: 'Variable Name', type: 'text', placeholder: 'myVar' },
    ],
  },
  setTempVar: {
    label: 'Set Temp Variable',
    category: 'variable',
    icon: Thermometer,
    description: 'Set a temporary variable',
    tooltip: 'Creates a variable that exists only during this flow execution.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'varName', label: 'Variable Name', type: 'text', placeholder: 'tempVar' },
      { key: 'value', label: 'Value', type: 'text', placeholder: "'hello'" },
    ],
  },
  textLiteral: {
    label: 'Text Literal',
    category: 'variable',
    icon: Type,
    description: 'Outputs specific text',
    tooltip: 'Provides a static text block that outputs the typed string.',
    inputs: [],
    outputs: [
      { id: 'text', label: 'Text Out', dataType: 'text' },
    ],
    settings: [
      { key: 'value', label: 'Text Value', type: 'textarea', placeholder: 'Enter text here...', rows: 3 },
    ],
  },
  getTempVar: {
    label: 'Get Temp Variable',
    category: 'variable',
    icon: Thermometer,
    description: 'Use a temporary variable',
    tooltip: 'References a temp variable from the current flow.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'value', label: 'Value', dataType: 'any' },
    ],
    settings: [
      { key: 'varName', label: 'Variable Name', type: 'text', placeholder: 'tempVar' },
    ],
  },

  // ═══ DISCORD ADVANCED ═════════════════════════════
  automodRule: {
    label: 'AutoMod Rule',
    category: 'discord',
    icon: ShieldCheck,
    description: 'Create an AutoMod rule',
    tooltip: 'Sets up an automatic content moderation rule.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'name', label: 'Rule Name', type: 'text', placeholder: 'No Bad Words' },
      { key: 'triggerType', label: 'Trigger', type: 'select', default: 'Keyword', options: [
        { value: 'Keyword', label: 'Keyword' },
        { value: 'Spam', label: 'Spam' },
        { value: 'KeywordPreset', label: 'Preset (Profanity, etc.)' },
      ]},
    ],
  },
  leveling: {
    label: 'Leveling System',
    category: 'discord',
    icon: TrendingUp,
    description: 'XP and leveling system',
    tooltip: 'Adds XP to users on message and tracks their level.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'level', label: 'Level', dataType: 'number' },
      { id: 'xp', label: 'XP', dataType: 'number' },
      { id: 'levelUp', label: 'Level Up!', dataType: 'action' },
    ],
    settings: [
      { key: 'minXp', label: 'Min XP per message', type: 'number', default: 15 },
      { key: 'maxXp', label: 'Max XP per message', type: 'number', default: 25 },
      { key: 'xpPerLevel', label: 'XP per Level', type: 'number', default: 100 },
    ],
  },
  economy: {
    label: 'Economy System',
    category: 'discord',
    icon: Coins,
    description: 'Currency and economy',
    tooltip: 'Manages virtual currency for users.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'amount', label: 'Amount', dataType: 'number' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'balance', label: 'Balance', dataType: 'number' },
    ],
    settings: [
      { key: 'amount', label: 'Amount', type: 'number', default: 10 },
      { key: 'startingBalance', label: 'Starting Balance', type: 'number', default: 0 },
    ],
  },
  ticketCreate: {
    label: 'Create Ticket',
    category: 'discord',
    icon: Ticket,
    description: 'Create a support ticket channel',
    tooltip: 'Creates a private channel for support tickets.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Ticket Channel', dataType: 'channel' },
    ],
    settings: [],
  },
  ticketClose: {
    label: 'Close Ticket',
    category: 'discord',
    icon: TicketX,
    description: 'Close a support ticket',
    tooltip: 'Closes and deletes a ticket channel.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  reactionRole: {
    label: 'Reaction Role',
    category: 'discord',
    icon: Star,
    description: 'Assign roles via reactions',
    tooltip: 'Sets up a message where users can react to get roles.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'role', label: 'Role', dataType: 'role' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'content', label: 'Message', type: 'text', placeholder: 'React to get a role!' },
      { key: 'emoji', label: 'Emoji', type: 'text', placeholder: '⭐' },
    ],
  },
  pollCreate: {
    label: 'Create Poll',
    category: 'discord',
    icon: BarChart,
    description: 'Create a reaction poll',
    tooltip: 'Creates a poll message with reaction-based voting.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'question', label: 'Question', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Poll', dataType: 'message' },
    ],
    settings: [
      { key: 'question', label: 'Question', type: 'text', placeholder: 'What do you prefer?' },
    ],
  },
  stickerSend: {
    label: 'Send Sticker',
    category: 'discord',
    icon: Sticker,
    description: 'Send a sticker',
    tooltip: 'Sends a sticker message.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'stickerId', label: 'Sticker ID', type: 'text', placeholder: 'STICKER_ID' },
    ],
  },
  auditLog: {
    label: 'Audit Log',
    category: 'discord',
    icon: FileSearch,
    description: 'Fetch audit log entries',
    tooltip: 'Retrieves recent audit log entries from the server.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'server', label: 'Server', dataType: 'server' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'text', label: 'Entries', dataType: 'text' },
    ],
    settings: [
      { key: 'limit', label: 'Limit', type: 'number', default: 5, min: 1, max: 100 },
    ],
  },
  getUserInfo: {
    label: 'Get User Info',
    category: 'discord',
    icon: User,
    description: 'Extract data from user',
    tooltip: 'Gets specific information (like Avatar, ID, or Voice Channel status) from a User or Member object.',
    inputs: (data) => {
      const isVC = data?.infoType === 'vc';
      return [
        ...(isVC ? [{ id: 'action', label: 'Action', dataType: 'action' }] : []),
        { id: 'user', label: 'User/Member', dataType: 'user' }
      ];
    },
    outputs: (data) => {
      if (data?.infoType === 'vc') {
        return [
          { id: 'true', label: 'True', dataType: 'action' },
          { id: 'false', label: 'False', dataType: 'action' },
          { id: 'channel', label: 'Channel', dataType: 'channel' }
        ];
      }
      return [
        { id: 'result', label: 'Result', dataType: 'any' }
      ];
    },
    settings: [
      { 
        key: 'infoType', 
        label: 'Information to Get', 
        type: 'select', 
        default: 'id', 
        options: [
          { value: 'id', label: 'User ID' },
          { value: 'username', label: 'Username' },
          { value: 'avatar', label: 'Avatar URL' },
          { value: 'bot', label: 'Is Bot?' },
          { value: 'vc', label: 'Check if in Voice Channel' }
        ]
      }
    ],
  },
  fetchUser: {
    label: 'Fetch User',
    category: 'discord',
    icon: Search,
    description: 'Fetch user info by ID',
    tooltip: 'Retrieves raw user data (username, avatar, etc.) from a User ID.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'userId', label: 'User ID', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'user', label: 'User', dataType: 'user' },
    ],
    settings: [
      { key: 'userId', label: 'User ID', type: 'text', placeholder: '123456789' },
    ],
  },
  getInteractionOption: {
    label: 'Get Interaction Option',
    category: 'discord',
    icon: Search,
    description: 'Get an argument from an interaction',
    tooltip: 'Gets an option value from an interaction (e.g. Slash Command).',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'name', label: 'Name', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'output', label: 'Value', dataType: 'any' },
    ],
    settings: [
      { key: 'optionName', label: 'Argument Name', type: 'text', placeholder: 'argument' },
      { key: 'get', label: 'Get Type', type: 'select', default: 'Text', options: [
        { value: 'Text', label: 'Text' },
        { value: 'Channel', label: 'Channel' },
        { value: 'User', label: 'User' },
        { value: 'Member', label: 'Member' },
        { value: 'Role', label: 'Role' },
        { value: 'Number', label: 'Number' },
        { value: 'Attachment', label: 'Attachment' },
        { value: 'Mentionable', label: 'Mentionable' },
        { value: 'Message', label: 'Message' },
        { value: 'Boolean', label: 'Boolean' },
        { value: 'Sub Command Group', label: 'Sub Command Group' },
        { value: 'Sub Command', label: 'Sub Command' },
        { value: 'Custom ID', label: 'Custom ID' },
        { value: 'Anything', label: 'Anything' },
        { value: 'Anything_Raw', label: 'Anything (RAW)' },
      ]},
    ],
  },
  getModalFieldValue: {
    label: 'Get Modal Field Value',
    category: 'discord',
    icon: FormInput,
    description: 'Get an argument from a Modal',
    tooltip: 'Extracts the submitted value from a Modal Input event.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'interaction', label: 'Interaction', dataType: 'interaction' },
      { id: 'customid', label: 'Custom ID', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'any' },
      { id: 'users', label: 'Selected Users', dataType: 'any' },
      { id: 'roles', label: 'Selected Roles', dataType: 'any' },
      { id: 'members', label: 'Selected Members', dataType: 'any' },
    ],
    settings: [
      { key: 'customid', label: 'Custom ID', type: 'text', placeholder: 'Input Custom ID' },
      { key: 'type', label: 'Type', type: 'select', default: 'textinput', options: [
        { value: 'textinput', label: 'Text Input Value' },
        { value: 'fileupload', label: 'Uploaded Files' },
        { value: 'selectmenu', label: 'Selected Menu Values' },
        { value: 'userselect', label: 'Selected Users' },
        { value: 'roleselect', label: 'Selected Roles' },
        { value: 'mentionableselect', label: 'Selected Mentionables' },
        { value: 'channelselect', label: 'Selected Channels' },
      ]},
    ],
  },
  fetchMessage: {
    label: 'Fetch Message',
    category: 'discord',
    icon: FileSearch,
    description: 'Fetch message by ID',
    tooltip: 'Retrieves a message object given its ID and Channel ID.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Channel', dataType: 'channel' },
      { id: 'messageId', label: 'Msg ID', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'message' },
    ],
    settings: [
      { key: 'messageId', label: 'Message ID', type: 'text', placeholder: 'MESSAGE_ID' },
    ],
  },
  aiResponse: {
    label: 'AI Response',
    category: 'discord',
    icon: Bot,
    description: 'Generate AI response',
    tooltip: 'Generates a response using an external AI API.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'prompt', label: 'Prompt', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'response', label: 'Response', dataType: 'text' },
    ],
    settings: [
      { key: 'apiUrl', label: 'API URL', type: 'text', placeholder: 'https://api.openai.com/v1/...' },
      { key: 'apiKey', label: 'API Key', type: 'text', placeholder: 'sk-...' },
    ],
  },

  // ═══ MUSIC ════════════════════════════════════════
  playMusic: {
    label: 'Play Music',
    category: 'action',
    icon: Volume2,
    description: 'Play a song in voice',
    tooltip: 'Plays a song from YouTube, Spotify, or SoundCloud in the user\'s voice channel. Uses discord-player. No API key needed!',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'query', label: 'Query / URL', dataType: 'text' },
      { id: 'channel', label: 'Voice Channel (Optional)', dataType: 'channel' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'query', label: 'Search Query or URL', type: 'text', placeholder: 'Never Gonna Give You Up' },
    ],
  },
  stopMusic: {
    label: 'Stop Music',
    category: 'action',
    icon: StopCircle,
    description: 'Stop playing music',
    tooltip: 'Stops the currently playing music and disconnects from voice.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Guild/Channel (Optional)', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },
  skipMusic: {
    label: 'Skip Track',
    category: 'action',
    icon: Shuffle,
    description: 'Skip the current song',
    tooltip: 'Skips the currently playing track and plays the next one in queue.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'channel', label: 'Guild/Channel (Optional)', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [],
  },

  // ═══ UTILITIES ════════════════════════════════════
  mathOp: {
    label: 'Math',
    category: 'utility',
    icon: Calculator,
    description: 'Perform a math operation',
    tooltip: 'Evaluates a mathematical expression.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'a', label: 'A', dataType: 'number' },
      { id: 'b', label: 'B', dataType: 'number' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'number' },
    ],
    settings: [
      { key: 'expression', label: 'Expression', type: 'text', placeholder: '2 + 2', help: 'JavaScript math expression' },
    ],
  },
  textOp: {
    label: 'Text',
    category: 'utility',
    icon: Type,
    description: 'Text manipulation',
    tooltip: 'Performs text operations like uppercase, lowercase, trim, etc.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'input', label: 'Input', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'text' },
    ],
    settings: [
      { key: 'operation', label: 'Operation', type: 'select', default: 'toUpperCase', options: [
        { value: 'toUpperCase', label: 'To Uppercase' },
        { value: 'toLowerCase', label: 'To Lowercase' },
        { value: 'trim', label: 'Trim' },
        { value: 'split', label: 'Split' },
        { value: 'replace', label: 'Replace' },
      ]},
    ],
  },
  arrayOp: {
    label: 'Array',
    category: 'utility',
    icon: Brackets,
    description: 'Array operations',
    tooltip: 'Perform operations on arrays (push, pop, filter, etc.).',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'input', label: 'Array', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'any' },
    ],
    settings: [
      { key: 'operation', label: 'Operation', type: 'select', default: 'push', options: [
        { value: 'push', label: 'Push' },
        { value: 'pop', label: 'Pop' },
        { value: 'shift', label: 'Shift' },
        { value: 'filter', label: 'Filter' },
        { value: 'map', label: 'Map' },
        { value: 'find', label: 'Find' },
      ]},
    ],
  },
  jsonParse: {
    label: 'JSON Parse',
    category: 'utility',
    icon: Braces,
    description: 'Parse JSON string',
    tooltip: 'Parses a JSON string into a JavaScript object.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'input', label: 'JSON', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Object', dataType: 'any' },
    ],
    settings: [],
  },
  httpRequest: {
    label: 'HTTP Request',
    category: 'utility',
    icon: Wifi,
    description: 'Make an HTTP request',
    tooltip: 'Sends an HTTP request to an external API.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'url', label: 'URL', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'response', label: 'Response', dataType: 'text' },
      { id: 'status', label: 'Status', dataType: 'number' },
    ],
    settings: [
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/data' },
      { key: 'method', label: 'Method', type: 'select', default: 'GET', options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ]},
    ],
  },
  randomOp: {
    label: 'Random',
    category: 'utility',
    icon: Dice6,
    description: 'Generate a random number',
    tooltip: 'Generates a random integer between min and max.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Number', dataType: 'number' },
    ],
    settings: [
      { key: 'min', label: 'Min', type: 'number', default: 0 },
      { key: 'max', label: 'Max', type: 'number', default: 100 },
    ],
  },
  delay: {
    label: 'Delay',
    category: 'utility',
    icon: Hourglass,
    description: 'Wait before continuing',
    tooltip: 'Pauses execution for a specified duration.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'After Wait', dataType: 'action' },
    ],
    settings: [
      { key: 'duration', label: 'Duration (ms)', type: 'number', default: 1000, min: 100, help: '1000ms = 1 second' },
    ],
  },
  dateTime: {
    label: 'Date / Time',
    category: 'utility',
    icon: Calendar,
    description: 'Get current date/time',
    tooltip: 'Gets the current date and time in a specified format.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'text', label: 'Date String', dataType: 'text' },
      { id: 'timestamp', label: 'Timestamp', dataType: 'number' },
    ],
    settings: [
      { key: 'locale', label: 'Locale', type: 'text', default: 'en-US', placeholder: 'en-US' },
    ],
  },
  logNode: {
    label: 'Console Log',
    category: 'utility',
    icon: FileText,
    description: 'Log to console',
    tooltip: 'Outputs a message to the bot console for debugging.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'message', label: 'Message', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
    ],
    settings: [
      { key: 'message', label: 'Message', type: 'text', placeholder: "'[Bot Log] Something happened'" },
    ],
  },
  customJs: {
    label: 'Custom JavaScript',
    category: 'utility',
    icon: Code,
    description: 'Run custom JS code',
    tooltip: 'Execute arbitrary JavaScript code. Use with caution!',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'input', label: 'Input', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Result', dataType: 'any' },
    ],
    settings: [
      { key: 'code', label: 'JavaScript Code', type: 'textarea', rows: 6, placeholder: '// Your custom code here\nconsole.log("Hello!");' },
    ],
  },
  regexOp: {
    label: 'Regex',
    category: 'utility',
    icon: Regex,
    description: 'Regular expression matching',
    tooltip: 'Tests or matches text against a regular expression pattern.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'input', label: 'Input', dataType: 'text' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'match', label: 'Match', dataType: 'text' },
      { id: 'found', label: 'Found?', dataType: 'boolean' },
    ],
    settings: [
      { key: 'pattern', label: 'Pattern', type: 'text', placeholder: '\\w+' },
      { key: 'flags', label: 'Flags', type: 'text', placeholder: 'gi' },
    ],
  },
  formatString: {
    label: 'Format String',
    category: 'utility',
    icon: TextCursorInput,
    description: 'Create formatted text',
    tooltip: 'Creates a string using template literals with variable interpolation.',
    inputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'input1', label: 'Input 1', dataType: 'any' },
      { id: 'input2', label: 'Input 2', dataType: 'any' },
    ],
    outputs: [
      { id: 'action', label: 'Action', dataType: 'action' },
      { id: 'result', label: 'Text', dataType: 'text' },
    ],
    settings: [
      { key: 'template', label: 'Template', type: 'text', placeholder: 'Hello, ${user}!', help: 'Use ${variable} for interpolation' },
    ],
  },
};

// ─── BUILD nodeTypes MAP FOR REACT FLOW ─────────────────
function createNodeComponent(typeName) {
  const Component = memo((props) => {
    const definition = NODE_DEFINITIONS[typeName];
    
    // Evaluate dynamic ports if they are functions
    const resolvedInputs = typeof definition.inputs === 'function' ? definition.inputs(props.data) : definition.inputs;
    const resolvedOutputs = typeof definition.outputs === 'function' ? definition.outputs(props.data) : definition.outputs;

    const mergedData = {
      ...definition,
      ...props.data,
      settings: definition.settings,
      icon: definition.icon,
      inputs: resolvedInputs,
      outputs: resolvedOutputs,
    };
    return <BaseNode {...props} data={mergedData} />;
  });
  Component.displayName = `Node_${typeName}`;
  return Component;
}

export const nodeTypes = {};
for (const key of Object.keys(NODE_DEFINITIONS)) {
  nodeTypes[key] = createNodeComponent(key);
}

// ─── PALETTE CATEGORIES ─────────────────────────────────
export const PALETTE_CATEGORIES = [
  {
    name: 'Events',
    color: '#5865f2',
    nodes: Object.entries(NODE_DEFINITIONS)
      .filter(([, d]) => d.category === 'event')
      .map(([key, d]) => ({ type: key, ...d })),
  },
  {
    name: 'Actions',
    color: '#57f287',
    nodes: Object.entries(NODE_DEFINITIONS)
      .filter(([, d]) => d.category === 'action')
      .map(([key, d]) => ({ type: key, ...d })),
  },
  {
    name: 'Logic',
    color: '#fee75c',
    nodes: Object.entries(NODE_DEFINITIONS)
      .filter(([, d]) => d.category === 'logic')
      .map(([key, d]) => ({ type: key, ...d })),
  },
  {
    name: 'Variables',
    color: '#ed4245',
    nodes: Object.entries(NODE_DEFINITIONS)
      .filter(([, d]) => d.category === 'variable')
      .map(([key, d]) => ({ type: key, ...d })),
  },
  {
    name: 'Discord Advanced',
    color: '#eb459e',
    nodes: Object.entries(NODE_DEFINITIONS)
      .filter(([, d]) => d.category === 'discord')
      .map(([key, d]) => ({ type: key, ...d })),
  },
  {
    name: 'Utilities',
    color: '#99aab5',
    nodes: Object.entries(NODE_DEFINITIONS)
      .filter(([, d]) => d.category === 'utility')
      .map(([key, d]) => ({ type: key, ...d })),
  },
];

// Helper: get total node count
export const TOTAL_NODE_COUNT = Object.keys(NODE_DEFINITIONS).length;
