from pathlib import Path
import sys

root = Path(sys.argv[1])
service = root / "app/src/main/java/com/vozia/translate/TranslatorService.kt"
t = service.read_text()

old_order = '''        Diagnostics.markStage(this, "pipe_created")
        startSpeechRecognizerWithInjectedAudio(pipeRead!!)
        Diagnostics.markStage(this, "speech_recognizer_requested")
        startAudioPump(minBuffer)'''
new_order = '''        Diagnostics.markStage(this, "pipe_created")
        Diagnostics.markStage(this, "audio_pump_requested_before_recognizer")
        startAudioPump(minBuffer)
        if (stopping.get()) return
        Diagnostics.markStage(this, "audio_pump_running_before_recognizer")
        startSpeechRecognizerWithInjectedAudio(pipeRead!!)
        if (!stopping.get()) {
            Diagnostics.markStage(this, "speech_recognizer_requested")
        }'''
if old_order not in t:
    raise SystemExit("capture/recognizer order block not found")
t = t.replace(old_order, new_order, 1)

old_audio_fail = '''        if (!started) {
            capturing.set(false)
            publishStatus("Não foi possível iniciar a captura de áudio")
            stopEverything()
            return
        }'''
new_audio_fail = '''        if (!started) {
            capturing.set(false)
            Diagnostics.markStage(this, "audio_record_start_failed")
            publishStatus("Não foi possível iniciar a captura de áudio")
            stopEverything("audio_record_start_failed", true)
            return
        }'''
if old_audio_fail not in t:
    raise SystemExit("audio start failure block not found")
t = t.replace(old_audio_fail, new_audio_fail, 1)

old_speech_fail = '''            publishStatus("Reconhecedor não aceitou o áudio")
            stopEverything()'''
new_speech_fail = '''            publishStatus("Reconhecedor não aceitou o áudio")
            stopEverything("speech_start_listening_failure", true)'''
if old_speech_fail in t:
    t = t.replace(old_speech_fail, new_speech_fail, 1)

service.write_text(t)

diag = root / "app/src/main/java/com/vozia/translate/Diagnostics.kt"
d = diag.read_text().replace("Vozia 0.1.4 diagnostico", "Vozia 0.1.7 diagnostico")
diag.write_text(d)

gradle = root / "app/build.gradle.kts"
g = gradle.read_text()
g = g.replace("versionCode = 7", "versionCode = 8")
g = g.replace('versionName = "0.1.6"', 'versionName = "0.1.7"')
gradle.write_text(g)

layout = root / "app/src/main/res/layout/activity_main.xml"
x = layout.read_text().replace(
    "v0.1.6 • serviço em segundo plano",
    "v0.1.7 • captura antes do reconhecimento"
)
layout.write_text(x)
