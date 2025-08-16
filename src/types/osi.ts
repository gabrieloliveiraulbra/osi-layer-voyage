export interface OSILayer {
  id: number;
  nome: string;
  descricao: string;
  processo: string;
  cor: string;
}

export interface DataUnit {
  sdu: string;
  pdu: string;
  campos: string[];
  envelope?: string;
}

export interface SimulationStep {
  camada: number;
  direction: 'encapsulamento' | 'desencapsulamento';
  dataUnit: DataUnit;
  explanation: string;
}

export interface Scenario {
  id: string;
  nome: string;
  descricao: string;
  exemploMensagem: string;
}

export const OSI_LAYERS: OSILayer[] = [
  {
    id: 7,
    nome: "Aplicação",
    descricao: "Interface com o usuário e aplicações",
    processo: "Cria requisição HTTPS com dados do usuário",
    cor: "from-purple-500 to-purple-600"
  },
  {
    id: 6,
    nome: "Apresentação", 
    descricao: "Codificação, compressão e criptografia",
    processo: "Codifica em UTF-8, comprime (ZIP) e criptografa (AES-256)",
    cor: "from-pink-500 to-pink-600"
  },
  {
    id: 5,
    nome: "Sessão",
    descricao: "Controle de sessões e conexões",
    processo: "Estabelece sessão SSL/TLS segura",
    cor: "from-blue-500 to-blue-600"
  },
  {
    id: 4,
    nome: "Transporte",
    descricao: "Controle de fluxo e segmentação",
    processo: "Adiciona cabeçalho TCP com portas e controle",
    cor: "from-green-500 to-green-600"
  },
  {
    id: 3,
    nome: "Rede",
    descricao: "Roteamento entre redes",
    processo: "Adiciona cabeçalho IP com endereços origem/destino",
    cor: "from-yellow-500 to-yellow-600"
  },
  {
    id: 2,
    nome: "Enlace",
    descricao: "Controle de acesso ao meio",
    processo: "Adiciona cabeçalho Ethernet com MACs",
    cor: "from-orange-500 to-orange-600"
  },
  {
    id: 1,
    nome: "Física",
    descricao: "Transmissão de bits",
    processo: "Converte em sinais elétricos/ópticos",
    cor: "from-red-500 to-red-600"
  }
];

export const SCENARIOS: Scenario[] = [
  {
    id: "download",
    nome: "Download Seguro",
    descricao: "Download de arquivo via HTTPS",
    exemploMensagem: "GET /arquivo.pdf HTTP/1.1"
  },
  {
    id: "email",
    nome: "E-mail Seguro", 
    descricao: "Envio de e-mail criptografado",
    exemploMensagem: "Oi! Segue o relatório em anexo."
  }
];