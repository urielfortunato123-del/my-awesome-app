from pathlib import Path
import xml.etree.ElementTree as ET

root = Path("voltai-build/src25")

build = root / "app/build.gradle"
s = build.read_text(encoding="utf-8")
s = s.replace("versionCode 52", "versionCode 53")
s = s.replace(
    "versionName '0.24.0-voltai-ui2-glass-mova-user-test'",
    "versionName '0.25.0-voltai-ui2-glass-modern-nav-user-test'"
)
build.write_text(s, encoding="utf-8")

layout = root / "app/src/main/res/layout/activity_main.xml"
s = layout.read_text(encoding="utf-8")
start = s.index('    <LinearLayout android:id="@+id/bottomNav"')
end = s.index("    </LinearLayout>\n</LinearLayout>", start) + len("    </LinearLayout>")
nav = """    <LinearLayout
        android:id="@+id/bottomNav"
        android:layout_width="match_parent"
        android:layout_height="80dp"
        android:layout_marginLeft="12dp"
        android:layout_marginRight="12dp"
        android:layout_marginBottom="8dp"
        android:background="@drawable/bg_glass_nav2"
        android:gravity="center"
        android:orientation="horizontal"
        android:paddingLeft="5dp"
        android:paddingTop="5dp"
        android:paddingRight="5dp"
        android:paddingBottom="5dp">

        <TextView
            android:id="@+id/tabHome"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:background="@drawable/bg_glass_nav_selected"
            android:drawableTop="@drawable/ic_nav_home_modern"
            android:drawablePadding="3dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Início"
            android:textColor="@color/nav_active"
            android:textSize="9sp" />

        <TextView
            android:id="@+id/tabAi"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_marginLeft="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_glass_nav_unselected"
            android:drawableTop="@drawable/ic_nav_stats_modern"
            android:drawablePadding="3dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Estatísticas"
            android:textColor="@color/text_secondary"
            android:textSize="8sp" />

        <TextView
            android:id="@+id/tabMova"
            android:layout_width="0dp"
            android:layout_height="68dp"
            android:layout_marginLeft="6dp"
            android:layout_marginRight="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_mova_center"
            android:drawableTop="@drawable/ic_nav_mova_modern"
            android:drawablePadding="2dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="MOVA"
            android:textColor="#FFFFFF"
            android:textSize="9sp"
            android:translationY="-8dp" />

        <TextView
            android:id="@+id/tabAnalysis"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_marginLeft="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_glass_nav_unselected"
            android:drawableTop="@drawable/ic_nav_history_modern"
            android:drawablePadding="3dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Histórico"
            android:textColor="@color/text_secondary"
            android:textSize="9sp" />

        <TextView
            android:id="@+id/tabSettings"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_marginLeft="3dp"
            android:layout_weight="1"
            android:background="@drawable/bg_glass_nav_unselected"
            android:drawableTop="@drawable/ic_nav_more_modern"
            android:drawablePadding="3dp"
            android:fontFamily="sans-serif-medium"
            android:gravity="center"
            android:includeFontPadding="false"
            android:maxLines="1"
            android:text="Mais"
            android:textColor="@color/text_secondary"
            android:textSize="9sp" />
    </LinearLayout>"""
layout.write_text(s[:start] + nav + s[end:], encoding="utf-8")

