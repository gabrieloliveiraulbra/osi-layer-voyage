import { create } from 'zustand';
import { SimulationStep, DataUnit, OSI_LAYERS } from '@/types/osi';

interface SimulationState {
  currentStep: number;
  direction: 'encapsulamento' | 'desencapsulamento';
  steps: SimulationStep[];
  message: string;
  scenario: string;
  isPlaying: boolean;
  isAutoMode: boolean;
  speed: number;
  
  // Actions
  setMessage: (message: string) => void;
  setScenario: (scenario: string) => void;
  startSimulation: () => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  togglePlay: () => void;
  toggleAutoMode: () => void;
  setSpeed: (speed: number) => void;
  generateSteps: (message: string, scenario: string) => SimulationStep[];
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  currentStep: 0,
  direction: 'encapsulamento',
  steps: [],
  message: '',
  scenario: 'download',
  isPlaying: false,
  isAutoMode: false,
  speed: 2000,

  setMessage: (message) => set({ message }),
  
  setScenario: (scenario) => set({ scenario }),

  startSimulation: () => {
    const { message, scenario } = get();
    const steps = get().generateSteps(message, scenario);
    set({ 
      steps, 
      currentStep: 0, 
      direction: 'encapsulamento',
      isPlaying: false 
    });
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  reset: () => set({ 
    currentStep: 0, 
    direction: 'encapsulamento',
    isPlaying: false 
  }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  toggleAutoMode: () => set((state) => ({ isAutoMode: !state.isAutoMode })),
  
  setSpeed: (speed) => set({ speed }),

  generateSteps: (message: string, scenario: string): SimulationStep[] => {
    const steps: SimulationStep[] = [];
    
    // Encapsulamento (7 → 1)
    OSI_LAYERS.forEach((layer, index) => {
      const dataUnit = generateDataUnit(layer.id, message, scenario, 'encapsulamento');
      steps.push({
        camada: layer.id,
        direction: 'encapsulamento',
        dataUnit,
        explanation: `Camada ${layer.id} (${layer.nome}): ${layer.processo}`
      });
    });

    // Desencapsulamento (1 → 7)
    [...OSI_LAYERS].reverse().forEach((layer) => {
      const dataUnit = generateDataUnit(layer.id, message, scenario, 'desencapsulamento');
      steps.push({
        camada: layer.id,
        direction: 'desencapsulamento', 
        dataUnit,
        explanation: `Camada ${layer.id} (${layer.nome}): Remove cabeçalho e processa dados`
      });
    });

    return steps;
  }
}));

function generateDataUnit(layerId: number, message: string, scenario: string, direction: string): DataUnit {
  const examples = {
    7: {
      sdu: message,
      pdu: `HTTP Request: ${message}`,
      campos: ['Host: example.com', 'User-Agent: Browser', 'Content-Type: text/html'],
      envelope: 'HTTP'
    },
    6: {
      sdu: `HTTP Request: ${message}`,
      pdu: `[UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: ['Encoding: UTF-8', 'Compression: ZIP', 'Encryption: AES-256'],
      envelope: 'SSL/TLS'
    },
    5: {
      sdu: `[UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: ['Session ID: 12345', 'Keep-Alive: 300s'],
      envelope: 'Session'
    },
    4: {
      sdu: `[Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: ['Src Port: 5050', 'Dst Port: 443', 'Seq: 001', 'ACK: 0'],
      envelope: 'TCP'
    },
    3: {
      sdu: `[TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: ['Src IP: 192.168.1.100', 'Dst IP: 8.8.8.8', 'TTL: 64'],
      envelope: 'IP'
    },
    2: {
      sdu: `[IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[Ethernet] [IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: ['Src MAC: AA:BB:CC:DD:EE:FF', 'Dst MAC: 11:22:33:44:55:66'],
      envelope: 'Ethernet'
    },
    1: {
      sdu: `[Ethernet] [IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `10110101011010101... (Sinais Elétricos)`,
      campos: ['Frequency: 2.4GHz', 'Signal: +/-5V', 'Bits/sec: 1Gbps'],
      envelope: 'Physical'
    }
  };

  return examples[layerId as keyof typeof examples] || {
    sdu: message,
    pdu: message,
    campos: [],
    envelope: 'Generic'
  };
}