import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowLeft, Pause, Play, ArrowRight, VolumeX, Volume2, Shuffle, ListMusic, Globe, Lock, Upload, Repeat, Volume1, SkipBack, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopNavigation from './TopNavigation'; // Asumiendo que existe

const RelaxationScreen = ({ userProfile }) => {
  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(-1);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [newSoundName, setNewSoundName] = useState('');
  // Removed newSoundUrl
  const [isPublic, setIsPublic] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(false);

  const defaultSounds = [
    { id: '1', name: 'Lluvia Suave', url: 'https://www.soundjay.com/nature/sounds/rain-01.mp3', type: 'default', color: 'from-blue-400 to-blue-600' },
    { id: '2', name: 'Olas del Mar', url: 'https://www.soundjay.com/nature/sounds/ocean-waves-1.mp3', type: 'default', color: 'from-teal-400 to-teal-600' },
    { id: '3', name: 'Fuego', url: 'https://www.soundjay.com/nature/sounds/fire-1.mp3', type: 'default', color: 'from-green-400 to-green-600' },
  ];

  const allSounds = [...defaultSounds, ...playlist];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration || 0);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else if (isShuffle) {
        handleShufflePlay();
      } else {
        handleNext();
      }
    });
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => {});
      audio.removeEventListener('play', () => {});
      audio.removeEventListener('pause', () => {});
    };
  }, [isPlaying, currentSound, currentSoundIndex, allSounds, isShuffle, isRepeat]);

  const handlePlayPause = async (sound, index) => {
    if (currentSound && currentSound.id === sound.id) {
      const audio = audioRef.current;
      if (isPlaying) {
        audio.pause();
      } else {
        try {
          await audio.play();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSound(sound);
      setCurrentSoundIndex(index);
      setIsPlaying(true);
      if (audioRef.current) {
        const audio = audioRef.current;
        audio.pause();
        audio.src = sound.url;
        audio.load();
        try {
          await audio.play();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgressChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (allSounds.length === 0) return;
    let nextIndex = (currentSoundIndex + 1) % allSounds.length;
    handlePlayPause(allSounds[nextIndex], nextIndex);
  };

  const handlePrevious = () => {
    if (allSounds.length === 0) return;
    let prevIndex = currentSoundIndex - 1;
    if (prevIndex < 0) prevIndex = allSounds.length - 1;
    handlePlayPause(allSounds[prevIndex], prevIndex);
  };

  const handleShufflePlay = () => {
    if (allSounds.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allSounds.length);
    handlePlayPause(allSounds[randomIndex], randomIndex);
  };

  const playClick = () => {
    if (clickAudioRef.current) {
      try {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play();
      } catch (error) {
        console.error('Error playing click sound:', error);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setFilePreviewUrl(url);
    } else {
      e.target.value = '';
    }
  };


  const handleAddSoundFromFile = () => {
    if (newSoundName.trim() && selectedFile) {
      const newId = Date.now().toString();
      const url = URL.createObjectURL(selectedFile);
      const newSound = { id: newId, name: newSoundName.trim(), url, type: 'local', isPublic };
      setPlaylist(prev => [...prev, newSound]);
      setNewSoundName('');
      setSelectedFile(null);
      setFilePreviewUrl('');
      setIsPublic(false);
    }
  };

  const SoundItem = ({ sound, index, isCurrent, isPlaying, disabled = false }) => (
    <motion.div
      whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer w-full max-w-md transition-all duration-200 ${isCurrent ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-200  bg-white hover:border-gray-300 dark:hover:border-gray-500'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${sound.color || 'from-gray-300 to-gray-400'} flex items-center justify-center`}>
          <Music className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-semibold text-gray-900w ">{sound.name}</p>
          <p className="text-xs text-gray-500w ">{sound.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {sound.isPublic ? <Globe className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-gray-500w " />}
        <motion.button onClick={() => { if (!disabled) { playClick(); handlePlayPause(sound, index); } }} whileTap={{ scale: disabled ? 1 : 0.98 }} className={disabled ? 'cursor-not-allowed' : ''}>
          {isCurrent && isPlaying ? <Pause className="w-5 h-5 text-green-600" /> : <Play className="w-5 h-5 text-gray-500w " />}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100  text-gray-900w  p-4 relative overflow-hidden">
      {/* TopNavigation centrado */}
      <div className="flex justify-center items-center mb-6">
        <TopNavigation />
      </div>
      <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gray-100 from-gray-50w to-gray-500w  rounded-3xl shadow-xl p-8 max-w-3xl w-full border border-gray-200  text-center"
        >
          <Music className="w-16 h-16 text-green-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold mb-4 text-gray-800w ">Relajación y Sonidos</h2>
          <p className="text-gray-600w  mb-6">Escucha sonidos o crea tu playlist como un pro.</p>

          {/* Controles principales arriba */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-gray-800w ">Reproduciendo: {currentSound ? currentSound.name : 'Selecciona un sonido'}</h3>
            <audio ref={audioRef} preload="auto" className="hidden" />
            <audio ref={clickAudioRef} src="https://www.soundjay.com/buttons/sounds/button-30.mp3" preload="auto" className="hidden" />
          </div>

          {/* Playlists secciones con scroll */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-green-500 dark:text-green-400">
              <ListMusic className="w-6 h-6" /> Sonidos de la App
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
              {defaultSounds.map((sound, index) => {
                const isPremiumSound = false; // Todos libres
                const isLocked = isPremiumSound && !userProfile?.isPremium;
                return (
                  <div key={sound.id} className="relative">
                    <SoundItem
                      sound={sound}
                      index={index}
                      isCurrent={currentSound?.id === sound.id}
                      isPlaying={isPlaying}
                      disabled={isLocked}
                    />
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <div className="text-center text-white">
                          <Lock className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-bold">Premium</p>
                          <p className="text-xs">Desbloquea más sonidos</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <motion.div className="flex items-center justify-between mb-4" onClick={() => setShowPlaylist(!showPlaylist)}>
              <h3 className="text-2xl font-bold flex items-center gap-2 text-blue-500 dark:text-blue-400">
                <ListMusic className="w-6 h-6" /> Tu Playlist ({playlist.length})
              </h3>
              <Maximize2 className={`w-5 h-5 transition-transform ${showPlaylist ? 'rotate-180' : ''}`} />
            </motion.div>
            {showPlaylist && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto justify-items-center">
                {playlist.map((sound, index) => (
                  <SoundItem key={sound.id} sound={sound} index={defaultSounds.length + index} isCurrent={currentSound?.id === sound.id} isPlaying={isPlaying} />
                ))}
                {playlist.length === 0 && <p className="text-gray-400w  italic col-span-full text-center">Añade tus vibes aquí.</p>}
              </div>
            )}
          </div>

          {/* Añadir nuevo sonido, compacto */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 ">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 justify-center text-orange-500 dark:text-orange-400">
              <Upload className="w-6 h-6" /> Añadir Nuevo Sonido
            </h3>
            <input
              type="text"
              placeholder="Nombre del sonido"
              value={newSoundName}
              onChange={(e) => setNewSoundName(e.target.value)}
              className="w-full mb-3 p-3 bg-white border border-gray-300  rounded-lg text-gray-900w  placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className="grid grid-cols-1 gap-3 mb-3">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="w-full p-3 bg-white border border-gray-300  rounded-lg text-gray-900w  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
              />
              {filePreviewUrl && (
                <audio controls src={filePreviewUrl} className="w-full mt-2" />
              )}
            </div>
            <div className="flex items-center gap-2 mb-4 justify-center">
              <input type="checkbox" id="isPublic" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded" />
              <label htmlFor="isPublic" className="text-sm text-gray-700w ">Hacer público</label>
            </div>
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={handleAddSoundFromFile}
                disabled={!newSoundName.trim() || !selectedFile}
                whileHover={{ scale: 1.05 }}
                className="bg-green-500 disabled:opacity-50 px-6 py-3 rounded-full text-white font-semibold hover:bg-green-600"
              >
                Subir Archivo
              </motion.button>
            </div>
          </div>

          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-800w py-3 px-6 rounded-full border border-gray-300 transition-all font-semibold"
            >
              Volver al Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Barra de reproductor inferior estilo limpio */}
      {currentSound && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white/90/90 backdrop-blur-lg border-t border-gray-200  p-3 z-50 shadow-lg"
        >
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            {/* Info del track */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentSound.color} flex items-center justify-center`}>
                <Music className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900w  truncate">{currentSound.name}</p>
                <p className="text-xs text-gray-500w  truncate">{currentSound.type}</p>
              </div>
            </div>

            {/* Controles centrales */}
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <motion.button onClick={handlePrevious} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-600w hover:text-gray-800w p-2 rounded-full">
                <SkipBack className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => handlePlayPause(currentSound, currentSoundIndex)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-green-500 text-white p-3 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </motion.button>
              <motion.button onClick={handleNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-600w hover:text-gray-800w p-2 rounded-full">
                <SkipForward className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <span className="text-xs text-gray-600w  min-w-[4rem]">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="flex-1 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:rounded-full"
              />
              <span className="text-xs text-gray-600w  min-w-[4rem] text-right">{formatTime(duration)}</span>
            </div>

            {/* Controles derechos: volumen y repeat/shuffle */}
            <div className="flex items-center gap-4">
              <motion.button onClick={() => setIsShuffle(!isShuffle)} whileHover={{ scale: 1.1 }} className={`p-2 rounded-full ${isShuffle ? 'text-green-500' : 'text-gray-600w  hover:text-gray-800w '}`}>
                <Shuffle className="w-5 h-5" />
              </motion.button>
              <motion.button onClick={() => setIsRepeat(!isRepeat)} whileHover={{ scale: 1.1 }} className={`p-2 rounded-full ${isRepeat ? 'text-green-500' : 'text-gray-600w  hover:text-gray-800w '}`}>
                <Repeat className="w-5 h-5" />
              </motion.button>
              <div className="flex items-center gap-2">
                {volume > 0.5 ? (
                  <Volume2 className="w-5 h-5 text-gray-600w " />
                ) : volume > 0 ? (
                  <Volume1 className="w-5 h-5 text-gray-600w " />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600w " />
                )}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:bg-gray-800 dark:[&::-webkit-slider-thumb]:bg-gray-200 [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RelaxationScreen;
