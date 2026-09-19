from pathlib import Path
import sys

root = Path(sys.argv[1])
service = root / "app/src/main/java/com/vozia/translate/TranslatorService.kt"
t = service.read_text()

# Imports necessários para manter a sessão MediaProjection com um VirtualDisplay mínimo.
imports = [
    ("import android.media.AudioRecord\n", "import android.media.AudioRecord\nimport android.media.ImageReader\n"),
    ("import android.media.projection.MediaProjectionManager\n", "import android.media.projection.MediaProjectionManager\nimport android.hardware.display.DisplayManager\nimport android.hardware.display.VirtualDisplay\nimport android.graphics.PixelFormat\n")
]
for old, new in imports:
    if old in t and new not in t:
        t = t.replace(old, new, 1)

# Campos de retenção do VirtualDisplay e ImageReader.
field_anchor = "    private var mediaProjection: MediaProjection? = null\n"
field_new = """    private var mediaProjection: MediaProjection? = null
    private var projectionDisplay: VirtualDisplay? = null
    private var projectionImageReader: ImageReader? = null
"""
if field_anchor not in t:
    raise SystemExit("mediaProjection field not found")
t = t.replace(field_anchor, field_new, 1)

# Após registrar o callback, cria um VirtualDisplay 64x64 e descarta todos os frames.
capture_anchor = "        val captureBuilder = AudioPlaybackCaptureConfiguration.Builder(mediaProjection!!)\n"
virtual_display_block = """        Diagnostics.markStage(this, "before_virtual_display_create")
        projectionImageReader = ImageReader.newInstance(
            64,
            64,
            PixelFormat.RGBA_8888,
            2
        ).also { reader ->
            reader.setOnImageAvailableListener({ r ->
                runCatching { r.acquireLatestImage()?.close() }
            }, mainHandler)
        }

        projectionDisplay = mediaProjection?.createVirtualDisplay(
            "VoziaAudioProjection",
            64,
            64,
            resources.displayMetrics.densityDpi.coerceAtLeast(1),
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            projectionImageReader?.surface,
            null,
            mainHandler
        )

        if (projectionDisplay == null) {
            Diagnostics.markStage(this, "virtual_display_create_failed")
            publishStatus("Não foi possível manter a sessão de captura")
            stopEverything("virtual_display_create_failed", true)
            return
        }
        Diagnostics.markStage(this, "virtual_display_created")

"""
if capture_anchor not in t:
    raise SystemExit("capture builder anchor not found")
t = t.replace(capture_anchor, virtual_display_block + capture_anchor, 1)

# Limpeza do VirtualDisplay/ImageReader antes de parar o MediaProjection.
stop_anchor = """        runCatching { mediaProjection?.stop() }
        mediaProjection = null
"""
stop_new = """        runCatching { projectionDisplay?.release() }
        projectionDisplay = null
        runCatching { projectionImageReader?.close() }
        projectionImageReader = null
        runCatching { mediaProjection?.stop() }
        mediaProjection = null
"""
if stop_anchor not in t:
    raise SystemExit("mediaProjection cleanup block not found")
t = t.replace(stop_anchor, stop_new, 1)

service.write_text(t)

diag = root / "app/src/main/java/com/vozia/translate/Diagnostics.kt"
d = diag.read_text().replace("Vozia 0.1.8 diagnostico", "Vozia 0.1.9 diagnostico")
diag.write_text(d)

gradle = root / "app/build.gradle.kts"
g = gradle.read_text()
g = g.replace("versionCode = 9", "versionCode = 10")
g = g.replace('versionName = "0.1.8"', 'versionName = "0.1.9"')
gradle.write_text(g)

layout = root / "app/src/main/res/layout/activity_main.xml"
x = layout.read_text().replace(
    "v0.1.8 • captura da tela inteira",
    "v0.1.9 • projeção persistente"
)
layout.write_text(x)
