import { WebSocketServer, WebSocket } from 'ws';
import { Authority, lobbyView } from './authority';
import type { ClientCommand, ServerMessage } from './protocol';

const port = Number(process.env.PORT ?? 8787);
const authority = new Authority();
const sockets = new Map<string, WebSocket>();
const sessions = new Map<string, { playerId: string; lobbyId?: string; matchId?: string }>();
const wss = new WebSocketServer({ port });
const send = (ws: WebSocket, message: ServerMessage) => ws.send(JSON.stringify(message));

wss.on('connection', ws => {
  let session: { playerId: string; lobbyId?: string; matchId?: string } | null = null;
  ws.on('message', raw => {
    let command: ClientCommand | undefined;
    try {
      command = JSON.parse(raw.toString()) as ClientCommand;
      if (command.type === 'CREATE_LOBBY') { const created = authority.createLobby(command.displayName ?? 'Pinguim', command.deck ?? []); session = { playerId: created.player.playerId, lobbyId: created.lobby.lobbyId }; sessions.set(session.playerId, session); sockets.set(session.playerId, ws); send(ws, { type: 'LOBBY_STATE', requestId: command.requestId, lobby: lobbyView(created.lobby) }); return; }
      if (command.type === 'JOIN_LOBBY') { const joined = authority.joinLobby(command.inviteCode ?? command.lobbyId!, command.displayName ?? 'Pinguim', command.deck ?? []); session = { playerId: joined.player.playerId, lobbyId: joined.lobby.lobbyId }; sessions.set(session.playerId, session); sockets.set(session.playerId, ws); for (const p of joined.lobby.players) { const s = sessions.get(p.playerId); const peer = sockets.get(p.playerId); if (s && peer) send(peer, { type: 'LOBBY_STATE', requestId: command.requestId, lobby: lobbyView(joined.lobby) }); } return; }
      if (!session) throw new Error('NOT_AUTHENTICATED');
      if (command.type === 'SET_READY') { const lobby = authority.setReady(session.lobbyId!, session.playerId, true); send(ws, { type: 'LOBBY_STATE', requestId: command.requestId, lobby: lobbyView(lobby) }); return; }
      if (command.type === 'START_MATCH') { const match = authority.startMatch(session.lobbyId!); for (const peerSession of sessions.values()) if (peerSession.lobbyId === session.lobbyId) peerSession.matchId = match.matchId; for (const peerSession of sessions.values()) if (peerSession.matchId === match.matchId) { const peer = sockets.get(peerSession.playerId); if (peer) send(peer, { type: 'MATCH_STATE', requestId: command.requestId, match: authority.view(match.matchId, peerSession.playerId) }); } return; }
      if (command.type === 'GET_STATE') { if (!session.matchId) throw new Error('MATCH_NOT_STARTED'); send(ws, { type: 'MATCH_STATE', requestId: command.requestId, match: authority.view(session.matchId, session.playerId) }); return; }
      if (!session.matchId) throw new Error('MATCH_NOT_STARTED');
      const result = authority.command(session.matchId, session.playerId, command);
      for (const peerSession of sessions.values()) if (peerSession.matchId === session.matchId) { const peer = sockets.get(peerSession.playerId); if (peer) send(peer, { type: 'MATCH_STATE', requestId: command.requestId, match: authority.view(session.matchId!, peerSession.playerId) }); }
    } catch (error) { const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'; const [code, detail] = message.split(':', 2); send(ws, { type: 'ERROR', requestId: command?.requestId, code, message: detail ?? code }); }
  });
  ws.on('close', () => { if (session) { sockets.delete(session.playerId); const persisted = sessions.get(session.playerId); if (persisted) persisted.playerId = session.playerId; } });
});
console.log(`Servidor autoritativo local em ws://127.0.0.1:${port}`);
