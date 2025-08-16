import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Paperclip, Send, User, Mail } from 'lucide-react';

interface EmailInterfaceProps {
  onSendEmail: () => void;
}

const EmailInterface = ({ onSendEmail }: EmailInterfaceProps) => {
  const [emailData] = useState({
    from: 'rafael@escola.com',
    to: 'andreia@escola.com',
    subject: 'Atividade 4 – Lógica de Programação',
    message: 'Olá professora Andréia, segue em anexo a Atividade 4 da disciplina de Lógica de Programação.',
    attachment: 'atividade4.py'
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header - Story Introduction */}
        <Card className="mb-6 layer-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              📧 História: Enviando um E-mail
            </CardTitle>
            <p className="text-muted-foreground">
              O aluno Rafael está enviando sua atividade de programação para a professora Andréia
            </p>
          </CardHeader>
        </Card>

        {/* Student Avatar and Context */}
        <Card className="mb-6 layer-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Rafael - Estudante</h3>
                <p className="text-muted-foreground">Enviando atividade de Lógica de Programação</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              💭 "Preciso enviar minha atividade para a professora. Vou usar o e-mail da escola para isso!"
            </p>
          </CardContent>
        </Card>

        {/* Email Interface */}
        <Card className="layer-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Compor E-mail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Field */}
            <div className="space-y-2">
              <Label htmlFor="from">De:</Label>
              <Input
                id="from"
                value={emailData.from}
                readOnly
                className="bg-muted/50 font-mono"
              />
            </div>

            {/* To Field */}
            <div className="space-y-2">
              <Label htmlFor="to">Para:</Label>
              <Input
                id="to"
                value={emailData.to}
                readOnly
                className="bg-muted/50 font-mono"
              />
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto:</Label>
              <Input
                id="subject"
                value={emailData.subject}
                readOnly
                className="bg-muted/50"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem:</Label>
              <Textarea
                id="message"
                value={emailData.message}
                readOnly
                className="bg-muted/50 resize-none"
                rows={3}
              />
            </div>

            {/* Attachment */}
            <div className="space-y-2">
              <Label>Anexo:</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{emailData.attachment}</span>
                <span className="text-xs text-muted-foreground">(2.5 KB)</span>
              </div>
            </div>

            {/* Send Button */}
            <div className="pt-4 border-t">
              <Button 
                onClick={onSendEmail} 
                className="w-full control-button text-lg py-3"
                size="lg"
              >
                <Send className="h-5 w-5 mr-2" />
                Enviar E-mail
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                🌐 Clique para ver como este e-mail viaja pela rede!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailInterface;