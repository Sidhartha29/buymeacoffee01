import React, { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";
import { useMessages } from "../hooks/useMessages";

export default function Messages() {
  const { conversations, sendMessage } = useMessages();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    conversations[0]?.id || null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations by participant name
  const filteredConversations = conversations.filter((conv) =>
    conv.participants
      .some((p) =>
        p.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Current conversation
  const currentConversation = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  // Current messages
  const currentMessages = currentConversation ? currentConversation.messages : [];

  // Other participant (not current user "1")
  const getOtherUser = (conv: any) =>
    conv.participants.find((p: any) => p.id !== "1");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      sendMessage(selectedConversation, newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Connect with your community</p>
          </div>
        </div>

        <div className="flex h-[calc(100vh-140px)]">
          {/* Conversations Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                const lastMessage =
                  conversation.messages[conversation.messages.length - 1];

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id
                        ? "bg-yellow-50 border-l-4 border-l-yellow-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={otherUser?.avatar}
                        alt={otherUser?.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherUser?.displayName}
                            {otherUser?.isVerified && (
                              <span className="ml-1 text-yellow-500">✓</span>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {new Date(conversation.updatedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {lastMessage?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getOtherUser(currentConversation)?.avatar}
                        alt={getOtherUser(currentConversation)?.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="font-medium text-gray-900">
                          {getOtherUser(currentConversation)?.displayName}
                          {getOtherUser(currentConversation)?.isVerified && (
                            <span className="ml-1 text-yellow-500">✓</span>
                          )}
                        </h2>
                        <p className="text-sm text-gray-500">Active recently</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === "1"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === "1"
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === "1"
                              ? "text-black/70"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