draw = root / "app/src/main/res/drawable"
icons = {
    "ic_nav_home_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="23dp" android:height="23dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FFFFFFFF" android:pathData="M12,3.1L3.5,10v9.1c0,1 0.8,1.8 1.8,1.8h4.5v-6.1h4.4v6.1h4.5c1,0 1.8,-0.8 1.8,-1.8V10L12,3.1zM18.5,18.9h-2.3v-6.1H7.8v6.1H5.5v-7.9L12,5.8l6.5,5.2v7.9z"/></vector>""",
    "ic_nav_stats_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="23dp" android:height="23dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FFFFFFFF" android:pathData="M4.5,20.5c-0.8,0 -1.5,-0.7 -1.5,-1.5v-6c0,-0.8 0.7,-1.5 1.5,-1.5h1c0.8,0 1.5,0.7 1.5,1.5v6c0,0.8 -0.7,1.5 -1.5,1.5h-1zM11.5,20.5c-0.8,0 -1.5,-0.7 -1.5,-1.5V6.5c0,-0.8 0.7,-1.5 1.5,-1.5h1c0.8,0 1.5,0.7 1.5,1.5V19c0,0.8 -0.7,1.5 -1.5,1.5h-1zM18.5,20.5c-0.8,0 -1.5,-0.7 -1.5,-1.5v-9c0,-0.8 0.7,-1.5 1.5,-1.5h1c0.8,0 1.5,0.7 1.5,1.5v9c0,0.8 -0.7,1.5 -1.5,1.5h-1z"/></vector>""",
    "ic_nav_mova_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="25dp" android:height="25dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FFFFFFFF" android:pathData="M12.9,2.4L6.3,12h4.4l-0.9,9.6l7.9,-11.2h-4.5l-0.3,-8z"/></vector>""",
    "ic_nav_history_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="23dp" android:height="23dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FFFFFFFF" android:pathData="M12,3.1c-4.9,0 -8.9,4 -8.9,8.9H1l3.2,3.2L7.4,12H5.2c0,-3.8 3.1,-6.8 6.8,-6.8s6.8,3.1 6.8,6.8s-3.1,6.8 -6.8,6.8c-2.1,0 -4,-0.9 -5.2,-2.4l-1.6,1.4c1.6,1.9 4.1,3.2 6.8,3.2c4.9,0 8.9,-4 8.9,-8.9s-4,-9 -8.9,-9zM10.9,7.4v5.2l4.5,2.7l1.1,-1.8l-3.5,-2.1v-4h-2.1z"/></vector>""",
    "ic_nav_more_modern.xml": """<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="23dp" android:height="23dp" android:viewportWidth="24" android:viewportHeight="24"><path android:fillColor="#FFFFFFFF" android:pathData="M5,6.2h14c0.7,0 1.3,0.6 1.3,1.3S19.7,8.8 19,8.8H5c-0.7,0 -1.3,-0.6 -1.3,-1.3S4.3,6.2 5,6.2zM5,10.7h14c0.7,0 1.3,0.6 1.3,1.3s-0.6,1.3 -1.3,1.3H5c-0.7,0 -1.3,-0.6 -1.3,-1.3s0.6,-1.3 1.3,-1.3zM5,15.2h14c0.7,0 1.3,0.6 1.3,1.3s-0.6,1.3 -1.3,1.3H5c-0.7,0 -1.3,-0.6 -1.3,-1.3s0.6,-1.3 1.3,-1.3z"/></vector>"""
}
for name, data in icons.items():
    (draw / name).write_text(data, encoding="utf-8")

main = root / "app/src/main/java/com/bateriaia/app/MainActivity.java"
s = main.read_text(encoding="utf-8")
if "import android.content.res.ColorStateList;" not in s:
    s = s.replace(
        "import android.content.pm.PackageManager;\n",
        "import android.content.pm.PackageManager;\nimport android.content.res.ColorStateList;\n"
    )

old = """        int active = Color.WHITE;
        int idle = Color.parseColor("#8798B3");
        tabHome.setTextColor(tab == 0 ? active : idle);
        tabAi.setTextColor(tab == 1 ? active : idle);
        tabAnalysis.setTextColor(tab == 2 ? active : idle);
        tabSettings.setTextColor(tab == 3 ? active : idle);
        tabMova.setTextColor(Color.WHITE);
        tabHome.setBackgroundResource(tab == 0 ? R.drawable.bg_glass_nav_selected : R.drawable.bg_glass_nav_unselected);
        tabAi.setBackgroundResource(tab == 1 ? R.drawable.bg_glass_nav_selected : R.drawable.bg_glass_nav_unselected);
        tabAnalysis.setBackgroundResource(tab == 2 ? R.drawable.bg_glass_nav_selected : R.drawable.bg_glass_nav_unselected);
        tabSettings.setBackgroundResource(tab == 3 ? R.drawable.bg_glass_nav_selected : R.drawable.bg_glass_nav_unselected);
        tabMova.setBackgroundResource(R.drawable.bg_mova_center);
        tabMova.setAlpha(tab == 4 ? 1.0f : 0.82f);
        tabMova.setScaleX(tab == 4 ? 1.06f : 1.0f);
        tabMova.setScaleY(tab == 4 ? 1.06f : 1.0f);"""

