from pathlib import Path
import sys

root = Path(sys.argv[1])
service = root / "app/src/main/java/com/vozia/translate/TranslatorService.kt"
t = service.read_text()

# Imports para manter a sessão MediaProjection ativa.
import_anchor = "import android.graphics.PixelFormat\n"
imports = "import android.graphics.PixelFormat\nimport android.hardware.display.DisplayManager\nimport android.hardware.display.VirtualDisplay\n"
if "import android.hardware.display.VirtualDisplay" not in t:
    if import_anchor not in t:
        raise SystemExit("PixelFormat import anchor not found")
    t = t.replace(import_anchor, imports, 1)

# Recursos do VirtualDisplay keep-alive.
field_anchor = "    private var mediaProjection: MediaProjection? = null\n"
fields = """    private var mediaProjection: MediaProjection? = null
    private var projectionVirtualDisplay: VirtualDisplay? = null
    private var projectionKeepAliveReader: ImageReader? = null
"""
if "projectionVirtualDisplay" not in t:
    if field_anchor not in t:
        raise SystemExit("mediaProjection field anchor not found")
    t = t.replace(field_anchor, fields, 1)

# Cria o VirtualDisplay logo após registrar o callback e obter a projeção.
projection_anchor = """        val projection = mediaProjection ?: run {
            publishStatus("Não foi possível iniciar captura")
            return
        }

        val captureBuilder = AudioPlaybackCaptureConfiguration.Builder(projection)"""
projection_new = """        val projection = mediaProjection ?: run {
            publishStatus("Não foi possível iniciar captura")
            return
        }

        Diagnostics.markStage(this, "before_projection_keepalive")
        createProjectionKeepAlive(projection)
        Diagnostics.markStage(this, "projection_keepalive_ready")

        val captureBuilder = AudioPlaybackCaptureConfiguration.Builder(projection)"""
if projection_anchor not in t:
    raise SystemExit("projection capture-builder anchor not found")
t = t.replace(projection_anchor, projection_new, 1)

# Função de keep-alive: VirtualDisplay pequeno, descartando os frames imediatamente.
method_anchor = "    private fun startSpeechRecognizerWithInjectedAudio(readFd: ParcelFileDescriptor) {"
keepalive_method = """    private fun createProjectionKeepAlive(projection: MediaProjection) {
        if (projectionVirtualDisplay != null) return

        val size = 16
        val reader = ImageReader.newInstance(
            size,
            size,
            PixelFormat.RGBA_8888,
            2
        )
        reader.setOnImageAvailableListener({ imageReader ->
            runCatching { imageReader.acquireLatestImage()?.close() }
        }, mainHandler)

        projectionKeepAliveReader = reader
        val densityDpi = resources.displayMetrics.densityDpi.coerceAtLeast(1)

        Diagnostics.markStage(this, "before_virtual_display_create")
        projectionVirtualDisplay = projection.createVirtualDisplay(
            "VoziaProjectionKeepAlive",
            size,
            size,
            densityDpi,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            reader.surface,
            object : VirtualDisplay.Callback() {
                override fun onPaused() {
                    Diagnostics.markStage(this@TranslatorService, "virtual_display_paused")
                }

                override fun onResumed() {
                    Diagnostics.markStage(this@TranslatorService, "virtual_display_resumed")
                }

                override fun onStopped() {
                    if (!stopping.get()) {
                        Diagnostics.markStage(this@TranslatorService, "virtual_display_stopped_external")
                    }
                }
            },
            mainHandler
        )

        if (projectionVirtualDisplay == null) {
            reader.setOnImageAvailableListener(null, null)
            reader.close()
            projectionKeepAliveReader = null
            throw IllegalStateException("VirtualDisplay keep-alive não foi criado")
        }

        Diagnostics.markStage(this, "virtual_display_keepalive_created")
    }

"""
if "private fun createProjectionKeepAlive" not in t:
    if method_anchor not in t:
        raise SystemExit("speech recognizer method anchor not found")
    t = t.replace(method_anchor, keepalive_method + method_anchor, 1)

# Libera o keep-alive antes de parar a projeção.
stop_anchor = """        val projection = mediaProjection
        mediaProjection = null
        try { projection?.stop() } catch (_: Throwable) { }
"""
stop_new = """        try { projectionVirtualDisplay?.release() } catch (_: Throwable) { }
        projectionVirtualDisplay = null

        projectionKeepAliveReader?.let { reader ->
            try { reader.setOnImageAvailableListener(null, null) } catch (_: Throwable) { }
            try { reader.close() } catch (_: Throwable) { }
        }
        projectionKeepAliveReader = null

        val projection = mediaProjection
        mediaProjection = null
        try { projection?.stop() } catch (_: Throwable) { }
"""
if stop_anchor not in t:
    raise SystemExit("projection stop anchor not found")
t = t.replace(stop_anchor, stop_new, 1)

service.write_text(t)

# Atualiza diagnóstico/versão.
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
