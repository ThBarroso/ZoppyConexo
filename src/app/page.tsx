'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Popup from '../components/Popup';

// Função para embaralhar os blocos
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Home() {
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [connectedGroups, setConnectedGroups] = useState<{ name: string; words: string[] }[]>([]);
  const [words, setWords] = useState([
    'Segmentação assertiva de público',
    'Personalização por comportamento',
    'Comunicação personalizada por perfil',
    'Segmentação RFM',
    'Comunicação em massa',
    'Templates validados',
    'Mensagens por multicanais',
    'Interação com usuários',
    'Automatização de estratégias',
    'Fluxos de mensagens personalizadas',
    'Personalização de jornadas',
    'Configuração de gatilhos',
    'Recência',
    'Frequência',
    'Valor monetário',
    'Análise de clientes',
  ]);
  const [attempts, setAttempts] = useState(0);
  const [ranking, setRanking] = useState<{ name: string; points: number }[]>([]); // Atualizado para incluir 'points'
  const [showRanking, setShowRanking] = useState(false);
  const [popup, setPopup] = useState<{ title: string; message: string } | null>(null); // Estado para o popup
  const [startTime, setStartTime] = useState<number | null>(null); // Armazena o tempo de início
  const [gameFinished, setGameFinished] = useState(false); // Estado para controlar se o jogo terminou

  const groups = [
    {
      name: 'Matriz RFM',
      words: [
        'Segmentação assertiva de público',
        'Personalização por comportamento',
        'Comunicação personalizada por perfil',
        'Segmentação RFM',
      ],
    },
    {
      name: 'Campanhas',
      words: [
        'Comunicação em massa',
        'Templates validados',
        'Mensagens por multicanais',
        'Interação com usuários',
      ],
    },
    {
      name: 'Fluxo de automações',
      words: [
        'Automatização de estratégias',
        'Fluxos de mensagens personalizadas',
        'Personalização de jornadas',
        'Configuração de gatilhos',
      ],
    },
    {
      name: 'Métricas RFM',
      words: ['Recência', 'Frequência', 'Valor monetário', 'Análise de clientes'],
    },
  ];

  // Carregar o ranking do localStorage ao carregar a página
  useEffect(() => {
    const storedRanking = localStorage.getItem('ranking');
    if (storedRanking) {
      const parsedRanking = JSON.parse(storedRanking);
      if (Array.isArray(parsedRanking)) {
        setRanking(parsedRanking.map((entry) => ({
          name: entry.name,
          points: entry.points || 0, // Garante que 'points' exista
        })));
      }
    }
  }, []);

  // Salvar o ranking no localStorage sempre que ele for atualizado
  useEffect(() => {
    localStorage.setItem('ranking', JSON.stringify(ranking));
  }, [ranking]);

  const handleStartGame = () => {
    if (name.trim() === '') {
      setPopup({ title: 'Erro', message: 'Por favor, insira seu nome antes de começar.' });
      return;
    }
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setSelectedWords([]);
    setConnectedGroups([]);
    setWords(shuffleArray(words)); // Embaralha os blocos antes de começar o jogo
  };

  const handleSquareClick = (word: string) => {
    if (!startTime) {
      setStartTime(Date.now()); // Registra o tempo de início ao selecionar o primeiro quadrado
    }

    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleSubmit = () => {
    setAttempts(attempts + 1); // Incrementa as tentativas

    const matchedGroup = groups.find((group) =>
      group.words.every((word) => selectedWords.includes(word))
    );

    if (matchedGroup) {
      const endTime = Date.now();
      const elapsedTime = (endTime - (startTime || endTime)) / 1000; // Tempo decorrido em segundos
      setStartTime(null); // Reseta o tempo de início para o próximo grupo

      // Calcula a pontuação com base no tempo decorrido
      let points = 0;
      if (elapsedTime <= 10) points = 20;
      else if (elapsedTime <= 20) points = 15;
      else if (elapsedTime <= 30) points = 10;
      else if (elapsedTime <= 60) points = 5;
      else points = 1;

      setScore(score + points); // Atualiza a pontuação

      // Adiciona o grupo conectado com o nome e palavras
      setConnectedGroups([...connectedGroups, { name: matchedGroup.name, words: matchedGroup.words }]);
      setSelectedWords([]);
      const remainingWords = words.filter((word) => !matchedGroup.words.includes(word));
      setWords(remainingWords);

      // Verifica se todos os grupos foram conectados
      if (connectedGroups.length + 1 === groups.length) {
        setRanking([...ranking, { name, points: score + points }]); // Adiciona o jogador ao ranking com 'points'
        setShowRanking(true); // Mostra a tela de ranking
        setGameFinished(true); // Marca o jogo como terminado
      }
    } else {
      setPopup({
        title: 'Erro',
        message: 'O grupo selecionado não é válido.',
      });
    }
  };

  const handleClearRanking = () => {
    setPopup({
      title: 'Confirmação',
      message: 'Tem certeza de que deseja limpar o histórico?',
    });
  };

  const confirmClearRanking = () => {
    setRanking([]); // Limpa o ranking
    localStorage.removeItem('ranking'); // Remove do localStorage
    setPopup(null); // Fecha o popup
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-cyan-500 to-blue-500 text-white">
      {popup && (
        <Popup
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)} // Fecha o popup
        >
          {popup.title === 'Confirmação' ? (
            // Caso de confirmação (Esvaziar histórico)
            <>
              <button
                onClick={() => {
                  confirmClearRanking(); // Confirma a limpeza do histórico
                  setPopup(null); // Fecha o popup
                }}
                className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600"
              >
                Confirmar
              </button>
              <button
                onClick={() => setPopup(null)} // Fecha o popup sem limpar
                className="bg-gray-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-600"
              >
                Voltar
              </button>
            </>
          ) : (
            // Caso de erro (Grupo inválido)
            <button
              onClick={() => setPopup(null)} // Fecha o popup
              className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
            >
              Fechar
            </button>
          )}
        </Popup>
      )}
      {!gameStarted && !showRanking ? (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Zoppy Conexo</h1>
          <p className="mb-4">Encontre grupos de 4 palavras que se conectam em algum tema relacionado às funcionalidades da Zoppy.</p>
          <p className="mb-4">Você terá 2 minutos para resolver o máximo de jogos possíveis!</p>
          <input
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded font-bold"
          >
            Começar Jogo
          </button>
          <button
            onClick={handleClearRanking}
            className="mt-8 flex items-center justify-center bg-red-500 text-white px-6 py-2 rounded font-bold hover:bg-red-600 shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M9 3a1 1 0 00-1 1v1H5a1 1 0 100 2h14a1 1 0 100-2h-3V4a1 1 0 00-1-1H9zm10 6a1 1 0 00-1 1v8a3 3 0 01-3 3H9a3 3 0 01-3-3V10a1 1 0 10-2 0v8a5 5 0 005 5h6a5 5 0 005-5V10a1 1 0 00-1-1zM10 12a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Esvaziar Histórico
          </button>
        </div>
      ) : showRanking ? (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-4">Ranking</h1>
          <ul className="text-left">
            {ranking
              .sort((a, b) => b.points - a.points) // Ordena por pontos em ordem decrescente
              .map((player, index) => (
                <li key={index} className="mb-2">
                  {index + 1}. {player.name} - {player.points} pontos
                </li>
              ))}
          </ul>
          <button
            onClick={() => {
              setShowRanking(false);
              setGameStarted(false);
              setName('');
              setWords([
                'Segmentação assertiva de público',
                'Personalização por comportamento',
                'Comunicação personalizada por perfil',
                'Segmentação RFM',
                'Comunicação em massa',
                'Templates validados',
                'Mensagens por multicanais',
                'Interação com usuários',
                'Automatização de estratégias',
                'Fluxos de mensagens personalizadas',
                'Personalização de jornadas',
                'Configuração de gatilhos',
                'Recência',
                'Frequência',
                'Valor monetário',
                'Análise de clientes',
              ]);
            }}
            className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded font-bold"
          >
            Voltar ao Início
          </button>
        </div>
      ) : (
        <>
          {gameFinished ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Parabéns! Você completou o jogo!</h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setGameFinished(false); // Reseta o estado do jogo
                    setGameStarted(false); // Volta para a tela inicial
                    setName('');
                    setWords([
                      'Segmentação assertiva de público',
                      'Personalização por comportamento',
                      'Comunicação personalizada por perfil',
                      'Segmentação RFM',
                      'Comunicação em massa',
                      'Templates validados',
                      'Mensagens por multicanais',
                      'Interação com usuários',
                      'Automatização de estratégias',
                      'Fluxos de mensagens personalizadas',
                      'Personalização de jornadas',
                      'Configuração de gatilhos',
                      'Recência',
                      'Frequência',
                      'Valor monetário',
                      'Análise de clientes',
                    ]);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded font-bold"
                >
                  Voltar ao Início
                </button>
                <button
                  onClick={() => {
                    setGameFinished(false); // Reseta o estado do jogo
                    setShowRanking(true); // Mostra o ranking
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded font-bold"
                >
                  Ver Ranking
                </button>
              </div>
            </div>
          ) : (
            // Renderização normal do jogo
            <div className="w-full max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg">Jogador: {name}</p>
                <p className="text-lg">Pontuação: {score}</p>
                <p className="text-lg">Tentativas: {attempts}</p>
              </div>
              <div className="mb-4">
                {connectedGroups.map((group, index) => (
                  <div
                    key={index}
                    className="bg-green-500 text-white p-4 rounded mb-2 shadow-lg"
                  >
                    <p className="font-bold">{group.name}</p>
                    <p>{group.words.join(', ')}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {words.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleSquareClick(word)}
                    className={`p-4 rounded shadow ${
                      selectedWords.includes(word)
                        ? 'bg-yellow-300 text-black border-4 border-yellow-500'
                        : 'bg-blue-600 text-white'
                    } hover:bg-gray-200`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                className="mt-4 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded font-bold"
              >
                Enviar Grupo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
