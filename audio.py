import os
from pathlib import Path
from elevenlabs import ElevenLabs, VoiceSettings
import subprocess
import platform
from audiostretchy.stretch import stretch_audio
from pydub import AudioSegment
import io

class AudioManager:
    def __init__(self, config):
        self.api_key = os.getenv('ELEVEN_API_KEY')
        if not self.api_key:
            raise ValueError("ELEVEN_API_KEY not found in environment variables")
            
        self.client = ElevenLabs(api_key=self.api_key)
        
        # Get voice settings from config
        voice_config = config.get('voice', {})
        self.voice_id = voice_config.get('voice_id', "pNInz6obpgDQGcFmaJgB")
        self.model = voice_config.get('model', "eleven_turbo_v2")
        
        # Initialize speed with config value or default
        initial_speed = voice_config.get('speed', 1.5)
        self._speed = max(0.1, min(initial_speed, 5.0))  # Clamp between 0.1x and 5.0x
        
        self.current_process = None
        
        # Create cache directory if it doesn't exist
        self.cache_dir = Path.home() / '.vaultkeeper' / 'audio_cache'
        self.cache_dir.mkdir(parents=True, exist_ok=True)
    
    @property
    def speed(self):
        return self._speed
    
    @speed.setter
    def speed(self, value):
        """Set playback speed (0.1x to 5.0x)"""
        self._speed = max(0.1, min(value, 5.0))
        print(f"Playback speed set to {self._speed}x")
        
    def generate_and_play(self, text):
        """Generate audio from text and play using system audio player with speed control"""
        try:
            print('Generating voice...')
            
            # Generate audio using ElevenLabs client
            response = self.client.text_to_speech.convert(
                voice_id=self.voice_id,
                text=text,
                model_id=self.model,
                voice_settings=VoiceSettings(
                    stability=0.5,
                    similarity_boost=0.75,
                    style=0.0,
                    use_speaker_boost=True
                )
            )
            
            # Collect all chunks into bytes
            audio_data = b''.join(chunk for chunk in response)
            
            # Convert MP3 to WAV using pydub
            audio = AudioSegment.from_mp3(io.BytesIO(audio_data))
            
            # Save original audio to temporary file as WAV
            original_path = self.cache_dir / 'original_audio.wav'
            audio.export(str(original_path), format='wav')
            
            # Create speed-adjusted version (using inverse ratio since stretch_audio expects duration ratio)
            output_path = self.cache_dir / 'current_audio.wav'
            stretch_audio(str(original_path), str(output_path), ratio=1/self._speed)
            
            # Stop any currently playing audio
            self.stop()
            
            # Play audio using system default player
            if platform.system() == 'Darwin':  # macOS
                self.current_process = subprocess.Popen(['afplay', str(output_path)])
            elif platform.system() == 'Linux':
                self.current_process = subprocess.Popen(['aplay', str(output_path)])
            else:
                print("Unsupported operating system for audio playback")
                
        except Exception as e:
            print(f"\nError generating/playing audio: {e}")
    
    def stop(self):
        """Stop current playback"""
        if self.current_process and self.current_process.poll() is None:
            self.current_process.terminate()
            self.current_process.wait() 