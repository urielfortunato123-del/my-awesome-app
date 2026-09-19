from pathlib import Path
import sys

root = Path(sys.argv[1])

main = root / "app/src/main/java/com/vozia/translate/MainActivity.kt"
m = main.read_text()

imp = "import android.media.projection.MediaProjectionConfig\n"
if imp not in m:
    anchor = "import android.media.projection.MediaProjectionManager\n"
    if anchor not in m:
        raise SystemExit("MediaProjectionManager import not found")
    m = m.replace(anchor, anchor + imp, 1)

old_launch = '''            val manager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            statusText.text = "Autorize a captura para traduzir o áudio do vídeo."
            projectionLauncher.launch(manager.createScreenCaptureIntent())'''
new_launch = '''            val manager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            statusText.text = "Autorize a captura da tela inteira para traduzir o áudio de outros apps."
            val captureIntent = if (Build.VERSION.SDK_INT >= 34) {
                manager.createScreenCaptureIntent(
                    MediaProjectionConfig.createConfigForDefaultDisplay()
                )
            } else {
                manager.createScreenCaptureIntent()
            }
            projectionLauncher.launch(captureIntent)'''
if old_launch not in m:
    raise SystemExit("screen capture launch block not found")
m = m.replace(old_launch, new_launch, 1)
main.write_text(m)

service = root / "app/src/main/java/com/vozia/translate/TranslatorService.kt"
t = service.read_text()

old_cb = '''        mediaProjection?.registerCallback(object : MediaProjection.Callback() {
            override fun onStop() {
                if (!stopping.get()) {
                    publishStatus("Captura encerrada pelo Android")
                    stopEverything()
                }
            }
        }, mainHandler)'''
new_cb = '''        mediaProjection?.registerCallback(object : MediaProjection.Callback() {
            override fun onStop() {
                if (!stopping.get()) {
                    Diagnostics.markStage(this@TranslatorService, "media_projection_onStop")
                    publishStatus("Captura de tela encerrada pelo Android")
                    stopEverything("media_projection_onStop", true)
                }
            }

            override fun onCapturedContentVisibilityChanged(isVisible: Boolean) {
                Diagnostics.markStage(
                    this@TranslatorService,
                    if (isVisible) "projection_content_visible" else "projection_content_hidden"
                )
            }
        }, mainHandler)'''
if old_cb not in t:
    raise SystemExit("MediaProjection callback block not found")
t = t.replace(old_cb, new_cb, 1)

# Elimina alguns internal_stop remanescentes da inicialização.
repls = [
    ('publishStatus("Captura não autorizada")\n                            stopEverything()',
     'publishStatus("Captura não autorizada")\n                            stopEverything("projection_not_authorized", true)'),
    ('publishStatus("Captura incompatível: ${it.javaClass.simpleName}")\n            stopEverything()',
     'publishStatus("Captura incompatível: ${it.javaClass.simpleName}")\n            stopEverything("playback_capture_failure", true)'),
    ('publishStatus("Captura de áudio indisponível neste app/aparelho")\n            stopEverything()',
     'publishStatus("Captura de áudio indisponível neste app/aparelho")\n            stopEverything("audio_record_uninitialized", true)')
]
for old, new in repls:
    if old in t:
        t = t.replace(old, new, 1)

service.write_text(t)

diag = root / "app/src/main/java/com/vozia/translate/Diagnostics.kt"
d = diag.read_text().replace("Vozia 0.1.7 diagnostico", "Vozia 0.1.8 diagnostico")
diag.write_text(d)

gradle = root / "app/build.gradle.kts"
g = gradle.read_text()
g = g.replace("versionCode = 8", "versionCode = 9")
g = g.replace('versionName = "0.1.7"', 'versionName = "0.1.8"')
gradle.write_text(g)

layout = root / "app/src/main/res/layout/activity_main.xml"
x = layout.read_text().replace(
    "v0.1.7 • captura antes do reconhecimento",
    "v0.1.8 • captura da tela inteira"
)
layout.write_text(x)
