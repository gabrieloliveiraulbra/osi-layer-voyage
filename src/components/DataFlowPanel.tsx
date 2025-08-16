import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SimulationStep, OSILayer } from '@/types/osi';

interface DataFlowPanelProps {
  currentStep: SimulationStep;
  layer?: OSILayer;
}

const DataFlowPanel = ({ currentStep, layer }: DataFlowPanelProps) => {
  if (!currentStep || !layer) {
    return (
      <Card className="layer-card">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Aguardando dados...</p>
        </CardContent>
      </Card>
    );
  }

  const { dataUnit, direction } = currentStep;
  const isEncapsulating = direction === 'encapsulamento';

  return (
    <Card className="layer-card">
      <CardHeader>
        <CardTitle className="text-lg">
          📋 Fluxo de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Data */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              SDU-{layer.id}
            </Badge>
            <span className="text-sm font-medium">
              {isEncapsulating ? 'Entrada da Camada' : 'Dados Recebidos'}
            </span>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border-l-4 border-blue-500">
            <code className="text-sm text-foreground break-all">
              {dataUnit.sdu}
            </code>
          </div>
        </div>

        <Separator />

        {/* Process Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <span className="text-sm font-medium">Processamento</span>
          </div>
          <div className="bg-accent/10 rounded-lg p-3 border-l-4 border-accent">
            <p className="text-sm text-foreground">
              {layer.processo}
            </p>
          </div>
        </div>

        <Separator />

        {/* Output Data */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              PDU-{layer.id}
            </Badge>
            <span className="text-sm font-medium">
              {isEncapsulating ? 'Saída da Camada' : 'Dados Processados'}
            </span>
          </div>
          <div className="bg-success/10 rounded-lg p-3 border-l-4 border-success">
            <code className="text-sm text-foreground break-all">
              {dataUnit.pdu}
            </code>
          </div>
        </div>

        {/* Protocol Fields */}
        {dataUnit.campos && dataUnit.campos.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏷️</span>
                <span className="text-sm font-medium">Campos do Protocolo</span>
              </div>
              <div className="space-y-2">
                {dataUnit.campos.map((campo, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 bg-card/50 rounded p-2 text-xs font-mono"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{campo}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Direction Indicator */}
        <div className="flex items-center justify-center pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Direção:</span>
            <Badge variant={isEncapsulating ? "default" : "secondary"}>
              {isEncapsulating ? '📤 Origem → Destino' : '📥 Destino ← Origem'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataFlowPanel;