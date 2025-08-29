// useWebSocket.js
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { API_URL } from "./api";

export function useWebSocket(topic, onMessage) {
    useEffect(() => {
        if (!topic) return;

        const socket = new SockJS(`${API_URL}/ws`);
        const client = new Client({ webSocketFactory: () => socket });

        client.onConnect = () => {
            client.subscribe(topic, message => {
                if (message.body) {
                    onMessage(JSON.parse(message.body));
                }
            });
        };

        client.activate();
        return () => client.deactivate();
    }, [topic, onMessage]);
}
