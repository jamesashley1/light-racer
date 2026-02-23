/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private musicAudio: HTMLAudioElement | null = null;

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
  }

  playAmbientMusic() {
    if (this.musicAudio) return;
    this.musicAudio = new Audio('/NeonGridRun.mp3');
    this.musicAudio.loop = true;
    this.musicAudio.volume = 0.4;
    this.musicAudio.play().catch(e => console.log("Audio play failed (user interaction needed):", e));
  }

  stopAmbientMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.musicAudio = null;
    }
  }

  pauseAmbientMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
  }

  resumeAmbientMusic() {
    if (this.musicAudio) {
      this.musicAudio.play().catch(e => console.log("Audio resume failed:", e));
    } else {
      this.playAmbientMusic();
    }
  }

  private resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startEngine() {
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain || this.engineOsc) return;

    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();
    
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 60;
    
    this.engineGain.gain.value = 0.05;
    
    this.engineOsc.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
    
    this.engineOsc.start();
  }

  updateEngine(speedPercent: number) {
    if (!this.ctx || !this.engineOsc) return;
    // Map speed (0-1) to frequency (60-180Hz)
    const freq = 60 + speedPercent * 120;
    this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    this.engineGain?.gain.setTargetAtTime(0.02 + speedPercent * 0.05, this.ctx.currentTime, 0.1);
  }

  stopEngine() {
    if (this.engineOsc) {
      this.engineOsc.stop();
      this.engineOsc.disconnect();
      this.engineOsc = null;
    }
  }

  playCollision() {
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playBoost() {
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playSlow() {
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playTeleport() {
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + i * 400, now + i * 0.05);
      
      gain.gain.setValueAtTime(0.1, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.05 + 0.1);
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.1);
    }
  }
}

export const soundService = new SoundService();
