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
  showEmailInterface: boolean;
  showProfessorInterface: boolean;
  
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
  sendEmail: () => void;
  resetToEmailInterface: () => void;
  showProfessorReceiving: () => void;
  continueFromProfessor: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  currentStep: 0,
  direction: 'encapsulamento',
  steps: [],
  message: '',
  scenario: 'email',
  isPlaying: false,
  isAutoMode: false,
  speed: 2000,
  showEmailInterface: true,
  showProfessorInterface: false,

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
    } else {
      // Quando a simulação termina, mostrar tela da professora
      get().showProfessorReceiving();
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

  sendEmail: () => {
    const emailContent = 'E-mail';
    set({ 
      message: emailContent,
      showEmailInterface: false 
    });
    get().startSimulation();
  },

  resetToEmailInterface: () => set({
    showEmailInterface: true,
    showProfessorInterface: false,
    steps: [],
    currentStep: 0,
    isPlaying: false
  }),

  showProfessorReceiving: () => set({
    showProfessorInterface: true,
    isPlaying: false
  }),

  continueFromProfessor: () => set({
    showProfessorInterface: false,
    showEmailInterface: true,
    steps: [],
    currentStep: 0,
    message: '',
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
      campos: [
        'Host: Endereço do servidor de destino',
        'User-Agent: Identificação do navegador usado',
        'Content-Type: Tipo de conteúdo sendo enviado'
      ],
      envelope: 'HTTP'
    },
    6: {
      sdu: `HTTP Request: ${message}`,
      pdu: `[UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: [
        'Encoding UTF-8: Codificação de caracteres padrão',
        'Compression ZIP: Compressão para reduzir tamanho',
        'Encryption AES-256: Criptografia para segurança'
      ],
      envelope: 'SSL/TLS'
    },
    5: {
      sdu: `[UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: [
        'Session ID: Identificador único da sessão ativa',
        'Keep-Alive: Tempo para manter conexão aberta'
      ],
      envelope: 'Session'
    },
    4: {
      sdu: `[Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: [
        'Porta de Origem: Porta do seu computador (5050)',
        'Porta de Destino: Porta do servidor (443 - HTTPS)',
        'Número de Sequência: Ordem dos dados enviados',
        'ACK: Confirmação de recebimento dos dados'
      ],
      envelope: 'TCP'
    },
    3: {
      sdu: `[TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: [
        'IP de Origem: Endereço do seu computador (192.168.1.100)',
        'IP de Destino: Endereço do servidor Google (8.8.8.8)',
        'TTL: Tempo de vida do pacote na rede (64 saltos)'
      ],
      envelope: 'IP'
    },
    2: {
      sdu: `[IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `[Ethernet] [IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      campos: [
        'MAC de Origem: Endereço físico da sua placa de rede',
        'MAC de Destino: Endereço físico do roteador/switch'
      ],
      envelope: 'Ethernet'
    },
    1: {
      sdu: `[Ethernet] [IP] [TCP] [Session] [UTF-8][ZIP][AES-256] HTTP Request: ${message}`,
      pdu: `10110101011010101... (Sinais Elétricos)`,
      campos: [
        'Frequência: Velocidade de transmissão (2.4GHz)',
        'Voltagem: Sinais elétricos (+/-5V) para bits 0 e 1',
        'Taxa de Bits: Velocidade de dados (1Gbps)'
      ],
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