new = """        updateBottomNavItem(tabHome, tab == 0);
        updateBottomNavItem(tabAi, tab == 1);
        updateBottomNavItem(tabAnalysis, tab == 2);
        updateBottomNavItem(tabSettings, tab == 3);
        tabMova.setBackgroundResource(R.drawable.bg_mova_center);
        tabMova.setTextColor(Color.WHITE);
        tabMova.setCompoundDrawableTintList(ColorStateList.valueOf(Color.WHITE));
        tabMova.setAlpha(tab == 4 ? 1.0f : 0.78f);
        tabMova.setScaleX(tab == 4 ? 1.06f : 1.0f);
        tabMova.setScaleY(tab == 4 ? 1.06f : 1.0f);"""

if old not in s:
    raise SystemExit("showTab navigation style block not found")
s = s.replace(old, new, 1)

marker = "    private void showConsumptionPanel(int panel) {"
helper = """    private void updateBottomNavItem(TextView view, boolean selected) {
        int active = Color.WHITE;
        int idle = Color.parseColor("#8798B3");
        view.setTextColor(selected ? active : idle);
        view.setCompoundDrawableTintList(ColorStateList.valueOf(selected ? active : idle));
        view.setBackgroundResource(selected ? R.drawable.bg_glass_nav_selected : R.drawable.bg_glass_nav_unselected);
        view.setAlpha(selected ? 1.0f : 0.86f);
    }

"""
if marker not in s:
    raise SystemExit("showConsumptionPanel marker not found")
s = s.replace(marker, helper + marker, 1)
main.write_text(s, encoding="utf-8")

(root / "RELEASE_NOTES_VOLTAI_0_25.md").write_text("""# VoltAI 0.25 UI2 — Glass Modern Nav

Base: VoltAI 0.24 UI2 Glass MOVA.

## Mudança principal
- barra inferior preserva o visual Glass da 0.24, mas deixa de usar glifos de fonte;
- Início, Estatísticas, MOVA, Histórico e Mais agora usam ícones vetoriais dedicados;
- ícones ativos e inativos recebem tonalização coerente com o estado da aba;
- MOVA mantém o destaque central/elevado da UI2;
- espaçamento, alinhamento vertical e legibilidade dos rótulos foram refinados.

## Compatibilidade
- package: com.bateriaia.app
- versionCode: 53
- versionName: 0.25.0-voltai-ui2-glass-modern-nav-user-test
- motor, lógica MOVA, previsões, histórico e telas da 0.24 preservados.
""", encoding="utf-8")

assert "versionCode 53" in build.read_text(encoding="utf-8")
assert "0.25.0-voltai-ui2-glass-modern-nav-user-test" in build.read_text(encoding="utf-8")

page = layout.read_text(encoding="utf-8")
for exact_old in (
    'android:text="⌂&#10;Início"',
    'android:text="▥&#10;Estatísticas"',
    'android:text="ϟ&#10;MOVA"',
    'android:text="◷&#10;Histórico"',
    'android:text="▦&#10;Mais"',
):
    assert exact_old not in page

for icon in icons:
    assert (draw / icon).is_file()

assert "setCompoundDrawableTintList" in main.read_text(encoding="utf-8")

for p in (root / "app/src/main/res").rglob("*.xml"):
    ET.parse(p)

print("VoltAI 0.25 modern navigation patch: OK")
