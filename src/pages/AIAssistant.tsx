import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Medical Assistant. Ask me anything about medicine, anatomy, diseases, or medical procedures.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call the OpenAI API via edge function)
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        pneumonia: "Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing symptoms like cough with phlegm, fever, chills, and difficulty breathing. It can be caused by bacteria, viruses, or fungi.",
        heart: "The heart is a muscular organ that pumps blood throughout the body via the circulatory system. It has four chambers: two atria (upper chambers) and two ventricles (lower chambers). The right side pumps deoxygenated blood to the lungs, while the left side pumps oxygenated blood to the rest of the body.",
        diabetes: "Diabetes is a chronic condition that affects how your body turns food into energy. There are two main types: Type 1 (autoimmune condition where the pancreas produces little to no insulin) and Type 2 (where the body becomes resistant to insulin or doesn't make enough). Management includes blood sugar monitoring, medication, diet, and exercise.",
      };

      let responseContent = "I understand you're asking about medical topics. ";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("pneumonia")) {
        responseContent = responses.pneumonia;
      } else if (lowerInput.includes("heart")) {
        responseContent = responses.heart;
      } else if (lowerInput.includes("diabetes")) {
        responseContent = responses.diabetes;
      } else {
        responseContent += "While I can provide general medical information, please consult with a qualified healthcare provider for specific medical advice or diagnosis. Is there a particular medical topic you'd like to learn more about?";
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">AI Medical Assistant</h1>
          <p className="text-muted-foreground text-lg">
            Get instant answers to your medical questions
          </p>
        </div>

        <Card className="border-2 h-[calc(100vh-16rem)]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg medical-gradient flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              Medical AI Chat
            </CardTitle>
            <CardDescription>
              Ask questions about medical conditions, anatomy, or treatments
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100%-100px)]">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full medical-gradient flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full medical-gradient flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a medical question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="medical-gradient text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send • This is an educational tool, not a substitute for professional medical advice
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
