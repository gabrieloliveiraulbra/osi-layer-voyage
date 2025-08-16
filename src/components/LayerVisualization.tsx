import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SimulationStep, OSILayer } from '@/types/osi';

interface LayerVisualizationProps {
  currentStep: SimulationStep;
  layer?: OSILayer;
}

const LayerVisualization = ({ currentStep, layer }: LayerVisualizationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [currentStep]);

  if (!currentStep || !layer) {
    return (
      <Card className="layer-card">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Inicie uma simulação para ver a visualização</p>
        </CardContent>
      </Card>
    );
  }

  const envelopes = currentStep.dataUnit.campos || [];
  const isEncapsulating = currentStep.direction === 'encapsulamento';

  return (
    <Card className="layer-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${layer.cor}`} />
          Camada {layer.id} - {layer.nome}
          <Badge variant={isEncapsulating ? "default" : "secondary"}>
            {isEncapsulating ? 'Encapsulando' : 'Desencapsulando'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Visualization */}
        <div className="space-y-4">
          <div className={`data-envelope ${isAnimating ? 'animate-envelope-wrap' : ''}`}>
            <div className="p-4 space-y-3">
              <div className="text-sm font-medium text-foreground">
                📊 Dados Atuais:
              </div>
              
              {/* Data Unit Display */}
              <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  {isEncapsulating ? (
                    <>
                      {/* Show envelopes being added */}
                      {envelopes.map((envelope, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-1 bg-primary/20 border border-primary/30 rounded text-primary text-xs
                            ${isAnimating ? 'animate-slide-down' : ''}`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          [{envelope.split(':')[0]}]
                        </span>
                      ))}
                      <span className="text-accent">
                        {currentStep.dataUnit.sdu}
                      </span>
                    </>
                  ) : (
                    <>
                      {/* Show envelopes being removed */}
                      <span className="text-accent">
                        {currentStep.dataUnit.pdu}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Protocol Details */}
              <div className="grid grid-cols-1 gap-2">
                {envelopes.map((campo, index) => (
                  <div 
                    key={index}
                    className={`flex items-center gap-2 text-xs bg-card/50 rounded p-2 border
                      ${isAnimating ? 'animate-data-flow' : ''}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="font-mono">{campo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Process Explanation */}
          <div className="bg-gradient-to-r from-muted/30 to-accent/10 rounded-lg p-4 border-l-4 border-accent">
            <h4 className="font-medium text-accent mb-2">🔄 Processo:</h4>
            <p className="text-sm text-foreground">
              {currentStep.explanation}
            </p>
          </div>

          {/* Visual Flow Arrow */}
          <div className="flex items-center justify-center">
            <div className={`flow-arrow ${isAnimating ? 'animate-pulse-glow' : ''}`}>
              {isEncapsulating ? '⬇️' : '⬆️'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerVisualization;