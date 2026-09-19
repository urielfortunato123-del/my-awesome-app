from pathlib import Path
import sys

root = Path(sys.argv[1])

diag = root / "app/src/main/java/com/vozia/translate/Diagnostics.kt"
d = diag.read_text()

if 'private const val KEY_EVENTS' not in d:
    d = d.replace(
        '    private const val KEY_STOP_REASON = "stop_reason"\n',
        '    private const val KEY_STOP_REASON = "stop_reason"\n    private const val KEY_EVENTS = "event_history"\n',
        1
    )

start_anchor = '.putBoolean(KEY_CLEAN_STOP, false)\n'
if '.remove(KEY_EVENTS)' not in d:
    if start_anchor not in d:
        raise SystemExit("startSession clean anchor not found")
    d = d.replace(
        start_anchor,
        start_anchor + '            .remove(KEY_EVENTS)\n',
        1
    )

mark_log = '        Log.i("VoziaDiag", "session=$id mode=$mode stage=$stage")\n'
mark_log_new = '''        appendEvent(context, stage, now)
        Log.i("VoziaDiag", "session=$id mode=$mode stage=$stage")
'''
if mark_log in d and 'appendEvent(context, stage, now)' not in d:
    d = d.replace(mark_log, mark_log_new, 1)

start_log = '        Log.i("VoziaDiag", "session=$id mode=$mode stage=session_started")\n'
start_log_new = '''        appendEvent(context, "session_started", now)
        Log.i("VoziaDiag", "session=$id mode=$mode stage=session_started")
'''
if start_log in d and 'appendEvent(context, "session_started", now)' not in d:
    d = d.replace(start_log, start_log_new, 1)

stop_log = '        Log.i("VoziaDiag", "session=$id stop=$reason clean=$clean lastStage=$stage")\n'
stop_log_new = '''        appendEvent(context, "STOP:$reason", System.currentTimeMillis())
        Log.i("VoziaDiag", "session=$id stop=$reason clean=$clean lastStage=$stage")
'''
if stop_log in d and 'appendEvent(context, "STOP:$reason"' not in d:
    d = d.replace(stop_log, stop_log_new, 1)

record_anchor = '    fun record(context: Context, label: String, error: Throwable) {'
events_method = '''    private fun appendEvent(context: Context, event: String, at: Long) {
        val p = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val previous = p.getString(KEY_EVENTS, "") ?: ""
        val line = "$at|$event"
        val updated = (previous.lineSequence().filter { it.isNotBlank() }.toList() + line)
            .takeLast(30)
            .joinToString("\\n")
        p.edit().putString(KEY_EVENTS, updated).commit()
    }

'''
if 'private fun appendEvent(' not in d:
    if record_anchor not in d:
        raise SystemExit("Diagnostics record anchor missing")
    d = d.replace(record_anchor, events_method + record_anchor, 1)

report_anchor = "            append('\\n').append(systemExitReport(context, sessionStart, fmt))"
report_new = '''            val events = p.getString(KEY_EVENTS, "") ?: ""
            append("\\nHistorico de eventos Vozia:\\n")
            if (events.isBlank()) {
                append("nenhum evento registrado\\n")
            } else {
                events.lineSequence().filter { it.isNotBlank() }.forEach { line ->
                    val parts = line.split('|', limit = 2)
                    val ts = parts.firstOrNull()?.toLongOrNull()
                    val event = parts.getOrNull(1) ?: line
                    if (ts != null) append(fmt.format(Date(ts))).append(" • ")
                    append(event).append('\\n')
                }
            }
            append('\\n').append(systemExitReport(context, sessionStart, fmt))'''
if report_anchor not in d:
    raise SystemExit("Diagnostics report system-exit anchor missing")
d = d.replace(report_anchor, report_new, 1)

d = d.replace("Vozia 0.1.9 diagnostico", "Vozia 0.2.0 diagnostico")
diag.write_text(d)

service = root / "app/src/main/java/com/vozia/translate/TranslatorService.kt"
t = service.read_text()

old_method_start = '    private fun createProjectionKeepAlive(projection: MediaProjection) {'
start = t.find(old_method_start)
end = t.find('\n    private fun startSpeechRecognizerWithInjectedAudio', start)
if start < 0 or end < 0:
    raise SystemExit("createProjectionKeepAlive region not found")

new_method = '''    private fun createProjectionKeepAlive(projection: MediaProjection) {
        if (projectionVirtualDisplay != null) return

        val windowManagerForMetrics = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val bounds = if (Build.VERSION.SDK_INT >= 30) {
            windowManagerForMetrics.maximumWindowMetrics.bounds
        } else {
            @Suppress("DEPRECATION")
            Rect(0, 0, resources.displayMetrics.widthPixels, resources.displayMetrics.heightPixels)
        }

        val width = bounds.width().coerceAtLeast(1)
        val height = bounds.height().coerceAtLeast(1)
        val densityDpi = resources.displayMetrics.densityDpi.coerceAtLeast(1)

        Diagnostics.markStage(this, "projection_metrics_\${width}x\${height}_dpi$densityDpi")

        val reader = ImageReader.newInstance(
            width,
            height,
            PixelFormat.RGBA_8888,
            2
        )
        reader.setOnImageAvailableListener({ imageReader ->
            runCatching { imageReader.acquireLatestImage()?.close() }
        }, mainHandler)

        projectionKeepAliveReader = reader

        Diagnostics.markStage(this, "before_virtual_display_create")
        projectionVirtualDisplay = projection.createVirtualDisplay(
            "VoziaProjection",
            width,
            height,
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
                    Diagnostics.markStage(this@TranslatorService, "virtual_display_stopped")
                }
            },
            mainHandler
        )

        if (projectionVirtualDisplay == null) {
            reader.setOnImageAvailableListener(null, null)
            reader.close()
            projectionKeepAliveReader = null
            throw IllegalStateException("VirtualDisplay não foi criado")
        }

        Diagnostics.markStage(this, "virtual_display_created_\${width}x\${height}")
    }
'''
t = t[:start] + new_method + t[end:]

if 'import android.graphics.Rect\n' not in t:
    anchor = 'import android.graphics.PixelFormat\n'
    if anchor not in t:
        raise SystemExit("PixelFormat import missing")
    t = t.replace(anchor, anchor + 'import android.graphics.Rect\n', 1)

old_vis = '''            override fun onCapturedContentVisibilityChanged(isVisible: Boolean) {
                Diagnostics.markStage(
                    this@TranslatorService,
                    if (isVisible) "projection_content_visible" else "projection_content_hidden"
                )
            }'''
new_vis = '''            override fun onCapturedContentVisibilityChanged(isVisible: Boolean) {
                Diagnostics.markStage(
                    this@TranslatorService,
                    if (isVisible) "projection_content_visible" else "projection_content_hidden"
                )
            }

            override fun onCapturedContentResize(width: Int, height: Int) {
                Diagnostics.markStage(
                    this@TranslatorService,
                    "projection_content_resize_\${width}x\${height}"
                )
                runCatching {
                    if (width > 0 && height > 0) {
                        projectionVirtualDisplay?.resize(
                            width,
                            height,
                            resources.displayMetrics.densityDpi.coerceAtLeast(1)
                        )
                    }
                }.onFailure {
                    Diagnostics.record(this@TranslatorService, "projection_resize_failure", it)
                }
            }'''
if old_vis not in t:
    raise SystemExit("projection visibility callback not found")
t = t.replace(old_vis, new_vis, 1)

service.write_text(t)

gradle = root / "app/build.gradle.kts"
g = gradle.read_text()
g = g.replace("versionCode = 10", "versionCode = 11")
g = g.replace('versionName = "0.1.9"', 'versionName = "0.2.0"')
gradle.write_text(g)

layout = root / "app/src/main/res/layout/activity_main.xml"
x = layout.read_text().replace(
    "v0.1.9 • projeção persistente",
    "v0.2.0 • projeção em tamanho real"
)
layout.write_text(x)
