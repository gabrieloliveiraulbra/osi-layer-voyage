import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Paperclip } from 'lucide-react';

interface ProfessorInterfaceProps {
  onContinue: () => void;
}

const ProfessorInterface = ({ onContinue }: ProfessorInterfaceProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Mail className="h-6 w-6" />
            E-mail Recebido - Professora Andréia
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium text-center">
              ✓ E-mail recebido com sucesso!
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-semibold text-gray-600">De:</div>
              <div className="col-span-2 bg-gray-50 p-2 rounded">rafael@escola.com</div>
              
              <div className="font-semibold text-gray-600">Para:</div>
              <div className="col-span-2 bg-gray-50 p-2 rounded">andreia@escola.com</div>
              
              <div className="font-semibold text-gray-600">Assunto:</div>
              <div className="col-span-2 bg-gray-50 p-2 rounded">Atividade 4 – Lógica de Programação</div>
            </div>

            <div className="border-t pt-4">
              <div className="font-semibold text-gray-600 mb-2">Mensagem:</div>
              <div className="bg-white border rounded-lg p-4 min-h-[100px]">
                <p className="text-gray-800">
                  Olá professora Andréia, segue em anexo a Atividade 4 da disciplina de Lógica de Programação.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="font-semibold text-gray-600 mb-2">Anexo:</div>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Paperclip className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800 font-medium">atividade4.py</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Arquivo Python
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={onContinue} 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Continuar Navegação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorInterface;