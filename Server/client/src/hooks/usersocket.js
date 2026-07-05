// ─────────────────────────────────────────────────────────────
// hooks/useSocket.js  ·  Socket.IO connection hook
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let sharedSocket = null;

export const getSocket = () => sharedSocket;

export const useSocket = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (!sharedSocket) {
      sharedSocket = io(
        process.env.REACT_APP_WS_URL || 'http://localhost:5000',
        {
          auth:       { token: localStorage.getItem('diq_token') },
          transports: ['websocket'],
          reconnectionAttempts: 5,
        }
      );
      sharedSocket.on('connect',    () => console.log('🔌 Socket connected'));
      sharedSocket.on('disconnect', () => console.log('🔌 Socket disconnected'));
    }
    ref.current = sharedSocket;
    return () => {};
  }, []);

  return ref.current;
};

export const useDeploymentLogs = (deploymentId, onLog, onComplete, onFailed) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !deploymentId) return;
    socket.emit('join-deployment', deploymentId);
    socket.on('log',                onLog);
    socket.on('deployment:complete', onComplete);
    socket.on('deployment:failed',   onFailed);

    return () => {
      socket.emit('leave-deployment', deploymentId);
      socket.off('log',                onLog);
      socket.off('deployment:complete', onComplete);
      socket.off('deployment:failed',   onFailed);
    };
  }, [socket, deploymentId]);
};