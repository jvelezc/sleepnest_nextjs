"use client";

import { X, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface ChatWindowProps {
  specialistId: string;
  caregiverId: string;
  caregiverName: string;
  onClose: () => void;
}

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  edited: boolean;
  deleted: boolean;
  read: boolean;
}

export function ChatWindow({ specialistId, caregiverId, caregiverName, onClose }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    let messageChannel: RealtimeChannel | null = null;

    const loadMessages = async () => {
      try {
        const { data: roomId, error: roomError } = await supabase.rpc(
          "get_or_create_chat_room",
          {
            p_specialist_id: specialistId,
            p_caregiver_id: caregiverId,
          }
        );

        if (roomError) throw roomError;

        messageChannel = supabase
          .channel(`room:${roomId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `room_id=eq.${roomId}`,
            },
            (payload) => {
              const newMessage = payload.new as Message;
              if (newMessage.sender_id !== specialistId) {
                setMessages((prev) => [...prev, newMessage]);
              }
            }
          )
          .subscribe();

        setChannel(messageChannel);

        const { data, error: messagesError } = await supabase.rpc("chat_get_messages", {
          p_room_id: roomId,
        });

        if (messagesError) throw messagesError;

        if (mounted) {
          setMessages(data || []);
          setLoading(false);
        }

        await supabase.rpc("chat_mark_messages_read", { p_room_id: roomId });
      } catch (err) {
        console.error("Error loading messages:", err);
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load messages",
          });
          setLoading(false);
        }
      }
    };

    loadMessages();
    return () => {
      mounted = false;
      if (messageChannel) {
        messageChannel.unsubscribe();
      }
    };
  }, [specialistId, caregiverId, toast]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const { data: roomId, error: roomError } = await supabase.rpc("get_or_create_chat_room", {
        p_specialist_id: specialistId,
        p_caregiver_id: caregiverId,
      });

      if (roomError) throw roomError;

      const { data: messageId, error: messageError } = await supabase.rpc("chat_save_message", {
        p_room_id: roomId,
        p_content: message.trim(),
      });

      if (messageError) throw messageError;

      const newMessage: Message = {
        id: messageId,
        room_id: roomId,
        sender_id: specialistId,
        content: message.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        edited: false,
        deleted: false,
        read: false,
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-4 bg-background rounded-lg shadow-lg border flex flex-col">
        <Card className="flex-1 flex flex-col relative">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarFallback>{caregiverName[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{caregiverName}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="text-center">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground">No messages yet.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === specialistId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2 ${isOwn ? "flex-row-reverse" : ""} group`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{isOwn ? "ME" : caregiverName[0]}</AvatarFallback>
                        </Avatar>
                        <div 
                          className={`flex flex-col ${isOwn ? "items-end" : ""} gap-1 max-w-[80%] relative`}
                        >
                          <div 
                            className={`
                              px-4 py-2 rounded-2xl text-sm
                              ${isOwn ? 
                                "bg-primary text-primary-foreground rounded-tr-sm" : 
                                "bg-muted rounded-tl-sm"
                              }
                              group-hover:shadow-sm transition-shadow
                            `}
                          >
                            {msg.content}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(msg.created_at), "h:mm a")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t flex items-center gap-2 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={sending}
                className="bg-background"
              />
              <Button
                size="icon"
                variant="default"
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}