'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import Popup from '../components/Popup';

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
  const [ranking, setRanking] = useState<{ name: string; attempts: number }[]>([]);
  const [showRanking, setShowRanking] = useState(false);
  const [popup, setPopup] = useState<{ title: string; message: string } | null>(null); // Estado para o popup

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
      setRanking(JSON.parse(storedRanking));
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
  };

  const handleSquareClick = (word: string) => {
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
      setConnectedGroups([...connectedGroups, matchedGroup]);
      setScore(score + 10);
      setSelectedWords([]);
      const remainingWords = words.filter((word) => !matchedGroup.words.includes(word));
      setWords(remainingWords);

      // Verifica se todos os grupos foram conectados
      if (connectedGroups.length + 1 === groups.length) {
        setRanking([...ranking, { name, attempts: attempts + 1 }]);
        setShowRanking(true); // Mostra a tela de ranking
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
              .sort((a, b) => a.attempts - b.attempts)
              .map((player, index) => (
                <li key={index} className="mb-2">
                  {index + 1}. {player.name} - {player.attempts} tentativas
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
                    ? 'bg-yellow-300 text-black border-4 border-yellow-500' // Fundo amarelo ao ser clicado
                    : 'bg-blue-600 text-white' // Fundo azul por padrão
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
    </div>
  );
}
