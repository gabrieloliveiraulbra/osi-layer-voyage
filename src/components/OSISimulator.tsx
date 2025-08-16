import { useState, useEffect } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Settings, ArrowLeft } from 'lucide-react';
import { OSI_LAYERS, SCENARIOS } from '@/types/osi';
import LayerVisualization from './LayerVisualization';
import DataFlowPanel from './DataFlowPanel';
import EmailInterface from './EmailInterface';

const OSISimulator = () => {
  const {
    currentStep,
    steps,
    message,
    scenario,
    isPlaying,
    isAutoMode,
    speed,
    showEmailInterface,
    setMessage,
    setScenario,
    startSimulation,
    nextStep,
    prevStep,
    reset,
    togglePlay,
    toggleAutoMode,
    setSpeed,
    sendEmail,
    resetToEmailInterface
  } = useSimulationStore();

  const [inputMessage, setInputMessage] = useState('GET /arquivo.pdf HTTP/1.1');

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || !isAutoMode) return;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        nextStep();
      } else {
        togglePlay();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, isAutoMode, currentStep, steps.length, speed, nextStep, togglePlay]);

  const handleStart = () => {
    setMessage(inputMessage);
    startSimulation();
  };

  const currentStepData = steps[currentStep];
  const currentLayer = OSI_LAYERS.find(layer => layer.id === currentStepData?.camada);

  // Show email interface first
  if (showEmailInterface) {
    return <EmailInterface onSendEmail={sendEmail} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <Card className="layer-card mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
              🌐 Simulador OSI Interativo
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Visualize como os dados são transformados em cada camada do modelo OSI
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um cenário" />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIOS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome} - {s.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="font-mono"
              />
              
              <Button onClick={handleStart} className="control-button">
                Iniciar Simulação
              </Button>
            </div>

            {/* Playback Controls */}
            {steps.length > 0 && (
              <div className="flex flex-col gap-4">
                {/* Back to Email Button */}
                <div className="flex justify-center">
                  <Button variant="outline" onClick={resetToEmailInterface} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para E-mail
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={prevStep} disabled={currentStep === 0}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={isPlaying ? togglePlay : togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={nextStep} disabled={currentStep >= steps.length - 1}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={reset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant={isAutoMode ? "default" : "outline"} 
                    size="sm" 
                    onClick={toggleAutoMode}
                  >
                    Auto Mode
                  </Button>
                  
                  <Select value={speed.toString()} onValueChange={(value) => setSpeed(parseInt(value))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">Rápido</SelectItem>
                      <SelectItem value="2000">Normal</SelectItem>
                      <SelectItem value="3000">Lento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Simulation Area */}
        {steps.length > 0 && currentStepData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Layer List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {currentStepData.direction === 'encapsulamento' ? 
                  '📤 Encapsulamento (7→1)' : 
                  '📥 Desencapsulamento (1→7)'
                }
              </h3>
              {OSI_LAYERS.map((layer) => (
                <Card 
                  key={layer.id} 
                  className={`layer-card transition-all duration-300 ${
                    layer.id === currentStepData.camada ? 'active ring-2 ring-primary' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${layer.cor}`} />
                      <div>
                        <h4 className="font-medium">
                          Camada {layer.id} - {layer.nome}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {layer.descricao}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Visualization */}
            <LayerVisualization 
              currentStep={currentStepData}
              layer={currentLayer}
            />

            {/* Data Flow Panel */}
            <DataFlowPanel 
              currentStep={currentStepData}
              layer={currentLayer}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OSISimulator;