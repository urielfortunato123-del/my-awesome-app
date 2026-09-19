from pathlib import Path
import sys

root = Path(sys.argv[1])

main = root / "app/src/main/java/com/vozia/translate/MainActivity.kt"
m = main.read_text()

if "import android.app.AlertDialog\n" not in m:
    anchor = "import android.app.Activity\n"
    if anchor not in m:
        raise SystemExit("Activity import not found")
    m = m.replace(anchor, anchor + "import android.app.AlertDialog\n", 1)

old_block = '''            val manager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            statusText.text = "Autorize a captura da tela inteira para traduzir o áudio de outros apps."
            val captureIntent = if (Build.VERSION.SDK_INT >= 34) {
                manager.createScreenCaptureIntent(
                    MediaProjectionConfig.createConfigForDefaultDisplay()
                )
            } else {
                manager.createScreenCaptureIntent()
            }
            projectionLauncher.launch(captureIntent)'''

new_block = '''            val manager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            val captureIntent = if (Build.VERSION.SDK_INT >= 34) {
                manager.createScreenCaptureIntent(
                    MediaProjectionConfig.createConfigForUserChoice()
                )
            } else {
                manager.createScreenCaptureIntent()
            }

            if (Build.VERSION.SDK_INT >= 34) {
                statusText.text = "Escolha o aplicativo onde o vídeo será reproduzido."
                AlertDialog.Builder(this)
                    .setTitle("Escolha o aplicativo do vídeo")
                    .setMessage(
                        "Na próxima tela do Android, escolha compartilhar UM APLICATIVO e selecione X, YouTube, Instagram ou o navegador. " +
                            "Não escolha Tela inteira neste teste."
                    )
                    .setNegativeButton("CANCELAR", null)
                    .setPositiveButton("CONTINUAR") { _, _ ->
                        Diagnostics.markStage(this, "projection_user_choice_requested")
                        projectionLauncher.launch(captureIntent)
                    }
                    .show()
            } else {
                statusText.text = "Autorize a captura para traduzir o áudio do vídeo."
                Diagnostics.markStage(this, "projection_screen_capture_requested")
                projectionLauncher.launch(captureIntent)
            }'''

if old_block not in m:
    raise SystemExit("v0.2.0 capture intent block not found")
m = m.replace(old_block, new_block, 1)
main.write_text(m)

service = root / "app/src/main/java/com/vozia/translate/TranslatorService.kt"
t = service.read_text()

t = t.replace('"projection_metrics_\\${width}x\\${height}_dpi$densityDpi"', '"projection_metrics_${width}x${height}_dpi$densityDpi"')
t = t.replace('"virtual_display_created_\\${width}x\\${height}"', '"virtual_display_created_${width}x${height}"')
t = t.replace('"projection_content_resize_\\${width}x\\${height}"', '"projection_content_resize_${width}x${height}"')

old_resize = '''                runCatching {
                    if (width > 0 && height > 0) {
                        projectionVirtualDisplay?.resize(
                            width,
                            height,
                            resources.displayMetrics.densityDpi.coerceAtLeast(1)
                        )
                    }
                }.onFailure {
                    Diagnostics.record(this@TranslatorService, "projection_resize_failure", it)
                }'''

new_resize = '''                runCatching {
                    if (width > 0 && height > 0) {
                        projectionVirtualDisplay?.resize(
                            width,
                            height,
                            resources.displayMetrics.densityDpi.coerceAtLeast(1)
                        )
                    }
                }.onSuccess {
                    Diagnostics.markStage(
                        this@TranslatorService,
                        "projection_resize_applied_${width}x${height}"
                    )
                }.onFailure {
                    Diagnostics.record(this@TranslatorService, "projection_resize_failure", it)
                }'''

if old_resize not in t:
    raise SystemExit("projection resize block not found")
t = t.replace(old_resize, new_resize, 1)
service.write_text(t)

diag = root / "app/src/main/java/com/vozia/translate/Diagnostics.kt"
d = diag.read_text().replace("Vozia 0.2.0 diagnostico", "Vozia 0.2.1 diagnostico")
diag.write_text(d)

gradle = root / "app/build.gradle.kts"
g = gradle.read_text()
g = g.replace("versionCode = 11", "versionCode = 12")
g = g.replace('versionName = "0.2.0"', 'versionName = "0.2.1"')
gradle.write_text(g)

layout = root / "app/src/main/res/layout/activity_main.xml"
x = layout.read_text().replace(
    "v0.2.0 • projeção em tamanho real",
    "v0.2.1 • selecione o app do vídeo"
)
layout.write_text(x)
